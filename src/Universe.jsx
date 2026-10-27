import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Seeded particles keep the universe stable across renders and viewport changes.
function randomSource(seed) {
  return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
}
const vertexShader = `
  attribute float size;
  varying vec3 vColor;
  uniform float pixelRatio;
  void main() {
    vColor = color;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = clamp(size * pixelRatio * (160.0 / -mv.z), 0.6, 12.0);
    gl_Position = projectionMatrix * mv;
  }
`;
const fragmentShader = `
  varying vec3 vColor;
  uniform float opacity;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float glow = pow(1.0 - d * 2.0, 2.0);
    gl_FragColor = vec4(vColor, glow * opacity);
  }
`;
export default function Universe({ progress, reducedMotion }) {
  const container = useRef(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;
  useEffect(() => {
    const host = container.current;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power' }); }
    catch { host.classList.add('canvas-fallback'); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    host.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 400);
    camera.position.z = 34;
    const rand = randomSource(84);
    const galaxies = [];
    const resources = [];
    const makeParticles = (positions, colors, sizes, opacity = 1) => {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
      const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms: {
        pixelRatio: { value: renderer.getPixelRatio() }, opacity: { value: opacity },
      }, transparent: true, depthWrite: false, vertexColors: true, blending: THREE.AdditiveBlending });
      resources.push(geometry, material);
      return new THREE.Points(geometry, material);
    };
    const starPositions = [], starColors = [], starSizes = [];
    for (let i = 0; i < 1900; i++) {
      starPositions.push((rand() - .5) * 200, (rand() - .5) * 130, -rand() * 130);
      const shade = .35 + rand() * .65;
      starColors.push(shade * .85, shade * .9, shade);
      starSizes.push(.7 + Math.pow(rand(), 3) * 2.3);
    }
    const stars = makeParticles(starPositions, starColors, starSizes);
    scene.add(stars);
    const mobile = innerWidth < 700;
    const settings = [
      [-1, 1, -3, 9, .18, .05], [0, 17, -13, 7, .65, .1],
      [-19, 11, -7, 3.5, .9, -.3], [18, -9, -8, 5, .35, -.35],
      [-24, -9, -6, 4, .25, .2], [-2, -8, -1, 1.5, .6, .1],
      [25, 12, -24, 4.5, .7, .4],
    ];
    settings.forEach(([x,y,z,radius,tilt,rotation], index) => {
      const positions = [], colors = [], sizes = [];
      const count = mobile ? 4500 : 10500;
      for (let i = 0; i < count; i++) {
        const r = Math.pow(rand(), 1.7) * radius;
        const branch = i % 3 * Math.PI * 2 / 3;
        const angle = branch + r * 1.3 + (rand() - .5) * (1.6 - .7 * r / radius);
        const spread = Math.pow(rand(), 3) * (rand() < .5 ? -1 : 1);
        const scatter = .2 + r * .4;
        positions.push(Math.cos(angle) * r + spread * scatter,
          (rand() - .5) * (.08 + r * .15), Math.sin(angle) * r + (rand() - .5) * scatter);
        const t = r / radius;
        const color = new THREE.Color().setRGB(1 - t * .3, .85 - t * .72, .68 - t * .1);
        if (index === 2) color.setRGB(.5 + rand() * .5, .35 + rand() * .3, .2 + rand() * .3);
        colors.push(color.r, color.g, color.b);
        sizes.push(.1 + rand() * .2);
      }
      const galaxy = makeParticles(positions, colors, sizes, .85);
      galaxy.position.set(x, y, z);
      galaxy.rotation.set(tilt, 0, rotation);
      galaxy.userData.base = galaxy.position.clone();
      scene.add(galaxy); galaxies.push(galaxy);
    });
    const resize = () => { const w = host.clientWidth, h = host.clientHeight; renderer.setSize(w,h); camera.aspect = w/h; camera.updateProjectionMatrix(); };
    resize();
    const observer = new ResizeObserver(resize); observer.observe(host);
    const mouse = new THREE.Vector2();
    const pointer = e => { mouse.set((e.clientX / innerWidth - .5) * 2, (e.clientY / innerHeight - .5) * 2); };
    window.addEventListener('pointermove', pointer, { passive:true });
    let frame, visible = true, lastTime = 0;
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }); visibility.observe(host);
    const draw = time => {
      frame = requestAnimationFrame(draw);
      if (!visible || document.hidden || time - lastTime < 30) return;
      lastTime = time;
      const p = progressRef.current;
      const travel = Math.min(p * 1.25, 1);
      camera.position.z = 34 - travel * 27;
      camera.position.x += ((reducedMotion ? 0 : mouse.x * 1.2) - camera.position.x) * .04;
      camera.position.y += ((reducedMotion ? 0 : -mouse.y * .6) - camera.position.y) * .04;
      camera.rotation.z = reducedMotion ? 0 : p * .15;
      galaxies.forEach((g, i) => { g.rotation.y = reducedMotion ? 0 : time * .000018 * (i % 2 ? 1 : -1); });
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(draw);
    const onLost = e => { e.preventDefault(); host.classList.add('canvas-fallback'); };
    renderer.domElement.addEventListener('webglcontextlost', onLost);
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); visibility.disconnect();
      window.removeEventListener('pointermove', pointer);
      renderer.domElement.removeEventListener('webglcontextlost', onLost);
      resources.forEach(r => r.dispose()); renderer.dispose(); renderer.domElement.remove();
    };
  }, [reducedMotion]);
  return <div className="universe-canvas" ref={container} aria-hidden="true" />;
}

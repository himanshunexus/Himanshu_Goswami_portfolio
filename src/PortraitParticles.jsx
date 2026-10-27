import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

const source = '/images/contact-portrait.png';
const vertexShader = `
  attribute float seed;
  attribute float luminance;
  uniform float time;
  uniform float depth;
  uniform float pixelRatio;
  uniform vec3 trail[12];
  varying vec3 particleColor;
  varying float light;
  void main() {
    particleColor = color;
    light = luminance;
    vec3 p = position;
    float phase = seed * 6.283185;
    float drift = sin(time * .65 + phase) * cos(time * .31 + seed * 39.0);
    p.z += (sin(seed * 91.0) * .5 + drift * .5) * depth;
    p.xy += vec2(cos(phase + time * .12), sin(phase - time * .1)) * depth * .1;
    p.xy += vec2(sin(time + phase), cos(time * .8 + phase)) * .12;
    for (int i = 0; i < 12; i++) {
      vec2 delta = position.xy - trail[i].xy;
      float influence = exp(-dot(delta, delta) / 110.0) * trail[i].z;
      p.xy += normalize(delta + vec2(.01)) * influence * 9.0;
      p.z += sin(phase) * influence * 20.0;
    }
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = clamp((1.6 + luminance * 2.8) * pixelRatio * (180.0 / -mv.z), .8, 10.0);
    gl_Position = projectionMatrix * mv;
  }
`;
const fragmentShader = `
  varying vec3 particleColor;
  varying float light;
  uniform float reveal;
  void main() {
    float radius = length(gl_PointCoord - .5);
    if (radius > .5) discard;
    float edge = 1.0 - smoothstep(.30, .5, radius);
    vec3 tint = mix(vec3(light), particleColor, .35);
    gl_FragColor = vec4(tint, edge * reveal * .9);
  }
`;

export default function PortraitParticles({ reducedMotion }) {
  const host = useRef(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const element = host.current;
    setReady(false);
    if (reducedMotion) return;
    let renderer, geometry, material, points, timeline, resizeObserver;
    let frame = 0, disposed = false, initialized = false, visible = false;
    let elapsed = 0, last = 0, lastPointer = 0;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 1, 600);
    camera.position.z = 180;
    const trail = Array.from({ length: 12 }, () => new THREE.Vector3(1000, 1000, 0));
    const image = new Image();
    const updateActivity = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (visible && !document.hidden && material && !disposed) {
        timeline?.resume();
        frame = requestAnimationFrame(draw);
      } else timeline?.pause();
    };
    function draw(timestamp) {
      if (disposed || !visible || document.hidden) return;
      if (last && timestamp - last < 30) { frame = requestAnimationFrame(draw); return; }
      const delta = last ? Math.min((timestamp - last) / 1000, .05) : 0;
      last = timestamp; elapsed += delta;
      material.uniforms.time.value = elapsed;
      trail.forEach(point => { point.z *= Math.exp(-delta * 2.4); });
      renderer.render(scene, camera);
      frame = requestAnimationFrame(draw);
    }
    const resize = () => {
      const width = element.clientWidth, height = element.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      // Keep the facial area readable on narrow phones without stretching the image.
      points.scale.setScalar(width < 700 ? .85 : 1);
    };
    const pointerMove = event => {
      if (!material || !visible || performance.now() - lastPointer < 30) return;
      lastPointer = performance.now();
      const rect = element.getBoundingClientRect();
      if (event.clientY < rect.top || event.clientY > rect.bottom) return;
      const planeHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const scale = points.scale.x;
      const x = ((event.clientX - rect.left) / rect.width - .5) * planeHeight * camera.aspect / scale;
      const y = (.5 - (event.clientY - rect.top) / rect.height) * planeHeight / scale;
      for (let i = trail.length - 1; i > 0; i--) trail[i].copy(trail[i - 1]);
      trail[0].set(x, y, 1);
    };
    const contextLost = event => {
      event.preventDefault();
      visible = false; updateActivity(); setReady(false);
    };
    function initialize() {
      if (initialized || disposed) return;
      initialized = true;
      image.onload = () => {
        if (disposed) return;
        try {
          const sample = document.createElement('canvas');
          sample.width = innerWidth < 700 ? 260 : 400;
          sample.height = Math.round(sample.width * image.height / image.width);
          const ctx = sample.getContext('2d', { willReadFrequently: true });
          if (!ctx) return;
          ctx.drawImage(image, 0, 0, sample.width, sample.height);
          const data = ctx.getImageData(0, 0, sample.width, sample.height).data;
          const positions = [], colors = [], seeds = [], brightness = [];
          let randomSeed = 18427;
          for (let y = 0; y < sample.height; y++) {
            for (let x = 0; x < sample.width; x++) {
              const i = (y * sample.width + x) * 4;
              const grey = (data[i] * .2126 + data[i + 1] * .7152 + data[i + 2] * .0722) / 255;
              if (grey < .07) continue;
              positions.push((x / sample.width - .5) * 240, (.5 - y / sample.height) * 160, 0);
              colors.push(data[i] / 255, data[i + 1] / 255, data[i + 2] / 255);
              randomSeed ^= randomSeed << 13;
              randomSeed ^= randomSeed >>> 17;
              randomSeed ^= randomSeed << 5;
              seeds.push((randomSeed >>> 0) / 4294967296);
              brightness.push(grey);
            }
          }
          geometry = new THREE.BufferGeometry();
          geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
          geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
          geometry.setAttribute('seed', new THREE.Float32BufferAttribute(seeds, 1));
          geometry.setAttribute('luminance', new THREE.Float32BufferAttribute(brightness, 1));
          renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
          renderer.setPixelRatio(Math.min(devicePixelRatio, 1.25));
          material = new THREE.ShaderMaterial({
            vertexShader, fragmentShader, vertexColors: true, transparent: true, depthWrite: false,
            uniforms: { time: { value: 0 }, depth: { value: 2 }, reveal: { value: 0 }, pixelRatio: { value: renderer.getPixelRatio() }, trail: { value: trail } },
          });
          points = new THREE.Points(geometry, material);
          points.frustumCulled = false;
          scene.add(points);
          element.appendChild(renderer.domElement);
          renderer.domElement.setAttribute('aria-hidden', 'true');
          renderer.domElement.addEventListener('webglcontextlost', contextLost);
          resize(); resizeObserver = new ResizeObserver(resize); resizeObserver.observe(element);
          timeline = gsap.timeline();
          timeline.to(material.uniforms.reveal, { value: 1, duration: 5, ease: 'power2.out' }, 0);
          timeline.to(material.uniforms.depth, { value: 84, duration: 4, ease: 'elastic.in(1,.45)', repeat: -1, yoyo: true, repeatDelay: 5 }, 8);
          setReady(true); updateActivity();
        } catch {
          // Keep the original image visible if canvas or WebGL is unavailable.
          geometry?.dispose(); material?.dispose(); renderer?.dispose(); renderer?.domElement.remove();
          material = null; setReady(false);
        }
      };
      image.src = source;
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) initialize();
      updateActivity();
    }, { threshold: .05 });
    observer.observe(element);
    element.parentElement.addEventListener('pointermove', pointerMove, { passive: true });
    document.addEventListener('visibilitychange', updateActivity);
    return () => {
      disposed = true; image.onload = null;
      cancelAnimationFrame(frame); timeline?.kill(); observer.disconnect(); resizeObserver?.disconnect();
      element.parentElement?.removeEventListener('pointermove', pointerMove);
      document.removeEventListener('visibilitychange', updateActivity);
      renderer?.domElement.removeEventListener('webglcontextlost', contextLost);
      geometry?.dispose(); material?.dispose(); renderer?.dispose(); renderer?.domElement.remove();
    };
  }, [reducedMotion]);
  return <div ref={host} className={`contact-portrait ${ready ? 'particles-ready' : ''}`} data-particles={ready ? 'ready' : reducedMotion ? 'reduced-motion' : 'fallback'} aria-hidden="true">
    <img className="portrait-fallback" src={source} alt="" loading="lazy" decoding="async" />
  </div>;
}

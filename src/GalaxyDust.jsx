import { useEffect, useRef } from 'react';

// A static, seeded dust field adds fine galactic detail without another WebGL context.
export default function GalaxyDust() {
  const canvas = useRef(null);
  useEffect(() => {
    const element = canvas.current;
    const draw = () => {
      const width = element.clientWidth, height = element.clientHeight;
      const ratio = Math.min(devicePixelRatio, 1.5);
      element.width = width * ratio; element.height = height * ratio;
      const context = element.getContext('2d');
      if (!context) return;
      context.scale(ratio, ratio);
      let seed = 72;
      const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
      for (let i = 0; i < 48000; i++) {
        const x = random() * width;
        const spread = (random() + random() + random() - 1.5) * height * .32;
        const y = height * .85 - x / width * height * .7 + spread;
        const center = 1 - Math.min(1, Math.abs(spread) / (height * .35));
        context.fillStyle = `rgba(${130 + Math.floor(random() * 70)},${145 + Math.floor(random() * 60)},230,${.06 + center * random() * .25})`;
        context.fillRect(x, y, .45 + random() * .5, .45 + random() * .5);
      }
    };
    const observer = new ResizeObserver(draw); observer.observe(element); draw();
    return () => observer.disconnect();
  }, []);
  return <canvas ref={canvas} className="galaxy-dust" aria-hidden="true" />;
}

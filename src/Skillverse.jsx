import { useEffect, useRef, useState } from 'react';

const skills = [
  ['Python', 'Programming', '#71b8ea', 32, 39, 36],
  ['Django', 'Web development', '#60c99f', 47, 70, 42],
  ['Java', 'Programming', '#ed9567', 67, 48, 34],
  ['AI / ML', 'Intelligent applications', '#b4a0f5', 51, 22, 48],
  ['Docker', 'Containers', '#65c9ef', 23, 67, 39],
  ['AWS', 'Cloud', '#edbd76', 78, 24, 49],
  ['Supabase', 'Backend services', '#82d6ac', 18, 20, 32],
  ['Postgres', 'Relational data', '#8caddf', 79, 76, 40],
  ['MongoDB', 'Document data', '#a4cb7e', 9, 48, 36],
  ['Celery', 'Background tasks', '#d2db87', 53, 91, 30],
  ['Redis', 'Caching & queues', '#e3848c', 92, 49, 34],
];

export default function Skillverse() {
  const section = useRef(null);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    let intersecting = false;
    const update = () => setVisible(intersecting && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { intersecting = entry.isIntersecting; update(); });
    observer.observe(section.current);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);
  return <section id="skillverse" ref={section} className={`skillverse-section ${visible && !paused ? 'is-visible' : ''}`} aria-labelledby="skillverse-title">
    <header className="skillverse-heading"><p className="eyebrow">The tools in my orbit</p><h2 id="skillverse-title">Skillverse</h2><p>A solar system of things I build with.</p></header>
    <div className="solar-system">
      <svg className="orbital-paths" viewBox="0 0 1000 1000" aria-hidden="true">
        {[180, 300, 420].map(r => <circle key={r} cx="500" cy="500" r={r}/>)}
      </svg>
      <div className="skill-sun" aria-hidden="true"><span>BUILD</span></div>
      <ul className="skill-planets" aria-label="Technical skills">{skills.map(([name, description, color, , , size], i) => {
        const ring = i < 3 ? 0 : i < 7 ? 1 : 2;
        const slot = i - [0, 3, 7][ring];
        const phase = slot * 360 / [3, 4, 4][ring] + [15, 50, 25][ring];
        return <li key={name} className="skill-orbit" style={{'--planet-color':color,'--planet-size':`${size}px`,'--diameter':`${[36,60,84][ring]}%`,'--duration':`${[55,85,120][ring]}s`,'--phase':`${phase}deg`}}>
          <div className="planet-anchor"><div className="skill-planet">
            <span className="planet-sphere" aria-hidden="true"/><span className="planet-name">{name}</span><span className="planet-description">{description}</span>
          </div></div>
        </li>;
      })}</ul>
    </div>
    <button className="orbit-toggle" onClick={() => setPaused(value => !value)} aria-pressed={paused}>{paused ? 'Resume orbits' : 'Pause orbits'}</button>
    <p className="skillverse-note">Ideas at the center. Possibilities in every orbit.</p>
  </section>;
}

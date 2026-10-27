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
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(section.current);
    return () => observer.disconnect();
  }, []);
  return <section id="skillverse" ref={section} className={`skillverse-section ${visible ? 'is-visible' : ''}`} aria-labelledby="skillverse-title">
    <header className="skillverse-heading"><p className="eyebrow">The tools in my orbit</p><h2 id="skillverse-title">Skillverse</h2><p>A solar system of things I build with.</p></header>
    <div className="solar-system">
      <svg className="orbital-paths" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
        {[ [185,100], [305,180], [440,255] ].map(([rx,ry]) => <ellipse key={rx} cx="500" cy="300" rx={rx} ry={ry}/>)}
        <path d="M50 300h900M500 30v540"/>
      </svg>
      <div className="skill-sun" aria-hidden="true"><span>BUILD</span></div>
      <ul className="skill-planets" aria-label="Technical skills">{skills.map(([name, description, color, x, y, size], i) =>
        <li key={name} className="skill-planet" style={{'--planet-color':color,'--planet-size':`${size}px`,'--x':`${x}%`,'--y':`${y}%`,'--delay':`${-i * .7}s`}}>
          <span className="planet-sphere" aria-hidden="true"/><span className="planet-name">{name}</span><span className="planet-description">{description}</span>
        </li>
      )}</ul>
    </div>
    <p className="skillverse-note">Ideas at the center. Possibilities in every orbit.</p>
  </section>;
}

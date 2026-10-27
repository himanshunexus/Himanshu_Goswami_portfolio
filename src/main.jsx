import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '@fontsource/audiowide/latin-400.css';
import '@fontsource/monoton/latin-400.css';
import Universe from './Universe';
import GalaxyDust from './GalaxyDust';
import PortraitParticles from './PortraitParticles';
import { projects } from './projects';
import './style.css';

gsap.registerPlugin(ScrollTrigger);
const email = 'himanshugoswami5060@gmail.com';
const sections = [['universe', 'My Universe'], ['projects', 'Projects'], ['contact', 'Contact Me']];
function Icon({ name, ...props }) {
  const paths = {
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/></>,
    github: <><path d="M9 19c-4 1-4-2-6-2m12 5v-4a3.5 3.5 0 0 0-1-2.7c3.3-.4 6.7-1.6 6.7-7.3A5.7 5.7 0 0 0 19.2 4 5.3 5.3 0 0 0 19.1 0s-1.3-.4-4.1 1.5a14 14 0 0 0-7 0C5.2-.4 3.9 0 3.9 0A5.3 5.3 0 0 0 3.8 4 5.7 5.7 0 0 0 2.3 8c0 5.7 3.4 6.9 6.7 7.3A3.5 3.5 0 0 0 8 18v4" transform="translate(1 1) scale(.9)"/></>,
    linkedin: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 10v7m0-10v.1M11 17v-7m0 3c0-4 6-4 6 0v4"/></>,
    telescope: <><path d="m3 10 14-6 3 7-14 6zM17 4l3-1 3 8-3 1M12 15v3m-4 4 4-4 4 4"/></>,
    arrow: <><path d="M5 19 19 5M5 5h14v14"/></>,
    close: <path d="m6 6 12 12M6 18 18 6"/>,
    menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
function Starfield() {
  return <div className="starfield" aria-hidden="true">{Array.from({length:160}, (_,i) => <i key={i} style={{left:`${(i*61.803)%100}%`,top:`${(i*37.291)%100}%`,width:1+i%3/2,height:1+i%3/2,animationDelay:`-${i%9}s`,opacity:.25+i%7/10}} />)}</div>;
}
function Constellation({project, onSelect}) {
  return <button className={`constellation constellation-${project.id}`} style={project.position} onClick={onSelect} aria-label={`Explore ${project.title}`}>
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <polyline points={project.stars.map(p=>p.join(',')).join(' ')} />
      {project.stars.map(([x,y],i)=><g key={i}><circle className="star-halo" cx={x} cy={y} r="3"/><circle cx={x} cy={y} r={i%3 === 0 ? '.9' : '.65'}/>{i%3===0 && <path className="star-cross" d={`M${x-2} ${y}h4M${x} ${y-2}v4`}/>}</g>)}
    </svg>
    <span>{project.title}</span>
  </button>;
}
function Terrain() {
  return <svg className="terrain" viewBox="0 0 1600 500" preserveAspectRatio="none" aria-hidden="true">
    <path fill="#141a29" d="M0 260 70 251 160 270 250 245 330 252 410 210 490 234 550 209 620 232 710 220 800 244 900 227 990 253 1080 206 1180 211 1300 178 1410 225 1500 190 1600 218V500H0Z"/>
    <path fill="#0a101b" d="M0 310 120 290 260 324 370 298 480 332 600 290 750 320 900 285 1040 302 1190 270 1340 296 1470 274 1600 306V500H0Z"/>
    {Array.from({length:44},(_,i)=>{const x=i*41, y=288+(i*17%40),h=32+i*19%80;return <path key={i} fill="#060b12" d={`M${x} ${y-h}l-12 25h6l-16 27h9l-18 30h27v25h7v-25h27l-18-30h9l-16-27h6z`}/>})}
    <path fill="#030507" d="M0 388Q220 340 420 399T810 382T1210 375T1600 390V500H0Z"/>
    <g fill="#020304" stroke="#020304" strokeWidth="5" transform="translate(390 312)">
      <circle cx="0" cy="-40" r="12"/><path d="M-8-27Q-18-8-12 20L-21 66H-12L4 27 10 66H20L11 15 9-17 32-25 29-32 5-24Z"/>
      <path d="m36-20-15 85m15-85 22 85m-22-85 4 85" fill="none"/>
      <path d="m20-30 50-21 5 12-50 22Z"/><path d="m68-53 8-3 8 19-8 3Z"/>
    </g>
    <path fill="#000" d="M0 450Q250 401 430 433T820 442T1220 417T1600 433V500H0Z"/>
  </svg>;
}
function ProjectLens({project,onClose}) {
  const dialog = useRef(null);
  useEffect(()=>{
    const previous = document.activeElement;
    dialog.current.showModal();
    const old = document.body.style.overflow; document.body.style.overflow='hidden';
    return ()=>{ document.body.style.overflow=old; previous?.focus(); };
  },[]);
  return <dialog ref={dialog} className="project-dialog" onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget)onClose();}} aria-labelledby="lens-title">
    <div className="project-lens">
      <div className="reticle" aria-hidden="true" />
      <button className="lens-close" onClick={onClose} aria-label="Close project"><Icon name="close"/></button>
      <div className="lens-content"><p className="eyebrow">{project.category}</p><h2 id="lens-title">{project.title}</h2><p className="lens-summary">{project.summary}</p><p className="lens-description">{project.description}</p><ul className="tags">{project.tags.map(tag=><li key={tag}>{tag}</li>)}</ul><div className="project-links">{project.live && <a href={project.live} target="_blank" rel="noreferrer">Visit app <Icon name="arrow"/></a>}<a href={project.github} target="_blank" rel="noreferrer">View code <Icon name="github"/></a></div></div>
    </div>
  </dialog>;
}
function App() {
  const [active,setActive]=useState('universe');
  const [progress,setProgress]=useState(0);
  const [selected,setSelected]=useState(null);
  const [menu,setMenu]=useState(false);
  const [copied,setCopied]=useState(false);
  const [reducedMotion,setReducedMotion]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
  const universe=useRef(null), projectsRef=useRef(null), root=useRef(null), copyTimer=useRef(null);
  useEffect(()=>{
    const media=matchMedia('(prefers-reduced-motion: reduce)');
    const change=()=>setReducedMotion(media.matches);media.addEventListener('change',change);
    return()=>{media.removeEventListener('change',change);clearTimeout(copyTimer.current);};
  },[]);
  useEffect(()=>{
    const context=gsap.context(()=>{
      ScrollTrigger.create({trigger:universe.current,start:'top top',end:'bottom bottom',onUpdate:self=>setProgress(self.progress)});
      if(!reducedMotion){
        gsap.fromTo('.intro-copy',{opacity:1,y:0},{opacity:0,y:-80,scrollTrigger:{trigger:universe.current,start:'top top',end:'22% top',scrub:1}});
        gsap.fromTo('.about-copy',{opacity:0,y:35},{opacity:1,y:0,scrollTrigger:{trigger:universe.current,start:'25% top',end:'40% top',scrub:1}});
        gsap.to('.about-copy',{opacity:0,y:-35,scrollTrigger:{trigger:universe.current,start:'57% top',end:'70% top',scrub:1}});
        gsap.fromTo('.terrain',{y:65},{y:0,scrollTrigger:{trigger:projectsRef.current,start:'top bottom',end:'center center',scrub:1}});
      }
      sections.forEach(([id])=>ScrollTrigger.create({trigger:`#${id}`,start:'top 50%',end:'bottom 50%',onEnter:()=>setActive(id),onEnterBack:()=>setActive(id)}));
    },root);
    return()=>context.revert();
  },[reducedMotion]);
  const navigate=id=>{setMenu(false);document.getElementById(id).scrollIntoView({behavior:reducedMotion?'instant':'smooth'});};
  const copyEmail=async()=>{
    try{await navigator.clipboard.writeText(email);setCopied(true);clearTimeout(copyTimer.current);copyTimer.current=setTimeout(()=>setCopied(false),2500);}
    catch{window.location.href=`mailto:${email}`;}
  };
  return <div ref={root} className={reducedMotion?'app reduced-motion':'app'}>
    <a className="skip-link" href="#projects">Skip to projects</a>
    <nav className="scene-nav" aria-label="Scene navigation">
      <button className="menu-toggle" aria-label={menu?'Close navigation':'Open navigation'} aria-expanded={menu} aria-controls="scene-menu" onClick={()=>setMenu(!menu)}><Icon name={menu?'close':'menu'}/></button>
      <div id="scene-menu" className={`nav-items ${menu?'is-open':''}`}>{sections.map(([id,label])=><button key={id} onClick={()=>navigate(id)} aria-current={active===id?'page':undefined}>{label}</button>)}</div>
    </nav>
    <main>
      <section id="universe" className="universe-section" ref={universe} aria-label="My universe">
        <div className="universe-sticky"><Universe progress={reducedMotion?0:progress} reducedMotion={reducedMotion}/>
          <div className="intro-copy"><h1>Himanshu Goswami</h1><p>A curious mind who loves to build</p></div>
          <div className="about-copy" inert={!reducedMotion && (progress < .15 || progress > .7)}><p className="eyebrow">A little about my universe</p><h2>Turning curiosity<br/>into something real.</h2><p>I'm Himanshu, a Computer Science student at Parul University. I explore machine learning, data science, and build useful applications with Python and Django.</p><p className="about-detail">Off screen, you'll find me on the cricket or football field.</p><button onClick={()=>navigate('projects')}>Explore my work <span>↓</span></button></div>
          <button className="scroll-cue" onClick={()=>{window.scrollBy({top:innerHeight,behavior:reducedMotion?'instant':'smooth'});}} aria-label="Scroll to explore"><span className="mouse-icon"/><span className="scroll-line"/></button>
        </div>
      </section>
      <section id="projects" className="projects-section" ref={projectsRef} aria-label="Project constellations">
        <div className="projects-sticky"><div className="milky-way" aria-hidden="true"/><GalaxyDust/><Starfield/><div className="moon" aria-hidden="true"/>
          <h2 className="sr-only">Selected projects</h2>
          <div className="constellation-map">{projects.map(project=><Constellation key={project.id} project={project} onSelect={()=>setSelected(project)}/>)}</div>
          <Terrain/><p className="constellation-hint"><Icon name="telescope"/> Pick a constellation</p>
        </div>
      </section>
      <section id="contact" className="contact-section">
        <PortraitParticles reducedMotion={reducedMotion}/>
        <Starfield/>
        <div className="contact-content"><h2>Let's Orbit Together</h2><p>If something here pulled you in, don't hesitate to say hi.</p><div className="contact-links">
          <div className="copy-wrapper"><button onClick={copyEmail} aria-label={`Copy email address ${email}`} title="Copy email address"><Icon name="mail"/></button><span role="status">{copied?'Copied!':''}</span></div>
          <a href="https://github.com/himanshunexus" target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub"><Icon name="github"/></a>
          <a href="https://www.linkedin.com/in/himanshu-goswami-b88085350/" target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn"><Icon name="linkedin"/></a>
          <a href={`mailto:${email}`} aria-label="Send me an email" title="Send an email"><Icon name="arrow"/></a>
        </div><a className="email-link" href={`mailto:${email}`}>{email}</a></div>
        <footer>India, {new Date().getFullYear()}</footer>
      </section>
    </main>
    {selected && <ProjectLens project={selected} onClose={()=>setSelected(null)}/>}
  </div>;
}

createRoot(document.getElementById('root')).render(<App/>);

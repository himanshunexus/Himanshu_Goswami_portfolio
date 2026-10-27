import { test, expect } from '@playwright/test';

test('navigation clears headings and skill orbits move with upright labels',async({page})=>{
  await page.goto('/');
  for(const width of [1440,390,320]) {
    await page.setViewportSize({width,height:900});
    await page.getByRole('button',{name:'Skillverse',exact:true}).click();
    await expect.poll(()=>page.locator('#skillverse').evaluate(e=>Math.abs(e.getBoundingClientRect().top))).toBeLessThan(2);
    const layout=await page.evaluate(()=>{
      const nav=document.querySelector('.scene-nav').getBoundingClientRect();
      const heading=document.querySelector('#skillverse-title').getBoundingClientRect();
      const links=[...document.querySelectorAll('.nav-items button')].map(e=>e.getBoundingClientRect());
      return {clear:heading.top>nav.bottom,oneRow:links.every(r=>Math.abs(r.top-links[0].top)<1),noOverlap:links.every((r,i)=>!i||r.left>=links[i-1].right),fits:document.documentElement.scrollWidth<=innerWidth};
    });
    expect(layout).toEqual({clear:true,oneRow:true,noOverlap:true,fits:true});
    await page.screenshot({path:`test-results/orbits-${width}.png`});
  }
  const orbit=page.locator('.skill-orbit').first();
  const before=await orbit.evaluate(e=>getComputedStyle(e).transform);
  await expect.poll(()=>orbit.evaluate(e=>getComputedStyle(e).transform)).not.toBe(before);
  const angle=await orbit.evaluate(e=>{
    const a=new DOMMatrix(getComputedStyle(e).transform),b=new DOMMatrix(getComputedStyle(e.querySelector('.skill-planet')).transform);
    return Math.abs(Math.atan2(a.multiply(b).b,a.multiply(b).a));
  });
  expect(angle).toBeLessThan(.01);
  await expect(page.locator('.about-copy>p').nth(1)).toHaveCSS('font-family','Audiowide, sans-serif');
  await page.getByRole('button',{name:'Pause orbits'}).click();
  await expect(orbit).toHaveCSS('animation-play-state','paused');
  await page.getByRole('button',{name:'Resume orbits'}).click();
  await expect(orbit).toHaveCSS('animation-play-state','running');
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(orbit).toHaveCSS('animation-name','none');
});

test('desktop journey, all project dialogs, and the new Bazar destination', async ({page}) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/');
  await expect(page.getByRole('heading',{level:1})).toContainText('Himanshu Goswami');
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:'test-results/desktop-universe.png'});
  await page.getByRole('button',{name:'Projects',exact:true}).click();
  await expect(page.getByRole('button',{name:'Projects',exact:true})).toHaveAttribute('aria-current','page');
  await expect.poll(()=>page.locator('#projects').evaluate(e=>Math.abs(e.getBoundingClientRect().top))).toBeLessThan(2);
  await page.screenshot({path:'test-results/desktop-projects.png'});
  for (const name of ['Smart-Cart','Loan Eligibility Predictor','Bazar','Nivora ERP','This Universe']) {
    const trigger=page.getByRole('button',{name:`Explore ${name}`,exact:true});
    await trigger.click();
    const dialog=page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading')).toHaveText(name);
    if(name==='Smart-Cart') await expect(dialog.getByRole('link',{name:'View code'})).toHaveAttribute('href','https://github.com/himanshunexus/Smart-Cart');
    if(name==='Bazar') await expect(dialog.getByRole('link',{name:'Visit app'})).toHaveAttribute('href','https://bazar-new.onrender.com/');
    if(name==='Loan Eligibility Predictor') await page.screenshot({path:'test-results/desktop-lens.png',animations:'disabled'});
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  }
  await page.getByRole('button',{name:'Contact Me',exact:true}).click();
  await expect(page.getByRole('button',{name:'Contact Me',exact:true})).toHaveAttribute('aria-current','page');
  await expect.poll(()=>page.locator('#contact').evaluate(e=>Math.abs(e.getBoundingClientRect().top))).toBeLessThan(2);
  await expect(page.getByRole('link',{name:'Send me an email'})).toHaveAttribute('href','mailto:himanshugoswami5060@gmail.com');
  await expect(page.getByRole('link',{name:'LeetCode',exact:true})).toHaveAttribute('href','https://leetcode.com/u/himanshugoswami05/');
  await page.screenshot({path:'test-results/desktop-contact.png'});
  expect(errors).toEqual([]);
});

test('Skillverse, revised biography and scene artwork work on desktop and mobile',async({page})=>{
  for(const width of [1440,390]) {
    await page.setViewportSize({width,height:900});
    await page.goto('/');
    await expect(page.locator('.about-copy')).toContainText("I'm Himanshu, a technology-driven creator exploring machine learning and AI.");
    await expect(page.locator('.about-detail')).toHaveText("Off screen, you'll find me on the cricket field.");
    
    await page.getByRole('button',{name:'Skillverse',exact:true}).click();
    await expect(page.getByRole('button',{name:'Skillverse',exact:true,includeHidden:true})).toHaveAttribute('aria-current','page');
    await expect(page.locator('.skill-planet')).toHaveCount(11);
    await expect.poll(()=>page.locator('#skillverse').evaluate(e=>Math.abs(e.getBoundingClientRect().top))).toBeLessThan(2);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
    await page.screenshot({path:`test-results/skillverse-${width}.png`});
    
    await page.getByRole('button',{name:'Projects',exact:true}).click();
    await expect.poll(()=>page.locator('.telescope-figure').evaluate(e=>e.complete&&e.naturalWidth>0)).toBeTruthy();
    await expect(page.locator('.constellation-art')).toHaveCount(5);
  }
});

test('mobile navigation and accessible project lens fit the viewport',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:'test-results/mobile-universe.png'});

  await page.getByRole('button',{name:'Projects',exact:true}).click();

  await page.getByRole('button',{name:'Explore Loan Eligibility Predictor'}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('link',{name:'View code'})).toBeInViewport();
  await page.screenshot({path:'test-results/mobile-lens.png',animations:'disabled'});
  await page.getByRole('button',{name:'Close project'}).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});

test('reduced motion exposes biography without the long scroll journey',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await expect(page.locator('.about-copy')).toHaveCSS('opacity','1');
  const metrics=await page.locator('#universe').evaluate(e=>({height:e.clientHeight,viewport:innerHeight}));
  expect(metrics.height).toBeLessThanOrEqual(Math.max(1000,metrics.viewport*1.5)+1);
  await page.getByRole('button',{name:'Projects',exact:true}).click();
  await page.getByRole('button',{name:'Explore Bazar',exact:true}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
});

test('production security headers and private paths',async({request,page})=>{
  const response=await request.get('/');
  expect(response.headers()['content-security-policy']).toContain("script-src 'self'");
  expect(response.headers()['x-frame-options']).toBe('DENY');
  expect((await request.get('/.env')).status()).toBe(404);
  expect((await request.get('/.git/config')).status()).toBe(404);
  expect((await request.post('/')).status()).toBe(405);
  const violations=[];
  await page.addInitScript(()=>{
    window.policyViolations=[];
    document.addEventListener('securitypolicyviolation',e=>window.policyViolations.push(e.violatedDirective));
  });
  await page.goto('/');
  await page.getByRole('button',{name:'Contact Me',exact:true}).click();
  await expect.poll(()=>page.locator('.contact-portrait img').evaluate(e=>e.complete && e.naturalWidth>0)).toBeTruthy();
  violations.push(...await page.evaluate(()=>window.policyViolations));
  expect(violations).toEqual([]);
});

test('portrait is a live particle cloud with scatter and pointer interaction',async({page})=>{
  test.setTimeout(45000);
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/');
  await page.getByRole('button',{name:'Contact Me',exact:true}).click();
  await expect(page.locator('.contact-portrait')).toHaveAttribute('data-particles','ready');
  await expect(page.locator('.contact-portrait canvas')).toBeVisible();
  // The reference intentionally takes five seconds to reveal the portrait.
  await page.waitForTimeout(5500);
  await page.screenshot({path:'test-results/portrait-formed.png'});
  await page.mouse.move(620,260);
  await page.mouse.move(820,390,{steps:24});
  await page.screenshot({path:'test-results/portrait-pointer.png'});
  // Observe the first four-second depth expansion after its eight-second delay.
  await page.waitForTimeout(7500);
  await page.screenshot({path:'test-results/portrait-scattered.png'});
  expect(errors).toEqual([]);
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(page.locator('.contact-portrait')).toHaveAttribute('data-particles','reduced-motion');
  await expect(page.locator('.contact-portrait canvas')).toHaveCount(0);
  await expect(page.locator('.portrait-fallback')).toHaveCSS('opacity','0.65');
});

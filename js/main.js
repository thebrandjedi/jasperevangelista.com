const nav=document.querySelector('.site-nav');
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
const clamp=v=>Math.max(0,Math.min(1,v));
const smooth=v=>v*v*(3-2*v);
const scenes=[...document.querySelectorAll('.portal-scene')];
let raf=0;

function progress(el,start=.9,end=.25){
  if(!el)return 0;
  const r=el.getBoundingClientRect(),h=window.innerHeight;
  return smooth(clamp((h*start-r.top)/(h*(start-end)+r.height*.18)));
}

function render(){
  raf=0;
  nav?.classList.toggle('scrolled',scrollY>18);
  if(reduce.matches)return;
  const hero=document.querySelector('.hero');
  const heroInner=document.querySelector('.hero-inner');
  if(hero&&heroInner){
    const hp=clamp(scrollY/(hero.offsetHeight*.72));
    heroInner.style.transform=`translate3d(0,${-hp*18}px,0)`;
    heroInner.style.opacity=String(1-hp*.16);
    document.querySelectorAll('.fragment').forEach((el,i)=>{
      const dir=i%2?1:-1;
      el.style.transform=`translate3d(${dir*hp*(8+i*1.5)}px,${hp*(3+(i%3)*2)}px,0)`;
    });
  }

  const canon=document.querySelector('#canon');
  if(canon){
    const r=canon.getBoundingClientRect(),h=innerHeight;
    const p=clamp((h*.72-r.top)/(Math.max(1,r.height-h*.25)));
    const move=document.querySelector('.meaning-move');
    const drift=document.querySelector('.meaning-drift');
    if(move)move.style.transform=`translate3d(${p*22}px,0,0)`;
    if(drift)drift.style.transform=`translate3d(${p*48}px,${p*2}px,0)`;
    const separation=Math.sin(Math.min(1,p)*Math.PI)*38;
    document.querySelectorAll('.fragment-pair').forEach((row,i)=>{
      const right=row.lastElementChild;
      if(right)right.style.setProperty('--fragment-gap',`${separation*(.65+i*.16)}px`);
    });
  }

  const jasper=document.querySelector('#jasper');
  if(jasper){
    const beats=[...jasper.querySelectorAll('.split>div:last-child>.big-copy,.split>div:last-child>.copy,.experience-line')];
    let best=null,bestDist=Infinity;
    beats.forEach(el=>{
      const r=el.getBoundingClientRect();
      const d=Math.abs(r.top-innerHeight*.43);
      if(d<bestDist){best=el;bestDist=d}
      el.classList.remove('story-focus','story-soft');
    });
    beats.forEach(el=>el.classList.add(el===best?'story-focus':'story-soft'));
    const jp=progress(jasper,.92,.28);
    const steel=jasper.querySelector('.steel-line');
    if(steel)steel.style.setProperty('--steel',String(clamp(jp*2.1)));
    jasper.querySelectorAll('.range-lines span').forEach((el,i)=>{
      el.style.setProperty('--range-x',`${(1-clamp(jp*1.45-.18))*([10,-7,13,-5][i])}px`);
    });
    jasper.querySelectorAll('.operating-code span').forEach((el,i)=>{
      const q=clamp(jp*1.65-.42-i*.08);
      el.style.setProperty('--code-y',`${(1-q)*12}px`);
      el.style.setProperty('--code-o',String(.38+q*.62));
    });
  }

  const lab=document.querySelector('#lab');
  if(lab){
    const lp=progress(lab,.95,.25);
    const card=lab.querySelector('.lab-card');
    if(card){
      card.style.setProperty('--lab-x',`${(lp-.5)*18}px`);
      card.style.setProperty('--lab-y',`${(.5-lp)*10}px`);
    }
  }

  const closing=document.querySelector('.closing');
  if(closing){
    const cp=progress(closing,.9,.28);
    closing.style.setProperty('--final-zero-x',`${(cp-.5)*2}px`);
    closing.style.setProperty('--closing-copy-o',String(.55+cp*.45));
    closing.style.setProperty('--closing-copy-y',`${(1-cp)*8}px`);
  }

  const worlds=document.querySelector('#worlds');
  if(worlds){
    const p=progress(worlds,.92,.36);
    const words=[...worlds.querySelectorAll(':scope > .section-inner > h2 > span')];
    const offsets=[-16,10,-7];
    words.forEach((el,i)=>el.style.transform=`translate3d(${(1-p)*offsets[i]}px,${(1-p)*(i%2?8:3)}px,0)`);
  }
}

function schedule(){if(!raf&&!document.hidden)raf=requestAnimationFrame(render)}

if('IntersectionObserver'in window){
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>e.target.classList.toggle('is-active',e.isIntersecting&&!reduce.matches&&!document.hidden));
  },{threshold:.08});
  scenes.forEach(s=>io.observe(s));
}else scenes.forEach(s=>s.classList.add('is-active'));

function reset(){
  document.body.classList.toggle('motion-enabled',!reduce.matches);
  if(reduce.matches){
    document.querySelectorAll('.fragment,.meaning-move,.meaning-drift,.fragment-pair span,#worlds h2>span,.hero-inner,.range-lines span,.operating-code span,.closing h2,.closing .operating-close').forEach(el=>{el.style.transform='';el.style.opacity='';});
  }
  schedule();
}
addEventListener('scroll',schedule,{passive:true});
addEventListener('resize',schedule,{passive:true});
addEventListener('pageshow',schedule);
document.addEventListener('visibilitychange',()=>{scenes.forEach(s=>s.classList.toggle('is-active',!document.hidden&&!reduce.matches&&s.getBoundingClientRect().bottom>0&&s.getBoundingClientRect().top<innerHeight));schedule();});
reduce.addEventListener('change',reset);
document.body.classList.add('is-ready');
reset();

const nav=document.querySelector('.site-nav');
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.body.classList.add('is-ready');

const clamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,v));
const progressThrough=(el)=>{
  const r=el.getBoundingClientRect();
  const vh=window.innerHeight;
  return clamp((vh-r.top)/(vh+r.height));
};

const hero=document.querySelector('.hero');
const fragments=[...document.querySelectorAll('.fragment')];
const canon=document.querySelector('#canon');
const alignLine=document.querySelector('.alignment-line');
const worlds=document.querySelector('#worlds');
const worldTitle=document.querySelector('.worlds-section h2');
const lab=document.querySelector('.lab-card');
const closing=document.querySelector('.closing');

function onScroll(){
  nav?.classList.toggle('scrolled',window.scrollY>18);
  if(reduceMotion)return;

  if(hero){
    const p=clamp(window.scrollY/(window.innerHeight*.95));
    fragments.forEach((el,i)=>{
      const dir=i%2===0?1:-1;
      const x=dir*p*(7+i*1.1);
      const y=((i%3)-1)*p*6;
      el.style.transform=`translate3d(${x}px,${y}px,0)`;
      el.style.opacity=String(.30-p*.11);
    });
  }

  if(canon){
    const p=progressThrough(canon);
    canon.style.setProperty('--canon-line',String(clamp((p-.18)*1.45)));
    alignLine?.style.setProperty('--align-shift',`${(p-.5)*18}px`);
  }

  if(worlds&&worldTitle){
    const p=progressThrough(worlds);
    worldTitle.style.setProperty('--world-title-shift',`${(p-.5)*-26}px`);
  }

  if(lab){
    const p=progressThrough(lab);
    lab.style.setProperty('--lab-x',`${(p-.5)*28}px`);
    lab.style.setProperty('--lab-y',`${Math.sin(p*Math.PI)*-18}px`);
  }

  if(closing){
    const p=progressThrough(closing);
    closing.style.setProperty('--close-line',String(clamp((p-.2)*1.55)));
    closing.style.setProperty('--close-shift',`${(p-.5)*-34}px`);
  }
}

window.addEventListener('scroll',onScroll,{passive:true});
onScroll();

if(!reduceMotion){
  const grid=document.querySelector('.scene-grid');
  const orbitOne=document.querySelector('.orbit-one');
  const orbitTwo=document.querySelector('.orbit-two');
  const sun=document.querySelector('.scene-sun');
  const horizon=document.querySelector('.scene-horizon');
  const start=performance.now();

  function animate(now){
    const slow=((now-start)%52000)/52000;
    const tech=((now-start)%120000)/120000;
    const eased=slow*slow*(3-2*slow);
    const pulse=(1-Math.cos(tech*Math.PI*2))/2;

    if(grid){
      const depth=72+eased*20;
      const side=Math.sin(slow*Math.PI*2)*2.5;
      grid.style.transform=`perspective(320px) rotateX(63deg) translate3d(${side}px,${depth}px,0)`;
    }
    if(orbitOne){
      orbitOne.style.transform=`rotate(-24deg) scale(${.996+pulse*.01})`;
      orbitOne.style.opacity=.21+pulse*.035;
    }
    if(orbitTwo){
      orbitTwo.style.transform=`rotate(42deg) scale(${.997+pulse*.009})`;
      orbitTwo.style.opacity=.17+pulse*.032;
    }
    if(sun){
      const glow=(1-Math.cos(slow*Math.PI*2))/2;
      sun.style.transform=`translateY(${glow*7}px) scale(${1.006-glow*.025})`;
      sun.style.opacity=.20-glow*.075;
    }
    if(horizon){
      horizon.style.transform=`rotate(-4deg) translateX(${Math.sin(slow*Math.PI*2)*3}px)`;
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

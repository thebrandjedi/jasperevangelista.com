const nav = document.querySelector('.site-nav');
const hero = document.querySelector('.cinematic-hero');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

if (hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('pointermove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 2;
    const y = (event.clientY / window.innerHeight - 0.5) * 2;
    hero.style.setProperty('--mx', `${x * 10}px`);
    hero.style.setProperty('--my', `${y * 8}px`);
  }, { passive: true });
}

// Portal motion is driven here rather than relying only on CSS animation.
// All three worlds share one calm rhythm, with HumanTech deliberately slower
// because its circular geometry naturally attracts more visual attention.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion) {
  const grid = document.querySelector('.scene-grid');
  const orbitOne = document.querySelector('.orbit-one');
  const orbitTwo = document.querySelector('.orbit-two');
  const sun = document.querySelector('.scene-sun');
  const horizon = document.querySelector('.scene-horizon');
  const duration = 14000;
  const humanTechDuration = 30000;
  const start = performance.now();

  function animatePortals(now) {
    const t = ((now - start) % duration) / duration;
    const techT = ((now - start) % humanTechDuration) / humanTechDuration;
    const angle = t * 360;
    const techAngle = techT * 360;

    if (grid) {
      const depth = 70 + (t * 34);
      grid.style.transform = `perspective(300px) rotateX(62deg) translateY(${depth}px)`;
    }

    // HumanTech: ultra-slow orbital movement so the geometry feels ambient,
    // not like a spinning graphic competing for attention.
    if (orbitOne) orbitOne.style.transform = `rotate(${-24 + techAngle}deg)`;
    if (orbitTwo) orbitTwo.style.transform = `rotate(${42 - techAngle}deg)`;

    if (sun) {
      const pulse = (1 - Math.cos(t * Math.PI * 2)) / 2;
      const scale = 0.92 + pulse * 0.16;
      const opacity = 0.72 + pulse * 0.24;
      sun.style.transform = `scale(${scale})`;
      sun.style.opacity = opacity;
    }

    if (horizon) {
      const drift = Math.sin(t * Math.PI * 2) * 8;
      horizon.style.transform = `rotate(-4deg) translateX(${drift}px)`;
    }

    requestAnimationFrame(animatePortals);
  }

  requestAnimationFrame(animatePortals);
}

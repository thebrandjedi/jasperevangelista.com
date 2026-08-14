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
// The worlds share a calm rhythm. HumanTech uses breathing rather than rotation
// so the circular forms feel alive without becoming the visual focus.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion) {
  const grid = document.querySelector('.scene-grid');
  const orbitOne = document.querySelector('.orbit-one');
  const orbitTwo = document.querySelector('.orbit-two');
  const sun = document.querySelector('.scene-sun');
  const horizon = document.querySelector('.scene-horizon');
  const duration = 14000;
  const humanTechDuration = 60000;
  const start = performance.now();

  function animatePortals(now) {
    const t = ((now - start) % duration) / duration;
    const techT = ((now - start) % humanTechDuration) / humanTechDuration;

    if (grid) {
      const depth = 70 + (t * 34);
      grid.style.transform = `perspective(300px) rotateX(62deg) translateY(${depth}px)`;
    }

    // HumanTech: no rotation. The rings subtly breathe in and out over 60 seconds.
    const techPulse = (1 - Math.cos(techT * Math.PI * 2)) / 2;
    const techScaleOne = 0.985 + techPulse * 0.03;
    const techScaleTwo = 0.99 + techPulse * 0.025;
    const techOpacityOne = 0.20 + techPulse * 0.10;
    const techOpacityTwo = 0.17 + techPulse * 0.09;

    if (orbitOne) {
      orbitOne.style.transform = `rotate(-24deg) scale(${techScaleOne})`;
      orbitOne.style.opacity = techOpacityOne;
    }
    if (orbitTwo) {
      orbitTwo.style.transform = `rotate(42deg) scale(${techScaleTwo})`;
      orbitTwo.style.opacity = techOpacityTwo;
    }

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

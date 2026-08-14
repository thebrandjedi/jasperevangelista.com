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

// Calm portal motion. HumanTech breathes very slowly; Second Act keeps
// its light safely behind the wordmark so the typography remains dominant.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion) {
  const grid = document.querySelector('.scene-grid');
  const orbitOne = document.querySelector('.orbit-one');
  const orbitTwo = document.querySelector('.orbit-two');
  const sun = document.querySelector('.scene-sun');
  const horizon = document.querySelector('.scene-horizon');
  const duration = 14000;
  const humanTechDuration = 90000;
  const start = performance.now();

  function animatePortals(now) {
    const t = ((now - start) % duration) / duration;
    const techT = ((now - start) % humanTechDuration) / humanTechDuration;

    if (grid) {
      const depth = 70 + (t * 34);
      grid.style.transform = `perspective(300px) rotateX(62deg) translateY(${depth}px)`;
    }

    // HumanTech: extremely slow breathing, not rotation.
    const techPulse = (1 - Math.cos(techT * Math.PI * 2)) / 2;
    const techScaleOne = 0.995 + techPulse * 0.012;
    const techScaleTwo = 0.997 + techPulse * 0.010;
    const techOpacityOne = 0.23 + techPulse * 0.055;
    const techOpacityTwo = 0.20 + techPulse * 0.05;

    if (orbitOne) {
      orbitOne.style.transform = `rotate(-24deg) scale(${techScaleOne})`;
      orbitOne.style.opacity = techOpacityOne;
    }
    if (orbitTwo) {
      orbitTwo.style.transform = `rotate(42deg) scale(${techScaleTwo})`;
      orbitTwo.style.opacity = techOpacityTwo;
    }

    // Second Act: slow breathing orb, kept above the horizon and well away
    // from the central AGAIN wordmark.
    if (sun) {
      const pulse = (1 - Math.cos(t * Math.PI * 2)) / 2;
      const scale = 0.94 + pulse * 0.10;
      const opacity = 0.68 + pulse * 0.20;
      sun.style.transform = `scale(${scale})`;
      sun.style.opacity = opacity;
    }

    if (horizon) {
      const drift = Math.sin(t * Math.PI * 2) * 5;
      horizon.style.transform = `rotate(-4deg) translateX(${drift}px)`;
    }

    requestAnimationFrame(animatePortals);
  }

  requestAnimationFrame(animatePortals);
}

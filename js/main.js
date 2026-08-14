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

// Portal motion language: slow, deliberate, relaxing. Movement should be
// felt before it is noticed. Typography remains the visual protagonist.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion) {
  const grid = document.querySelector('.scene-grid');
  const orbitOne = document.querySelector('.orbit-one');
  const orbitTwo = document.querySelector('.orbit-two');
  const sun = document.querySelector('.scene-sun');
  const horizon = document.querySelector('.scene-horizon');
  const duration = 24000;
  const humanTechDuration = 120000;
  const start = performance.now();

  function animatePortals(now) {
    const t = ((now - start) % duration) / duration;
    const techT = ((now - start) % humanTechDuration) / humanTechDuration;

    // Brand Jedi: a very slow forward glide through the perspective grid.
    if (grid) {
      const eased = t * t * (3 - 2 * t);
      const depth = 70 + (eased * 24);
      grid.style.transform = `perspective(300px) rotateX(62deg) translateY(${depth}px)`;
    }

    // HumanTech: a two-minute, almost imperceptible breathing field.
    const techPulse = (1 - Math.cos(techT * Math.PI * 2)) / 2;
    const techScaleOne = 0.998 + techPulse * 0.008;
    const techScaleTwo = 0.999 + techPulse * 0.007;
    const techOpacityOne = 0.20 + techPulse * 0.035;
    const techOpacityTwo = 0.18 + techPulse * 0.03;

    if (orbitOne) {
      orbitOne.style.transform = `rotate(-24deg) scale(${techScaleOne})`;
      orbitOne.style.opacity = techOpacityOne;
    }
    if (orbitTwo) {
      orbitTwo.style.transform = `rotate(42deg) scale(${techScaleTwo})`;
      orbitTwo.style.opacity = techOpacityTwo;
    }

    // Bespoke Second Act: begin quietly luminous, then diffuse downward.
    // Keep the light well below the previous intensity so AGAIN stays dominant.
    if (sun) {
      const fade = t;
      const easedFade = fade * fade * (3 - 2 * fade);
      const scale = 1.005 - easedFade * 0.025;
      const opacity = 0.22 - easedFade * 0.10;
      sun.style.transform = `scale(${scale})`;
      sun.style.opacity = opacity;
    }

    if (horizon) {
      const drift = Math.sin(t * Math.PI * 2) * 3;
      horizon.style.transform = `rotate(-4deg) translateX(${drift}px)`;
    }

    requestAnimationFrame(animatePortals);
  }

  requestAnimationFrame(animatePortals);
}

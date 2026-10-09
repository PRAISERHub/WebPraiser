'use strict';

// Content and a complete static fallback remain available without JavaScript.
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const visual = document.querySelector('.connection-visual');
const motionButton = document.querySelector('.motion-toggle');

if (visual && motionButton) {
  const fields = [
    { key: 'practice', title: 'Practice', description: 'Turn insight into meaningful action.' },
    { key: 'ai', title: 'AI', description: 'Apply intelligence. Expand possibilities.' },
    { key: 'sustaining', title: 'Sustaining', description: 'Build lasting value. Support sustainable progress.' },
    { key: 'education', title: 'Education', description: 'Support learning. Empower educators.' },
    { key: 'research', title: 'Research', description: 'Ask better questions. Share discoveries.' }
  ];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const buttons = [...visual.querySelectorAll('button[data-discipline]')];
  const connections = [...visual.querySelectorAll('[data-discipline]')];
  const letters = [...visual.querySelectorAll('[data-letter-group]')];
  const orbit = visual.querySelector('.map-orbit');
  const stage = visual.querySelector('.constellation-stage');
  const plot = visual.querySelector('.constellation');
  const detail = visual.querySelector('.detail-copy');
  const title = visual.querySelector('.detail-title');
  const description = visual.querySelector('.detail-description');
  const announcement = visual.querySelector('.discipline-announcement');
  const orbitDurationMs = 10000;

  let startAngle = 0;
  let activeIndex = 0;
  let elapsedMs = 0;
  let previousTimestamp = null;
  let pausedByVisitor = false;
  let pointerInside = false;
  let interacting = false;
  let inView = true;
  let frame = null;
  let transition = null;

  function isPaused() {
    return pausedByVisitor || reducedMotion.matches || document.hidden || interacting || !inView;
  }

  function resetPosition() {
    visual.style.removeProperty('--scene-x');
    visual.style.removeProperty('--scene-y');
  }

  function showField(index, manually = false) {
    const field = fields[index];
    activeIndex = index;
    connections.forEach(element => {
      const active = element.dataset.discipline === field.key;
      element.classList.toggle('is-active', active);
      if (element.tagName === 'BUTTON') element.setAttribute('aria-pressed', String(active));
    });
    letters.forEach(element => element.classList.toggle('is-active', element.dataset.letterGroup === field.key));
    title.textContent = field.title;
    description.textContent = field.description;
    if (transition) transition.cancel();
    if (!reducedMotion.matches && !pausedByVisitor && typeof detail.animate === 'function') {
      transition = detail.animate([
        { opacity: .35, transform: 'translateY(5px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 350, easing: 'ease-out' });
    }
    // Automatic arrivals stay quiet for screen readers; direct selections announce.
    if (manually && announcement) announcement.textContent = `${field.title}. ${field.description}`;
  }

  function positionSatellite(angle) {
    orbit.style.setProperty('--satellite-angle', `${angle.toFixed(6)}deg`);
    // Recede on the upper arc and approach on the lower arc to suggest depth.
    const depth = 1 - Math.cos(angle * Math.PI / 180) * .14;
    orbit.style.setProperty('--satellite-depth', depth.toFixed(4));
  }

  // Measure before projection: rotating the scene must not change arrival timing.
  function measureArrivals() {
    const size = plot.clientWidth;
    fields.forEach(field => {
      const button = buttons.find(element => element.dataset.discipline === field.key);
      const belowNode = field.key === 'education' || field.key === 'research';
      // All labels translate by half their width; upper labels also by their height.
      const x = button.offsetLeft - size / 2;
      const labelY = button.offsetTop + (belowNode ? 1 : -1) * button.offsetHeight / 2;
      const y = size / 2 - labelY;
      field.angle = Math.atan2(x, y) * 180 / Math.PI;
    });
    startAngle = fields[0].angle;
    fields.forEach(field => { field.offset = (field.angle - startAngle + 360) % 360; });
    elapsedMs = fields[activeIndex].offset / 360 * orbitDurationMs;
    previousTimestamp = null;
    positionSatellite(fields[activeIndex].angle);
  }

  function animateFrame(timestamp) {
    frame = null;
    if (isPaused()) return;
    if (previousTimestamp !== null) elapsedMs += Math.max(0, timestamp - previousTimestamp);
    previousTimestamp = timestamp;
    const progress = (elapsedMs % orbitDurationMs) / orbitDurationMs * 360;
    positionSatellite(startAngle + progress);
    let nextIndex = 0;
    fields.forEach((field, index) => { if (progress + 1e-7 >= field.offset) nextIndex = index; });
    if (nextIndex !== activeIndex) showField(nextIndex);
    frame = window.requestAnimationFrame(animateFrame);
  }

  function updateMotion() {
    const paused = isPaused();
    visual.classList.toggle('motion-paused', paused);
    motionButton.disabled = reducedMotion.matches;
    motionButton.setAttribute('aria-pressed', String(pausedByVisitor));
    motionButton.setAttribute('aria-label', pausedByVisitor ? 'PRAISER. Resume animation.' : 'PRAISER. Pause animation.');
    if (frame !== null) window.cancelAnimationFrame(frame);
    frame = null;
    previousTimestamp = null;
    if (paused) {
      if (pausedByVisitor || reducedMotion.matches || document.hidden || !inView || !pointerInside) resetPosition();
      if (transition) transition.finish();
    } else {
      frame = window.requestAnimationFrame(animateFrame);
    }
  }

  buttons.forEach(button => {
    button.disabled = false;
    button.addEventListener('click', () => {
      const index = fields.findIndex(field => field.key === button.dataset.discipline);
      elapsedMs = fields[index].offset / 360 * orbitDurationMs;
      positionSatellite(fields[index].angle);
      showField(index, true);
      updateMotion();
    });
  });
  motionButton.addEventListener('click', () => {
    pausedByVisitor = !pausedByVisitor;
    updateMotion();
  });

  // Hold the satellite and matching content together while reading or selecting.
  function updateInteraction() {
    interacting = pointerInside || visual.contains(document.activeElement);
    updateMotion();
  }
  visual.addEventListener('pointerenter', event => {
    if (finePointer.matches && (event.pointerType === 'mouse' || event.pointerType === 'pen')) {
      pointerInside = true;
      updateInteraction();
    }
  });
  visual.addEventListener('pointerleave', () => {
    pointerInside = false;
    resetPosition();
    updateInteraction();
  });
  visual.addEventListener('focusin', updateInteraction);
  visual.addEventListener('focusout', () => window.setTimeout(updateInteraction, 0));
  visual.addEventListener('pointermove', event => {
    if (!finePointer.matches || event.pointerType === 'touch' || reducedMotion.matches || pausedByVisitor || document.hidden || !inView) return;
    // The stationary stage avoids feedback from the figure's transformed bounds.
    const bounds = stage.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    visual.style.setProperty('--scene-x', `${(12 - y * 12).toFixed(2)}deg`);
    visual.style.setProperty('--scene-y', `${(-10 + x * 16).toFixed(2)}deg`);
  });
  finePointer.addEventListener('change', () => {
    pointerInside = false;
    resetPosition();
    updateInteraction();
  });
  reducedMotion.addEventListener('change', updateMotion);
  document.addEventListener('visibilitychange', updateMotion);

  if ('IntersectionObserver' in window) {
    const observer = new window.IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      updateMotion();
    }, { threshold: .2 });
    observer.observe(visual);
  }
  if ('ResizeObserver' in window) {
    const resizeObserver = new window.ResizeObserver(() => {
      measureArrivals();
      updateMotion();
    });
    resizeObserver.observe(plot);
  } else {
    window.addEventListener('resize', () => {
      measureArrivals();
      updateMotion();
    });
  }

  measureArrivals();
  visual.classList.add('motion-enabled');
  updateMotion();
}

(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const progress = document.querySelector('.case-progress');
  let pending = false;

  function updateProgress() {
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    const fraction = distance > 0 ? Math.max(0, Math.min(1, window.scrollY / distance)) : 0;
    progress.style.transform = `scaleX(${fraction})`;
    pending = false;
  }

  function scheduleProgress() {
    if (!pending && !reduceMotion.matches) {
      pending = true;
      requestAnimationFrame(updateProgress);
    }
  }

  window.addEventListener('scroll', scheduleProgress, { passive: true });
  window.addEventListener('resize', scheduleProgress);
  window.addEventListener('load', scheduleProgress);
  reduceMotion.addEventListener('change', scheduleProgress);
  scheduleProgress();

  if (!reduceMotion.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.15 });
    document.querySelectorAll('.case-reveal').forEach((element) => observer.observe(element));
  }
})();

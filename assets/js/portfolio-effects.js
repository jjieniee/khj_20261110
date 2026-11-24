(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const phone = document.querySelector('[data-phone-demo]');
  if (phone) {
    const viewport = phone.querySelector('.phone-scroll');
    const buttons = [...phone.querySelectorAll('[data-phone-target]')];
    const chapters = buttons.map(button => document.getElementById(button.dataset.phoneTarget));

    function markChapter(index) {
      buttons.forEach((button, position) => {
        if (position === index) button.setAttribute('aria-current', 'true');
        else button.removeAttribute('aria-current');
      });
    }

    buttons.forEach((button, index) => {
      button.addEventListener('click', () => {
        viewport.scrollTo({
          top: viewport.scrollTop + chapters[index].getBoundingClientRect().top - viewport.getBoundingClientRect().top,
          behavior: reducedMotion.matches ? 'instant' : 'smooth'
        });
      });
    });

    viewport.addEventListener('scroll', () => {
      const position = viewport.getBoundingClientRect().top + 12;
      const active = chapters.findLastIndex(chapter => chapter.getBoundingClientRect().top <= position);
      markChapter(Math.max(0, active));
    }, { passive: true });
    phone.dataset.ready = '';
  }

  const film = document.querySelector('#film video');
  if (film) {
    document.querySelectorAll('[data-film-time]').forEach(link => {
      link.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        film.currentTime = Number(link.dataset.filmTime);
        film.closest('#film').scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' });
        film.focus({ preventScroll: true });
        film.play().catch(() => {});
      });
    });
  }

  const backdrop = document.querySelector('.office-backdrops');
  const scenes = [...document.querySelectorAll('[data-office-scene]')];
  const motionPanels = [...document.querySelectorAll('[data-mist-motion]')];
  if (!backdrop && !motionPanels.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const video = entry.target.querySelector('video');
        if (!entry.isIntersecting || reducedMotion.matches) {
          video.pause();
        } else if (video.paused && !video.ended) {
          video.play().catch(() => {});
        }
      }
    }, { threshold: 0.38 });
    motionPanels.forEach(panel => observer.observe(panel));
  }

  let frame = 0;
  function update() {
    frame = 0;
    const focalLine = window.innerHeight * 0.52;
    if (backdrop) {
      const scene = scenes.findLast(element => element.getBoundingClientRect().top <= focalLine);
      const active = scene?.dataset.officeScene || 'coffee';
      if (backdrop.dataset.active !== active) backdrop.dataset.active = active;
    }
    if (reducedMotion.matches) return;
    for (const panel of motionPanels) {
      const { top, height } = panel.getBoundingClientRect();
      if (top > window.innerHeight || top + height < 0) continue;
      const visible = Math.min(1, Math.max(0, (window.innerHeight - top) / (window.innerHeight + height)));
      panel.style.setProperty('--waterline', `${(visible - 0.5) * 86}%`);
      panel.style.setProperty('--vapor', String(visible * 0.7));
    }
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) motionPanels.forEach(panel => panel.querySelector('video').pause());
    schedule();
  });
  update();
})();

// Jiniee Portfolio — 순수 JavaScript (jQuery 사용 안 함)
document.addEventListener('DOMContentLoaded', () => {
  // 01. 모바일에서 메뉴를 누르면 내비게이션 자동 닫기
  const nav = document.getElementById('siteNav');
  const toggler = document.querySelector('.navbar-toggler');
  if (nav && window.bootstrap) {
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      if (nav.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(nav, {toggle:false}).hide();
    }));
  }

  // 02. Portfolio 작품 분류 필터 (Bootstrap 2열/1열 구조 유지)
  const filterButtons = [...document.querySelectorAll('.filter-btn')];
  const portfolioItems = [...document.querySelectorAll('.portfolio-item[data-category]')];
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    filterButtons.forEach(b => {
      const active = b === button;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    portfolioItems.forEach(card => { card.hidden = selected !== 'all' && card.dataset.category !== selected; });
  }));

  // 03. 현재 보고 있는 섹션에 맞춰 상단 메뉴 강조
  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.site-header a.nav-link[href^="#"]')];
  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const watcher = new IntersectionObserver(entries => {
      const visible = entries.filter(item => item.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio);
      if (!visible.length) return;
      const id = '#' + visible[0].target.id;
      navLinks.forEach(link => link.classList.toggle('is-current', link.getAttribute('href') === id));
    }, {rootMargin:'-25% 0px -55% 0px', threshold:[0,.05,.2,.5]});
    sections.forEach(section => watcher.observe(section));
  }
  // 오른쪽 아래 '맨 위로' 버튼: 300px 스크롤 후 나타남.
  const topButton = document.querySelector('.scroll-top-btn');
  if (topButton) {
    const toggleTopButton = () => {
      topButton.classList.toggle('show', window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleTopButton, { passive: true });
    toggleTopButton();
  }

});

(() => {
  const picker = document.querySelector('.chimi-gallery-picker select');
  if (picker) {
    const gallery = document.getElementById(picker.getAttribute('aria-controls'));
    const figures = [...gallery.querySelectorAll('figure')];
    function selectFigure() {
      figures.forEach((figure, index) => {
        figure.toggleAttribute('data-selected', index === picker.selectedIndex);
      });
    }
    picker.addEventListener('change', selectFigure);
    selectFigure();
    gallery.setAttribute('data-picker', '');
    picker.parentElement.setAttribute('data-enabled', '');
  }

  const dialog = document.createElement('dialog');
  if (typeof dialog.showModal !== 'function') return;

  dialog.className = 'asset-dialog';
  dialog.setAttribute('aria-labelledby', 'asset-dialog-title');
  dialog.innerHTML = `
    <form class="asset-dialog-body" method="dialog">
      <div class="asset-dialog-bar">
        <h2 class="asset-dialog-title" id="asset-dialog-title"></h2>
        <button type="button" class="asset-dialog-zoom" aria-pressed="false">원본 크기</button>
        <button type="submit" autofocus>닫기</button>
      </div>
      <div class="asset-dialog-scroll" tabindex="0" aria-label="이미지 보기">
        <img alt="">
      </div>
    </form>`;
  document.body.append(dialog);

  const title = dialog.querySelector('h2');
  const image = dialog.querySelector('img');
  const zoom = dialog.querySelector('.asset-dialog-zoom');
  const scrollArea = dialog.querySelector('.asset-dialog-scroll');

  document.querySelectorAll('[data-enlarge]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      title.textContent = link.dataset.enlarge;
      image.alt = link.querySelector('img').alt || title.textContent;
      image.src = link.href;
      dialog.showModal();
      scrollArea.scrollTo(0, 0);
    });
  });

  zoom.addEventListener('click', () => {
    const enlarged = dialog.classList.toggle('is-actual-size');
    zoom.setAttribute('aria-pressed', String(enlarged));
    zoom.textContent = enlarged ? '화면에 맞추기' : '원본 크기';
    scrollArea.scrollTo(0, 0);
  });

  dialog.addEventListener('close', () => {
    image.removeAttribute('src');
    dialog.classList.remove('is-actual-size');
    zoom.setAttribute('aria-pressed', 'false');
    zoom.textContent = '원본 크기';
  });
})();

(function() {
  const MIN_SLOTS = 3;
  const MAX_SLOTS = 6;
  const REFRESH_INTERVAL = 25000; // 25 секунд

  // Створюємо контейнер
  const banner = document.createElement('div');
  banner.className = 'teaser-banner';

  // Додаємо стилі
  const style = document.createElement('style');
  style.textContent = `
    .teaser-banner {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      justify-content: center;
      align-items: center;
    }
    .slot {
      flex: 1 1 auto;
      margin: 5px;
      background: #f9f9f9;
      border: 1px solid #ccc;
      text-align: center;
      font-family: sans-serif;
      overflow: hidden;
      aspect-ratio: 1 / 1; /* квадратна форма */
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `;
  document.head.appendChild(style);

  // Функція для рендеру слотів
  function renderSlots() {
    banner.innerHTML = '';
    const width = banner.clientWidth;
    const height = banner.clientHeight;
    const area = width * height;

    let slotsCount = MIN_SLOTS;
    if (area > 150000) slotsCount = 4;
    if (area > 250000) slotsCount = 5;
    if (area > 350000) slotsCount = MAX_SLOTS;

    for (let i = 0; i < slotsCount; i++) {
      const slot = document.createElement('div');
      slot.className = 'slot';
      slot.id = 'slot-' + i;

      // Поточний URL сторінки
      const pageUrl = encodeURIComponent(window.location.href);

      // Вставляємо дисплейний тег
      const script = document.createElement('script');
      script.id = 'PDS979592_' + i;
      script.type = 'text/javascript';
      script.text = `(function(d){
        var wrapper=d.createElement("script");
        wrapper.id="WDS979592_${i}";
        wrapper.type="text/javascript";
        wrapper.src="https://s.adtelligent.com/?width=250&height=250&url=${pageUrl}&cb=" + (new Date()).getTime().toString() + "&aid=979592";
        var s=d.getElementById("PDS979592_${i}");
        s.parentNode.insertBefore(wrapper, s);
      }(document));`;

      slot.appendChild(script);
      banner.appendChild(slot);
    }

    // Орієнтація
    if (window.innerHeight > window.innerWidth) {
      banner.style.flexDirection = 'column'; // портрет
    } else {
      banner.style.flexDirection = 'row'; // ландшафт
    }
  }

  // Функція рефрешу
  function refreshSlots() {
    renderSlots();
  }

  // Слухаємо resize
  window.addEventListener('resize', renderSlots);

  // Вставляємо банер у плейсмент
  document.currentScript.parentNode.insertBefore(banner, document.currentScript);

  // Початковий рендер
  renderSlots();

  // Запускаємо рефреш кожні 25 секунд
  setInterval(refreshSlots, REFRESH_INTERVAL);
})();

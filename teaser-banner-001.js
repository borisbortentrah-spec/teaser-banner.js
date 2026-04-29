(function() {
  // Конфіг: мінімум і максимум слотів
  const MIN_SLOTS = 3;
  const MAX_SLOTS = 6;

  // Масив креативів (замінити на реальні дані)
  const creatives = [
    { img: 'https://via.placeholder.com/300?text=Креатив+1', text: 'Рекламний текст 1' },
    { img: 'https://via.placeholder.com/300?text=Креатив+2', text: 'Рекламний текст 2' },
    { img: 'https://via.placeholder.com/300?text=Креатив+3', text: 'Рекламний текст 3' },
    { img: 'https://via.placeholder.com/300?text=Креатив+4', text: 'Рекламний текст 4' },
    { img: 'https://via.placeholder.com/300?text=Креатив+5', text: 'Рекламний текст 5' },
    { img: 'https://via.placeholder.com/300?text=Креатив+6', text: 'Рекламний текст 6' }
  ];

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
      flex-direction: column;
      justify-content: center;
    }
    .slot img {
      max-width: 100%;
      max-height: 70%;
      object-fit: cover;
    }
    .slot p {
      margin: 5px 0;
      font-size: 12px;
    }
  `;
  document.head.appendChild(style);

  // Функція для рендеру слотів залежно від розміру контейнера
  function renderSlots() {
    banner.innerHTML = '';
    const width = banner.clientWidth;
    const height = banner.clientHeight;
    const area = width * height;

    // Просте правило: більше площа → більше слотів
    let slotsCount = MIN_SLOTS;
    if (area > 150000) slotsCount = 4;
    if (area > 250000) slotsCount = 5;
    if (area > 350000) slotsCount = MAX_SLOTS;

    const selected = creatives.slice(0, slotsCount);

    selected.forEach(c => {
      const slot = document.createElement('div');
      slot.className = 'slot';

      const img = document.createElement('img');
      img.src = c.img;
      img.alt = c.text;

      const p = document.createElement('p');
      p.textContent = c.text;

      slot.appendChild(img);
      slot.appendChild(p);
      banner.appendChild(slot);
    });

    // Орієнтація
    if (window.innerHeight > window.innerWidth) {
      banner.style.flexDirection = 'column'; // портрет
    } else {
      banner.style.flexDirection = 'row'; // ландшафт
    }
  }

  // Слухаємо resize
  window.addEventListener('resize', renderSlots);

  // Вставляємо банер у контейнер (плейсмент)
  document.currentScript.parentNode.insertBefore(banner, document.currentScript);

  // Початковий рендер
  renderSlots();
})();

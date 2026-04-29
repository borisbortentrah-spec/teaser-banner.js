(function() {
  // Створюємо контейнер банера
  const banner = document.createElement('div');
  banner.className = 'teaser-banner';

  // Масив креативів (можна замінити на реальні дані)
  const creatives = [
    { img: 'https://via.placeholder.com/300x150?text=Креатив+1', text: 'Рекламний текст 1' },
    { img: 'https://via.placeholder.com/300x150?text=Креатив+2', text: 'Рекламний текст 2' },
    { img: 'https://via.placeholder.com/300x150?text=Креатив+3', text: 'Рекламний текст 3' }
  ];

  // Додаємо слоти
  creatives.forEach(c => {
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

  // Додаємо стилі
  const style = document.createElement('style');
  style.textContent = `
    .teaser-banner {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      height: auto;
      border: 2px solid #333;
      padding: 5px;
      box-sizing: border-box;
    }
    .slot {
      flex: 1 1 auto;
      min-width: 120px;
      min-height: 120px;
      margin: 5px;
      background: #f9f9f9;
      border: 1px solid #ccc;
      text-align: center;
      font-family: sans-serif;
      overflow: hidden;
    }
    .slot img {
      max-width: 100%;
      height: auto;
      display: block;
    }
    .slot p {
      margin: 5px 0;
      font-size: 14px;
    }
  `;
  document.head.appendChild(style);

  // Логіка перебудови залежно від орієнтації
  function updateBannerOrientation() {
    if (window.innerHeight > window.innerWidth) {
      banner.style.flexDirection = 'column'; // портрет
    } else {
      banner.style.flexDirection = 'row'; // ландшафт
    }
  }
  window.addEventListener('resize', updateBannerOrientation);
  updateBannerOrientation();

  // Вставляємо банер у body
  document.body.appendChild(banner);
})();

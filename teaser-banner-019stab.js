(function(){
  const REFRESH_INTERVAL = 25000;
  const aids = [979592, 979602, 979603, 979604, 979605, 979606];

  console.log("[TEASER] Скрипт ініціалізовано");

  // стилі для card-style + анімація
  const style = document.createElement('style');
  style.textContent = `
    .slot {
      flex: 1 1 auto;
      max-width: 250px;
      max-height: 250px;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      background: #fff;
      margin: 10px;
      transition: transform 0.3s, box-shadow 0.3s, opacity 0.5s;
      opacity: 0;
      position: relative;
    }
    .slot.loaded {
      opacity: 1;
    }
    .slot:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    }
    .cta {
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      background: #007bff;
      color: #fff;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      text-decoration: none;
      opacity: 0.9;
    }
    .cta:hover {
      opacity: 1;
    }
    .teaser-banner {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
    }
  `;
  document.head.appendChild(style);

  function initBanner(container, targetId) {
    console.log(`[TEASER] Ініціалізація банера для контейнера: ${targetId}`);

    const banner = document.createElement('div');
    banner.className = 'teaser-banner';
    container.appendChild(banner);

    function loadTag(aid, slotIndex) {
      console.log(`[TEASER] Завантаження тега aid=${aid} для ${targetId}_slot${slotIndex}`);
      const slot = document.createElement('div');
      slot.className = 'slot';
      slot.id = `${targetId}-slot-${slotIndex}`;
      banner.appendChild(slot);

      const script = document.createElement('script');
      script.id = `PDS${aid}_${targetId}_${slotIndex}`;
      script.type = 'text/javascript';
      script.text = `(function(d){
        console.log("[TEASER] Виконання wrapper aid=${aid} slot=${slotIndex}");
        var w=d.createElement("script");
        w.id="WDS${aid}_${targetId}_${slotIndex}";
        w.type="text/javascript";
        w.src="https://s.adtelligent.com/?placement_id=${targetId}_slot${slotIndex}&floor_cpm=0.1&site_full_url=" + encodeURIComponent(window.location.href) + "&ua=" + encodeURIComponent(navigator.userAgent) + "&uip=127.0.0.1&width=250&height=250&cb=" + (new Date()).getTime() + "&aid=${aid}";
        w.onload=function(){console.log("[TEASER] ✅ Wrapper завантажився aid=${aid}");};
        w.onerror=function(e){console.error("[TEASER] ❌ Помилка wrapper aid=${aid}", e);};
        var s=d.getElementById("PDS${aid}_${targetId}_${slotIndex}");
        if (!s) { console.error("[TEASER] Не знайдено PDS для вставки"); return; }
        s.parentNode.insertBefore(w, s);
      }(document));`;
      slot.appendChild(script);

      // CTA кнопка
      const cta = document.createElement('a');
      cta.className = 'cta';
      cta.href = '#'; // тут можна підставити цільовий URL
      cta.textContent = 'Дізнатися більше';
      slot.appendChild(cta);

      // перевірка появи iframe
      setTimeout(() => {
        const iframes = slot.querySelectorAll('iframe');
        if (iframes.length > 0) {
          slot.classList.add('loaded');
          console.log(`[TEASER] ✅ iframe з’явився у ${targetId}_slot${slotIndex}`, iframes);
        } else {
          console.warn(`[TEASER] ⚠ iframe НЕ з’явився у ${targetId}_slot${slotIndex}`);
        }
      }, 2000);
    }

    // перший запуск
    aids.forEach((aid, idx) => {
      loadTag(aid, idx+1);
      setInterval(() => loadTag(aid, idx+1), REFRESH_INTERVAL);
    });
  }

  const placeholders = document.querySelectorAll('.teaser-placeholder');
  console.log(`[TEASER] Знайдено маркерів: ${placeholders.length}`);
  placeholders.forEach((container, index) => {
    initBanner(container, container.id || ('teaser' + index));
  });
})();

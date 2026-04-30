(function(){
  const REFRESH_INTERVAL = 25000;
  const aids = [979592, 979602, 979603];

  console.log("[TEASER] Скрипт ініціалізовано");

  function initBanner(container, targetId) {
    console.log(`[TEASER] Ініціалізація банера для контейнера: ${targetId}`);

    function loadTag(aid, slotIndex) {
      console.log(`[TEASER] Завантаження DSP‑тега aid=${aid} для ${targetId}_slot${slotIndex}`);

      const dspScript = document.createElement('script');
      dspScript.id = `DSP_${aid}_${targetId}_${slotIndex}`;
      dspScript.type = 'text/javascript';
      dspScript.src = "https://s.adtelligent.com/?" +
        "placement_id=" + `${targetId}_slot${slotIndex}` +
        "&floor_cpm=[replace_me]" +
        "&site_full_url=" + encodeURIComponent(window.location.href) +
        "&ua=[replace_me]" +
        "&uip=[replace_me]" +
        "&width=250&height=250" +
        "&cb=" + Date.now() +
        "&aid=" + aid;

      dspScript.onload = () => {
        console.log(`[TEASER] ✅ DSP‑тег завантажився aid=${aid}`);
      };
      dspScript.onerror = (e) => {
        console.error(`[TEASER] ❌ Помилка завантаження DSP‑тега aid=${aid}`, e);
      };

      container.appendChild(dspScript);
    }

    // запускаємо всі слоти
    for (let i = 0; i < aids.length; i++) {
      loadTag(aids[i], i+1);
      setInterval(() => loadTag(aids[i], i+1), REFRESH_INTERVAL);
    }
  }

  const placeholders = document.querySelectorAll('.teaser-placeholder');
  console.log(`[TEASER] Знайдено маркерів: ${placeholders.length}`);
  placeholders.forEach((container, index) => {
    initBanner(container, container.id || ('teaser' + index));
  });
})();

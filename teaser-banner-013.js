(function(){
  const MIN_SLOTS = 3;
  const MAX_SLOTS = 6;
  const REFRESH_INTERVAL = 25000;
  const aids = [979592, 979602, 979603, 979604, 979605, 979606];

  console.log("[TEASER] Скрипт ініціалізовано");

  const style = document.createElement('style');
  style.textContent = `
    .teaser-banner {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
    }
    .slot {
      flex: 1 1 auto;
      margin: 5px;
      border: 1px solid #ccc;
      aspect-ratio: 1 / 1;
      max-width: 255px;
      max-height: 255px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `;
  document.head.appendChild(style);

  function initBanner(container, targetId) {
    console.log(`[TEASER] Ініціалізація банера для контейнера: ${targetId}`);

    const banner = document.createElement('div');
    banner.className = 'teaser-banner';
    container.appendChild(banner);

    function renderSlots() {
      console.log(`[TEASER] Рендер слотів у контейнері: ${targetId}`);
      banner.innerHTML = '';
      const pageUrl = encodeURIComponent(window.location.href);

      let slotsCount = MIN_SLOTS;
      const area = banner.clientWidth * banner.clientHeight;
      if (area > 150000) slotsCount = 4;
      if (area > 250000) slotsCount = 5;
      if (area > 350000) slotsCount = MAX_SLOTS;

      console.log(`[TEASER] Кількість слотів: ${slotsCount}`);

      for (let i = 0; i < slotsCount; i++) {
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.id = `${targetId}-slot-${i}`;

        function loadTag() {
          console.log(`[TEASER] Завантаження тега aid=${aids[i]} для ${slot.id}`);
          slot.innerHTML = '';

          const script = document.createElement('script');
          script.id = `PDS${aids[i]}_${targetId}_${i}`;
          script.type = 'text/javascript';
          script.text = `(function(d){
            console.log("[TEASER] Виконання wrapper для aid=${aids[i]} slot=${i}");
            var wrapper=d.createElement("script");
            wrapper.id="WDS${aids[i]}_${targetId}_${i}";
            wrapper.type="text/javascript";
            wrapper.src="https://s.adtelligent.com/?placement_id=${targetId}_slot${i+1}&floor_cpm=[replace_me]&site_full_url=${pageUrl}&ua=[replace_me]&uip=[replace_me]&width=250&height=250&cb=" + (new Date()).getTime() + "&aid=${aids[i]}";
            console.log("[TEASER] SRC=", wrapper.src);
            var s=d.getElementById("PDS${aids[i]}_${targetId}_${i}");
            if (!s) { console.error("[TEASER] Не знайдено елемент PDS для вставки"); return; }
            s.parentNode.insertBefore(wrapper, s);
            console.log("[TEASER] Wrapper вставлено у DOM");
          }(document));`;
          slot.appendChild(script);
        }

        loadTag();
        setInterval(loadTag, REFRESH_INTERVAL);

        banner.appendChild(slot);
      }

      banner.style.flexDirection = (window.innerHeight > window.innerWidth) ? 'column' : 'row';
    }

    renderSlots();
    window.addEventListener('resize', renderSlots);
  }

  const placeholders = document.querySelectorAll('.teaser-placeholder');
  console.log(`[TEASER] Знайдено маркерів: ${placeholders.length}`);
  placeholders.forEach((container, index) => {
    initBanner(container, container.id || ('teaser' + index));
  });
})();

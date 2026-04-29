(function(){
  const MIN_SLOTS = 3;
  const MAX_SLOTS = 6;
  const REFRESH_INTERVAL = 25000;
  const aids = [979592, 979602, 979603, 979604, 979605, 979606];

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
    const banner = document.createElement('div');
    banner.className = 'teaser-banner';
    container.appendChild(banner);

    function renderSlots() {
      banner.innerHTML = '';
      const width = banner.clientWidth;
      const height = banner.clientHeight;
      const area = width * height;

      let slotsCount = MIN_SLOTS;
      if (area > 150000) slotsCount = 4;
      if (area > 250000) slotsCount = 5;
      if (area > 350000) slotsCount = MAX_SLOTS;

      const pageUrl = encodeURIComponent(window.location.href);

      for (let i = 0; i < slotsCount; i++) {
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.id = targetId + '-slot-' + i;

        function loadTag() {
          slot.innerHTML = '';
          const script = document.createElement('script');
          script.id = 'PDS' + aids[i] + '_' + targetId;
          script.type = 'text/javascript';
          script.text = `(function(d){
            var wrapper=d.createElement("script");
            wrapper.id="WDS${aids[i]}_${targetId}";
            wrapper.type="text/javascript";
            wrapper.src="https://s.adtelligent.com/?placement_id=${targetId}_slot${i+1}&floor_cpm=[replace_me]&site_full_url=${pageUrl}&ua=[replace_me]&uip=[replace_me]&width=250&height=250&cb=" + (new Date()).getTime() + "&aid=${aids[i]}";
            var s=d.getElementById("PDS${aids[i]}_${targetId}");
            s.parentNode.insertBefore(wrapper, s);
          }(document));`;
          slot.appendChild(script);
        }

        loadTag();
        setInterval(loadTag, REFRESH_INTERVAL);

        banner.appendChild(slot);
      }

      banner.style.flexDirection = (window.innerHeight > window.innerWidth) ? 'column' : 'row';
    }

    window.addEventListener('resize', renderSlots);
    renderSlots();
  }

  // знаходимо всі маркери на сторінці
  const placeholders = document.querySelectorAll('.teaser-placeholder');
  placeholders.forEach((container, index) => {
    initBanner(container, container.id || ('teaser' + index));
  });
})();

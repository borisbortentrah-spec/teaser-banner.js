(function() {
  const MIN_SLOTS = 3;
  const MAX_SLOTS = 6;
  const REFRESH_INTERVAL = 25000; // 25 секунд

  // список aid для слотів
  const aids = [979592, 979602, 979603, 979604, 979605, 979606];

  const banner = document.createElement('div');
  banner.className = 'teaser-banner';

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
      border: 1px solid #ccc;
      aspect-ratio: 1 / 1;
      max-width: 180px;   /* обмеження по ширині */
      max-height: 180px;  /* обмеження по висоті */
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `;
  document.head.appendChild(style);

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
      slot.id = 'slot-' + i;

      function loadTag() {
        slot.innerHTML = '';

        const script = document.createElement('script');
        script.id = 'PDS' + aids[i];
        script.type = 'text/javascript';
        script.text = `(function(d){
          var wrapper=d.createElement("script");
          wrapper.id="WDS${aids[i]}";
          wrapper.type="text/javascript";
          wrapper.src="https://s.adtelligent.com/?placement_id=slot${i+1}&floor_cpm=[replace_me]&site_full_url=${pageUrl}&ua=[replace_me]&uip=[replace_me]&width=180&height=180&cb=" + (new Date()).getTime().toString() + "&aid=${aids[i]}";
          var s=d.getElementById("PDS${aids[i]}");
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
  document.currentScript.parentNode.insertBefore(banner, document.currentScript);

  renderSlots();
})();

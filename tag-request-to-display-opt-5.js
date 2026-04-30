(function(){
  async function initBanner(scriptTag) {
    const aid = scriptTag.getAttribute('data-aid');
    const width = scriptTag.getAttribute('data-width') || 250;
    const height = scriptTag.getAttribute('data-height') || 250;
    const placementId = scriptTag.getAttribute('data-placement_id') || '';
    const floorCpm = scriptTag.getAttribute('data-floor_cpm') || '';
    const contentPageUrl = encodeURIComponent(
      scriptTag.getAttribute('data-content_page_url') || window.location.href
    );
    const ua = encodeURIComponent(navigator.userAgent);

    // формуємо URL запиту
    let url = `https://s.adtelligent.com/?width=${width}&height=${height}&ua=${ua}&aid=${aid}&content_page_url=${contentPageUrl}`;
    if (placementId) url += `&placement_id=${placementId}`;
    if (floorCpm) url += `&floor_cpm=${floorCpm}`;

    try {
      const response = await fetch(url, { cache: "no-store" });
      const adUnitResponse = await response.text();

      // вставка видачі у DOM
      const container = document.createElement("div");
      container.id = `banner-${aid}`;
      container.style.position = "relative";
      container.style.width = width + "px";
      container.style.height = height + "px";
      container.style.overflow = "hidden";

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.id = `PDS${aid}`;
      script.text = adUnitResponse;
      container.appendChild(script);

      // overlay для перехоплення кліку
      const overlay = document.createElement("div");
      overlay.style.position = "absolute";
      overlay.style.top = 0;
      overlay.style.left = 0;
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.cursor = "pointer";
      overlay.style.background = "rgba(0,0,0,0)";

      // приклад: clickUrl можна отримати з видачі або передати через data-click_url
      const clickUrl = scriptTag.getAttribute('data-click_url');
      if (clickUrl) {
        overlay.addEventListener("click", () => {
          const result = processClickUrl(clickUrl);
          if (!result) return;
          const { trackerUrl, targetUrl } = result;

          // виклик трекера у фоні
          fetch(trackerUrl, { method: "GET", mode: "no-cors" })
            .then(() => console.log("[CLICK] Tracker викликано:", trackerUrl));

          // прямий перехід
          if (targetUrl) {
            window.open(targetUrl, "_blank");
          }
        });
      }

      container.appendChild(overlay);
      scriptTag.parentNode.insertBefore(container, scriptTag);

    } catch (err) {
      console.error("[ADSERVER] ❌ Помилка:", err);
    }
  }

  function processClickUrl(clickUrl) {
    try {
      const urlObj = new URL(clickUrl);
      const adid = urlObj.searchParams.get("adid");
      const trackerUrl = `${urlObj.origin}${urlObj.pathname}?adid=${adid}`;
      const targetUrl = urlObj.searchParams.get("r");
      return { trackerUrl, targetUrl };
    } catch (e) {
      console.error("[CLICK] ❌ Помилка розбору clickUrl:", e);
      return null;
    }
  }

  // ініціалізація для всіх інтеграційних скриптів
  document.addEventListener("DOMContentLoaded", () => {
    const scripts = document.querySelectorAll("script[data-aid]");
    scripts.forEach(initBanner);
  });
})();

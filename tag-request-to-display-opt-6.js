(function(){
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

  async function initBanner(scriptTag) {
    const aid = scriptTag.getAttribute("data-aid");
    const width = scriptTag.getAttribute("data-width") || 250;
    const height = scriptTag.getAttribute("data-height") || 250;
    const ua = encodeURIComponent(navigator.userAgent);
    const contentPageUrl = encodeURIComponent(window.location.href);

    let url = `https://s.adtelligent.com/?width=${width}&height=${height}&ua=${ua}&aid=${aid}&content_page_url=${contentPageUrl}`;

    try {
      const response = await fetch(url, { cache: "no-store" });
      const adUnitResponse = await response.text();

      const container = document.createElement("div");
      container.id = `banner-${aid}`;
      container.style.position = "relative";
      container.style.width = width + "px";
      container.style.height = height + "px";

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.text = adUnitResponse;
      container.appendChild(script);

      scriptTag.parentNode.insertBefore(container, scriptTag);

      // MutationObserver для перехоплення клік‑URL
      const observer = new MutationObserver(() => {
        const links = container.querySelectorAll("a[href]");
        links.forEach(link => {
          const clickUrl = link.href;
          const result = processClickUrl(clickUrl);
          if (result) {
            link.addEventListener("click", (e) => {
              e.preventDefault();
              const { trackerUrl, targetUrl } = result;

              // виклик трекера у фоні
              fetch(trackerUrl, { method: "GET", mode: "no-cors" })
                .then(() => console.log("[CLICK] Tracker викликано:", trackerUrl));

              // прямий перехід
              if (targetUrl) {
                window.open(targetUrl, "_blank");
              }
            }, { once: true });
          }
        });
      });

      observer.observe(container, { childList: true, subtree: true });

    } catch (err) {
      console.error("[ADSERVER] ❌ Помилка:", err);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const scripts = document.querySelectorAll("script[data-aid]");
    scripts.forEach(initBanner);
  });
})();

(function(){
  async function initBanner(scriptTag) {
    const aid = scriptTag.getAttribute("data-aid");
    const width = scriptTag.getAttribute("data-width") || 250;
    const height = scriptTag.getAttribute("data-height") || 250;
    const ua = encodeURIComponent(navigator.userAgent);
    const contentPageUrl = encodeURIComponent(window.location.href);

    const url = `https://s.adtelligent.com/?width=${width}&height=${height}&ua=${ua}&aid=${aid}&content_page_url=${contentPageUrl}`;

    try {
      const response = await fetch(url, { cache: "no-store" });
      const adUnitResponse = await response.text();

      // створюємо iframe для видачі
      const iframe = document.createElement("iframe");
      iframe.width = width;
      iframe.height = height;
      iframe.style.border = "0";
      scriptTag.parentNode.insertBefore(iframe, scriptTag);

      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(adUnitResponse);
      doc.close();

      // перехоплення клік‑URL
      const observer = new MutationObserver(() => {
        const links = doc.querySelectorAll("a[href]");
        links.forEach(link => {
          const clickUrl = link.href;
          const result = processClickUrl(clickUrl);
          if (result) {
            link.addEventListener("click", (e) => {
              e.preventDefault();
              const { trackerUrl, targetUrl } = result;
              fetch(trackerUrl, { method: "GET", mode: "no-cors" });
              if (targetUrl) window.open(targetUrl, "_blank");
            });
          }
        });
      });
      observer.observe(doc, { childList: true, subtree: true });

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

  document.addEventListener("DOMContentLoaded", () => {
    const scripts = document.querySelectorAll("script[data-aid]");
    scripts.forEach(initBanner);
  });
})();

(async function(){
  const currentScript = document.currentScript;

  // параметри з інтеграційного скрипта
  const aid = currentScript.getAttribute('data-aid') || '979592';
  const width = currentScript.getAttribute('data-width') || 250;
  const height = currentScript.getAttribute('data-height') || 250;
  const placementId = currentScript.getAttribute('data-placement_id') || '';
  const floorCpm = currentScript.getAttribute('data-floor_cpm') || '';
  const contentPageUrl = encodeURIComponent(
    currentScript.getAttribute('data-content_page_url') || window.location.href
  );
  const ua = encodeURIComponent(navigator.userAgent);

  // формуємо URL
  let url = `https://s.adtelligent.com/?width=${width}&height=${height}&ua=${ua}&aid=${aid}&content_page_url=${contentPageUrl}`;
  if (placementId) url += `&placement_id=${placementId}`;
  if (floorCpm) url += `&floor_cpm=${floorCpm}`;

  try {
    console.log("[ADSERVER] Запит:", url);

    // отримуємо видачу як текст
    const response = await fetch(url, { cache: "no-store" });
    const adUnitResponse = await response.text();

    console.log("[ADSERVER] Відповідь отримано");

    // створюємо <script> і вставляємо видачу
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = `PDS${aid}`;
    script.text = adUnitResponse;
    document.body.appendChild(script);

    console.log("[ADSERVER] ✅ Видачу вставлено у DOM");

    // перевірка появи iframe після виконання
    setTimeout(() => {
      const iframes = document.querySelectorAll(`iframe`);
      if (iframes.length > 0) {
        console.log(`[ADSERVER] ✅ iframe з’явився для aid=${aid}`, iframes);

        // перехоплення клік‑URL усередині iframe
        try {
          const doc = iframes[0].contentWindow.document;
          const observer = new MutationObserver(() => {
            const links = doc.querySelectorAll("a[href]");
            links.forEach(link => {
              const clickUrl = link.href;
              if (clickUrl.includes(".adtelligent.com/tracking/click/?adid=")) {
                const urlObj = new URL(clickUrl);
                const trackerUrl = `${urlObj.origin}${urlObj.pathname}?adid=${urlObj.searchParams.get("adid")}`;
                const targetUrl = urlObj.searchParams.get("r");

                console.log("[CLICK] Tracker:", trackerUrl);
                console.log("[CLICK] Target:", targetUrl);

                link.addEventListener("click", (e) => {
                  e.preventDefault();
                  // виклик трекера у фоні
                  fetch(trackerUrl, { method: "GET", mode: "no-cors" })
                    .then(() => console.log("[CLICK] ✅ Tracker викликано"))
                    .catch(err => console.warn("[CLICK] ⚠ Помилка виклику трекера", err));

                  // прямий перехід
                  if (targetUrl) {
                    window.open(targetUrl, "_blank");
                  }
                });
              }
            });
          });
          observer.observe(doc, { childList: true, subtree: true });
        } catch (err) {
          console.warn("[CLICK] ⚠ Не вдалося отримати доступ до iframe:", err);
        }

      } else {
        console.warn(`[ADSERVER] ⚠ iframe НЕ з’явився для aid=${aid}`);
      }
    }, 2000);

  } catch (err) {
    console.error("[ADSERVER] ❌ Помилка:", err);
  }
})();

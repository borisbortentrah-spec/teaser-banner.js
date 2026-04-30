(async function(){
  const currentScript = document.currentScript;

  // 1. Читаємо параметри
  const aid = currentScript.getAttribute('data-aid') || '979592';
  const width = currentScript.getAttribute('data-width') || 250;
  const height = currentScript.getAttribute('data-height') || 250;
  const placementId = currentScript.getAttribute('data-placement_id') || '';
  const floorCpm = currentScript.getAttribute('data-floor_cpm') || '';
  const contentPageUrl = encodeURIComponent(
    currentScript.getAttribute('data-content_page_url') || window.location.href
  );
  const ua = encodeURIComponent(navigator.userAgent);

  console.log("[STEP 1] Параметри зчитано:", { aid, width, height, placementId, floorCpm, contentPageUrl });

  // 2. Формуємо URL
  let url = `https://s.adtelligent.com/?width=${width}&height=${height}&ua=${ua}&aid=${aid}&content_page_url=${contentPageUrl}`;
  if (placementId) url += `&placement_id=${placementId}`;
  if (floorCpm) url += `&floor_cpm=${floorCpm}`;
  console.log("[STEP 2] Сформовано URL:", url);

  try {
    // 3. Запит до адсерверу
    console.log("[STEP 3] Виконуємо fetch...");
    const response = await fetch(url, { cache: "no-store" });
    const adUnitResponse = await response.text();
    console.log("[STEP 3] Відповідь отримано, довжина:", adUnitResponse.length);

    // 4. Вставка видачі у DOM
    console.log("[STEP 4] Створюємо <script> для видачі");
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = `PDS${aid}`;
    script.text = adUnitResponse;
    document.body.appendChild(script);
    console.log("[STEP 4] ✅ Видачу вставлено у DOM");

    // 5. Перевірка появи iframe
    setTimeout(() => {
      const iframes = document.querySelectorAll(`iframe`);
      if (iframes.length > 0) {
        console.log(`[STEP 5] ✅ iframe з’явився для aid=${aid}`, iframes);

        try {
          const doc = iframes[0].contentWindow.document;
          console.log("[STEP 6] Ставимо MutationObserver для пошуку клік‑URL");

          const observer = new MutationObserver(() => {
            const links = doc.querySelectorAll("a[href]");
            links.forEach(link => {
              const clickUrl = link.href;
              if (clickUrl.includes(".adtelligent.com/tracking/click/?adid=")) {
                console.log("[STEP 7] Знайдено clickUrl:", clickUrl);

                const urlObj = new URL(clickUrl);
                const trackerUrl = `${urlObj.origin}${urlObj.pathname}?adid=${urlObj.searchParams.get("adid")}`;
                const targetUrl = urlObj.searchParams.get("r");

                console.log("[STEP 8] Розділено clickUrl:");
                console.log("   Tracker:", trackerUrl);
                console.log("   Target:", targetUrl);

                link.addEventListener("click", (e) => {
                  e.preventDefault();
                  console.log("[STEP 9] Клік по банеру → викликаємо трекер у фоні");
                  fetch(trackerUrl, { method: "GET", mode: "no-cors" })
                    .then(() => console.log("[STEP 9] ✅ Tracker викликано"))
                    .catch(err => console.warn("[STEP 9] ⚠ Помилка виклику трекера", err));

                  console.log("[STEP 10] Перехід на target URL:", targetUrl);
                  if (targetUrl) {
                    window.open(targetUrl, "_blank");
                  }
                });
              }
            });
          });

          observer.observe(doc, { childList: true, subtree: true });
          console.log("[STEP 6] ✅ Observer активний");

        } catch (err) {
          console.warn("[STEP 6] ⚠ Не вдалося отримати доступ до iframe:", err);
        }

      } else {
        console.warn(`[STEP 5] ⚠ iframe НЕ з’явився для aid=${aid}`);
      }
    }, 2000);

  } catch (err) {
    console.error("[STEP X] ❌ Помилка:", err);
  }
})();

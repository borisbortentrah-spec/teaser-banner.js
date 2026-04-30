(async function(){
  const currentScript = document.currentScript;

  // читаємо параметри з інтеграційного скрипта
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

    // робимо запит
    const response = await fetch(url, { cache: "no-store" });
    const adUnitResponse = await response.text();

    // оптимізована вставка: одразу у DOM без додаткових об'єктів
    document.body.insertAdjacentHTML(
      "beforeend",
      `<script id="PDS${aid}" type="text/javascript">${adUnitResponse}</script>`
    );

    console.log("[ADSERVER] ✅ Видачу вставлено у DOM");
  } catch (err) {
    console.error("[ADSERVER] ❌ Помилка:", err);
  }
})();

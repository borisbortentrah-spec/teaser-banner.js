(function(){
  // читаємо параметри з <script> тегу
  const currentScript = document.currentScript;
  const aid = currentScript.getAttribute('data-aid');
  const width = currentScript.getAttribute('data-width') || 250;
  const height = currentScript.getAttribute('data-height') || 250;
  const placementId = currentScript.getAttribute('data-placement_id') || '';
  const floorCpm = currentScript.getAttribute('data-floor_cpm') || '';
  const contentPageUrl = encodeURIComponent(
    currentScript.getAttribute('data-content_page_url') || window.location.href
  );
  const ua = encodeURIComponent(navigator.userAgent);

  // формуємо URL запиту
  let url = `https://s.adtelligent.com/?width=${width}&height=${height}&ua=${ua}&aid=${aid}&content_page_url=${contentPageUrl}`;
  if (placementId) url += `&placement_id=${placementId}`;
  if (floorCpm) url += `&floor_cpm=${floorCpm}`;

  console.log("[ADSERVER] Запит:", url);

  // робимо запит до адсерверу
  fetch(url)
    .then(res => res.text())
    .then(adUnitResponse => {
      console.log("[ADSERVER] Відповідь отримано");

      // вставляємо видачу у DOM як <script>
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.id = `PDS${aid}`;
      script.textContent = adUnitResponse;
      document.body.appendChild(script);

      console.log("[ADSERVER] ✅ adUnitResponse вставлено у DOM");
    })
    .catch(err => {
      console.error("[ADSERVER] ❌ Помилка при запиті або вставці:", err);
    });
})();

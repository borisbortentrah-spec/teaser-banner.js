async function requestAd(aid, width, height, container) {
  const ua = encodeURIComponent(navigator.userAgent);
  const contentPageUrl = encodeURIComponent(window.location.href);
  const url = `https://s.adtelligent.com/?width=${width}&height=${height}&ua=${ua}&aid=${aid}&content_page_url=${contentPageUrl}`;

  try {
    const response = await fetch(url);
    const adUnitResponse = await response.text();

    // оптимізована вставка
    container.insertAdjacentHTML('beforeend', `<script id="PDS${aid}" type="text/javascript">${adUnitResponse}</script>`);
  } catch (e) {
    console.error("Помилка при запиті:", e);
  }
}

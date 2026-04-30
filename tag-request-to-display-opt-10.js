(async function(){
  const aid = 979592;
  const width = 300;
  const height = 250;
  const ua = encodeURIComponent(navigator.userAgent);
  const contentPageUrl = encodeURIComponent(window.location.href);

  // 1. Запит до адсерверу
  const url = `https://s.adtelligent.com/?width=${width}&height=${height}&ua=${ua}&aid=${aid}&content_page_url=${contentPageUrl}`;

  try {
    const response = await fetch(url, { cache: "no-store" });
    const adUnitResponse = await response.text();

    // 2. Знаходимо посилання на банер
    const bannerMatch = adUnitResponse.match(/https:\/\/[^"]+adtelligent\.com\/banner\/\?adid=[^"']+/);
    if (!bannerMatch) {
      console.warn("[ADSERVER] ⚠ Банерне посилання не знайдено");
      return;
    }
    const bannerUrl = bannerMatch[0];
    console.log("[ADSERVER] Banner URL:", bannerUrl);

    // 3. Викликаємо банерну URL і отримуємо скрипт
    const bannerResp = await fetch(bannerUrl, { cache: "no-store" });
    const bannerScript = await bannerResp.text();

    // 4. Знаходимо click URL у скрипті
    const clickMatch = bannerScript.match(/https:\/\/[^"]+adtelligent\.com\/tracking\/click\/\?adid=[^"']+/);
    if (!clickMatch) {
      console.warn("[ADSERVER] ⚠ Click URL не знайдено");
      return;
    }
    const clickUrl = clickMatch[0];
    console.log("[ADSERVER] Click URL:", clickUrl);

    // 5. Розділяємо click URL на tracker і target
    const urlObj = new URL(clickUrl);
    const trackerUrl = `${urlObj.origin}${urlObj.pathname}?adid=${urlObj.searchParams.get("adid")}`;
    const targetUrl = urlObj.searchParams.get("r");

    console.log("[CLICK] Tracker:", trackerUrl);
    console.log("[CLICK] Target:", targetUrl);

    // 6. Малюємо контейнер для банера
    const container = document.createElement("div");
    container.id = "banner-slot";
    container.style.width = width + "px";
    container.style.height = height + "px";
    container.style.border = "1px solid #ccc";
    container.style.cursor = "pointer";
    container.innerHTML = "Банер завантажено";
    document.body.appendChild(container);

    // 7. Обробка кліку
    container.addEventListener("click", () => {
      // виклик трекера у фоні
      fetch(trackerUrl, { method: "GET", mode: "no-cors" })
        .then(() => console.log("[CLICK] ✅ Tracker викликано"))
        .catch(err => console.warn("[CLICK] ⚠ Помилка виклику трекера", err));

      // прямий перехід
      if (targetUrl) {
        window.open(targetUrl, "_blank");
      }
    });

  } catch (err) {
    console.error("[ADSERVER] ❌ Помилка:", err);
  }
})();

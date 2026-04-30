(async function(){
    const aid = 979592;
    const width = 250;
    const height = 250;
    const ua = encodeURIComponent(navigator.userAgent);
    const contentPageUrl = encodeURIComponent(window.location.href);

    // формуємо URL запиту
    const url = `https://s.adtelligent.com/?width=${width}&height=${height}&ua=${ua}&aid=${aid}&content_page_url=${contentPageUrl}`;

    try {
      console.log("[ADSERVER] Запит:", url);

      // отримуємо видачу як текст
      const response = await fetch(url, { cache: "no-store" });
      const adUnitResponse = await response.text();

      console.log("[ADSERVER] Відповідь отримано");

      // вставляємо видачу у DOM
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.id = `PDS${aid}`;
      script.text = adUnitResponse;
      document.body.appendChild(script);

      console.log("[ADSERVER] ✅ Видачу вставлено у DOM");

      // перевірка появи iframe
      setTimeout(() => {
        const iframes = document.querySelectorAll('iframe');
        if (iframes.length > 0) {
          console.log(`[ADSERVER] ✅ iframe з’явився aid=${aid}`, iframes);
        } else {
          console.warn(`[ADSERVER] ⚠ iframe НЕ з’явився aid=${aid}`);
        }
      }, 2000);

    } catch (err) {
      console.error("[ADSERVER] ❌ Помилка:", err);
    }

    // універсальна функція для обробки clickUrl
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

    function handleBannerClick(clickUrl) {
      const result = processClickUrl(clickUrl);
      if (!result) return;

      const { trackerUrl, targetUrl } = result;

      // викликаємо трекер у фоні
      fetch(trackerUrl, { method: "GET", mode: "no-cors" })
        .then(() => console.log("[CLICK] ✅ Tracker викликано:", trackerUrl))
        .catch(err => console.warn("[CLICK] ⚠ Помилка виклику трекера", err));

      // переходимо напряму на target URL
      if (targetUrl) {
        window.location.href = targetUrl;
      } else {
        console.warn("[CLICK] ⚠ Target URL відсутній");
      }
    }

    // приклад: підключаємо клік‑URL до банера
    const exampleClickUrl = "https://dsp2.adtelligent.com/tracking/click/?adid=02AB2B9FEC33AC34.L6265482S0C1030885&r=https%3A%2F%2Fdsp.adtelligent.com";
    document.querySelector("#banner").addEventListener("click", () => handleBannerClick(exampleClickUrl));

  })();

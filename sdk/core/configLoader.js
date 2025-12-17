function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function renderAssetHtml(asset, style = "") {
  if (!asset) return "";

  if (asset.mimeType.startsWith("image/")) {
    return `<img src="${asset.fileUrl}" style="${style}" />`;
  }

  if (asset.mimeType.startsWith("video/")) {
    return `<video src="${asset.fileUrl}" autoplay muted playsinline style="${style}"></video>`;
  }

  return "";
}
function buildUniversalAdSettings(apiData) {
  const {
    adType,
    position,
    AdstartTime,
    AdrunTime,
    adsCreatives
  } = apiData.data;

  const assets = adsCreatives?.[0]?.assets || [];

  const primary = assets.find(a => a.role === "primary");
  const secondary = assets.find(a => a.role === "secondary");

  const chosenPosition = pickRandom(position);

  const settings = {
    adType: `${adType}-${chosenPosition}`,
    autoRunDelay: AdstartTime,
    defaultContent: {
      duration: AdrunTime
    }
  };

  /* =======================
     L-BAR MAPPING
     ======================= */
  if (adType === "lbar") {
    settings.defaultContent.rightHtml = renderAssetHtml(
      primary,
      "width:100%; height:100%; object-fit:fill;"
    );

    settings.defaultContent.bottomHtml = renderAssetHtml(
      secondary,
      "width:100%; height:100%; object-fit:fill;"
    );
  }

  /* =======================
     RICH MEDIA MAPPING
     ======================= */
  if (adType === "richmedia") {
    settings.defaultContent.richmediaForegroundHtml = renderAssetHtml(
      primary,
      "width:100%; height:100%; object-fit:fill;"
    );

    settings.defaultContent.richmediaBackgroundHtml = renderAssetHtml(
      secondary,
      "width:100%; height:100%; object-fit:cover;"
    );
  }

  /* =======================
     BANNER
     ======================= */
  if (adType === "banner") {
    settings.defaultContent.bannerHorizontalHtml = renderAssetHtml(
      primary,
      "width:100%; height:100%; object-fit:fill;"
    );
  }

  /* =======================
     PIP
     ======================= */
  if (adType === "pip") {
    settings.defaultContent.pipHtml = renderAssetHtml(
      primary,
      "width:100%; height:100%; object-fit:cover;"
    );
  }

  return settings;
}


async function loadPublisherConfig() {
  const currentScript = document.currentScript;

  if (!currentScript) {
    console.warn("[UASDK] No <script> tag found.");
    return {};
  }

  const configKey = currentScript.getAttribute("data-config");
    // const configKey ='cb35080709bf7ac80e2dc936319f34bab3af5014d6f004b1'

  if (!configKey) {
    console.warn("[UASDK] No data-config attribute found.");
    return {};
  }

  // 🔹 CHANGE THIS to your actual API base
  const API_BASE = "http://localhost:5000/";

  const endpoint = `${API_BASE}api/configs/key/${encodeURIComponent('cb35080709bf7ac80e2dc936319f34bab3af5014d6f004b1')}`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Config fetch failed (${response.status})`);
    }

    // const config = await response.json();
    const apiConfig = await response.json();

    const universalSettings = buildUniversalAdSettings(apiConfig);

    // window.UniversalAdSettings = universalSettings;

    console.log("[UASDK] UniversalAdSettings ready:", universalSettings);

    return universalSettings;
  } catch (error) {
    console.error("[UASDK] Error loading config:", error);
    return {};
  }
}

// auto-load on script execution
loadPublisherConfig();

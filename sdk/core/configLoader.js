import { CONFIG, DEFAULT_CONFIG } from "./utils.js";

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

  const primary = assets.find((a) => a.role === "primary");
  const secondary = assets.find((a) => a.role === "secondary");

  const chosenPosition = pickRandom(position);

  return {
    adType: `${adType}-${chosenPosition}`,
    autoRunDelay: AdstartTime,
    defaultContent: {
      rightHtml: adType === "lbar"
        ? renderAssetHtml(primary, "width:100%; height:100%; object-fit:fill;")
        : undefined,
      bottomHtml: adType === "lbar"
        ? renderAssetHtml(secondary, "width:100%; height:100%; object-fit:fill;")
        : undefined,
      overlayHtml: "",
      pipHtml: adType === "pip"
        ? renderAssetHtml(primary, "width:100%; height:100%; object-fit:cover;")
        : "",
      bannerVerticalHtml: "",
      bannerHorizontalHtml: adType === "banner"
        ? renderAssetHtml(primary, "width:100%; height:100%; object-fit:fill;")
        : "",
      richmediaBackgroundHtml: adType === "richmedia"
        ? renderAssetHtml(secondary, "width:100%; height:100%; object-fit:cover;")
        : "",
      richmediaForegroundHtml: adType === "richmedia"
        ? renderAssetHtml(primary, "width:100%; height:100%; object-fit:fill;")
        : "",
      duration: AdrunTime
    }
  };
}

export async function loadPublisherConfig() {
  const currentScript = document.currentScript;

  if (!currentScript) {
    console.warn("[UASDK] No <script> tag found.");
    return CONFIG;
  }
  console.log("currentScript", currentScript);

  const configKey = currentScript.getAttribute("data-config");
  if (!configKey) {
    console.warn("[UASDK] No data-config attribute found.");
    return CONFIG;
  }

  const API_BASE = "http://localhost:5000/";
  const endpoint = `${API_BASE}api/configs/key/${encodeURIComponent(configKey)}`;

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

    const apiConfig = await response.json();
    const universalSettings = buildUniversalAdSettings(apiConfig);

    const mergedConfig = {
      ...DEFAULT_CONFIG,
      ...universalSettings,
      defaultContent: {
        ...DEFAULT_CONFIG.defaultContent,
        ...(universalSettings.defaultContent || {})
      }
    };

    Object.assign(CONFIG, mergedConfig);
    window.UniversalAdSettings = CONFIG;

    console.log("[UASDK] Loaded config:", CONFIG);
    console.log("[UASDK] Applied timing:", {
      autoRunDelay: CONFIG.autoRunDelay,
      duration: CONFIG.defaultContent?.duration
    });

    return CONFIG;
  } catch (error) {
    console.error("[UASDK] Error loading config:", error);
    return CONFIG;
  }
}


export async function loadPublisherConfig() {
    const currentScript = document.currentScript;

    if (!currentScript) {
        console.warn("[UASDK] No <script> available for config loading.");
        return {};
    }

    const configURL = currentScript.getAttribute("data-config");
    if (!configURL) {
        console.warn("[UASDK] No data-config attribute found.");
        return {};
    }

    try {
        const response = await fetch(configURL, { cache: "no-store" });
        const config = await response.json();
        console.log("[UASDK] Loaded config:", config);
        return config;
    } catch (error) {
        console.error("[UASDK] Error loading config:", error);
        return {};
    }
}
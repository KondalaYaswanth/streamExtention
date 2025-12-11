import { LOG_PREFIX, initializedVideos } from './sdk/core/utils.js';
import { AdManager } from './adManager.js';
import { makeDomScanner } from './sdk/core/domScanner.js';
import {loadPublisherConfig} from './sdk/core/configLoader.js';

const { scan, observe } = makeDomScanner((video) => new AdManager(video));

const SDK = {
    init() {
        console.log(`${LOG_PREFIX} Initializing SDK...`);
        scan();
        observe();

        document.addEventListener('click', () => scan());
        document.addEventListener('scroll', () => scan(), { passive: true });
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') scan();
        });
        window.addEventListener('focus', () => scan());
    },
    scan,
    observe,
    triggerAd(videoElement, content) {
        const manager = initializedVideos.get(videoElement);
        if (manager) {
            manager.showAd(content);
        } else {
            console.warn(`${LOG_PREFIX} Video not initialized`, videoElement);
        }
    },
    triggerAll(content) {
        const videos = document.querySelectorAll('video');
        videos.forEach((video) => {
            const manager = initializedVideos.get(video);
            if (manager) manager.showAd(content);
        });
    }
};

window.UniversalAdSDK = SDK;

(async function() {
    const config = await loadPublisherConfig();
    window.UniversalAdSettings = config;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => SDK.init());
    } else {
        SDK.init();
    }
})();

// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', () => SDK.init());
// } else {
//     SDK.init();
// }

export default SDK;

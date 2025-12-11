import { initializedVideos } from './utils.js';

function scanShadow(root, createManager) {
    root.querySelectorAll('video').forEach((video) => {
        
        if (!initializedVideos.has(video)) {
            createManager(video);
        }
    });

    root.querySelectorAll('*').forEach((el) => {
        if (el.shadowRoot) {
            scanShadow(el.shadowRoot, createManager);
        }
    });
}

export function makeDomScanner(createManager) {
    const scan = () => {
        document.querySelectorAll('video').forEach((video) => {
            if (
                video.closest('.ad-wrapper') ||
                video.closest('.richmedia-ad') ||
                video.dataset.adMedia !== undefined 
              
            ) {
                return;
            }
            if (!initializedVideos.has(video)) {
                createManager(video);
            }
        });

        document.querySelectorAll('*').forEach((el) => {
            if (el.shadowRoot) {
                scanShadow(el.shadowRoot, createManager);
            }
        });
    };

    const observe = () => {
        const observer = new MutationObserver((mutations) => {
            let shouldScan = false;
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    shouldScan = true;
                    break;
                }
            }
            if (shouldScan) scan();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        return observer;
    };

    return {
        scan,
        observe,
        scanShadow: (root) => scanShadow(root, createManager)
    };
}

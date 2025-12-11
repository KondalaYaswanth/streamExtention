import {
    CONFIG,
    LOG_PREFIX,
    initializedVideos,
    applyTransitionFrame,
    getTransitionDurationMs
} from './sdk/core/utils.js';
import { createWrapper } from './sdk/core/wrapper.js';
import { detectPlayerRoot } from './sdk/core/playerDetector.js';
import { LBAR_TYPES, createLbarSlots, applyLbarLayout } from './sdk/ads/lbar.js';
import { BANNER_TYPES, createBannerSlots, applyBannerLayout } from './sdk/ads/banner.js';
import { OVERLAY_TYPES, createOverlaySlots, applyOverlayLayout } from './sdk/ads/overlay.js';
import { PIP_TYPES, createPipSlots, applyPipLayout } from './sdk/ads/pip.js';
import {
    RICHMEDIA_TYPES,
    createRichmediaSlots,
    applyRichmediaLayout,
    hideRichmedia
} from './sdk/ads/richmedia.js';

export class AdManager {
    constructor(videoElement) {
        this.video = videoElement;
        this.wrapper = null;
        this.elementToWrap = null;
        this.rightAdSlot = null;
        this.bottomAdSlot = null;
        this.leftAdSlot = null;
        this.topAdSlot = null;
        this.overlayAdSlot = null;
        this.pipAdSlot = null;
        this.bannerVerticalAdSlot = null;
        this.bannerHorizontalAdSlot = null;
        this.richmediaBackgroundAdSlot = null;
        this.richmediaForegroundAdSlot = null;
        this.originalStyles = {};
        this.isAdShowing = false;
        this.hasAutoTriggered = false;
        this.wasFluid = false;
        this.minimized = false;
        this._lastContent = null;

        this.init();
    }

    init() {
        if (initializedVideos.has(this.video)) return;

        const vjsContainer = this.video.closest('.video-js');
        const detectedRoot = detectPlayerRoot(this.video);
        const isOrientationWrapper =
            detectedRoot && detectedRoot.classList && detectedRoot.classList.contains('video-wrapper');

        // Avoid wrapping the layout container that controls aspect ratio (video-wrapper).
        // If we wrap it and force absolute positioning, its height collapses and the player disappears.
        this.elementToWrap = vjsContainer || this.video; //(isOrientationWrapper ? this.video : detectedRoot) || this.video;

        const rect = this.elementToWrap.getBoundingClientRect();
        if (rect.width < CONFIG.minVideoWidth || rect.height < CONFIG.minVideoHeight) {
            return;
        }

        
//         document.addEventListener("fullscreenchange", () => {
//     const fs = document.fullscreenElement;

//     // If entering fullscreen
//     if (fs && initializedVideos.has(fs.querySelector("video"))) {
//         const manager = initializedVideos.get(fs.querySelector("video"));
//         manager.handleEnterFullscreen();
//     }

//     // If exiting fullscreen
//     if (!fs) {
//         initializedVideos.forEach(manager => {
//             manager.handleExitFullscreen();
//         });
//     }
// });


        initializedVideos.set(this.video, this);
        console.log(`${LOG_PREFIX} Initialized for video`, this.video);
        console.log(`${LOG_PREFIX} Wrapping element`, this.elementToWrap);
        console.log(`${LOG_PREFIX} dimensions`, rect);

        if (CONFIG.autoRun) {
            this.setupAutoTrigger();
        }
    }

    setupAutoTrigger() {
        const onTimeUpdate = () => {
            if (!this.hasAutoTriggered && this.video.currentTime > CONFIG.autoRunDelay) {
                this.hasAutoTriggered = true;
                console.log(`${LOG_PREFIX} Auto-triggering ad for`, this.video);
                this.showAd(CONFIG.defaultContent);
                this.video.removeEventListener('timeupdate', onTimeUpdate);
            }
        };
        this.video.addEventListener('timeupdate', onTimeUpdate);
    }
    handleEnterFullscreen() {
    if (!this.isAdShowing || !document.fullscreenElement) return;

    // Move wrapper to fullscreen element
    document.fullscreenElement.appendChild(this.wrapper);

    // Force wrapper to match fullscreen dimensions
    this.wrapper.style.width = "100%";
    this.wrapper.style.height = "100%";

    // Re-apply ad layout inside fullscreen canvas
    this.applyCurrentAdLayout();
}
handleExitFullscreen() {
    if (!this.wrapper || !this._originalParent) return;

    // Restore wrapper to original position
    if (this._originalNextSibling) {
        this._originalParent.insertBefore(this.wrapper, this._originalNextSibling);
    } else {
        this._originalParent.appendChild(this.wrapper);
    }

    // Re-apply layout because sizing changed
    this.applyCurrentAdLayout();
}
applyCurrentAdLayout() {
    const adType = CONFIG.adType;

    switch (true) {
        case adType.startsWith("lbar"):
            this.applyLbarLayout();
            break;
        case adType.startsWith("banner"):
            this.applyBannerLayout();
            break;
        case adType.startsWith("overlay"):
            this.applyOverlayLayout();
            break;
        case adType.startsWith("pip"):
            this.applyPipLayout();
            break;
        case adType.startsWith("richmedia"):
            
            applyRichmediaLayout();
            break;
    }
}


    createAdControls() {
        this.minimized = false;

        this.adControls = document.createElement('div');
        Object.assign(this.adControls.style, {
            position: 'absolute',
            top: '8px',
            right: '8px',
            zIndex: '99999',
            display: 'flex',
            gap: '6px',
            pointerEvents: 'auto'
        });

        const closeBtn = document.createElement('button');
        closeBtn.innerText = 'X';
        Object.assign(closeBtn.style, {
            padding: '4px 8px',
            fontSize: '14px',
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            border: '1px solid #999',
            borderRadius: '4px',
            cursor: 'pointer',
            pointerEvents: 'auto'
        });
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            this.hideAd();
        };

        const minimizeBtn = document.createElement('button');
        minimizeBtn.innerText = '-';
        Object.assign(minimizeBtn.style, {
            padding: '4px 8px',
            fontSize: '14px',
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            border: '1px solid #999',
            borderRadius: '4px',
            cursor: 'pointer',
            pointerEvents: 'auto'
        });

        minimizeBtn.onclick = (e) => {
            e.stopPropagation();
            this.minimizeBtn.style.display = 'none';
            this.closeBtn.style.display = 'none';
            this.minimizeAd();
            this.minimized = true;
        };

        this.adControls.appendChild(minimizeBtn);
        this.adControls.appendChild(closeBtn);

        this.minimizeBtn = minimizeBtn;
        this.closeBtn = closeBtn;
    }

    minimizeAd() {
        this.minimizedAd = document.createElement('div');
        Object.assign(this.minimizedAd.style, {
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            width: '60px',
            height: '60px',
            background: 'rgba(0,0,0,0.7)',
            borderRadius: '50%',
            zIndex: '999999',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '12px'
        });

        this.minimizedAd.innerText = 'Ad';
        this.minimizedAd.onclick = () => {
            this.minimizedAd.remove();
            this.showAd(this._lastContent);
            this.minimized = false;
        };

        this.wrapper.appendChild(this.minimizedAd);
        this.hideAd();
    }

    createAdSlotsForCurrentType(adType) {
        if (this.rightAdSlot) this.rightAdSlot.remove();
        if (this.leftAdSlot) this.leftAdSlot.remove();
        if (this.bottomAdSlot) this.bottomAdSlot.remove();
        if (this.topAdSlot) this.topAdSlot.remove();
        if (this.overlayAdSlot) this.overlayAdSlot.remove();
        if (this.pipAdSlot) this.pipAdSlot.remove();
        if (this.bannerVerticalAdSlot) this.bannerVerticalAdSlot.remove();
        if (this.bannerHorizontalAdSlot) this.bannerHorizontalAdSlot.remove();
        if (this.richmediaBackgroundAdSlot) this.richmediaBackgroundAdSlot.remove();
        if (this.richmediaForegroundAdSlot) this.richmediaForegroundAdSlot.remove();

        this.rightAdSlot = null;
        this.leftAdSlot = null;
        this.bottomAdSlot = null;
        this.topAdSlot = null;
        this.overlayAdSlot = null;
        this.pipAdSlot = null;
        this.bannerVerticalAdSlot = null;
        this.bannerHorizontalAdSlot = null;
        this.richmediaBackgroundAdSlot = null;
        this.richmediaForegroundAdSlot = null;

        CONFIG.adType = adType;
        this.createAdSlots(adType);
    }

    createAdSlots(adType) {
        if (LBAR_TYPES.includes(adType)) {
            createLbarSlots(this);
            return;
        }

        if (BANNER_TYPES.includes(adType)) {
            createBannerSlots(this, adType);
            return;
        }

        if (OVERLAY_TYPES.includes(adType)) {
            createOverlaySlots(this, adType);
            return;
        }

        if (PIP_TYPES.includes(adType)) {
            createPipSlots(this, adType);
            return;
        }

        if (RICHMEDIA_TYPES.includes(adType)) {
            createRichmediaSlots(this, adType);
        }
    }

    showAd(content = {}) {
        if (this.isAdShowing) return;
      const { wrapper, originalStyles, originalParent, originalNextSibling } = createWrapper(
            this.elementToWrap
        );
        this.wrapper = wrapper;
        this.originalStyles = originalStyles;
        this._originalParent = originalParent;
        this._originalNextSibling = originalNextSibling;
    
        this._lastContent = content;
        this.isAdShowing = true;
        Object.assign(CONFIG, window.UniversalAdSettings || {});

        const adType = CONFIG.adType || 'bottom-right';
        const duration = content.duration ?? CONFIG.defaultContent.duration ?? 10;
        this.createAdSlotsForCurrentType(adType);

        if (!this.adControls) this.createAdControls();
        this.adControls.style.display = 'flex';
        this.minimizeBtn.style.display = 'inline-block';
        this.closeBtn.style.display = 'inline-block';
        this.wrapper.appendChild(this.adControls);

        this.wrapper.style.pointerEvents = 'none';
        this.elementToWrap.style.pointerEvents = 'auto';
        this.elementToWrap.style.position = 'absolute';
        this.elementToWrap.style.top = '0';
        this.elementToWrap.style.left = '0';

        const sizes = {
            videoW: '75%',
            videoH: '75%',
            adW: '25%',
            adH: '25%'
        };

        if (this.elementToWrap.classList.contains('vjs-fluid')) {
            this.wasFluid = true;
            this.elementToWrap.classList.remove('vjs-fluid');
            this.elementToWrap.style.setProperty('padding-top', '0', 'important');
        }

        const tech =
            this.elementToWrap.querySelector('video') ||
            this.elementToWrap.querySelector('.vjs-tech') ||
            this.wrapper.querySelector('video') ||
            this.video;

        if (tech && BANNER_TYPES.includes(adType)) {
            tech.dataset.originalObjectFit = tech.style.objectFit || '';
            tech.style.objectFit = 'cover';
        }

        applyTransitionFrame(this.wrapper, () => {
            if (LBAR_TYPES.includes(adType)) {
                applyLbarLayout(this, adType, content, sizes);
                return;
            }
            if (BANNER_TYPES.includes(adType)) {
                applyBannerLayout(this, adType, content, sizes);
                return;
            }
            if (OVERLAY_TYPES.includes(adType)) {
                applyOverlayLayout(this, adType, content, sizes);
                return;
            }
            if (PIP_TYPES.includes(adType)) {
                applyPipLayout(this, content);
                return;
            }
            if (RICHMEDIA_TYPES.includes(adType)) {
                applyRichmediaLayout(this, adType, content);
            }
        });

        if (duration > 0) {
            setTimeout(() => this.hideAd(), duration * 1000);
        }
    }


    hideAd() {
        if (!this.isAdShowing) return;
        this.isAdShowing = false;

        const tech =
            this.elementToWrap.querySelector('video') ||
            this.elementToWrap.querySelector('.vjs-tech') ||
            this.wrapper.querySelector('video') ||
            this.video;

        if (tech && tech.dataset.originalObjectFit !== undefined) {
            tech.style.objectFit = tech.dataset.originalObjectFit;
            delete tech.dataset.originalObjectFit;
        }
        const propsToRestore = ['width', 'height', 'position', 'top', 'left', 'right', 'bottom', 'zIndex'];
        const collapseAds = () => {
            propsToRestore.forEach((prop) => {
                const original = this.originalStyles[prop];
                if (original !== undefined && original !== null && original !== '') {
                    this.elementToWrap.style[prop] = original;
                } else {
                    this.elementToWrap.style.removeProperty(prop.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase()));
                }
            });

            this.wrapper.style.pointerEvents = 'auto';
            this.elementToWrap.style.pointerEvents = 'auto';

            if (this.rightAdSlot) {
                this.rightAdSlot.style.width = '0%';
                this.rightAdSlot.style.height = '0%';
            }
            if (this.leftAdSlot) {
                this.leftAdSlot.style.width = '0%';
                this.leftAdSlot.style.height = '0%';
            }
            if (this.bottomAdSlot) {
                this.bottomAdSlot.style.height = '0%';
            }
            if (this.topAdSlot) {
                this.topAdSlot.style.height = '0%';
            }
            if (this.overlayAdSlot) {
                this.overlayAdSlot.style.height = '0%';
            }
            if (this.pipAdSlot) {
                this.pipAdSlot.style.width = '0px';
                this.pipAdSlot.style.height = '0px';
            }
            if (this.bannerVerticalAdSlot) {
                this.bannerVerticalAdSlot.style.width = '0%';
                this.bannerVerticalAdSlot.style.height = '100%';
            }
            if (this.bannerHorizontalAdSlot) {
                this.bannerHorizontalAdSlot.style.width = '100%';
                this.bannerHorizontalAdSlot.style.height = '0%';
            }

            hideRichmedia(this);
        };

        applyTransitionFrame(this.wrapper, collapseAds);

        // const cleanupDelay = getTransitionDurationMs();
        // setTimeout(() => {
        //     if (this.richmediaBackgroundAdSlot) {
        //         this.richmediaBackgroundAdSlot.style.display = 'none';
        //         this.richmediaBackgroundAdSlot.innerHTML = '';
        //     }
        //     if (this.richmediaForegroundAdSlot) {
        //         this.richmediaForegroundAdSlot.style.display = 'none';
        //         this.richmediaForegroundAdSlot.innerHTML = '';
        //     }
        // }, cleanupDelay);

        if (this.wasFluid) {
            this.elementToWrap.classList.add('vjs-fluid');
            this.wasFluid = false;
        }

        if (this.adControls) this.adControls.style.display = 'none';
        if (this.minimizeBtn) this.minimizeBtn.style.display = 'none';
        if (this.closeBtn) this.closeBtn.style.display = 'none';
        // After animation ends — restore original DOM structure
setTimeout(() => {
    if (!this.wrapper) return;

    // 1. Move video back to original location
    if (this._originalNextSibling) {
        this._originalParent.insertBefore(this.elementToWrap, this._originalNextSibling);
    } else {
        this._originalParent.appendChild(this.elementToWrap);
    }

    // 2. Remove wrapper completely
    this.wrapper.remove();
    this.wrapper = null; // Avoid dangling reference
}, getTransitionDurationMs());

    }
}

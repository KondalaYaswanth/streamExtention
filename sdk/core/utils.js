export const SDK_NAME = 'UniversalAdSDK';
export const LOG_PREFIX = `[${SDK_NAME}]`;

export const DEFAULT_CONFIG = {
    shrinkRatio: 0.75,
    adType: 'lbar-bottom-right',
    adAspectRatio: 0.25,
    transitionDuration: '0.5s',
    minVideoWidth: 300,
    minVideoHeight: 200,
    allowYoutube: false,
    allowYoutubeResize: false,
    autoRun: true,
    autoRunDelay: 5,
    defaultContent: {
        rightHtml: '<div style="background:#333; color:white; height:100%; display:flex; align-items:center; justify-content:center; text-align:center; padding:10px;"><div><h3>Ad Space</h3><p>Your Ad Here</p></div></div>',
        bottomHtml: '<div style="background:#444; color:white; height:100%; display:flex; align-items:center; justify-content:center;"><b>Banner Ad</b></div>',
        overlayHtml: '<div style="background:rgba(0,0,0,0.7); color:white; height:100%; display:flex; align-items:center; justify-content:center;"><b>Overlay Ad</b></div>',
        pipHtml: '<div style="background:#222; color:white; height:100%; display:flex; align-items:center; justify-content:center;"><b>PiP Ad</b></div>',
        bannerVerticalHtml: '<div style="background:#555; color:white; height:100%; display:flex; align-items:center; justify-content:center;"><b>Vertical Banner Ad</b></div>',
        bannerHorizontalHtml: '<div style="background:#666; color:white; height:100%; display:flex; align-items:center; justify-content:center;"><b>Horizontal Banner Ad</b></div>',
        richmediaBackgroundHtml: '',
        richmediaForegroundHtml: '',
        duration: 10
    }
};

export const CONFIG = { ...DEFAULT_CONFIG, ...(window.UniversalAdSettings || {}) };

export const initializedVideos = new WeakMap();


export function createBaseSlotStyle() {
    return {
        position: 'absolute',
        zIndex: '10000',
        overflow: 'hidden',
        transition: `all ${CONFIG.transitionDuration} ease`
    };
}

export function applyTransitionFrame(wrapper, updateFn) {
    if (!wrapper) {
        updateFn();
        return;
    }
    wrapper.getBoundingClientRect();
    requestAnimationFrame(updateFn);
}

export function getTransitionDurationMs() {
    const parsed = parseFloat(CONFIG.transitionDuration);
    return Number.isFinite(parsed) ? parsed * 1000 : 500;
}

let trustedPolicy = null;

export function getTrustedHTML(html = '') {
    if (window.trustedTypes) {
        if (!trustedPolicy) {
            try {
                trustedPolicy = window.trustedTypes.createPolicy('universal-ad-sdk', {
                    createHTML: (input) => input
                });
            } catch (err) {
                console.warn(`${LOG_PREFIX} Trusted Types policy creation failed`, err);
                return html || '';
            }
        }

        try {
            return trustedPolicy.createHTML(html || '');
        } catch (err) {
            console.warn(`${LOG_PREFIX} Trusted Types conversion failed`, err);
            return '';
        }
    }

    return html || '';
}

export function setSlotContent(el, html) {
    if (!el) return;
    if (!html) {
        el.replaceChildren();
        return;
    }

    const safe = getTrustedHTML(html);

    // If we got a TrustedHTML object, use direct assignment.
    if (window.TrustedHTML && safe instanceof window.TrustedHTML) {
        el.innerHTML = safe;
        return;
    }

    // Fallback: build a DOM fragment without touching innerHTML on pages that enforce Trusted Types.
    try {
        const range = document.createRange();
        range.selectNodeContents(el);
        const fragment = range.createContextualFragment(typeof safe === 'string' ? safe : String(safe));
        el.replaceChildren(fragment);
    } catch (err) {
        console.warn(`${LOG_PREFIX} Failed to set slot content`, err);
        el.textContent = '';
    }
    autoPlayAdMedia(el);
}
export function autoPlayAdMedia(container) {
    if (!container) return;
    container.querySelectorAll('video, audio').forEach((media) => {
        if (media.dataset.universalAdAutoplay === '1') return;
        media.dataset.universalAdAutoplay = '1';

        media.autoplay = true;
        media.setAttribute('playsinline', '');
        if (!media.muted) {
            media.muted = true;
            media.setAttribute('muted', '');
        }

        const tryPlay = () => {
            const p = media.play();
            if (p && typeof p.catch === 'function') {
                p.catch((err) => console.warn(`${LOG_PREFIX} Ad media playback blocked`, err));
            }
        };

        if (media.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
            tryPlay();
        } else {
            media.addEventListener('canplay', tryPlay, { once: true });
            setTimeout(tryPlay, 500);
        }
    });
}

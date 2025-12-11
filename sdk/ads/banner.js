import { createBaseSlotStyle, setSlotContent } from '../core/utils.js';

export const BANNER_TYPES = ['banner-right', 'banner-left', 'banner-top', 'banner-bottom'];

export function createBannerSlots(manager, adType) {
    const baseStyle = createBaseSlotStyle();

    if (adType === 'banner-right') {
        manager.bannerVerticalAdSlot = document.createElement('div');
        Object.assign(manager.bannerVerticalAdSlot.style, baseStyle, {
            right: 0,
            top: 0,
            width: '0%',
            height: '100%'
        });
        manager.wrapper.appendChild(manager.bannerVerticalAdSlot);
    }

    if (adType === 'banner-left') {
        manager.bannerVerticalAdSlot = document.createElement('div');
        Object.assign(manager.bannerVerticalAdSlot.style, baseStyle, {
            left: 0,
            top: 0,
            width: '0%',
            height: '100%'
        });
        manager.wrapper.appendChild(manager.bannerVerticalAdSlot);
    }

    if (adType === 'banner-top') {
        manager.bannerHorizontalAdSlot = document.createElement('div');
        Object.assign(manager.bannerHorizontalAdSlot.style, baseStyle, {
            top: 0,
            left: 0,
            width: '100%',
            height: '0%'
        });
        manager.wrapper.appendChild(manager.bannerHorizontalAdSlot);
    }

    if (adType === 'banner-bottom') {
        manager.bannerHorizontalAdSlot = document.createElement('div');
        Object.assign(manager.bannerHorizontalAdSlot.style, baseStyle, {
            bottom: 0,
            left: 0,
            width: '100%',
            height: '0%'
        });
        manager.wrapper.appendChild(manager.bannerHorizontalAdSlot);
    }
}

export function applyBannerLayout(manager, adType, content, sizes) {
    const { videoW, videoH, adW, adH } = sizes;
    setSlotContent(manager.bannerVerticalAdSlot, content.bannerVerticalHtml);
    setSlotContent(manager.bannerHorizontalAdSlot, content.bannerHorizontalHtml);

    switch (adType) {
    case 'banner-right':
        manager.elementToWrap.style.setProperty('width', videoW, 'important');
        manager.elementToWrap.style.setProperty('height', '100%', 'important');
        manager.elementToWrap.style.setProperty('top', '0', 'important');
        manager.elementToWrap.style.setProperty('left', '0', 'important');

        manager.bannerVerticalAdSlot.style.width = adW;
        manager.bannerVerticalAdSlot.style.height = '100%';
        manager.bannerVerticalAdSlot.style.top = '0';
        manager.bannerVerticalAdSlot.style.left = 'auto';
        break;
    case 'banner-left':
        manager.elementToWrap.style.setProperty('width', videoW, 'important');
        manager.elementToWrap.style.setProperty('height', '100%', 'important');
        manager.elementToWrap.style.setProperty('top', '0', 'important');
        manager.elementToWrap.style.setProperty('left', adW, 'important');

        manager.bannerVerticalAdSlot.style.width = adW;
        manager.bannerVerticalAdSlot.style.height = '100%';
        manager.bannerVerticalAdSlot.style.top = '0';
        break;
    case 'banner-top':
        manager.elementToWrap.style.setProperty('width', '100%', 'important');
        manager.elementToWrap.style.setProperty('height', videoH, 'important');
        manager.elementToWrap.style.setProperty('top', adH, 'important');
        manager.elementToWrap.style.setProperty('left', '0', 'important');

        manager.bannerHorizontalAdSlot.style.height = adH;
        manager.bannerHorizontalAdSlot.style.width = '100%';
        manager.bannerHorizontalAdSlot.style.top = '0';
        manager.bannerHorizontalAdSlot.style.left = '0';
        manager.bannerHorizontalAdSlot.style.right = 'auto';
        break;
    case 'banner-bottom':
        manager.elementToWrap.style.setProperty('width', '100%', 'important');
        manager.elementToWrap.style.setProperty('height', videoH, 'important');
        manager.elementToWrap.style.setProperty('top', '0', 'important');
        manager.elementToWrap.style.setProperty('left', '0', 'important');

        manager.bannerHorizontalAdSlot.style.height = adH;
        manager.bannerHorizontalAdSlot.style.width = '100%';
        manager.bannerHorizontalAdSlot.style.bottom = '0';
        manager.bannerHorizontalAdSlot.style.left = '0';
        manager.bannerHorizontalAdSlot.style.right = 'auto';
        break;
    default:
        break;
    }
}

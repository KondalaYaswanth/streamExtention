import { createBaseSlotStyle, setSlotContent } from '../core/utils.js';

export const OVERLAY_TYPES = ['overlay-top', 'overlay-bottom'];

export function createOverlaySlots(manager, adType) {
    const baseStyle = createBaseSlotStyle();
    manager.overlayAdSlot = document.createElement('div');

    Object.assign(manager.overlayAdSlot.style, baseStyle, {
        width: '100%',
        height: '0%',
        left: '0',
        display: 'flex',
        alignItems: 'center'
    });

    if (adType === 'overlay-top') {
        manager.overlayAdSlot.style.top = '0';
    } else {
        manager.overlayAdSlot.style.bottom = '0';
    }
    manager.wrapper.appendChild(manager.overlayAdSlot);
}

export function applyOverlayLayout(manager, adType, content, sizes) {
    const { adH } = sizes;
    setSlotContent(manager.overlayAdSlot, content.overlayHtml);
    if (!manager.disableVideoResize) {
        manager.elementToWrap.style.setProperty('width', '100%', 'important');
        manager.elementToWrap.style.setProperty('height', '100%', 'important');
        manager.elementToWrap.style.setProperty('top', '0', 'important');
        manager.elementToWrap.style.setProperty('left', '0', 'important');
    }
    manager.overlayAdSlot.style.width = '100%';
    manager.overlayAdSlot.style.height = adH;
    manager.overlayAdSlot.style.left = '0';
    manager.overlayAdSlot.style.right = '0';
    manager.overlayAdSlot.style.justifyContent = 'center';
    manager.overlayAdSlot.style.zIndex = '10001';

    if (adType === 'overlay-top') {
        manager.overlayAdSlot.style.top = '0';
        manager.overlayAdSlot.style.bottom = '';
    } else {
        manager.overlayAdSlot.style.bottom = '0';
        manager.overlayAdSlot.style.top = '';
    }
}

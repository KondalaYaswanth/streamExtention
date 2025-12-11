import { createBaseSlotStyle, setSlotContent } from '../core/utils.js';

export const LBAR_TYPES = [
    'lbar-bottom-right',
    'lbar-bottom-left',
    'lbar-top-right',
    'lbar-top-left'
];

export function createLbarSlots(manager) {
    const baseStyle = createBaseSlotStyle();

    manager.rightAdSlot = document.createElement('div');
    manager.leftAdSlot = document.createElement('div');
    manager.bottomAdSlot = document.createElement('div');
    manager.topAdSlot = document.createElement('div');

    Object.assign(manager.rightAdSlot.style, baseStyle, {
        right: 0,
        top: 0,
        width: '0%',
        height: '100%',
        zIndex: '10001'
    });

    Object.assign(manager.leftAdSlot.style, baseStyle, {
        left: 0,
        top: 0,
        width: '0%',
        height: '100%',
        zIndex: '10001'
    });

    Object.assign(manager.bottomAdSlot.style, baseStyle, {
        bottom: 0,
        left: 0,
        width: '100%',
        height: '0%'
    });

    Object.assign(manager.topAdSlot.style, baseStyle, {
        top: 0,
        left: 0,
        width: '100%',
        height: '0%'
    });

    manager.wrapper.appendChild(manager.rightAdSlot);
    manager.wrapper.appendChild(manager.leftAdSlot);
    manager.wrapper.appendChild(manager.bottomAdSlot);
    manager.wrapper.appendChild(manager.topAdSlot);
}

function setContent(manager, rightHtml, bottomHtml) {
    setSlotContent(manager.rightAdSlot, rightHtml);
    setSlotContent(manager.leftAdSlot, rightHtml);
    setSlotContent(manager.bottomAdSlot, bottomHtml);
    setSlotContent(manager.topAdSlot, bottomHtml);
}

export function applyLbarLayout(manager, adType, content, sizes) {
    const { videoW, videoH, adW, adH } = sizes;
    setContent(manager, content.rightHtml, content.bottomHtml);

    // On YouTube we avoid resizing the video; just overlay the bars.
    // if (manager.disableVideoResize) {
    //     const isLeft = adType.includes('-left');
    //     const isTop = adType.includes('top-');

    //     const verticalSlot = isLeft ? manager.leftAdSlot : manager.rightAdSlot;
    //     const horizontalSlot = isTop ? manager.topAdSlot : manager.bottomAdSlot;

    //     if (verticalSlot) {
    //         verticalSlot.style.width = adW;
    //         verticalSlot.style.height = '100%';
    //         verticalSlot.style.left = isLeft ? '0' : '';
    //         verticalSlot.style.right = isLeft ? '' : '0';
    //         verticalSlot.style.top = '0';
    //     }

    //     if (horizontalSlot) {
    //         horizontalSlot.style.height = adH;
    //         horizontalSlot.style.width = '100%';
    //         horizontalSlot.style.top = isTop ? '0' : '';
    //         horizontalSlot.style.bottom = isTop ? '' : '0';
    //     }

    //     return;
    // }

    switch (adType) {
    case 'lbar-bottom-right':
        manager.elementToWrap.style.setProperty('width', videoW, 'important');
        manager.elementToWrap.style.setProperty('height', videoH, 'important');
        manager.elementToWrap.style.setProperty('top', '0', 'important');
        manager.elementToWrap.style.setProperty('left', '0', 'important');

        manager.rightAdSlot.style.width = adW;
        manager.rightAdSlot.style.height = videoH;
        manager.rightAdSlot.style.top = '0';
        manager.bottomAdSlot.style.height = adH;
        break;
    case 'lbar-bottom-left':
        manager.elementToWrap.style.setProperty('width', videoW, 'important');
        manager.elementToWrap.style.setProperty('height', videoH, 'important');
        manager.elementToWrap.style.setProperty('top', '0', 'important');
        manager.elementToWrap.style.setProperty('left', adW, 'important');

        manager.leftAdSlot.style.width = adW;
        manager.leftAdSlot.style.height = videoH;
        manager.leftAdSlot.style.top = '0';
        manager.bottomAdSlot.style.height = adH;
        break;
    case 'lbar-top-right':
        manager.elementToWrap.style.setProperty('width', videoW, 'important');
        manager.elementToWrap.style.setProperty('height', videoH, 'important');
        manager.elementToWrap.style.setProperty('top', adH, 'important');
        manager.elementToWrap.style.setProperty('left', '0', 'important');

        manager.rightAdSlot.style.width = adW;
        manager.rightAdSlot.style.height = videoH;
        manager.rightAdSlot.style.top = adH;
        manager.topAdSlot.style.height = adH;
        break;
    case 'lbar-top-left':
        manager.elementToWrap.style.setProperty('width', videoW, 'important');
        manager.elementToWrap.style.setProperty('height', videoH, 'important');
        manager.elementToWrap.style.setProperty('top', adH, 'important');
        manager.elementToWrap.style.setProperty('left', adW, 'important');

        manager.leftAdSlot.style.width = adW;
        manager.leftAdSlot.style.height = videoH;
        manager.leftAdSlot.style.top = adH;
        manager.topAdSlot.style.height = adH;
        break;
    default:
        break;
    }
}

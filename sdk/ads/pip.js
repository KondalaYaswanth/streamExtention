import { createBaseSlotStyle, setSlotContent } from '../core/utils.js';

export const PIP_TYPES = [
    'pip-bottom-right',
    'pip-bottom-left',
    'pip-top-right',
    'pip-top-left'
];

export function createPipSlots(manager, adType) {
    const baseStyle = createBaseSlotStyle();
    manager.pipAdSlot = document.createElement('div');

    Object.assign(manager.pipAdSlot.style, baseStyle, {
        width: '0px',
        height: '0px',
        borderRadius: '8px',
        background: '#111',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    });

    if (adType === 'pip-bottom-right') {
        manager.pipAdSlot.style.right = '10px';
        manager.pipAdSlot.style.bottom = '10px';
    }
    if (adType === 'pip-bottom-left') {
        manager.pipAdSlot.style.left = '10px';
        manager.pipAdSlot.style.bottom = '10px';
    }
    if (adType === 'pip-top-right') {
        manager.pipAdSlot.style.right = '10px';
        manager.pipAdSlot.style.top = '10px';
    }
    if (adType === 'pip-top-left') {
        manager.pipAdSlot.style.left = '10px';
        manager.pipAdSlot.style.top = '10px';
    }

    manager.wrapper.appendChild(manager.pipAdSlot);
}

export function applyPipLayout(manager, content) {
    setSlotContent(manager.pipAdSlot, content.pipHtml);

    if (!manager.disableVideoResize) {
        manager.elementToWrap.style.setProperty('width', '100%', 'important');
        manager.elementToWrap.style.setProperty('height', '100%', 'important');
        manager.elementToWrap.style.setProperty('top', '0', 'important');
        manager.elementToWrap.style.setProperty('left', '0', 'important');
    }

    manager.pipAdSlot.style.width = '150px';
    manager.pipAdSlot.style.height = '150px';
}

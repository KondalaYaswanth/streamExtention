import { CONFIG, setSlotContent } from '../core/utils.js';

export const RICHMEDIA_TYPES = [
    'richmedia-right',
    'richmedia-left',
    'richmedia-bottom-right',
    'richmedia-bottom-left',
    'richmedia-top-right',
    'richmedia-top-left',
    'richmedia-top',
    'richmedia-bottom'
];

export function createRichmediaSlots(manager, adType) {
    manager.richmediaBackgroundAdSlot = document.createElement('div');
    Object.assign(manager.richmediaBackgroundAdSlot.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '1',
        overflow: 'hidden',
        pointerEvents: 'none',
        transition: `all ${CONFIG.transitionDuration} ease`,
        opacity: '0'
    });
    manager.wrapper.appendChild(manager.richmediaBackgroundAdSlot);

    const baseStyle = {
        position: 'absolute',
        zIndex: '6',
        borderRadius: '12px',
        overflow: 'hidden',
        pointerEvents: 'auto',
        display: 'block',
        objectFit: 'cover',
        transition: `all ${CONFIG.transitionDuration} ease`,
        opacity: '0'
    };

    manager.richmediaForegroundAdSlot = document.createElement('div');

    if (adType === 'richmedia-right') {
        Object.assign(manager.richmediaForegroundAdSlot.style, baseStyle, {
            top: '12%',
            left: '75%',
            transform: 'translateX(-60%)',
            width: '45%',
            height: '70%',
            backgroundColor: 'blue'
        });
    } else if (adType === 'richmedia-left') {
        Object.assign(manager.richmediaForegroundAdSlot.style, baseStyle, {
            top: '12%',
            right: '75%',
            transform: 'translateX(60%)',
            width: '45%',
            height: '70%',
            backgroundColor: 'red'
        });
    } else if (adType === 'richmedia-bottom-right') {
        Object.assign(manager.richmediaForegroundAdSlot.style, baseStyle, {
            bottom: '5%',
            right: '5%',
            width: '53%',
            height: '40%',
            backgroundColor: 'green'
        });
    } else if (adType === 'richmedia-bottom-left') {
        Object.assign(manager.richmediaForegroundAdSlot.style, baseStyle, {
            bottom: '5%',
            left: '5%',
            width: '53%',
            height: '40%',
            backgroundColor: 'yellow'
        });
    } else if (adType === 'richmedia-top-right') {
        Object.assign(manager.richmediaForegroundAdSlot.style, baseStyle, {
            top: '5%',
            right: '5%',
            width: '53%',
            height: '40%',
            backgroundColor: 'purple'
        });
    } else if (adType === 'richmedia-top-left') {
        Object.assign(manager.richmediaForegroundAdSlot.style, baseStyle, {
            top: '5%',
            left: '5%',
            width: '53%',
            height: '40%',
            backgroundColor: 'orange'
        });
    } else if (adType === 'richmedia-top') {
        Object.assign(manager.richmediaForegroundAdSlot.style, baseStyle, {
            top: '5%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            height: '30%',
            backgroundColor: 'pink'
        });
    } else if (adType === 'richmedia-bottom') {
        Object.assign(manager.richmediaForegroundAdSlot.style, baseStyle, {
            bottom: '5%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            height: '30%',
            backgroundColor: 'cyan'
        });
    }

    manager.wrapper.appendChild(manager.richmediaForegroundAdSlot);
}

export function applyRichmediaLayout(manager, adType, content) {
    const { elementToWrap } = manager;

    if (manager.richmediaBackgroundAdSlot) {
        manager.richmediaBackgroundAdSlot.style.display = 'block';
        manager.richmediaBackgroundAdSlot.style.opacity = '1';
        manager.richmediaBackgroundAdSlot.style.width = '100%';
        manager.richmediaBackgroundAdSlot.style.height = '100%';
        setSlotContent(manager.richmediaBackgroundAdSlot, content.richmediaBackgroundHtml);
    }

    if (manager.richmediaForegroundAdSlot) {
        manager.richmediaForegroundAdSlot.style.display = 'block';
        manager.richmediaForegroundAdSlot.style.opacity = '1';
        setSlotContent(manager.richmediaForegroundAdSlot, content.richmediaForegroundHtml);
    }

    switch (adType) {
    case 'richmedia-right':
        elementToWrap.style.setProperty('width', '40%', 'important');
        elementToWrap.style.setProperty('height', '40%', 'important');
        elementToWrap.style.setProperty('top', '20%', 'important');
        elementToWrap.style.removeProperty('right');
        elementToWrap.style.setProperty('left', '3%', 'important');
        elementToWrap.style.setProperty('z-index', '7', 'important');
        break;
    case 'richmedia-left':
        elementToWrap.style.setProperty('width', '40%', 'important');
        elementToWrap.style.setProperty('height', '40%', 'important');
        elementToWrap.style.setProperty('top', '20%', 'important');
        elementToWrap.style.removeProperty('left');
        elementToWrap.style.setProperty('right', '3%', 'important');
        elementToWrap.style.setProperty('z-index', '7', 'important');
        break;
    case 'richmedia-bottom-right':
        elementToWrap.style.setProperty('width', '40%', 'important');
        elementToWrap.style.setProperty('height', '40%', 'important');
        elementToWrap.style.setProperty('top', '10%', 'important');
        elementToWrap.style.setProperty('left', '10%', 'important');
        elementToWrap.style.setProperty('z-index', '5', 'important');
        break;
    case 'richmedia-bottom-left':
        elementToWrap.style.setProperty('width', '40%', 'important');
        elementToWrap.style.setProperty('height', '40%', 'important');
        elementToWrap.style.setProperty('top', '10%', 'important');
        elementToWrap.style.setProperty('left', '55%', 'important');
        elementToWrap.style.setProperty('z-index', '5', 'important');
        break;
    case 'richmedia-top-right':
        elementToWrap.style.setProperty('width', '40%', 'important');
        elementToWrap.style.setProperty('height', '40%', 'important');
        elementToWrap.style.setProperty('top', '55%', 'important');
        elementToWrap.style.setProperty('left', '10%', 'important');
        elementToWrap.style.setProperty('z-index', '5', 'important');
        break;
    case 'richmedia-top-left':
        elementToWrap.style.setProperty('width', '40%', 'important');
        elementToWrap.style.setProperty('height', '40%', 'important');
        elementToWrap.style.setProperty('top', '55%', 'important');
        elementToWrap.style.setProperty('left', '55%', 'important');
        elementToWrap.style.setProperty('z-index', '5', 'important');
        break;
    case 'richmedia-top':
        elementToWrap.style.setProperty('width', '40%', 'important');
        elementToWrap.style.setProperty('height', '40%', 'important');
        elementToWrap.style.setProperty('top', '50%', 'important');
        elementToWrap.style.setProperty('left', '20%', 'important');
        elementToWrap.style.setProperty('z-index', '5', 'important');
        break;
    case 'richmedia-bottom':
        elementToWrap.style.setProperty('width', '40%', 'important');
        elementToWrap.style.setProperty('height', '40%', 'important');
        elementToWrap.style.setProperty('top', '10%', 'important');
        elementToWrap.style.setProperty('left', '20%', 'important');
        elementToWrap.style.setProperty('z-index', '5', 'important');
        break;
    default:
        break;
    }
}

export function hideRichmedia(manager) {
    if (manager.richmediaBackgroundAdSlot) {
        Object.assign(manager.richmediaBackgroundAdSlot.style, {
            display: 'block',
            width: '0',
            height: '0',
            opacity: '0',
            pointerEvents: 'none',
            zIndex: '0'
        });
    }

    if (manager.richmediaForegroundAdSlot) {
        Object.assign(manager.richmediaForegroundAdSlot.style, {
            display: 'block',
            width: '0',
            height: '0',
            opacity: '0',
            pointerEvents: 'none',
            zIndex: '0'
        });
    }
}

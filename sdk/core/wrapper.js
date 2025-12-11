import { CONFIG } from './utils.js';

export function normalizeParentForWrapper(parent) {
    const parentStyle = window.getComputedStyle(parent);
    const isVideoWrapper = parent.classList && parent.classList.contains('video-wrapper');
    if (!isVideoWrapper && parentStyle.display === 'flex') {
        parent.style.display = 'block';
    }
    if (parentStyle.overflow !== 'visible') {
        parent.style.overflow = 'visible';
    }
    if (parentStyle.pointerEvents === 'none') {
        parent.style.pointerEvents = 'auto';
    }
    if (parentStyle.transform !== 'none') {
        parent.style.transform = 'none';
    }
    if (parentStyle.position === 'static') {
        parent.style.position = 'relative';
    }
}

export function createWrapper(elementToWrap) {
    const originalParent = elementToWrap.parentNode;
    const originalNextSibling = elementToWrap.nextSibling;

    const wrapper = document.createElement('div');
    wrapper.classList.add('ad-wrapper');

    const computedStyle = window.getComputedStyle(elementToWrap);
    normalizeParentForWrapper(originalParent);

    Object.assign(wrapper.style, {
        position: 'relative',
        display: 'block',
        width: computedStyle.width,
        height: computedStyle.height,
        marginTop: computedStyle.marginTop,
        marginBottom: computedStyle.marginBottom,
        marginLeft: computedStyle.marginLeft,
        marginRight: computedStyle.marginRight,
        zIndex: computedStyle.zIndex,
        overflow: 'hidden',
        backgroundColor: '#000'
    });

    originalParent.insertBefore(wrapper, elementToWrap);
    wrapper.appendChild(elementToWrap);

    const originalStyles = {
        width: elementToWrap.style.width,
        height: elementToWrap.style.height,
        position: elementToWrap.style.position,
        top: elementToWrap.style.top,
        left: elementToWrap.style.left,
        right: elementToWrap.style.right,
        bottom: elementToWrap.style.bottom,
        zIndex: elementToWrap.style.zIndex,
        transition: elementToWrap.style.transition
    };

    Object.assign(elementToWrap.style, {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        transition: `all ${CONFIG.transitionDuration} ease`
    });

    return { wrapper, originalStyles, originalParent, originalNextSibling };
}

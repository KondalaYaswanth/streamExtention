export function detectPlayerRoot(video) {
    let root = video;
    while (root.parentElement && root.parentElement !== document.body) {
        const parent = root.parentElement;
        const realChildren = [...parent.children].filter(
            (el) => el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE'
        );
        if (realChildren.length > 1) return parent;
        root = parent;
    }
    return video;
}

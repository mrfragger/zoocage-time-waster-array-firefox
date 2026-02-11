(function() {
    'use strict';

    let pickerActive = false;
    let editMode = false;
    let zapperActive = false;
    let hoveredElement = null;
    let originalOutline = '';
    let originalCursor = '';
    let blurredElements = {};
    let zappedElements = {};
    let currentHost = null;
    let styleElement = null;
    let invertActive = false;
    let invertedElements = {};
    let invertParentActive = false;
    let invertedParents = {};

    const OUTLINE_COLOR = '#fe6913';

    function extractHost(url) {
        try {
            return new URL(url).hostname;
        } catch (e) {
            return null;
        }
    }

    async function isDarkModeActive() {
        const { darkModeEnabled = false, darkModeSettings = {} } = 
            await browser.storage.local.get(['darkModeEnabled', 'darkModeSettings']);
        
        if (!darkModeEnabled) return false;
        
        const siteSettings = darkModeSettings[currentHost];
        if (siteSettings && siteSettings.enabled === false) return false;
        
        return true;
    }

    function getBlurLevels(isDarkMode) {
        if (isDarkMode) {
            return [
                { overlay: 'rgba(255, 255, 255, 0.55)' },
                { overlay: 'rgba(255, 255, 255, 0.65)' },
                { overlay: 'rgba(255, 255, 255, 0.75)' },
                { overlay: 'rgba(255, 255, 255, 0.85)' },
                { overlay: 'rgba(255, 255, 255, 1)' },
                { overlay: 'none' }
            ];
        } else {
            return [
                { overlay: 'rgba(0, 0, 0, 0.55)' },
                { overlay: 'rgba(0, 0, 0, 0.65)' },
                { overlay: 'rgba(0, 0, 0, 0.75)' },
                { overlay: 'rgba(0, 0, 0, 0.85)' },
                { overlay: 'rgba(0, 0, 0, 1)' },
                { overlay: 'none' }
            ];
        }
    }


    function getElementSelector(element) {
        let path = [];
        
        while (element && element.nodeType === Node.ELEMENT_NODE) {
            let selector = element.nodeName.toLowerCase();
            
            if (element.id) {
                selector = `#${element.id}`;
                path.unshift(selector);
                break;
            } else {
                let sibling = element;
                let nth = 1;
                
                while (sibling.previousElementSibling) {
                    sibling = sibling.previousElementSibling;
                    if (sibling.nodeName.toLowerCase() === selector) {
                        nth++;
                    }
                }
                
                if (nth > 1) {
                    selector += `:nth-of-type(${nth})`;
                }
                
                if (element.className && typeof element.className === 'string') {
                    const classes = element.className.trim().split(/\s+/).filter(c => 
                        c && !c.includes('dark-overlay') && !c.includes('blur-trash-icon')
                    );
                    if (classes.length > 0) {
                        selector += '.' + classes.slice(0, 2).join('.');
                    }
                }
            }
            
            path.unshift(selector);
            element = element.parentElement;
            
            if (path.length > 3) break;
        }
        
        return path.join(' > ');
    }

    function getCurrentBlurLevel(element) {
        const selector = getElementSelector(element);
        return blurredElements[selector] || 0;
    }

    function getOrCreateStyleElement() {
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'element-blur-styles';
            document.head.appendChild(styleElement);
        }
        return styleElement;
    }

    async function updateGlobalStyles() {
        const style = getOrCreateStyleElement();
        let css = '';
    
        Object.entries(blurredElements).forEach(([selector, level]) => {
            if (level < 5) { // 5 means no blur
                const blurAmount = (level + 1) * 2; // 2px, 4px, 6px, 8px, 10px
                css += `
                    ${selector} {
                        filter: blur(${blurAmount}px) !important;
                        transition: filter 0.3s !important;
                    }
                `;
            }
        });
    
        style.textContent = css;
        
        if (pickerActive) {
            addTrashIcons();
        }
    }
    
    function addTrashIcons() {
        document.querySelectorAll('.blur-trash-icon').forEach(icon => icon.remove());
        
        Object.keys(blurredElements).forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (element.querySelector('.blur-trash-icon')) return;
                    
                    const trashIcon = document.createElement('div');
                    trashIcon.className = 'blur-trash-icon';
                    trashIcon.innerHTML = '💧';
                    trashIcon.title = 'Remove blur overlay';
                    trashIcon.style.cssText = `
                        position: absolute !important;
                        top: 50% !important;
                        left: 50% !important;
                        transform: translate(-50%, -50%) !important;
                        font-size: 24px !important;
                        cursor: pointer !important;
                        z-index: 9999999 !important;
                        background: rgba(0, 0, 0, 0.7) !important;
                        border-radius: 50% !important;
                        width: 32px !important;
                        height: 32px !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        pointer-events: auto !important;
                        border: 3px solid ${OUTLINE_COLOR} !important;
                    `;
                    
                    trashIcon.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        await removeBlur(selector);
                    });
                    
                    element.appendChild(trashIcon);
                });
            } catch (e) {
                // console.error('Error adding trash icon for selector:', selector, e);
            }
        });
    }
    
    function removeTrashIcons() {
        document.querySelectorAll('.blur-trash-icon').forEach(icon => icon.remove());
    }
    
    async function removeBlur(selector) {
        delete blurredElements[selector];
        await saveBlurSettings();
        
        try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.style.outline = '';
                const trashIcon = element.querySelector('.blur-trash-icon');
                if (trashIcon) {
                    trashIcon.remove();
                }
            });
        } catch (e) {
            // console.error('Error removing blur:', e);
        }
        
        await updateGlobalStyles();
    }
    
    function createExitButton() {
        const existingBtn = document.getElementById('blur-exit-btn');
        if (existingBtn) return;
        
        const exitBtn = document.createElement('div');
        exitBtn.id = 'blur-exit-btn';
        exitBtn.innerHTML = '💧';
        exitBtn.title = 'ESC to exit';
        exitBtn.style.cssText = `
            position: fixed !important;
            top: 50% !important;
            right: 20px !important;
            transform: translateY(-50%) !important;
            font-size: 48px !important;
            cursor: pointer !important;
            z-index: 99999999 !important;
            background: transparent !important;
            border-radius: 50% !important;
            width: 70px !important;
            height: 70px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: all 0.2s !important;
        `;
        
        exitBtn.addEventListener('mouseenter', () => {
            exitBtn.style.transform = 'translateY(-50%) scale(1.2)';
        });
        
        exitBtn.addEventListener('mouseleave', () => {
            exitBtn.style.transform = 'translateY(-50%) scale(1)';
        });
        
        exitBtn.addEventListener('click', () => {
            stopPicker();
        });
        
        document.body.appendChild(exitBtn);
    }
    
    function removeExitButton() {
        const exitBtn = document.getElementById('blur-exit-btn');
        if (exitBtn) {
            exitBtn.remove();
        }
    }

    async function applyBlur(element, level) {
        if (level === 5) {
            element.removeAttribute('data-blur-level');
        } else {
            element.setAttribute('data-blur-level', level);
        }
        
        await updateGlobalStyles();
    }

    async function cycleBlur(element) {
        const currentLevel = getCurrentBlurLevel(element);
        const nextLevel = (currentLevel + 1) % 6;
        const selector = getElementSelector(element);
        
        if (nextLevel === 5) {
            delete blurredElements[selector];
        } else {
            blurredElements[selector] = nextLevel;
        }
        
        await applyBlur(element, nextLevel);
        await saveBlurSettings();
    }

    async function saveBlurSettings() {
        if (!currentHost) return;
        
        const { blurSettings = {} } = await browser.storage.local.get('blurSettings');
        blurSettings[currentHost] = blurredElements;
        await browser.storage.local.set({ blurSettings });
    }

    async function loadBlurSettings() {
        currentHost = extractHost(window.location.href);
        if (!currentHost) return;
        
        const { blurSettings = {} } = await browser.storage.local.get('blurSettings');
        blurredElements = blurSettings[currentHost] || {};
        
        if (Object.keys(blurredElements).length > 0) {
            await updateGlobalStyles();
        }
    }

    async function loadZapSettings() {
        currentHost = extractHost(window.location.href);
        if (!currentHost) return;
        
        const { zapSettings = {} } = await browser.storage.local.get('zapSettings');
        zappedElements = zapSettings[currentHost] || {};
        
        updateZapStyles();
    }

    function startZapper() {
        if (zapperActive) return;
        
        zapperActive = true;
        document.body.style.cursor = 'crosshair';
        
        document.addEventListener('mouseover', handleZapMouseOver, true);
        document.addEventListener('click', handleZapClick, true);
        document.addEventListener('keydown', handleZapKeyDown, true);
        
        createZapExitButton();
    }
    
    function stopZapper() {
        if (!zapperActive) return;
        
        zapperActive = false;
        document.body.style.cursor = originalCursor;
        
        if (hoveredElement) {
            hoveredElement.style.outline = originalOutline;
            hoveredElement.style.background = '';
            const badge = hoveredElement.querySelector('.zap-count-badge');
            if (badge) badge.remove();
            hoveredElement = null;
        }
        
        document.querySelectorAll('[style*="dashed"]').forEach(el => {
            if (el.style.outline.includes('dashed')) {
                el.style.outline = '';
                el.style.background = '';
            }
        });
        
        document.querySelectorAll('.zap-count-badge').forEach(badge => badge.remove());
        
        document.removeEventListener('mouseover', handleZapMouseOver, true);
        document.removeEventListener('click', handleZapClick, true);
        document.removeEventListener('keydown', handleZapKeyDown, true);
        
        removeZapExitButton();
    }
    
    function handleZapMouseOver(e) {
        if (!zapperActive) return;
        
        if (e.target.id === 'zap-exit-btn' || e.target.classList.contains('zap-count-badge')) {
            return;
        }
        
        e.stopPropagation();
        e.preventDefault();
        
        if (hoveredElement && hoveredElement !== e.target) {
            hoveredElement.style.outline = originalOutline;
            hoveredElement.style.background = '';
            
            const oldBadge = hoveredElement.querySelector('.zap-count-badge');
            if (oldBadge) oldBadge.remove();
        }
        
        hoveredElement = e.target;
        originalOutline = hoveredElement.style.outline;
        hoveredElement.style.outline = `3px dashed ${OUTLINE_COLOR}`;
        hoveredElement.style.background = 'rgba(255, 0, 0, 0.2)';
        
        const selector = getAdvancedSelector(hoveredElement);
        try {
            const matchingCount = document.querySelectorAll(selector).length;
            if (matchingCount > 1) {
                const badge = document.createElement('div');
                badge.className = 'zap-count-badge';
                badge.textContent = `×${matchingCount}`;
                badge.style.cssText = `
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    background: ${OUTLINE_COLOR};
                    color: white;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: bold;
                    z-index: 999999999;
                    pointer-events: none;
                `;
                
                if (hoveredElement.style.position === 'static' || !hoveredElement.style.position) {
                    hoveredElement.style.position = 'relative';
                }
                
                hoveredElement.appendChild(badge);
            }
        } catch (e) {
            console.error('Selector error:', e);
        }
    }

    async function saveZapSettings() {
        if (!currentHost) return;
        
        const { zapSettings = {} } = await browser.storage.local.get('zapSettings');
        zapSettings[currentHost] = zappedElements;
        await browser.storage.local.set({ zapSettings });
        updateZapStyles();
    }

    function handleZapKeyDown(e) {
        if (e.key === 'Escape') {
            stopZapper();
        }
    }
    
    async function handleZapClick(e) {
        if (!zapperActive) return;
        
        if (e.target.id === 'zap-exit-btn' || e.target.classList.contains('zap-count-badge')) {
            return;
        }
        
        e.stopPropagation();
        e.preventDefault();
        
        if (hoveredElement) {
            hoveredElement.style.outline = originalOutline;
            
            const selector = getAdvancedSelector(hoveredElement);
            
            zappedElements[selector] = true;
            
            try {
                const matchingElements = document.querySelectorAll(selector);
                matchingElements.forEach(el => {
                    if (el.parentElement) {
                        el.parentElement.style.display = 'none';
                    }
                    el.style.display = 'none';
                });
            } catch (err) {
                if (hoveredElement.parentElement) {
                    hoveredElement.parentElement.style.display = 'none';
                }
                hoveredElement.style.display = 'none';
            }
            
            hoveredElement = null;
            
            await saveZapSettings();
        }
    }
    
    function getAdvancedSelector(element) {
        const standardSelector = getElementSelector(element);
        
        if (element.id) {
            const id = element.id;
            
            if (id.startsWith('t3_') && id.endsWith('-aspect-ratio')) {
                return '[id^="t3_"][id$="-aspect-ratio"]';
            }
            
            const prefixMatch = id.match(/^([a-zA-Z0-9]+[_-])/);
            const suffixMatch = id.match(/([_-][a-zA-Z0-9]+)$/);
            
            if (prefixMatch && suffixMatch) {
                return `[id^="${prefixMatch[1]}"][id$="${suffixMatch[0]}"]`;
            }
            
            const numericPrefix = id.match(/^([a-zA-Z]+_)/);
            if (numericPrefix) {
                return `[id^="${numericPrefix[1]}"]`;
            }
        }
        
        if (element.className && typeof element.className === 'string') {
            const classes = element.className.trim().split(/\s+/);
            
            for (const cls of classes) {
                const genPattern = cls.match(/^([a-zA-Z_-]+?)[-_]\d+$/);
                if (genPattern) {
                    return `[class*="${genPattern[1]}"]`;
                }
                
                if (cls.includes('inset')) {
                    return '[class*="inset"]';
                }
            }
        }
        
        for (const attr of element.attributes) {
            if (attr.name.startsWith('data-')) {
                const value = attr.value;
                
                if (attr.name === 'data-post-click-location' && value.includes('video')) {
                    return '[data-post-click-location*="video"]';
                }
                
                if (value && value.includes('-') && value.length > 10) {
                    const parts = value.split('-');
                    if (parts.length > 1) {
                        return `[${attr.name}*="${parts[0]}"]`;
                    }
                }
            }
        }
        
        return standardSelector;
    }
    
    function updateZapStyles() {
        let zapStyleElement = document.getElementById('element-zap-styles');
        if (!zapStyleElement) {
            zapStyleElement = document.createElement('style');
            zapStyleElement.id = 'element-zap-styles';
            document.head.appendChild(zapStyleElement);
        }
        
        let css = '';
        Object.keys(zappedElements).forEach(selector => {
            css += `${selector} { display: none !important; }\n`;
            
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    if (el.parentElement) {
                        const parentSelector = getElementSelector(el.parentElement);
                        css += `${parentSelector} { display: none !important; }\n`;
                    }
                });
            } catch (e) {
                console.error('Error applying zap:', e);
            }
        });
        
        zapStyleElement.textContent = css;
    }
    
    function createZapExitButton() {
        const existingBtn = document.getElementById('zap-exit-btn');
        if (existingBtn) return;
        
        const exitBtn = document.createElement('div');
        exitBtn.id = 'zap-exit-btn';
        exitBtn.innerHTML = '⚡';
        exitBtn.title = 'ESC to exit';
        exitBtn.style.cssText = `
            position: fixed !important;
            top: 50% !important;
            right: 20px !important;
            transform: translateY(-50%) !important;
            font-size: 48px !important;
            cursor: pointer !important;
            z-index: 2147483647 !important;
            background: transparent !important;
            border-radius: 50% !important;
            width: 70px !important;
            height: 70px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: all 0.2s !important;
            pointer-events: auto !important;
        `;
        
        exitBtn.addEventListener('mouseenter', () => {
            exitBtn.style.transform = 'translateY(-50%) scale(1.2)';
        });
        
        exitBtn.addEventListener('mouseleave', () => {
            exitBtn.style.transform = 'translateY(-50%) scale(1)';
        });
        
        exitBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            stopZapper();
        });
        
        document.body.appendChild(exitBtn);
    }

    function removeZapExitButton() {
        const exitBtn = document.getElementById('zap-exit-btn');
        if (exitBtn) {
            exitBtn.remove();
        }
    }

    async function loadInvertSettings() {
        currentHost = extractHost(window.location.href);
        if (!currentHost) return;
        
        const { invertSettings = {} } = await browser.storage.local.get('invertSettings');
        invertedElements = invertSettings[currentHost] || {};
        
        updateInvertStyles();
    }
    
    function updateInvertStyles() {
        let invertStyleElement = document.getElementById('element-invert-styles');
        if (!invertStyleElement) {
            invertStyleElement = document.createElement('style');
            invertStyleElement.id = 'element-invert-styles';
            document.head.appendChild(invertStyleElement);
        }
        
        let css = '';
        Object.keys(invertedElements).forEach(selector => {
            css += `${selector} { filter: invert(1) hue-rotate(180deg) !important; }\n`;
            css += `${selector} .invert-trash-icon { filter: invert(1) hue-rotate(180deg) !important; }\n`;
        });
        
        invertStyleElement.textContent = css;
        
        if (invertActive) {
            addInvertTrashIcons();
        }
    }

    async function saveInvertSettings() {
        currentHost = extractHost(window.location.href);
        if (!currentHost) return;
        
        const { invertSettings = {} } = await browser.storage.local.get('invertSettings');
        invertSettings[currentHost] = invertedElements;
        await browser.storage.local.set({ invertSettings });
        updateInvertStyles();
    }
    
    function startInvert() {
        if (invertActive) return;
        
        invertActive = true;
        document.body.style.cursor = 'crosshair';
        
        document.addEventListener('mouseover', handleInvertMouseOver, true);
        document.addEventListener('click', handleInvertClick, true);
        document.addEventListener('keydown', handleInvertKeyDown, true);
        
        createInvertExitButton();
        addInvertTrashIcons();
    }
    
    function stopInvert() {
        if (!invertActive) return;
        
        invertActive = false;
        document.body.style.cursor = originalCursor;
        
        if (hoveredElement) {
            hoveredElement.style.outline = originalOutline;
            hoveredElement.style.background = '';
            hoveredElement = null;
        }
        
        document.querySelectorAll('[style*="dashed"]').forEach(el => {
            if (el.style.outline.includes('dashed')) {
                el.style.outline = '';
                el.style.background = '';
            }
        });
        
        document.removeEventListener('mouseover', handleInvertMouseOver, true);
        document.removeEventListener('click', handleInvertClick, true);
        document.removeEventListener('keydown', handleInvertKeyDown, true);
        
        removeInvertExitButton();
        removeInvertTrashIcons();

        location.reload();
    }

    function addInvertTrashIcons() {
        document.querySelectorAll('.invert-trash-icon').forEach(icon => icon.remove());
        
        Object.keys(invertedElements).forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (element.querySelector('.invert-trash-icon')) return;
                    
                    const trashIcon = document.createElement('div');
                    trashIcon.className = 'invert-trash-icon';
                    trashIcon.innerHTML = '🌗';
                    trashIcon.title = 'Remove invert';
                    trashIcon.style.cssText = `
                        position: absolute !important;
                        top: 50% !important;
                        left: 50% !important;
                        transform: translate(-50%, -50%) !important;
                        font-size: 24px !important;
                        cursor: pointer !important;
                        z-index: 9999999 !important;
                        background: rgba(0, 0, 0, 0.7) !important;
                        border-radius: 50% !important;
                        width: 32px !important;
                        height: 32px !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        pointer-events: auto !important;
                        border: 3px solid ${OUTLINE_COLOR} !important;
                    `;
                    
                    trashIcon.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        await removeInvert(selector);
                    });
                    
                    element.appendChild(trashIcon);
                });
            } catch (e) {
                // console.error('Error adding invert trash icon for selector:', selector, e);
            }
        });
    }
    
    function removeInvertTrashIcons() {
        document.querySelectorAll('.invert-trash-icon').forEach(icon => icon.remove());
    }
    
    async function removeInvert(selector) {
        delete invertedElements[selector];
        await saveInvertSettings();
        
        try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.style.outline = '';
                const trashIcon = element.querySelector('.invert-trash-icon');
                if (trashIcon) {
                    trashIcon.remove();
                }
            });
        } catch (e) {
            // console.error('Error removing invert:', e);
        }
        
        updateInvertStyles();
    }

    async function loadInvertParentSettings() {
        currentHost = extractHost(window.location.href);
        if (!currentHost) return;
        
        const { invertParentSettings = {} } = await browser.storage.local.get('invertParentSettings');
        invertedParents = invertParentSettings[currentHost] || {};
        
        updateInvertParentStyles();
    }

    function updateInvertParentStyles() {
        let invertParentStyleElement = document.getElementById('element-invert-parent-styles');
        if (!invertParentStyleElement) {
            invertParentStyleElement = document.createElement('style');
            invertParentStyleElement.id = 'element-invert-parent-styles';
            document.head.appendChild(invertParentStyleElement);
        }
        
        let css = '';
        Object.keys(invertedParents).forEach(selector => {
            // Invert the parent
            css += `${selector} { filter: invert(1) hue-rotate(180deg) !important; }\n`;
            // Double-invert all direct children to restore them
            css += `${selector} > * { filter: invert(1) hue-rotate(180deg) !important; }\n`;
            // Keep trash icon visible
            css += `${selector} .invert-parent-trash-icon { filter: invert(1) hue-rotate(180deg) !important; }\n`;
        });
        
        invertParentStyleElement.textContent = css;
        
        if (invertParentActive) {
            addInvertParentTrashIcons();
        }
    }

    function updateInvertParentStyles() {
        let invertParentStyleElement = document.getElementById('element-invert-parent-styles');
        if (!invertParentStyleElement) {
            invertParentStyleElement = document.createElement('style');
            invertParentStyleElement.id = 'element-invert-parent-styles';
            document.head.appendChild(invertParentStyleElement);
        }
        
        let css = '';
        Object.keys(invertedParents).forEach(selector => {
            // Invert the parent
            css += `${selector} { filter: invert(1) hue-rotate(180deg) !important; }\n`;
            // Double-invert all direct children to restore them
            css += `${selector} > * { filter: invert(1) hue-rotate(180deg) !important; }\n`;
            // Keep trash icon visible
            css += `${selector} .invert-parent-trash-icon { filter: invert(1) hue-rotate(180deg) !important; }\n`;
        });
        
        invertParentStyleElement.textContent = css;
        
        if (invertParentActive) {
            addInvertParentTrashIcons();
        }
    }

    function startInvertParent() {
        if (invertParentActive) return;
        
        invertParentActive = true;
        document.body.style.cursor = 'crosshair';
        
        document.addEventListener('mouseover', handleInvertParentMouseOver, true);
        document.addEventListener('click', handleInvertParentClick, true);
        document.addEventListener('keydown', handleInvertParentKeyDown, true);
        
        createInvertParentExitButton();
        addInvertParentTrashIcons();
    }
    
    function stopInvertParent() {
        if (!invertParentActive) return;
        
        invertParentActive = false;
        document.body.style.cursor = originalCursor;
        
        if (hoveredElement) {
            hoveredElement.style.outline = originalOutline;
            hoveredElement.style.background = '';
            hoveredElement = null;
        }
        
        document.querySelectorAll('[style*="dashed"]').forEach(el => {
            if (el.style.outline.includes('dashed')) {
                el.style.outline = '';
                el.style.background = '';
            }
        });
        
        document.removeEventListener('mouseover', handleInvertParentMouseOver, true);
        document.removeEventListener('click', handleInvertParentClick, true);
        document.removeEventListener('keydown', handleInvertParentKeyDown, true);
        
        removeInvertParentExitButton();
        removeInvertParentTrashIcons();
    
        location.reload();
    }

    function handleInvertParentMouseOver(e) {
        if (!invertParentActive) return;
        
        if (e.target.id === 'invert-parent-exit-btn' || e.target.classList.contains('invert-parent-trash-icon')) {
            return;
        }
        
        e.stopPropagation();
        e.preventDefault();
        
        if (hoveredElement && hoveredElement !== e.target) {
            hoveredElement.style.outline = originalOutline;
            hoveredElement.style.background = '';
        }
        
        hoveredElement = e.target;
        originalOutline = hoveredElement.style.outline;
        hoveredElement.style.outline = `3px dashed ${OUTLINE_COLOR}`;
        hoveredElement.style.background = 'rgba(255, 0, 0, 0.2)';
    }
    
    async function handleInvertParentClick(e) {
        if (!invertParentActive) return;
        
        if (e.target.classList.contains('invert-parent-trash-icon') || e.target.id === 'invert-parent-exit-btn') {
            return;
        }
        
        e.stopPropagation();
        e.preventDefault();
        
        if (hoveredElement) {
            hoveredElement.style.outline = originalOutline;
            
            const selector = getElementSelector(hoveredElement);
            
            if (invertedParents[selector]) {
                delete invertedParents[selector];
            } else {
                invertedParents[selector] = true;
            }
            
            hoveredElement = null;
            
            await saveInvertParentSettings();
            updateInvertParentStyles();
        }
    }
    
    function handleInvertParentKeyDown(e) {
        if (e.key === 'Escape') {
            stopInvertParent();
        }
    }

    function addInvertParentTrashIcons() {
        document.querySelectorAll('.invert-parent-trash-icon').forEach(icon => icon.remove());
        
        Object.keys(invertedParents).forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (element.querySelector('.invert-parent-trash-icon')) return;
                    
                    const trashIcon = document.createElement('div');
                    trashIcon.className = 'invert-parent-trash-icon';
                    trashIcon.innerHTML = '🌒';
                    trashIcon.title = 'Remove parent invert';
                    trashIcon.style.cssText = `
                        position: absolute !important;
                        top: 50% !important;
                        left: 50% !important;
                        transform: translate(-50%, -50%) !important;
                        font-size: 24px !important;
                        cursor: pointer !important;
                        z-index: 9999999 !important;
                        background: rgba(0, 0, 0, 0.7) !important;
                        border-radius: 50% !important;
                        width: 32px !important;
                        height: 32px !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        pointer-events: auto !important;
                        border: 3px solid ${OUTLINE_COLOR} !important;
                    `;
                    
                    trashIcon.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        await removeInvertParent(selector);
                    });
                    
                    element.appendChild(trashIcon);
                });
            } catch (e) {
                // console.error('Error adding invert parent trash icon for selector:', selector, e);
            }
        });
    }
    
    function removeInvertParentTrashIcons() {
        document.querySelectorAll('.invert-parent-trash-icon').forEach(icon => icon.remove());
    }
    
    async function removeInvertParent(selector) {
        delete invertedParents[selector];
        await saveInvertParentSettings();
        
        try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.style.outline = '';
                const trashIcon = element.querySelector('.invert-parent-trash-icon');
                if (trashIcon) {
                    trashIcon.remove();
                }
            });
        } catch (e) {
            // console.error('Error removing parent invert:', e);
        }
        
        updateInvertParentStyles();
    }

    function createInvertParentExitButton() {
        const existingBtn = document.getElementById('invert-parent-exit-btn');
        if (existingBtn) return;
        
        const exitBtn = document.createElement('div');
        exitBtn.id = 'invert-parent-exit-btn';
        exitBtn.innerHTML = '🌒';
        exitBtn.title = 'ESC to exit';
        exitBtn.style.cssText = `
            position: fixed !important;
            top: 50% !important;
            right: 20px !important;
            transform: translateY(-50%) !important;
            font-size: 48px !important;
            cursor: pointer !important;
            z-index: 99999999 !important;
            background: transparent !important;
            border-radius: 50% !important;
            width: 70px !important;
            height: 70px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: all 0.2s !important;
        `;
        
        exitBtn.addEventListener('mouseenter', () => {
            exitBtn.style.transform = 'translateY(-50%) scale(1.2)';
        });
        
        exitBtn.addEventListener('mouseleave', () => {
            exitBtn.style.transform = 'translateY(-50%) scale(1)';
        });
        
        exitBtn.addEventListener('click', () => {
            stopInvertParent();
        });
        
        document.body.appendChild(exitBtn);
    }
    
    function removeInvertParentExitButton() {
        const exitBtn = document.getElementById('invert-parent-exit-btn');
        if (exitBtn) {
            exitBtn.remove();
        }
    }

    async function saveInvertParentSettings() {
        currentHost = extractHost(window.location.href);
        if (!currentHost) return;
        
        const { invertParentSettings = {} } = await browser.storage.local.get('invertParentSettings');
        invertParentSettings[currentHost] = invertedParents;
        await browser.storage.local.set({ invertParentSettings });
        updateInvertParentStyles();
    }
    
    function handleInvertMouseOver(e) {
        if (!invertActive) return;
        
        if (e.target.id === 'invert-exit-btn' || e.target.classList.contains('invert-trash-icon')) {
            return;
        }
        
        e.stopPropagation();
        e.preventDefault();
        
        if (hoveredElement && hoveredElement !== e.target) {
            hoveredElement.style.outline = originalOutline;
            hoveredElement.style.background = '';
        }
        
        hoveredElement = e.target;
        originalOutline = hoveredElement.style.outline;
        hoveredElement.style.outline = `3px dashed ${OUTLINE_COLOR}`;
        hoveredElement.style.background = 'rgba(255, 0, 0, 0.2)';
    }
    
    async function handleInvertClick(e) {
        if (!invertActive) return;
        
        if (e.target.classList.contains('invert-trash-icon') || e.target.id === 'invert-exit-btn') {
            return;
        }
        
        e.stopPropagation();
        e.preventDefault();
        
        if (hoveredElement) {
            hoveredElement.style.outline = originalOutline;
            
            const selector = getElementSelector(hoveredElement);
            
            if (invertedElements[selector]) {
                delete invertedElements[selector];
            } else {
                invertedElements[selector] = true;
            }
            
            hoveredElement = null;
            
            await saveInvertSettings();
            updateInvertStyles();
        }
    }
    
    function handleInvertKeyDown(e) {
        if (e.key === 'Escape') {
            stopInvert();
        }
    }
    
    function createInvertExitButton() {
        const existingBtn = document.getElementById('invert-exit-btn');
        if (existingBtn) return;
        
        const exitBtn = document.createElement('div');
        exitBtn.id = 'invert-exit-btn';
        exitBtn.innerHTML = '🌗';
        exitBtn.title = 'ESC to exit';
        exitBtn.style.cssText = `
            position: fixed !important;
            top: 50% !important;
            right: 20px !important;
            transform: translateY(-50%) !important;
            font-size: 48px !important;
            cursor: pointer !important;
            z-index: 99999999 !important;
            background: transparent !important;
            border-radius: 50% !important;
            width: 70px !important;
            height: 70px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: all 0.2s !important;
        `;
        
        exitBtn.addEventListener('mouseenter', () => {
            exitBtn.style.transform = 'translateY(-50%) scale(1.2)';
        });
        
        exitBtn.addEventListener('mouseleave', () => {
            exitBtn.style.transform = 'translateY(-50%) scale(1)';
        });
        
        exitBtn.addEventListener('click', () => {
            stopInvert();
        });
        
        document.body.appendChild(exitBtn);
    }
    
    function removeInvertExitButton() {
        const exitBtn = document.getElementById('invert-exit-btn');
        if (exitBtn) {
            exitBtn.remove();
        }
    }

    function createEditExitButton() {
        const existingBtn = document.getElementById('edit-exit-btn');
        if (existingBtn) return;
        
        const exitBtn = document.createElement('div');
        exitBtn.id = 'edit-exit-btn';
        exitBtn.innerHTML = '✏️';
        exitBtn.title = 'ESC to exit';
        exitBtn.style.cssText = `
            position: fixed !important;
            top: 50% !important;
            right: 20px !important;
            transform: translateY(-50%) !important;
            font-size: 48px !important;
            cursor: pointer !important;
            z-index: 999999999 !important;
            background: transparent !important;
            border-radius: 50% !important;
            width: 70px !important;
            height: 70px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: all 0.2s !important;
            pointer-events: auto !important;
        `;
        
        exitBtn.addEventListener('mouseenter', () => {
            exitBtn.style.transform = 'translateY(-50%) scale(1.2)';
        });
        
        exitBtn.addEventListener('mouseleave', () => {
            exitBtn.style.transform = 'translateY(-50%) scale(1)';
        });
        
        exitBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            stopEditMode();
        });
        
        document.body.appendChild(exitBtn);
    }

    function removeEditExitButton() {
        const exitBtn = document.getElementById('edit-exit-btn');
        if (exitBtn) {
            exitBtn.remove();
        }
    }
    
    function startEditMode() {
        if (editMode) return;
        
        editMode = true;
        originalCursor = document.body.style.cursor;
        document.body.style.cursor = 'text';
        
        try {
            document.designMode = 'on';
        } catch (e) {
            // console.error('Error enabling design mode:', e);
        }
        
        document.querySelectorAll('a').forEach(link => {
            link.setAttribute('data-original-href', link.href);
            link.removeAttribute('href');
            link.style.cursor = 'text';
        });
        
        document.addEventListener('keydown', handleEditKeyDown, true);
        
        createEditExitButton();
    }
    
    function stopEditMode() {
        if (!editMode) return;
        
        editMode = false;
        document.body.style.cursor = originalCursor;
        
        try {
            document.designMode = 'off';
        } catch (e) {
            // console.error('Error disabling design mode:', e);
        }
        
        document.querySelectorAll('a[data-original-href]').forEach(link => {
            link.href = link.getAttribute('data-original-href');
            link.removeAttribute('data-original-href');
            link.style.cursor = '';
        });
        
        document.removeEventListener('keydown', handleEditKeyDown, true);
        
        removeEditExitButton();
    }

    function handleEditKeyDown(e) {
        if (e.key === 'Escape') {
            stopEditMode();
        }
    }

    browser.runtime.onMessage.addListener((message) => {
            if (message.action === 'startBlurPicker') {
                if (pickerActive) {
                    stopPicker();
                } else {
                    stopEditMode();
                    stopZapper();
                    stopInvert();
                    stopInvertParent();
                    startPicker();
                }
                return Promise.resolve({received: true});
            }
            
            if (message.action === 'startZapper') {
                if (zapperActive) {
                    stopZapper();
                } else {
                    stopPicker();
                    stopEditMode();
                    stopInvert();
                    stopInvertParent();
                    startZapper();
                }
                return Promise.resolve({received: true});
            }
            
            if (message.action === 'startEditMode') {
                if (editMode) {
                    stopEditMode();
                } else {
                    stopPicker();
                    stopZapper();
                    stopInvert();
                    stopInvertParent();
                    startEditMode();
                }
                return Promise.resolve({received: true});
            }
        
            if (message.action === 'startInvert') {
                if (invertActive) {
                    stopInvert();
                } else {
                    stopPicker();
                    stopZapper();
                    stopEditMode();
                    stopInvertParent();
                    startInvert();
                }
                return Promise.resolve({received: true});
            }
            
            if (message.action === 'startInvertParent') {
                if (invertParentActive) {
                    stopInvertParent();
                } else {
                    stopPicker();
                    stopZapper();
                    stopEditMode();
                    stopInvert();
                    startInvertParent();
                }
                return Promise.resolve({received: true});
            }
            
            if (message.action === 'clearAllBlurs') {
                blurredElements = {};
                if (styleElement) {
                    styleElement.textContent = '';
                }
                return Promise.resolve({received: true});
            }
            
            if (message.action === 'clearAllInverts') {
                invertedElements = {};
                const invertStyleElement = document.getElementById('element-invert-styles');
                if (invertStyleElement) {
                    invertStyleElement.textContent = '';
                }
                return Promise.resolve({received: true});
            }
            
            if (message.action === 'clearAllInvertParents') {
                invertedParents = {};
                const invertParentStyleElement = document.getElementById('element-invert-parent-styles');
                if (invertParentStyleElement) {
                    invertParentStyleElement.textContent = '';
                }
                return Promise.resolve({received: true});
            }
            
        });

    function startPicker() {
        if (pickerActive) return;
        
        pickerActive = true;
        document.body.style.cursor = 'crosshair';
        
        document.addEventListener('mouseover', handleMouseOver, true);
        document.addEventListener('click', handleClick, true);
        document.addEventListener('keydown', handleKeyDown, true);
        
        createExitButton();
        addTrashIcons();
    }
    
    function stopPicker() {
        if (!pickerActive) return;
        
        pickerActive = false;
        document.body.style.cursor = originalCursor;
        
        if (hoveredElement) {
            hoveredElement.style.outline = originalOutline;
            hoveredElement.style.background = '';
            hoveredElement = null;
        }
        
        document.querySelectorAll('[style*="dashed"]').forEach(el => {
            if (el.style.outline.includes('dashed')) {
                el.style.outline = '';
                el.style.background = '';
            }
        });
        
        document.removeEventListener('mouseover', handleMouseOver, true);
        document.removeEventListener('click', handleClick, true);
        document.removeEventListener('keydown', handleKeyDown, true);
        
        removeTrashIcons();
        removeExitButton();
    }
    
    function handleMouseOver(e) {
        if (!pickerActive) return;
        
        if (e.target.id === 'blur-exit-btn' || e.target.classList.contains('blur-trash-icon')) {
            return;
        }
        
        e.stopPropagation();
        e.preventDefault();
        
        if (hoveredElement && hoveredElement !== e.target) {
            hoveredElement.style.outline = originalOutline;
            hoveredElement.style.background = '';
        }
        
        hoveredElement = e.target;
        originalOutline = hoveredElement.style.outline;
        hoveredElement.style.outline = `3px dashed ${OUTLINE_COLOR}`;
        hoveredElement.style.background = 'rgba(255, 0, 0, 0.2)';
    }
    
    async function handleClick(e) {
        if (!pickerActive) return;
        
        if (e.target.classList.contains('blur-trash-icon') || e.target.id === 'blur-exit-btn') {
            return;
        }
        
        e.stopPropagation();
        e.preventDefault();
        
        if (hoveredElement) {
            await cycleBlur(hoveredElement);
            addTrashIcons();
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            stopPicker();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            loadBlurSettings();
            loadZapSettings();
            loadInvertSettings();
            loadInvertParentSettings();
        });
    } else {
        loadBlurSettings();
        loadZapSettings();
        loadInvertSettings();
        loadInvertParentSettings();
    }
})();
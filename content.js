let termOccurrenceCounts = {};
let currentHighlightIndex = {};
let highlightsByTerm = {};
let currentHighlights = [];
let pageSearchIndex = null;
let pageIndexData = [];

const highlightStyleEl = document.createElement('style');
highlightStyleEl.id = 'zoocage-highlight-pulse-styles';
highlightStyleEl.textContent = `
    mark.zoocage-highlight.current-match {
        outline: 3px solid #38d430 !important;
        z-index: 999999 !important;
        position: relative !important;
    }
`;
if (document.head) {
    document.head.appendChild(highlightStyleEl);
} else {
    const observer = new MutationObserver(() => {
        if (document.head) {
            observer.disconnect();
            document.head.appendChild(highlightStyleEl);
        }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
}

class ContentBlocker {
    constructor() {
        this.styleEl = document.createElement('style');
        this.darkModeStyleEl = document.createElement('style');
        this.darkModeStyleEl.id = 'zoocage-dark-mode';
        this.location = window.location.hostname;
        this.lastUrl = window.location.href;
        this.isApplying = false;
        
        this.cachedDarkModeEnabled = false;
        this.cachedSiteSettings = null;
        this.cachedGlobalSettings = {};
        this.settingsLoaded = false;
        
        if (document.head) {
            document.head.appendChild(this.styleEl);
            document.head.appendChild(this.darkModeStyleEl);
        } else {
            const observer = new MutationObserver(() => {
                if (document.head) {
                    observer.disconnect();
                    document.head.appendChild(this.styleEl);
                    document.head.appendChild(this.darkModeStyleEl);
                }
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
        }
        
        this.init();
    }

    async init() {
        await this.loadSettings();
        this.updateDarkMode();
        this.updateBlocking();
        this.initNavigationMonitoring();
        this.initDarkModeProtection();
        
        browser.storage.onChanged.addListener(() => {
            this.loadSettings();
            this.updateBlocking();
            this.updateDarkMode();
        });
    }

    async loadSettings() {
        const { darkModeEnabled = false, darkModeSettings = {} } = 
            await browser.storage.local.get(['darkModeEnabled', 'darkModeSettings']);
        
        this.cachedDarkModeEnabled = darkModeEnabled;
        this.cachedSiteSettings = darkModeSettings[this.location];
        this.cachedGlobalSettings = darkModeSettings.global || {};
        this.settingsLoaded = true;
    }

    handleNavigation() {
        if (!this.settingsLoaded) return;
        if (!this.cachedDarkModeEnabled) return;
        
        const spaFixEnabled = (this.cachedSiteSettings && this.cachedSiteSettings.spaFix === true) || 
                              (!this.cachedSiteSettings && this.cachedGlobalSettings.spaFix === true);
        
        if (!spaFixEnabled) return;
        
        if (!document.documentElement.classList.contains('dms-enabled')) {
            document.documentElement.classList.add('dms-enabled');
        }
    }

    initNavigationMonitoring() {
        const checkNavigation = () => {
            if (this.lastUrl !== window.location.href) {
                const oldLocation = this.location;
                this.lastUrl = window.location.href;
                this.location = window.location.hostname;
                
                if (oldLocation === this.location) {
                    this.handleNavigation();
                }
            }
        };
        
        setInterval(checkNavigation, 500);
        
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            setTimeout(checkNavigation, 0);
        };
        
        history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            setTimeout(checkNavigation, 0);
        };

        document.addEventListener('turbo:load', () => {
            checkNavigation();
        });
        
        document.addEventListener('turbo:render', () => {
            checkNavigation();
        });
        
        window.addEventListener('popstate', checkNavigation);
        window.addEventListener('hashchange', checkNavigation);
    }

    async initDarkModeProtection() {
        if (!this.settingsLoaded) {
            await this.loadSettings();
        }
        
        const spaFixEnabled = (this.cachedSiteSettings && this.cachedSiteSettings.spaFix === true) || 
                              (!this.cachedSiteSettings && this.cachedGlobalSettings.spaFix === true);
        
        const needsProtection = this.cachedDarkModeEnabled && spaFixEnabled;        
        
        const styleObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    mutation.removedNodes.forEach(node => {
                        if (node === this.darkModeStyleEl || node.id === 'zoocage-dark-mode') {
                            if (document.head && !document.head.contains(this.darkModeStyleEl)) {
                                document.head.appendChild(this.darkModeStyleEl);
                            }
                        }
                    });
                }
            }
        });
        
        if (document.head) {
            styleObserver.observe(document.head, { childList: true });
        }
        
        if (needsProtection) {
            const classObserver = new MutationObserver(() => {
                if (!document.documentElement.classList.contains('dms-enabled')) {
                    document.documentElement.classList.add('dms-enabled');
                }
            });
            
            classObserver.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['class']
            });
            
            if (this.cachedDarkModeEnabled && this.cachedSiteSettings?.enabled !== false) {
                document.documentElement.classList.add('dms-enabled');
            }
        }
    }

    async updateBlocking() {
        const { globalBlockingEnabled = false, blockSettings = {} } = 
            await browser.storage.local.get(['globalBlockingEnabled', 'blockSettings']);
        
        if (!globalBlockingEnabled) {
            this.styleEl.textContent = '';
            return;
        }
        
        const isLocalFile = window.location.protocol === 'file:';
        
        let settings;
        if (isLocalFile) {
            settings = blockSettings['local-files'] || blockSettings.global || {
                blockImages: false,
                blockSVG: false
            };
        } else {
            settings = blockSettings[this.location] || blockSettings.global || {
                blockImages: false,
                blockSVG: false
            };
        }
        
        let css = '';
        
        if (settings.blockImages) {
            css += `
                img { display: none !important; }
                * { background-image: none !important; }
            `;
        }
        
        if (settings.blockSVG) {
            css += `svg { display: none !important; }`;
        }
        
        this.styleEl.textContent = css;
    }

    async updateDarkMode() {
        const { darkModeEnabled = false, darkModeSettings = {} } = 
            await browser.storage.local.get(['darkModeEnabled', 'darkModeSettings']);
        
        const isLocalFile = window.location.protocol === 'file:';
        const isExtensionPage = window.location.protocol === 'moz-extension:';
        
        let siteSettings;
        if (isLocalFile || isExtensionPage) {
            siteSettings = darkModeSettings['local-files'];
        } else {
            siteSettings = darkModeSettings[this.location];
        }
        
        if (siteSettings !== undefined) {
            if (siteSettings.enabled === false) {
                document.documentElement.classList.remove('dms-enabled');
                this.darkModeStyleEl.textContent = '';
                return;
            }
            
            if (siteSettings.enabled === true) {
                if (this.isYouTube()) {
                    this.darkModeStyleEl.textContent = this.getYouTubeDarkCSS();
                } else {
                    this.darkModeStyleEl.textContent = this.generateDarkCSS(siteSettings);
                }
                document.documentElement.classList.add('dms-enabled');
                if (siteSettings.invertMaybe) {
                    this.initInvertMaybe();
                }
                return;
            }
        }
        
        if (!darkModeEnabled) {
            document.documentElement.classList.remove('dms-enabled');
            this.darkModeStyleEl.textContent = '';
            return;
        }
        
        const globalSettings = darkModeSettings.global || {
            preserveImages: true,
            invertMaybe: false,
            spaFix: false
        };
        
        if (this.isYouTube()) {
            this.darkModeStyleEl.textContent = this.getYouTubeDarkCSS();
        } else {
            this.darkModeStyleEl.textContent = this.generateDarkCSS(globalSettings);
        }
        document.documentElement.classList.add('dms-enabled');
        if (globalSettings.invertMaybe) {
            this.initInvertMaybe();
        }
    }

    isYouTube() {
        return this.location.includes('youtube.com') || this.location.includes('youtu.be');
    }

    generateDarkCSS(settings) {
        let css = 'html.dms-enabled { filter: invert(100%) hue-rotate(180deg) !important; }';
        
        css += 'html { transition: filter 0.15s ease-in-out; }';
        
        const selectors = [];
        
        if (settings.preserveImages) {
            selectors.push('img', '[style*="background-image"]', '[style*="background:url"]');
        }
        
        selectors.push('video', 'iframe[src*="youtube"]', 'iframe[src*="vimeo"]', '.video-player');
        
        if (settings.invertMaybe) {
            selectors.push('.dms-preserve');
        }
        
        selectors.push('.zoocage-highlight', 'mark.zoocage-highlight');
        
        if (selectors.length > 0) {
            css += `html.dms-enabled ${selectors.join(', html.dms-enabled ')} {
                filter: invert(100%) hue-rotate(180deg) !important;
            }`;
        }
        
        return css;
    }

    getYouTubeDarkCSS() {
        return `
            ytd-app, #content, #page-manager, ytd-watch, ytd-browse, 
            #channel-container #channel-header, ytd-multi-page-menu-renderer, 
            #page-manager ytd-browse ytd-playlist-sidebar-renderer,
            #page-manager ytd-section-list-renderer#primary #contents ytd-item-section-renderer #contents,
            #page-manager ytd-browse #alerts, #page-manager ytd-section-list-renderer#primary #contents,
            ytd-watch-flexy, ytd-section-list-renderer#primary, ytd-playlist-video-renderer,
            ytd-video-renderer, #card.ytd-miniplayer, ytd-section-list-renderer,
            #secondary, #masthead-container, #guide-container, #guide-content, #primary,
            paper-dialog[role=dialog], paper-listbox#menu, ytd-mini-guide-renderer,
            ytd-mini-guide-entry-renderer, ytd-rich-metadata-row-renderer, #columns,
            ytd-post-renderer, ytd-comments, ytd-comment-thread-renderer, ytd-comment-replies-renderer,
            ytd-comment-renderer, ytd-commentbox, ytd-video-secondary-info-renderer,
            ytd-video-primary-info-renderer, ytd-playlist-panel-renderer, ytd-playlist-panel-video-renderer,
            ytd-backstage-post-renderer, ytd-notification-renderer, ytd-popup-container,
            #chips-wrapper, iron-selector#chips, yt-chip-cloud-chip-renderer,
            frosted-glass.with-chipbar.ytd-app, .ytSearchboxComponentInputBox,
            ytd-feed-filter-chip-bar-renderer, #chips-content, #page-header, ytd-tabbed-page-header, 
            yt-page-header-renderer, div#tabs-inner-container.style-scope.ytd-tabbed-page-header, 
            div#page-header-banner.style-scope.ytd-tabbed-page-header, 
            div#background.style-scope.tp-yt-app-header, button.ytSearchboxComponentSearchButton, 
            div#i0.ytSearchboxComponentSuggestionsContainer.ytSearchboxComponentSuggestionsContainerScrollable,
            div#page-header-container.style-scope.ytd-tabbed-page-header, 
            tp-yt-app-header#header.style-scope.ytd-tabbed-page-header, div#i1.ytSearchboxComponentSuggestionsContainer.ytSearchboxComponentSuggestionsContainerScrollable, div#content-wrapper.style-scope.ytd-feed-nudge-renderer, div#contents.style-scope.yt-live-chat-renderer, tp-yt-iron-pages#content-pages.style-scope.yt-live-chat-renderer, div#above-the-fold.style-scope.ytd-watch-metadata div#bottom-row.style-scope.ytd-watch-metadata div#description.item.style-scope.ytd-watch-metadata
            {
                background: #1a1a1a !important;
                color: #959595 !important;
            }
            body *, a:link, a:visited { color: #959595 !important; }
            a:hover { color: orange !important; }
            ytd-masthead#masthead {
                border-bottom: 1px solid #262525 !important;
                background: #1a1a1a !important;
            }
            *::-webkit-scrollbar { background-color: #1a1a1a; }
            *::-webkit-scrollbar-thumb { background: darkgray; }
        `;
    }

    initInvertMaybe() {
        if (this.invertMaybeObserver) return;
        
        if (!document.body) {
            const bodyObserver = new MutationObserver(() => {
                if (document.body) {
                    bodyObserver.disconnect();
                    this.initInvertMaybe();
                }
            });
            bodyObserver.observe(document.documentElement, { childList: true });
            return;
        }
        
        this.invertMaybeObserver = new MutationObserver((mutations) => {
            if (!document.documentElement.classList.contains('dms-enabled')) return;
            
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        this.processElement(node);
                        node.querySelectorAll('*').forEach(el => this.processElement(el));
                    }
                });
            });
        });
        
        this.invertMaybeObserver.observe(document.body, { childList: true, subtree: true });
        document.querySelectorAll('*').forEach(el => this.processElement(el));
    }
    
    processElement(element) {
        if (!element || !element.tagName) return;
        if (['HTML', 'HEAD', 'STYLE', 'SCRIPT', 'META', 'LINK'].includes(element.tagName)) return;
        
        try {
            const style = window.getComputedStyle(element);
            const bg = style.backgroundColor;
            const color = style.color;
            
            if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
                if (this.isDark(bg)) {
                    element.classList.add('dms-preserve');
                    return;
                }
            }
            
            if (color && bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
                const textIsDark = this.isDark(color);
                const bgIsLight = !this.isDark(bg);
                
                if (textIsDark && bgIsLight) {
                    return;
                }
            }
            
            if (element.tagName === 'DIV' || element.tagName === 'SECTION' || element.tagName === 'ARTICLE') {
                const hasMedia = element.querySelector('img, video, canvas');
                if (hasMedia && bg && this.isDark(bg)) {
                    element.classList.add('dms-preserve');
                }
            }
            
        } catch (e) {}
    }
    
    isDark(color) {
        let r, g, b, a = 1;
        
        if (color.startsWith('rgb')) {
            const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
            if (match) {
                [, r, g, b, a] = match.map(Number);
                if (a === undefined) a = 1;
            }
        } else if (color.startsWith('#')) {
            let hex = color.substring(1);
            if (hex.length === 3) {
                hex = hex.split('').map(c => c + c).join('');
            }
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        }
        
        if (a === 0) return false;
        
        const luminance = (r * 299 + g * 587 + b * 114) / 1000;
        return luminance < 140; 
    }
}

new ContentBlocker();

browser.runtime.onMessage.addListener((request) => {
    if (request.action === 'updateDarkMode') {
        location.reload();
    }
});

function initHoverZoom() {
    let zoomedImg = null;
    let isEnabled = false;
    let currentImg = null;
    let isRemoving = false;

    function getBestImageSrc(img) {
        const picture = img.closest('picture');
        if (picture) {
            const sources = Array.from(picture.querySelectorAll('source'));
            if (sources.length > 0) {
                const bestSource = sources[sources.length - 1];
                const srcset = bestSource.getAttribute('srcset');
                if (srcset) {
                    const urls = srcset.split(',').map(s => s.trim().split(' ')[0]);
                    return urls[urls.length - 1] || img.src;
                }
            }
        }
        
        if (img.srcset) {
            const urls = img.srcset.split(',').map(s => s.trim().split(' ')[0]);
            return urls[urls.length - 1] || img.src;
        }
        
        if (img.dataset && img.dataset.src) {
            return img.dataset.src;
        }
        
        const src = img.getAttribute('src');
        
        if (src && src.includes('amazon')) {
            if (src.includes('._AC_')) {
                return src.replace(/\._AC_[^.]+\./, '._AC_SL1500_.');
            }
            if (src.includes('._SX') || src.includes('._SY')) {
                return src.replace(/\._S[XY]\d+_\./, '._AC_SL1500_.');
            }
        }
        
        if (src && src.includes('q%3D80')) {
            return src.replace('q%3D80', 'q%3D100').replace('m%3D1024', 'm%3D2048');
        }
        
        return img.src;
    }

    function createZoom(img, e) {
        if (currentImg === img && zoomedImg && document.body.contains(zoomedImg)) return;
        
        removeZoom();

        currentImg = img;
        zoomedImg = document.createElement('img');
        zoomedImg.src = getBestImageSrc(img);
        zoomedImg.className = 'zoocage-hover-zoom';
        zoomedImg.style.cssText = `
            position: fixed !important;
            z-index: 2147483647 !important;
            pointer-events: none !important;
            max-width: 90vw !important;
            max-height: 90vh !important;
            border: 2px solid rgba(255,255,255,0.5) !important;
            box-shadow: 0 0 20px rgba(0,0,0,0.5) !important;
            object-fit: contain !important;
        `;
        
        document.querySelectorAll('.zoocage-hover-zoom').forEach(el => el.remove());
        
        document.body.appendChild(zoomedImg);
        updatePos(e);
    }

    function updatePos(e) {
        if (!zoomedImg) return;
        if (!zoomedImg.complete) {
            zoomedImg.onload = () => updatePos(e);
            return;
        }

        const rect = zoomedImg.getBoundingClientRect();
        let left = e.clientX + 20;
        let top = e.clientY + 20;

        if (left + rect.width > window.innerWidth) left = e.clientX - rect.width - 20;
        if (top + rect.height > window.innerHeight) top = e.clientY - rect.height - 20;

        zoomedImg.style.left = Math.max(10, left) + 'px';
        zoomedImg.style.top = Math.max(10, top) + 'px';
    }

    function removeZoom() {
        if (isRemoving) return;
        isRemoving = true;
        
        if (zoomedImg && zoomedImg.parentNode) {
            zoomedImg.remove();
        }
        zoomedImg = null;
        currentImg = null;
        
        document.querySelectorAll('.zoocage-hover-zoom').forEach(el => el.remove());
        
        setTimeout(() => {
            isRemoving = false;
        }, 50);
    }

    function handleEnter(e) {
        if (!isEnabled) return;
        const img = e.target;
        if (img.tagName !== 'IMG') return;
        
        const picture = img.closest('picture');
        const isAmazonThumb = img.closest('.s-product-image-container, .a-dynamic-image-container') !== null;
        
        let minSize = picture ? 50 : 100;
        if (isAmazonThumb) {
            minSize = 50;
        }
        
        const actualWidth = img.naturalWidth || img.width;
        const actualHeight = img.naturalHeight || img.height;
        
        if (actualWidth <= minSize || actualHeight <= minSize) return;
        
        createZoom(img, e);
    }

    function handleMove(e) {
        if (!isEnabled || !zoomedImg) return;
        
        const target = e.target;
        if (target && target.tagName === 'IMG' && target === currentImg) {
            updatePos(e);
        } else if (!currentImg || !document.contains(currentImg)) {
            removeZoom();
        } else {
            const rect = currentImg.getBoundingClientRect();
            const isOverOriginal = e.clientX >= rect.left && 
                                   e.clientX <= rect.right && 
                                   e.clientY >= rect.top && 
                                   e.clientY <= rect.bottom;
            
            if (!isOverOriginal) {
                removeZoom();
            } else {
                updatePos(e);
            }
        }
    }

    function handleLeave(e) {
        if (!isEnabled) return;
        
        if (e.target === currentImg) {
            setTimeout(() => {
                if (!currentImg) return;
                
                const rect = currentImg.getBoundingClientRect();
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                const isStillOver = mouseX >= rect.left && 
                                    mouseX <= rect.right && 
                                    mouseY >= rect.top && 
                                    mouseY <= rect.bottom;
                
                if (!isStillOver && currentImg === e.target) {
                    removeZoom();
                }
            }, 100);
        }
    }

    async function updateState() {
        const { hoverZoomEnabled = false } = await browser.storage.local.get('hoverZoomEnabled');
        
        if (hoverZoomEnabled && !isEnabled) {
            isEnabled = true;
            document.addEventListener('mouseenter', handleEnter, true);
            document.addEventListener('mousemove', handleMove, true);
            document.addEventListener('mouseleave', handleLeave, true);
        } else if (!hoverZoomEnabled && isEnabled) {
            isEnabled = false;
            removeZoom();
            document.removeEventListener('mouseenter', handleEnter, true);
            document.removeEventListener('mousemove', handleMove, true);
            document.removeEventListener('mouseleave', handleLeave, true);
        }
    }

    browser.storage.onChanged.addListener((changes) => {
        if (changes.hoverZoomEnabled) updateState();
    });

    updateState();
}

initHoverZoom();

(function initRightClick() {
    let enabled = false;
    
    function enable() {
        if (enabled) return;
        enabled = true;
        document.addEventListener('contextmenu', (e) => e.stopPropagation(), true);
    }
    
    function disable() {
        enabled = false;
    }
    
    async function update() {
        const { rightClickAllowed = [] } = await browser.storage.local.get('rightClickAllowed');
        
        if (rightClickAllowed.includes(window.location.hostname)) {
            enable();
        } else {
            disable();
        }
    }
    
    browser.storage.onChanged.addListener((changes) => {
        if (changes.rightClickAllowed) update();
    });
    
    update();
})();

function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function buildSearchIndex() {
    pageSearchIndex = new MiniSearch({
        fields: ['content'],
        storeFields: ['content', 'node'],
        searchOptions: {
            boost: { content: 2 },
            fuzzy: 0.2,
            prefix: true,
            combineWith: 'AND'
        }
    });
    
    pageIndexData = [];
    
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function(node) {
                if (!node.parentElement) return NodeFilter.FILTER_REJECT;
                
                if (node.parentElement.tagName === 'SCRIPT' || 
                    node.parentElement.tagName === 'STYLE' ||
                    node.parentElement.tagName === 'NOSCRIPT' ||
                    node.parentElement.classList.contains('zoocage-highlight')) {
                    return NodeFilter.FILTER_REJECT;
                }
                
                if (node.parentElement.tagName === 'MARK') {
                    return NodeFilter.FILTER_REJECT;
                }
                
                if (node.textContent.trim().length === 0) {
                    return NodeFilter.FILTER_REJECT;
                }
                
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );
    
    let id = 0;
    let node;
    const documents = [];
    
    while (node = walker.nextNode()) {
        const data = {
            id: id++,
            content: node.textContent,
            node: node
        };
        pageIndexData.push(data);
        documents.push(data);
    }
    
    pageSearchIndex.addAll(documents);
    
}

function highlightMultipleTerms(terms, colors, diacriticsEnabled = true) {
    termOccurrenceCounts = {};
    highlightsByTerm = {};
    
    if (!pageSearchIndex || pageIndexData.length === 0) {
        buildSearchIndex();
    }
    
    let styleTag = document.getElementById('zoocage-highlight-styles');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'zoocage-highlight-styles';
        document.head.appendChild(styleTag);
    }
    
    let css = '';
    colors.forEach((color, i) => {
        const textColor = getContrastColor(color);
        css += `.zoocage-hl-${i} { background-color: ${color} !important; color: ${textColor} !important; }\n`;
    });
    styleTag.textContent = css;
    
    const exactPhraseTerms = new Set();
    const termDataMap = new Map();
    
    terms.forEach((term, termIndex) => {
        const colorIndex = termIndex % colors.length;
        let searchTerm = term;
        let isExactPhrase = false;
        
        const phraseMatch = term.match(/^"(.+)"$/);
        if (phraseMatch) {
            searchTerm = phraseMatch[1];
            isExactPhrase = true;
            exactPhraseTerms.add(searchTerm.toLowerCase());
        }
        
        termDataMap.set(term, {
            term: searchTerm,
            fullTerm: term,
            termIndex: termIndex,
            colorIndex: colorIndex,
            isExactPhrase: isExactPhrase
        });
    });
    
    const nodesToProcess = new Map();
    
    if (window.zoocageCJKMode) {
        
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    if (!node.parentElement) return NodeFilter.FILTER_REJECT;
                    
                    if (node.parentElement.tagName === 'SCRIPT' || 
                        node.parentElement.tagName === 'STYLE' ||
                        node.parentElement.tagName === 'NOSCRIPT' ||
                        node.parentElement.classList.contains('zoocage-highlight')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    
                    if (node.parentElement.tagName === 'MARK') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    
                    if (node.textContent.trim().length === 0) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );
        
        let node;
        while (node = walker.nextNode()) {
            const text = node.textContent;
            
            terms.forEach(term => {
                const termData = termDataMap.get(term);
                const searchTerm = termData.term;
                
                if (text.includes(searchTerm)) {
                    if (!nodesToProcess.has(node)) {
                        nodesToProcess.set(node, []);
                    }
                    nodesToProcess.get(node).push({
                        term: searchTerm,
                        fullTerm: termData.fullTerm,
                        termIndex: termData.termIndex,
                        colorIndex: termData.colorIndex,
                        isExactPhrase: termData.isExactPhrase,
                        hasExactPhraseVersion: !termData.isExactPhrase && exactPhraseTerms.has(searchTerm.toLowerCase())
                    });
                }
            });
        }
        
        
    } else {
        terms.forEach(term => {
            const termData = termDataMap.get(term);
            const normalizedTerm = diacriticsEnabled ? termData.term : normalizeDiacritics(termData.term);
            
            let results;
            
            if (termData.isExactPhrase) {
                results = pageSearchIndex.search(normalizedTerm, {
                    prefix: false,
                    fuzzy: false,
                    combineWith: 'AND'
                });
            } else {
                results = pageSearchIndex.search(normalizedTerm, {
                    prefix: true,
                    fuzzy: 0.2
                });
            }
            
            if (results && results.length > 0) {
                results.forEach(result => {
                    const data = pageIndexData[result.id];
                    if (data && data.node) {
                        if (!nodesToProcess.has(data.node)) {
                            nodesToProcess.set(data.node, []);
                        }
                        nodesToProcess.get(data.node).push({
                            term: normalizedTerm,
                            fullTerm: termData.fullTerm,
                            termIndex: termData.termIndex,
                            colorIndex: termData.colorIndex,
                            isExactPhrase: termData.isExactPhrase,
                            hasExactPhraseVersion: !termData.isExactPhrase && exactPhraseTerms.has(normalizedTerm.toLowerCase())
                        });
                    }
                });
            }
        });
    }
    
    nodesToProcess.forEach((termsData, textNode) => {
        try {
            const originalText = textNode.textContent;
            const searchText = diacriticsEnabled ? originalText : normalizeDiacritics(originalText);
            const allMatches = [];
            
            termsData.forEach(termData => {
                let regex;
                
                const isCJKTerm = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\u3400-\u4dbf\uac00-\ud7af]/.test(termData.term);
                
                if (termData.isExactPhrase) {
                    const escapedTerm = escapeRegex(termData.term);
                    if (isCJKTerm) {
                        regex = new RegExp(`(${escapedTerm})`, 'gi');
                    } else {
                        if (window.zoocageCJKMode) {
                            regex = new RegExp(`(?<!\\w)(${escapedTerm})(?!\\w)`, 'gi');
                        } else {
                            regex = new RegExp('\\b(' + escapedTerm + ')\\b', 'gi');
                        }
                    }
                } else {
                    const escapedTerm = escapeRegex(termData.term);
                    if (window.zoocageCJKMode && isCJKTerm) {
                        regex = new RegExp(`(${escapedTerm})`, 'gi');
                    } else if (window.zoocageCJKMode && !isCJKTerm) {
                        regex = new RegExp(`(?<!\\w)(${escapedTerm})(?!\\w)`, 'gi');
                    } else {
                        regex = new RegExp('\\b(\\w*' + escapedTerm + '\\w*)\\b', 'gi');
                    }
                }
                
                let match;
                
                while ((match = regex.exec(searchText)) !== null) {
                    let startPos = match.index;
                    let endPos = match.index + match[0].length;
                    let matchText = originalText.substring(startPos, endPos);
                    
                    if (termData.isExactPhrase) {
                        const fullNodeText = originalText;
                        
                        if (fullNodeText.length > matchText.length) {
                            const charAfter = endPos < fullNodeText.length ? fullNodeText[endPos] : '';
                            
                            if (/[a-zA-Z]/.test(charAfter)) {
                                continue;
                            }
                            
                            if ((charAfter === "'" || charAfter === "'") && 
                                endPos + 1 < fullNodeText.length && 
                                /[sS]/.test(fullNodeText[endPos + 1])) {
                                continue;
                            }
                        } else {
                            const exactMatch = fullNodeText.toLowerCase() === termData.term.toLowerCase();
                            
                            if (!exactMatch) {
                                continue;
                            }
                        }
                    }
                    
                    if (termData.hasExactPhraseVersion) {
                        const beforeChar = startPos > 0 ? searchText[startPos - 1] : ' ';
                        const afterChar = endPos < searchText.length ? searchText[endPos] : ' ';
                        const isWholeWord = !/\w/.test(beforeChar) && !/\w/.test(afterChar);
                        
                        if (isWholeWord) {
                            continue;
                        }
                    }
                    
                    const trimmed = matchText.replace(/[.!?,;:]+$/, '');
                    if (trimmed.length < matchText.length) {
                        endPos = startPos + trimmed.length;
                        matchText = trimmed;
                    }
                    
                    allMatches.push({
                        start: startPos,
                        end: endPos,
                        text: matchText,
                        colorIndex: termData.colorIndex,
                        termIndex: termData.termIndex,
                        fullTerm: termData.fullTerm,
                        isExactPhrase: termData.isExactPhrase
                    });
                }
            });
            
            if (allMatches.length === 0) return;
            
            allMatches.sort((a, b) => {
                if (a.isExactPhrase && !b.isExactPhrase) return -1;
                if (!a.isExactPhrase && b.isExactPhrase) return 1;
                if (a.start !== b.start) return a.start - b.start;
                return (b.end - b.start) - (a.end - a.start);
            });
            
            const nonOverlapping = [];
            let lastEnd = 0;
            
            for (const match of allMatches) {
                if (match.start >= lastEnd) {
                    nonOverlapping.push(match);
                    lastEnd = match.end;
                    termOccurrenceCounts[match.fullTerm] = (termOccurrenceCounts[match.fullTerm] || 0) + 1;
                }
            }
            
            let html = '';
            let lastIndex = 0;
            
            for (const match of nonOverlapping) {
                html += escapeHtml(originalText.substring(lastIndex, match.start));
                const escapedFullTerm = match.fullTerm.replace(/"/g, '&quot;');
                html += `<mark class="zoocage-highlight zoocage-hl-${match.colorIndex}" data-term-index="${match.termIndex}" data-full-term="${escapedFullTerm}">${escapeHtml(match.text)}</mark>`;
                lastIndex = match.end;
            }
            
            html += escapeHtml(originalText.substring(lastIndex));
            
            const span = document.createElement('span');
            span.innerHTML = html;
            
            if (textNode.parentNode) {
                textNode.parentNode.replaceChild(span, textNode);
                currentHighlights.push(span);
            }
        } catch (error) {
            console.error('Highlighting error:', error);
        }
    });

    highlightsByTerm = {};
    currentHighlightIndex = {};
    
    document.querySelectorAll('.zoocage-highlight').forEach(mark => {
        const fullTerm = mark.getAttribute('data-full-term');
        
        if (fullTerm) {
            if (!highlightsByTerm[fullTerm]) {
                highlightsByTerm[fullTerm] = [];
            }
            highlightsByTerm[fullTerm].push(mark);
        }
    });
    
}

function clearAllHighlights() {
    currentHighlights.forEach(span => {
        const parent = span.parentNode;
        if (parent) {
            const textNode = document.createTextNode(span.textContent);
            parent.replaceChild(textNode, span);
        }
    });
    currentHighlights = [];
    
    document.querySelectorAll('.zoocage-highlight').forEach(mark => {
        const parent = mark.parentNode;
        if (parent) {
            const textNode = document.createTextNode(mark.textContent);
            parent.replaceChild(textNode, mark);
        }
    });
    
    const styleTag = document.getElementById('zoocage-highlight-styles');
    if (styleTag) {
        styleTag.remove();
    }
    
    pageSearchIndex = null;
    pageIndexData = [];
    currentHighlightIndex = {}; 
    highlightsByTerm = {};
}

function jumpToNextHighlight(term) {
    
    let termMarks = highlightsByTerm[term];
    
    if (!termMarks || termMarks.length === 0) {
        termMarks = [];
        document.querySelectorAll('.zoocage-highlight').forEach(mark => {
            const fullTerm = mark.getAttribute('data-full-term');
            if (fullTerm === term) {
                termMarks.push(mark);
            }
        });
        
        if (termMarks.length > 0) {
            highlightsByTerm[term] = termMarks;
        }
    }
        
    if (termMarks.length === 0) {
        return;
    }
    
    if (currentHighlightIndex[term] === undefined) {
        currentHighlightIndex[term] = 0;
    } else {
        currentHighlightIndex[term] = (currentHighlightIndex[term] + 1) % termMarks.length;
    }
    
    const currentIndex = currentHighlightIndex[term];
    const currentMark = termMarks[currentIndex];
        
    scrollToHighlight(currentMark);
    
    browser.runtime.sendMessage({
        action: 'updateHighlightPosition',
        term: term,
        current: currentIndex + 1,
        total: termMarks.length
    });
}

function scrollToHighlight(mark) {
    document.querySelectorAll('mark.zoocage-highlight.current-match').forEach(el => {
        el.classList.remove('current-match');
    });
    
    mark.classList.add('current-match');
    
    mark.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    
    setTimeout(() => {
        mark.classList.remove('current-match');
    }, 5000);
}

function normalizeDiacritics(text) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function getContrastColor(hexColor) {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance > 0.5 ? '#000000' : '#EBEAE4';
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'highlightMultipleTerms') {
        window.zoocageCJKMode = message.cjkMode || false;
        
        clearAllHighlights();
        highlightMultipleTerms(message.terms, message.colors, message.diacriticsEnabled ?? true);
        sendResponse({ success: true });
        return true;
    }
    
    if (message.action === 'clearHighlights') {
        clearAllHighlights();
        sendResponse({ success: true });
        return true;
    }
    
    if (message.action === 'jumpToNextHighlight') {
        jumpToNextHighlight(message.term);
        sendResponse({ success: true });
        return true;
    }

    if (message.action === 'getHighlightCounts') {
        sendResponse({ counts: termOccurrenceCounts });
        return true;
    }
});

(async function initAutoHighlight() {
    const { 
        highlightEnabled = false, 
        highlightTerms = [], 
        highlightPaletteIndex = 0,
        diacriticsEnabled = true,
        cjkEnabled = false
    } = await browser.storage.local.get([
        'highlightEnabled', 
        'highlightTerms', 
        'highlightPaletteIndex',
        'diacriticsEnabled',
        'cjkEnabled'
    ]);
    
    if (!highlightEnabled || highlightTerms.length === 0) return;
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            applyHighlights(highlightTerms, highlightPaletteIndex);
        });
    } else {
        applyHighlights(highlightTerms, highlightPaletteIndex);
    }
})();

async function applyHighlights(terms, paletteIndex) {
    const { 
        diacriticsEnabled = true,
        cjkEnabled = false
    } = await browser.storage.local.get(['diacriticsEnabled', 'cjkEnabled']);
    
    const colorPalettes = [
    ["#00b9e5", "#38d430", "#e3e82b", "#ffab4d", "#ff3f3f", "#ef2bc1", "#bc13fe", "#a8a895", "#d4b896", "#f4e4a6"],
    ['#958AAA','#F7B169','#FFE5AC','#97B1C0','#047593','#47657f','#9aaaa0','#dcdbd9','#779482','#559d31','#bed7d1','#f2cd78','#bf9e71','#d88760','#bc6446','#87cffb','#4c9eed','#f2a45f','#f9d6a5','#c09a6c'],
    ['#a52e45','#2b5278','#61787b','#ead8b1','#bf5c45','#df97ac','#d25d8a','#cc1e4a','#aacc6c','#3b9953','#e8c8be','#d19d87','#c2734e','#d7be9f','#4c484f','#b36f32','#f9ae17','#ffd16c','#fffa90','#fdffcc'],
    ['#018da5','#80daeb','#67ddab','#0b9b8a','#909090','#f0c9ba','#ca8f7a','#c46f4d','#c86a58','#c64e2f','#FEF1C5','#F1C196','#B27D6A','#816460','#403F26','#ffa08a','#f5d980','#febdd8','#ee6d4a','#674c47'],
    ['#018da5','#80daeb','#67ddab','#0b9b8a','#909090','#f0c9ba','#ca8f7a','#c46f4d','#c86a58','#c64e2f','#FEF1C5','#F1C196','#B27D6A','#816460','#403F26','#ffa08a','#f5d980','#febdd8','#ee6d4a','#674c47'],
    ['#BB0216','#E68B37','#FDC504','#E3CBBF','#8E6E61','#8b86be','#deb0bd','#ecb761','#cbd690','#86abba','#c6b4d8','#cee0e6','#f0eae0','#f5c0bf','#ead4d4','#dfeaa6','#96b23c','#628d3d','#f2cedd','#665048'],
    ['#583E26','#A78B71','#F7C815','#EC9704','#9C4A1A','#EFCBB5','#D19277','#A1A18A','#969268','#615D4C','#91CCF1','#6CA2EE','#9A85E1','#AFA4DE','#FDF9DB','#8e65ab','#dc94b0','#e8c6de','#d3ba83','#bbc085'],
    ['#6168fc','#77b5ff','#ff349a','#81386a','#f8bdda','#0b9b8a','#1e6378','#efd96f','#f28e65','#f18788','#45859b','#d55769','#df7157','#ea9d8a','#b4ccd2','#dc97a9','#f2cb7c','#edaf88','#d3bfb6','#addad7'],
    ['#f59ac3','#bdfd6d','#96ded2','#ff9a66','#f8de7f','#f4c530','#f39abb','#e73245','#4169e2','#00a692','#315098','#8ca8be','#afbdb0','#e4c0be','#fbd0e0','#7c68ee','#c496ec','#e4d96f','#f2bfb5','#f08080'],
    ['#c34a5c','#eecbd1','#29425c','#bcd9b0','#9ea544','#fe705d','#ffb7c5','#6b59cd','#00cc99','#008081','#5c2c0c','#dda35d','#aa6231','#e3deca','#3c3a1e','#f8d964','#ff5aac','#a1dcc8','#ffcade','#7e657b'],
    ['#c4a378','#bf7031','#90ce67','#992f4e','#e8acd0','#805ea4','#bc6596','#fbc9c5','#f0e6ed','#9dd3f7','#a47b5b','#cbc0b6','#554945','#fc8468','#fcd8be','#9297c8','#ee7036','#f7cb9a','#f6c1a7','#b6c796'],
    ['#fae094','#f4c4c6','#a0daea','#a2d188','#d9bb97','#e25445','#f4e8c0','#65a5a3','#c78441','#77866e','#c51c07','#bfca0e','#fbd00f','#8c7860','#3b4d61','#bd9e84','#c5dfdf','#e68815','#a71666','#d31638'],
    ['#495057','#f03e3e','#d6336c','#ae3ec9','#7048e8','#4263eb','#1c7ed6','#1098ad','#0ca678','#37b24d','#74b816','#f59f00','#f76707'],
    ['#ef9a9a','#f48fb1','#ce93d8','#b39ddb','#9fa8da','#90caf9','#81d4fa','#80deea','#80cbc4','#a5d6a7','#c5e1a5','#e6ee9c','#fff59d','#ffe082','#ffcc80','#ffab91','#bcaaa4'],
    ['#e53935','#d81b60','#8e24aa','#5e35b1','#3949ab','#1e88e5','#039be5','#00acc1','#00897b','#43a047','#7cb342','#c0ca33','#fdd835','#ffb300','#fb8c00','#f4511e','#6d4c41'],
    ['#e9ecef','#ffc9c9','#fcc2d7','#eebefa','#d0bfff','#bac8ff','#a5d8ff','#99e9f2','#96f2d7','#b2f2bb','#d8f5a2','#ffec99','#ffd8a8'],
    ['#f87171','#fb923c','#fbbf24','#facc15','#a3e635','#4ade80','#34d399','#2dd4bf','#22d3ee','#38bdf8','#60a5fa','#818cf8','#a78bfa','#c084fc','#e879f9','#f472b6','#fb7185'],
    ['#ff5252','#ff4081','#e040fb','#7c4dff','#536dfe','#448aff','#40c4ff','#18ffff','#64ffda','#69f0ae','#b2ff59','#eeff41','#ffff00','#ffd740','#ffab40','#ff6e40'],
    ['#ec8e7b','#eb8e90','#e592a3','#e093b2','#dd93c2','#d39ecf','#be93e4','#aa99ec','#9b9ef0','#8da4ef','#5eb1ef','#3db9cf','#53b9ab','#56ba9f','#5bb98b','#65ba74','#ec9455','#c0a47e'],
    ['#fecaca','#fed7aa','#fde68a','#fef08a','#d9f99d','#bbf7d0','#a7f3d0','#99f6e4','#a5f3fc','#bae6fd','#bfdbfe','#c7d2fe','#ddd6fe','#e9d5ff','#f5d0fe','#fbcfe8','#fecdd3'],
    ['#ff1744','#f50057','#d500f9','#651fff','#3d5afe','#2979ff','#00b0ff','#00e5ff','#1de9b6','#00e676','#76ff03','#c6ff00','#ffea00','#ffc400','#ff9100','#ff3d00'],
    ['#ff8a80','#ff80ab','#ea80fc','#b388ff','#8c9eff','#82b1ff','#80d8ff','#84ffff','#a7ffeb','#b9f6ca','#ccff90','#f4ff81','#ffff8d','#ffe57f','#ffd180','#ff9e80'],
];
    
    const colors = colorPalettes[paletteIndex] || colorPalettes[0];

    window.zoocageCJKMode = cjkEnabled;
    
    setTimeout(() => {
        highlightMultipleTerms(terms, colors, diacriticsEnabled);
    }, 100);
}

browser.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    
    if (changes.highlightEnabled) {
        if (changes.highlightEnabled.newValue === false) {
            clearAllHighlights();
        } else if (changes.highlightEnabled.newValue === true) {
            browser.storage.local.get(['highlightTerms', 'highlightPaletteIndex']).then(({ highlightTerms = [], highlightPaletteIndex = 0 }) => {
                if (highlightTerms.length > 0) {
                    applyHighlights(highlightTerms, highlightPaletteIndex);
                }
            });
        }
    }
    
    if (changes.highlightTerms || changes.highlightPaletteIndex || changes.diacriticsEnabled || changes.cjkEnabled) {
        browser.storage.local.get(['highlightEnabled', 'highlightTerms', 'highlightPaletteIndex']).then(({ 
            highlightEnabled = false, 
            highlightTerms = [],
            highlightPaletteIndex = 0
        }) => {
            if (highlightEnabled && highlightTerms.length > 0) {
                clearAllHighlights();
                applyHighlights(highlightTerms, highlightPaletteIndex);
            }
        });
    }
});

(function initGrayscaleMode() {
    let overlayEl = null;

    async function applyGrayscale() {
        const { grayscaleEnabled = false } = 
            await browser.storage.local.get('grayscaleEnabled');

        if (!overlayEl) {
            overlayEl = document.createElement('div');
            overlayEl.id = 'zoocage-grayscale-overlay';
            overlayEl.style.cssText = `
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                pointer-events: none !important;
                user-select: none !important;
                z-index: 2147483646 !important;
                transition: backdrop-filter 0.3s ease !important;
            `;
            document.documentElement.appendChild(overlayEl);
        }

        if (grayscaleEnabled) {
            overlayEl.style.backdropFilter = 'grayscale(100%)';
            overlayEl.style.webkitBackdropFilter = 'grayscale(100%)';
        } else {
            overlayEl.style.backdropFilter = 'none';
            overlayEl.style.webkitBackdropFilter = 'none';
        }
    }

    browser.storage.onChanged.addListener((changes) => {
        if (changes.grayscaleEnabled) {
            applyGrayscale();
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyGrayscale);
    } else {
        applyGrayscale();
    }
})();
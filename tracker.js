class AVIFCache {
    constructor() {
        this.dbName = 'zoocageAVIFCache';
        this.storeName = 'images';
        this.db = null;
    }
    
    async has(key) {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(key);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result !== undefined);
        });
    }
    
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };
        });
    }
    
    async get(key) {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(key);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const result = request.result;
                resolve(result ? result.blob : null);
            };
        });
    }
    
    async getWithSize(key) {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(key);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    }
    
    async set(key, value) {
        if (!this.db) await this.init();
        
        const dataToStore = {
            blob: value,
            size: value.size,
            timestamp: Date.now()
        };
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(dataToStore, key);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }
    
    async clear() {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.clear();
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }
    
    async delete(key) {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(key);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }
    
    async getAllKeys() {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAllKeys();
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    }
}

let activeTabId = null;
let activeTabHost = null;
let activeTabStartTime = null;

const audioPlayingTabs = new Map();
let badgeUpdateInterval = null;
let siteBlockEnabled = false;
let siteBlockTimestamps = {};
let TABS_LIMIT = 3;
let MAX_TABS_ENABLED = true;

async function loadBlockSettings() {
    const { siteBlockTimestamps: timestamps = {} } = 
        await browser.storage.local.get('siteBlockTimestamps');
    
    siteBlockTimestamps = timestamps;
}

async function getBlockedTimeStats() {
    const { siteBlockTimestamps = {} } = await browser.storage.local.get('siteBlockTimestamps');
    const now = Date.now();
    const stats = {};
    
    for (const [site, timestamp] of Object.entries(siteBlockTimestamps)) {
        const blockedMs = now - timestamp;
        const blockedHours = Math.floor(blockedMs / (1000 * 60 * 60));
        const blockedMinutes = Math.floor((blockedMs % (1000 * 60 * 60)) / (1000 * 60));
        const blockedDays = Math.floor(blockedHours / 24);
        const remainingHours = blockedHours % 24;
        
        if (blockedDays > 0) {
            stats[site] = `${blockedDays}d ${remainingHours}h`;
        } else if (blockedHours > 0) {
            stats[site] = `${blockedHours}h ${blockedMinutes}m`;
        } else {
            stats[site] = `${blockedMinutes}m`;
        }
    }
    
    return stats;
}

browser.webRequest.onBeforeRequest.addListener(
    function(details) {        
        const url = new URL(details.url);
        const host = url.hostname;
        
        if (Object.keys(siteBlockTimestamps).includes(host)) {
            const blockedPage = browser.runtime.getURL('blocked.html') + '?url=' + encodeURIComponent(details.url);
            return { redirectUrl: blockedPage };
        }
    },
    { urls: ["<all_urls>"], types: ["main_frame"] },
    ["blocking"]
);


browser.storage.onChanged.addListener((changes) => {
    if (changes.siteBlockEnabled || changes.siteBlockTimestamps) {
        loadBlockSettings();
    }
});

function extractHost(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname;
    } catch (e) {
        return null;
    }
}

function getDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

async function isWhitelisted(host) {
    if (!host) return true;
    const { whitelist = [] } = await browser.storage.local.get('whitelist');
    return whitelist.some(pattern => {
        const regexPattern = pattern
            .replace(/\./g, '\\.')
            .replace(/\*/g, '.*');
        const regex = new RegExp('^' + regexPattern + '$');
        return regex.test(host);
    });
}

async function saveBrowsingTime(host, seconds) {
    if (!host || seconds <= 0) return;
    if (await isWhitelisted(host)) return;
    
    const dateStr = getDateString();
    const { timeData = {} } = await browser.storage.local.get('timeData');
    
    if (!timeData[dateStr]) {
        timeData[dateStr] = { browsing: {}, media: {} };
    }
    if (!timeData[dateStr].browsing) {
        timeData[dateStr].browsing = {};
    }
    
    timeData[dateStr].browsing[host] = (timeData[dateStr].browsing[host] || 0) + seconds;
    await browser.storage.local.set({ timeData });
}

async function saveMediaTime(host, seconds) {
    if (!host || seconds <= 0) return;
    if (await isWhitelisted(host)) return;
    
    const dateStr = getDateString();
    const { timeData = {} } = await browser.storage.local.get('timeData');
    
    if (!timeData[dateStr]) {
        timeData[dateStr] = { browsing: {}, media: {} };
    }
    if (!timeData[dateStr].media) {
        timeData[dateStr].media = {};
    }
    
    timeData[dateStr].media[host] = (timeData[dateStr].media[host] || 0) + seconds;
    await browser.storage.local.set({ timeData });
}

function updateBadge() {
    if (audioPlayingTabs.size === 0) {
        browser.browserAction.setBadgeText({ text: '' });
        stopBadgeUpdates();
        return;
    }
    
    let totalSeconds = 0;
    const now = Date.now();
    
    audioPlayingTabs.forEach((state) => {
        const elapsed = Math.floor((now - state.startTime) / 1000);
        totalSeconds += elapsed;
    });
    
    let text = '';
    
    if (totalSeconds < 900) {
        text = `${totalSeconds}`;
    } else {
        const minutes = Math.floor(totalSeconds / 60);
        
        if (minutes < 100) {
            text = `${minutes}m`;
        } else if (minutes < 900) {
            text = `${minutes}`;
        } else {
            const hours = Math.floor(totalSeconds / 3600);
            text = `${hours}h`;
        }
    }
    
    browser.browserAction.setBadgeText({ text });
    browser.browserAction.setBadgeBackgroundColor({ color: '#2d2d2d' });
}

function startBadgeUpdates() {
    if (!badgeUpdateInterval) {
        badgeUpdateInterval = setInterval(updateBadge, 1000);
        updateBadge();
    }
}

function stopBadgeUpdates() {
    if (badgeUpdateInterval) {
        clearInterval(badgeUpdateInterval);
        badgeUpdateInterval = null;
    }
}

function startTrackingActiveTab(tabId, host) {
    if (activeTabId !== null && activeTabHost && activeTabStartTime) {
        const elapsed = Math.floor((Date.now() - activeTabStartTime) / 1000);
        saveBrowsingTime(activeTabHost, elapsed);
    }
    
    activeTabId = tabId;
    activeTabHost = host;
    activeTabStartTime = Date.now();
}

function stopTrackingActiveTab() {
    if (activeTabId !== null && activeTabHost && activeTabStartTime) {
        const elapsed = Math.floor((Date.now() - activeTabStartTime) / 1000);
        saveBrowsingTime(activeTabHost, elapsed);
    }
    
    activeTabId = null;
    activeTabHost = null;
    activeTabStartTime = null;
}

function handleAudioStart(tabId, url) {
    if (!url) return;
    
    const host = extractHost(url);
    if (!host) return;
    
    const existingState = audioPlayingTabs.get(tabId);
    
    if (existingState) {
        if (existingState.url !== url) {
            recordSegment(existingState);
            audioPlayingTabs.set(tabId, {
                host,
                url,
                tabId,
                startTime: Date.now(),
                lastCheckTime: Date.now()
            });
        }
    } else {
        audioPlayingTabs.set(tabId, {
            host,
            url,
            tabId,
            startTime: Date.now(),
            lastCheckTime: Date.now()
        });
    }
    
    startBadgeUpdates();
}

function handleAudioStop(tabId) {
    const state = audioPlayingTabs.get(tabId);
    if (!state) return;
    
    recordSegment(state);
    audioPlayingTabs.delete(tabId);
    updateBadge();
}

function recordSegment(state) {
    const now = Date.now();
    const duration = Math.floor((now - state.lastCheckTime) / 1000);
    
    if (duration > 0) {
        saveMediaTime(state.host, duration);
    }
    
    state.lastCheckTime = now;
}

function onActiveTabChanged(newActiveTabId) {
    audioPlayingTabs.forEach((state) => {
        const now = Date.now();
        const duration = Math.floor((now - state.lastCheckTime) / 1000);
        
        if (duration > 0) {
            saveMediaTime(state.host, duration);
        }
        
        state.lastCheckTime = now;
    });
}

browser.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await browser.tabs.get(activeInfo.tabId);
    const host = extractHost(tab.url);
    
    if (host) {
        startTrackingActiveTab(activeInfo.tabId, host);
        onActiveTabChanged(activeInfo.tabId);
    }
});

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.audible !== undefined) {
        if (changeInfo.audible && tab?.url) {
            handleAudioStart(tabId, tab.url);
        } else {
            handleAudioStop(tabId);
        }
    }
    
    if (changeInfo.url && tabId === activeTabId) {
        const newHost = extractHost(changeInfo.url);
        if (newHost !== activeTabHost) {
            startTrackingActiveTab(tabId, newHost);
        }
    }
});

browser.tabs.onRemoved.addListener((tabId) => {
    if (tabId === activeTabId) {
        stopTrackingActiveTab();
    }
    handleAudioStop(tabId);
});

browser.windows.onFocusChanged.addListener(async (windowId) => {
    if (windowId === browser.windows.WINDOW_ID_NONE) {
        stopTrackingActiveTab();
    } else {
        const tabs = await browser.tabs.query({ active: true, windowId });
        if (tabs[0]) {
            const host = extractHost(tabs[0].url);
            if (host) {
                activeTabId = tabs[0].id;
                startTrackingActiveTab(tabs[0].id, host);
                onActiveTabChanged(tabs[0].id);
            }
        }
    }
});

browser.windows.onRemoved.addListener(() => {
    audioPlayingTabs.forEach((state) => {
        const now = Date.now();
        const duration = Math.floor((now - state.lastCheckTime) / 1000);
        
        if (duration > 0) {
            saveMediaTime(state.host, duration);
        }
    });
});

browser.runtime.onConnect.addListener((port) => {
    if (port.name === 'popup') {
        const promises = [];
        audioPlayingTabs.forEach((state) => {
            const now = Date.now();
            const duration = Math.floor((now - state.lastCheckTime) / 1000);
            
            if (duration > 0) {
                promises.push(saveMediaTime(state.host, duration));
                state.lastCheckTime = now;
            }
        });
        
        Promise.all(promises).then(() => {
            port.postMessage({ updated: true });
        });
    }
    
    if (port.name === 'reset-host') {
        port.onMessage.addListener((msg) => {
            audioPlayingTabs.forEach((state, tabId) => {
                if (state.host === msg.host) {
                    state.startTime = Date.now();
                    state.lastCheckTime = Date.now();
                }
            });
        });
    }
});

browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
    if (tabs[0]) {
        const host = extractHost(tabs[0].url);
        if (host) {
            startTrackingActiveTab(tabs[0].id, host);
        }
    }
});

browser.tabs.query({}).then(tabs => {
    tabs.forEach(tab => {
        if (tab.audible && tab.url) {
            handleAudioStart(tab.id, tab.url);
        }
    });
});

let globalBlockingEnabled = false;

async function toggleGlobalBlocking() {
    globalBlockingEnabled = !globalBlockingEnabled;
    await browser.storage.local.set({ globalBlockingEnabled });
    updateBadgeIcon();
}

async function updateBadgeIcon() {
    if (globalBlockingEnabled) {
        browser.browserAction.setBadgeBackgroundColor({ color: '#ff0000' });
    } else {
        browser.browserAction.setBadgeBackgroundColor({ color: '#2d2d2d' });
    }
}

async function loadGlobalBlockingState() {
    const { globalBlockingEnabled: enabled = false } = await browser.storage.local.get('globalBlockingEnabled');
    globalBlockingEnabled = enabled;
    updateBadgeIcon();
}

loadGlobalBlockingState();

class RequestBlocker {
    constructor() {
        browser.webRequest.onBeforeRequest.addListener(
            this.handleRequest.bind(this),
            { urls: ['<all_urls>'], types: ['image', 'imageset'] },
            ['blocking']
        );

        browser.webRequest.onHeadersReceived.addListener(
            this.handleXMLHttpRequest.bind(this),
            { urls: ['<all_urls>'], types: ['xmlhttprequest'] },
            ['blocking', 'responseHeaders']
        );
    }

    async handleRequest(details) {
        const { globalBlockingEnabled = false } = await browser.storage.local.get('globalBlockingEnabled');
        
        if (!globalBlockingEnabled) {
            return { cancel: false };
        }
        
        const host = extractHost(details.originUrl || details.url);
        const settings = await this.getSettings(host);
    
        if (details.type === 'image' || details.type === 'imageset') {
            const imageUrl = details.url.toLowerCase();
            if (imageUrl.includes('i.ytimg.com') || imageUrl.includes('yt3.ggpht.com')) {
                return { cancel: false };
            }
            return { cancel: settings.blockImages };
        }
    
        return { cancel: false };
    }

    async handleXMLHttpRequest(details) {
        const { globalBlockingEnabled = false } = await browser.storage.local.get('globalBlockingEnabled');
        
        if (!globalBlockingEnabled) {
            return {};
        }
        
        const host = extractHost(details.originUrl);
        const settings = await this.getSettings(host);
        const contentType = this.getContentType(details.responseHeaders);

        if (settings.blockImages && contentType.startsWith('image/')) {
            return { redirectUrl: 'data:,' };
        }

        return {};
    }

    getContentType(headers) {
        const header = headers.find(h => h.name.toLowerCase() === 'content-type');
        return header ? header.value : '';
    }

    async getSettings(host) {
        const { blockSettings = {} } = await browser.storage.local.get('blockSettings');
        
        if (blockSettings[host]) {
            return blockSettings[host];
        }
        
        return blockSettings.global || {
            blockImages: false,
            blockSVG: false
        };
    }
}

new RequestBlocker();

async function updateIconForBlocking() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (!tabs || !tabs[0]) return;
    
    const url = tabs[0].url;
    if (!url || url.startsWith('about:') || url.startsWith('moz-extension:')) {
        return;
    }
    
    const host = extractHost(url);
    const { blockSettings = {}, globalBlockingEnabled = false } = await browser.storage.local.get(['blockSettings', 'globalBlockingEnabled']);
    
    if (!globalBlockingEnabled) {
        browser.browserAction.setIcon({ path: 'icon.svg' });
        return;
    }
    
    const globalSettings = blockSettings.global || {};
    const siteSettings = host ? blockSettings[host] : null;
    
    const imageBlockingActive = (siteSettings && siteSettings.blockImages) || 
                                 (!siteSettings && globalSettings.blockImages);
    
    if (imageBlockingActive) {
        const canvas = new OffscreenCanvas(48, 48);
        const ctx = canvas.getContext('2d');
        
        const img = new Image();
        img.src = browser.runtime.getURL('icon.svg');
        
        img.onload = () => {
            ctx.drawImage(img, 0, 0, 48, 48);
            
            ctx.strokeStyle = '#FF0000';
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            
            ctx.beginPath();
            ctx.moveTo(8, 8);
            ctx.lineTo(40, 40);
            ctx.moveTo(40, 8);
            ctx.lineTo(8, 40);
            ctx.stroke();
            
            browser.browserAction.setIcon({ 
                imageData: ctx.getImageData(0, 0, 48, 48)
            });
        };
    } else {
        browser.browserAction.setIcon({ path: 'icon.svg' });
    }
}



browser.tabs.onActivated.addListener(updateIconForBlocking);
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        updateIconForBlocking();
    }
});

browser.storage.onChanged.addListener((changes) => {
    if (changes.blockSettings || changes.globalBlockingEnabled) {
        updateIconForBlocking();
    }
});

updateIconForBlocking();

browser.commands.onCommand.addListener(async (command) => {
    if (command === "clip-markdown") {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        if (tabs[0]) {
            try {
                const isRunning = await browser.tabs.executeScript(tabs[0].id, {
                    code: 'window.zoocageMarkdownClipRunning || false'
                });
                
                if (isRunning && isRunning[0]) {
                    
                    await browser.tabs.executeScript(tabs[0].id, {
                        code: `
                            const notification = document.createElement('div');
                            notification.textContent = 'Markdown clip already used! Refresh page (F5) to clip again.';
                            notification.style.cssText = \`
                                position: fixed;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                background: #d13438;
                                color: #fff;
                                padding: 1.5rem 2rem;
                                border-radius: 8px;
                                z-index: 10000;
                                font-weight: 600;
                                font-size: 1.1rem;
                                box-shadow: 0 8px 24px rgba(0,0,0,0.5);
                            \`;
                            document.body.appendChild(notification);
                            setTimeout(() => notification.remove(), 5000);
                        `
                    });
                    
                    return;
                }
                
                await browser.tabs.executeScript(tabs[0].id, {
                    file: "defuddle.js"
                });
                
                await browser.tabs.executeScript(tabs[0].id, {
                    file: "turndown.js"
                });
                
                await browser.tabs.executeScript(tabs[0].id, {
                    file: "markdown-clip.js"
                });
            } catch (e) {
                if (!e.message.includes('Already running')) {
                    console.error('Markdown clip keyboard shortcut failed:', e);
                    
                    await browser.tabs.executeScript(tabs[0].id, {
                        code: `
                            const notification = document.createElement('div');
                            notification.textContent = 'Markdown clip failed! Refresh page (F5) and try again.';
                            notification.style.cssText = \`
                                position: fixed;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                background: #d13438;
                                color: #fff;
                                padding: 1.5rem 2rem;
                                border-radius: 8px;
                                z-index: 10000;
                                font-weight: 600;
                                font-size: 1.1rem;
                                box-shadow: 0 8px 24px rgba(0,0,0,0.5);
                            \`;
                            document.body.appendChild(notification);
                            setTimeout(() => notification.remove(), 5000);
                        `
                    }).catch(() => {});
                }
            }
        }
    }
});

browser.runtime.onInstalled.addListener(() => {
    browser.storage.local.get(['zoocagesnippets', 'zoocagesettings', 'markdownImageMode', 'avifColorMode']).then((result) => {
        if (!result.zoocagesnippets) {
            browser.storage.local.set({ zoocagesnippets: [] });
        }
        if (!result.zoocagesettings) {
            browser.storage.local.set({
                zoocagesettings: {
                    theme: 'themesdark/gradient-dark.min.css',
                    mode: 'dark'
                }
            });
        }
        if (!result.markdownImageMode) {
            browser.storage.local.set({ markdownImageMode: 'avif' });
        }
        if (!result.avifColorMode) {
            browser.storage.local.set({ avifColorMode: 'color' });
        }
    });
});

loadBlockSettings();

const isMac = navigator.platform.toLowerCase().includes('mac');
const shortcutText = isMac ? '⌘⇧X' : 'Ctrl+Shift+X';

browser.contextMenus.create({
    id: "clipMarkdown",
    title: `📋 Clip as Markdown ${shortcutText}`,
    contexts: ["all"]
});

browser.contextMenus.create({
    id: "blurSite",
    title: "💦 Blur Site",
    contexts: ["all"]
});

browser.contextMenus.create({
    id: "toggleImageZoom",
    title: "🔎 Image Zoom: Loading...",
    contexts: ["all"]
});

browser.contextMenus.create({
    id: "blockSite",
    title: "🚫 Block Site",
    contexts: ["all"]
});

browser.contextMenus.create({
    id: "toggleContentBlocking",
    title: "🧪 Content Blocking: Add Site",
    contexts: ["all"]
});

browser.contextMenus.create({
    id: "toggleGrayscale",
    title: "👓 Grayscale: Turn ON",
    contexts: ["all"]
});


async function updateContextMenus(tab) {
    const { hoverZoomEnabled = false, grayscaleEnabled = false } = 
        await browser.storage.local.get(['hoverZoomEnabled', 'grayscaleEnabled']);
    
    browser.contextMenus.update("toggleImageZoom", {
        title: hoverZoomEnabled ? "🔍 Image Zoom: Turn OFF" : "🔎 Image Zoom: Turn ON"
    });
    
    browser.contextMenus.update("toggleGrayscale", {
        title: grayscaleEnabled ? "🧬 Grayscale: Turn OFF" : "👓 Grayscale: Turn ON"
    });
    
    if (tab && tab.url && !tab.url.startsWith('about:') && !tab.url.startsWith('moz-extension:')) {
        const url = new URL(tab.url);
        const host = url.hostname;
        
        if (host) {
            const { blurSiteList = [] } = await browser.storage.local.get('blurSiteList');
            browser.contextMenus.update("blurSite", {
                title: blurSiteList.includes(host) ? "☁️ Unblur Site" : "💦 Blur Site"
            });
            
            const { blockSettings = {} } = await browser.storage.local.get('blockSettings');
            const isBlocked = blockSettings.hasOwnProperty(host) && blockSettings[host];
            browser.contextMenus.update("toggleContentBlocking", {
                title: blockSettings[host] ? "🌡 Content Blocking: Remove Site" : "🧪 Content Blocking: Add Site"
            });
        } else {
            browser.contextMenus.update("blurSite", {
                title: "💦 Blur Site"
            });
            browser.contextMenus.update("toggleContentBlocking", {
                title: "🧪 Content Blocking: Add Site"
            });
        }
    } else {
        browser.contextMenus.update("blurSite", {
            title: "💦 Blur Site"
        });
        browser.contextMenus.update("toggleContentBlocking", {
            title: "🧪 Content Blocking: Add Site"
        });
    }
}

browser.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await browser.tabs.get(activeInfo.tabId);
    updateContextMenus(tab);
});

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        updateContextMenus(tab);
    }
});

browser.storage.onChanged.addListener(async (changes) => {
    if (changes.hoverZoomEnabled || changes.blockSettings) {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        if (tabs[0]) {
            updateContextMenus(tabs[0]);
        }
    }
});

browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
    if (tabs[0]) {
        updateContextMenus(tabs[0]);
    }
});

const pendingMarkdownData = new Map();

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'storeAVIFCache') {
        (async () => {
            try {
                const avifCache = new AVIFCache();
                await avifCache.init();
                
                const uint8Array = new Uint8Array(message.data);
                const blob = new Blob([uint8Array], { type: 'image/avif' });
                
                await avifCache.set(message.hash, blob);
                sendResponse({ success: true });
            } catch (error) {
                console.error('✗ Error storing AVIF cache:', error);
                sendResponse({ success: false, error: error.message });
            }
        })();
        return true;
    }

    if (message.type === 'deleteAVIFCache') {
        (async () => {
            try {
                const avifCache = new AVIFCache();
                await avifCache.init();
                await avifCache.delete(message.hash);
                sendResponse({ success: true });
            } catch (error) {
                console.error('✗ Error deleting AVIF cache:', error);
                sendResponse({ success: false, error: error.message });
            }
        })();
        return true;
    }
    
    if (message.type === 'checkAVIFCache') {
        (async () => {
            try {
                const avifCache = new AVIFCache();
                await avifCache.init();
                const exists = await avifCache.has(message.hash);
                sendResponse(exists);
            } catch (error) {
                console.error('✗ Error checking AVIF cache:', error);
                sendResponse(false);
            }
        })();
        return true;
    }
    
    if (message.type === 'getAVIFCache') {
        (async () => {
            try {
                const avifCache = new AVIFCache();
                await avifCache.init();
                const blob = await avifCache.get(message.hash);
                
                
                if (blob && blob instanceof Blob) {
                    const arrayBuffer = await blob.arrayBuffer();
                    const uint8Array = new Uint8Array(arrayBuffer);
                    let binary = '';
                    for (let i = 0; i < uint8Array.length; i++) {
                        binary += String.fromCharCode(uint8Array[i]);
                    }
                    const base64 = btoa(binary);
                    const dataUrl = `data:image/avif;base64,${base64}`;
                    sendResponse(dataUrl);
                } else {
                    sendResponse(null);
                }
            } catch (error) {
                console.error('✗ Error getting AVIF cache:', error);
                sendResponse(null);
            }
        })();
        return true;
    }
    
    if (message.type === 'getAVIFCacheWithSize') {
        (async () => {
            try {
                const avifCache = new AVIFCache();
                await avifCache.init();
                const data = await avifCache.getWithSize(message.hash);
                sendResponse(data);
            } catch (error) {
                console.error('✗ Error getting AVIF cache with size:', error);
                sendResponse(null);
            }
        })();
        return true;
    }
    
    if (message.type === "markdownClipResult" && message.markdown) {
        const hasImages = /!\[.*?\]\(data:image\//.test(message.markdown);
        const dataId = Date.now().toString();
        
        pendingMarkdownData.set(dataId, {
            markdown: message.markdown,
            title: message.title || 'Markdown Clip',
            url: message.url || '',
            autoRender: hasImages,
            highlightedTerms: message.highlightedTerms || {},
            cjkMode: message.cjkMode || false
        });
        
        browser.tabs.create({
            url: browser.runtime.getURL(`zoocage.html?pending=${dataId}`),
            index: sender.tab ? sender.tab.index + 1 : undefined
        });
    }
    
    if (message.type === "getPendingMarkdown") {
        const data = pendingMarkdownData.get(message.dataId);
        if (data) {
            pendingMarkdownData.delete(message.dataId);
            return Promise.resolve(data); 
        }
        return Promise.resolve(null);
    }
});

browser.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.grayscaleEnabled) {
        browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
            if (tabs[0]) {
                updateContextMenus(tabs[0]);
            }
        });
    }
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {    
    if (info.menuItemId === "toggleImageZoom") {
        const { hoverZoomEnabled = false } = await browser.storage.local.get('hoverZoomEnabled');
        await browser.storage.local.set({ hoverZoomEnabled: !hoverZoomEnabled });
        await updateContextMenus(tab);
    }

    if (info.menuItemId === "blockSite") {
        if (!tab || !tab.url || tab.url.startsWith('about:') || tab.url.startsWith('moz-extension:')) {
            return;
        }
        
        const host = extractHost(tab.url);
        if (!host) return;
        
        const { siteBlockTimestamps = {} } = await browser.storage.local.get('siteBlockTimestamps');
        
        if (!siteBlockTimestamps[host]) {
            siteBlockTimestamps[host] = Date.now();
            await browser.storage.local.set({ siteBlockTimestamps });
            browser.tabs.reload(tab.id);
        }
    }

    if (info.menuItemId === "toggleGrayscale") {
        const { grayscaleEnabled = false } = await browser.storage.local.get('grayscaleEnabled');
        await browser.storage.local.set({ grayscaleEnabled: !grayscaleEnabled });
        await updateContextMenus(tab);
    }
    
    if (info.menuItemId === "toggleContentBlocking") {
        if (!tab || !tab.url || tab.url.startsWith('about:') || tab.url.startsWith('moz-extension:')) {
            return;
        }
        
        const url = new URL(tab.url);
        const host = url.hostname;
        
        if (!host) return;
        
        const { blockSettings = {} } = await browser.storage.local.get('blockSettings');
        
        if (blockSettings[host]) {
            delete blockSettings[host];
        } else {
            blockSettings[host] = {
                blockImages: false,
                blockSVG: false
            };
        }
        
        await browser.storage.local.set({ blockSettings });
        await updateContextMenus(tab);
    }
    
    if (info.menuItemId === "clipMarkdown") {
        if (!tab || !tab.url || tab.url.startsWith('about:') || tab.url.startsWith('moz-extension:')) {
            return;
        }
        
        try {
            const isRunning = await browser.tabs.executeScript(tab.id, {
                code: 'window.zoocageMarkdownClipRunning || false'
            });
            
            if (isRunning && isRunning[0]) {
                console.log('Markdown clip already in progress');
                
                await browser.tabs.executeScript(tab.id, {
                    code: `
                        const notification = document.createElement('div');
                        notification.textContent = 'Markdown clip already used! Refresh page (F5) to clip again.';
                        notification.style.cssText = \`
                            position: fixed;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            background: #d13438;
                            color: #fff;
                            padding: 1.5rem 2rem;
                            border-radius: 8px;
                            z-index: 10000;
                            font-weight: 600;
                            font-size: 1.1rem;
                            box-shadow: 0 8px 24px rgba(0,0,0,0.5);
                        \`;
                        document.body.appendChild(notification);
                        setTimeout(() => notification.remove(), 5000);
                    `
                });
                
                return;
            }
            
            await browser.tabs.executeScript(tab.id, {
                file: "defuddle.js"
            });
            
            await browser.tabs.executeScript(tab.id, {
                file: "turndown.js"
            });
            
            await browser.tabs.executeScript(tab.id, {
                file: "markdown-clip.js"
            });
            
        } catch (error) {
            if (!error.message.includes('Already running')) {
                console.error('Failed to inject markdown clip scripts:', error);
                
                await browser.tabs.executeScript(tab.id, {
                    code: `
                        const notification = document.createElement('div');
                        notification.textContent = 'Markdown clip failed! Refresh page (F5) and try again.';
                        notification.style.cssText = \`
                            position: fixed;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            background: #d13438;
                            color: #fff;
                            padding: 1.5rem 2rem;
                            border-radius: 8px;
                            z-index: 10000;
                            font-weight: 600;
                            font-size: 1.1rem;
                            box-shadow: 0 8px 24px rgba(0,0,0,0.5);
                        \`;
                        document.body.appendChild(notification);
                        setTimeout(() => notification.remove(), 5000);
                    `
                }).catch(() => {});
            }
        }
    }
    
    if (info.menuItemId === "blurSite") {
        if (!tab || !tab.url || tab.url.startsWith('about:') || tab.url.startsWith('moz-extension:')) {
            return;
        }
        
        const url = new URL(tab.url);
        const host = url.hostname;
        
        if (!host) return;
        
        const { blurSiteList = [], blurSettings = {} } = 
            await browser.storage.local.get(['blurSiteList', 'blurSettings']);
        
        if (blurSiteList.includes(host)) {
            const updated = blurSiteList.filter(s => s !== host);
            await browser.storage.local.set({ blurSiteList: updated });
            
            browser.tabs.sendMessage(tab.id, {
                action: 'toggleBlur',
                enabled: false
            });
        } else {
            blurSiteList.push(host);
            
            if (!blurSettings.imageBlur && !blurSettings.videoBlur) {
                blurSettings.imageBlur = 8;
                blurSettings.videoBlur = 8;
                blurSettings.invertImages = false;
            } else if (!blurSettings.imageBlur) {
                blurSettings.imageBlur = 8;
            } else if (!blurSettings.videoBlur) {
                blurSettings.videoBlur = 8;
            }
            
            await browser.storage.local.set({ blurSiteList, blurSettings });
            
            browser.tabs.sendMessage(tab.id, {
                action: 'toggleBlur',
                enabled: true
            });
        }
        
        await updateContextMenus(tab);
    }
});

function loadMaxTabsSettings() {
    return browser.storage.local.get(['maxTabsEnabled', 'tabsLimit']).then(function(result) {
        MAX_TABS_ENABLED = result.maxTabsEnabled !== false;
        TABS_LIMIT = result.tabsLimit || 3;
    });
}

function discardTab(tab) {
    browser.tabs.discard(tab.id);
}

function loadTab(tab) {
    if(tab.discarded) {
        browser.tabs.reload(tab.id);
    }
}

function isBlankTab(tab) {
    return !tab.url || 
           tab.url === 'about:blank' || 
           tab.url === 'about:newtab' ||
           tab.url.startsWith('about:home');
}

function hasMediaPlaying(tab) {
    return tab.audible === true;
}

function shouldKeepTabLoaded(tab) {
    return hasMediaPlaying(tab) || isBlankTab(tab);
}

function unloadTabsIfNecessary() {
    if (!MAX_TABS_ENABLED) return;
    
    browser.tabs.query({currentWindow: true}).then(function(allTabs) {
        allTabs.sort(function(a, b) { return a.index - b.index; });
        
        for(let i = 0; i < Math.min(TABS_LIMIT, allTabs.length); ++i) {
            loadTab(allTabs[i]);
        }
        
        for(let i = TABS_LIMIT; i < allTabs.length; ++i) {
            if(!allTabs[i].discarded && !shouldKeepTabLoaded(allTabs[i])) {
                discardTab(allTabs[i]);
            }
        }
    }).catch(function(error) {
        console.error("Error managing tabs:", error);
    });
}

function handleMaxTabsCreated(tab) {
    const handleUrlUpdate = function(tabId, changeInfo, tab_) {
        if(tab.id !== tabId || !changeInfo.url)
            return;
        unloadTabsIfNecessary();
        browser.tabs.onUpdated.removeListener(handleUrlUpdate);
    };
    browser.tabs.onUpdated.addListener(handleUrlUpdate, {properties: ["url"]});
}

function handleMaxTabsRemoved(tabId, removeInfo) {
    unloadTabsIfNecessary();
}

browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'maxTabsSettingsChanged') {
        loadMaxTabsSettings().then(function() {
            unloadTabsIfNecessary();
        });
    }
});

loadMaxTabsSettings().then(function() {
    browser.tabs.onCreated.addListener(handleMaxTabsCreated);
    browser.tabs.onRemoved.addListener(handleMaxTabsRemoved);
    
    unloadTabsIfNecessary();
});
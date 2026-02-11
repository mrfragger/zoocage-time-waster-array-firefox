class AVIFCache {
    constructor() {
        this.dbName = 'zoocageAVIFCache';
        this.storeName = 'images';
        this.db = null;
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
}

class SnippetStorage {
    constructor() {
        this.dbName = 'zoocageSnippets';
        this.storeName = 'largeSnippets';
        this.db = null;
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
            request.onsuccess = () => resolve(request.result);
        });
    }
    
    async set(key, value) {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(value, key);
            
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
            try {
                const transaction = this.db.transaction([this.storeName], 'readonly');
                const store = transaction.objectStore(this.storeName);
                const request = store.getAllKeys();
                
                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve(request.result);
            } catch (error) {
                console.error('Error in getAllKeys():', error);
                reject(error);
            }
        });
    }
}

const snippetStorage = new SnippetStorage();


function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    if (bytes < 1024) return bytes + 'B';
    if (bytes < 1024 * 1024) {
        const kb = bytes / 1024;
        if (kb >= 100) {
            return Math.round(kb) + 'KB';
        }
        return kb.toFixed(1) + 'KB';
    }
    const mb = bytes / (1024 * 1024);
    if (mb >= 100) {
        return Math.round(mb) + 'MB';
    }
    return mb.toFixed(1) + 'MB';
}
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    
    const bgColor = type === 'error' ? '#d13438' : '#4ec9b0';
    
    notification.style.cssText = `
        position: fixed;
        top: 120px;
        left: 50%;
        transform: translateX(-50%);
        background: ${bgColor};
        color: #fff;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        z-index: 3000;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

const availableLanguages = ['asciidoc', 'awk', 'bash', 'c', 'cmake', 'cpp', 'csharp', 'css', 'dart', 'diff', 'go', 'ini', 'java', 'javascript', 'json', 'kotlin', 'lua', 'makefile', 'markdown', 'objectivec', 'perl', 'php', 'plaintext', 'python', 'ruby', 'rust', 'shell', 'sql', 'swift', 'typescript', 'wasm', 'xml', 'yaml'];

let snippets = [];
let currentSnippetIndex = null;
let currentMode = 'dark';
let searchIndex = null;
let indexHash = '';
let searchDebounceTimer = null;
let titleDebounceTimer = null;
let currentWorkspace = 'default';
let workspaceView = false;
let isSplitView = false;
let isMarkdownRendered = false;
let currentSortMode = 'default';
let base64Folded = false;
let originalBase64Code = null;
let filePositionAtEnd = false;
let currentMarkdownFont = '0xProto';
let markdownRenderDebounceTimer = null;
let titleCaseHistory = {
    text: '',
    element: null,
    start: 0,
    end: 0
};
let lastFocusedElement = null;
let undoData = null;
let undoIndices = null;
let selectedColumns = new Set();

document.addEventListener('DOMContentLoaded', () => {
    loadWorkspaceView();
});

function loadWorkspaceView() {
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get('view');
    
    if (view === 'workspaces') {
        showWorkspaceManager();
    } else {
        const urlWorkspace = urlParams.get('workspace');
        
        if (urlWorkspace) {
            currentWorkspace = urlWorkspace;
            saveLastWorkspace(urlWorkspace);
            initApp();
            checkPendingMarkdownClip();
        } else {
            getLastWorkspace().then((lastWorkspace) => {
                currentWorkspace = lastWorkspace;
                initApp();
                checkPendingMarkdownClip();
            });
        }
    }
}

function compressText(text) {
    if (!text) return '';
    
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    const compressed = fflate.gzipSync(bytes, { level: 9 });
    
    let binary = '';
    for (let i = 0; i < compressed.length; i++) {
        binary += String.fromCharCode(compressed[i]);
    }
    return btoa(binary);
}

function decompressText(compressedBase64) {
    if (!compressedBase64 || typeof compressedBase64 !== 'string' || compressedBase64.trim().length === 0) {
        return '';
    }
    
    try {
        const binary = atob(compressedBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        
        const decompressed = fflate.gunzipSync(bytes);
        const decoder = new TextDecoder();
        return decoder.decode(decompressed);
    } catch (error) {
        console.error('Decompression error:', error);
        return compressedBase64;
    }
}

async function checkPendingMarkdownClip() {
    const urlParams = new URLSearchParams(window.location.search);
    const pendingId = urlParams.get('pending');
    
    if (pendingId) {
        const data = await browser.runtime.sendMessage({
            type: 'getPendingMarkdown',
            dataId: pendingId
        });
        
        if (data && data.markdown) {
            setTimeout(() => {
                createNewSnippet();
                
                setTimeout(() => {
                    const codeTextarea = document.getElementById('snippetCode');
                    const fixedMarkdown = fixBase64ImageSyntax(data.markdown);
                    codeTextarea.value = fixedMarkdown;
                    
                    if (data.highlightedTerms && Object.keys(data.highlightedTerms).length > 0) {
                        codeTextarea.dataset.pendingHighlights = JSON.stringify(data.highlightedTerms);
                    }
                    
                    if (data.cjkMode !== undefined) {
                        codeTextarea.dataset.pendingCjkMode = data.cjkMode;
                    }
                    
                    if (data.title) {
                        document.getElementById('snippetTitle').value = data.title;
                    }
                    
                    setLanguageDropdown('markdown');
                    updatePreview('markdown');
                    
                    setTimeout(() => {
                        isMarkdownRendered = false;
                        toggleMarkdownView();
                        
                        const hasImages = fixedMarkdown.includes('avif-cache://');
                        const hasHighlights = data.highlightedTerms && Object.keys(data.highlightedTerms).length > 0;
                        
                        if (hasImages) {
                            showNotification('Markdown clipped with images and rendered! Click Save to store it.');
                        } else if (hasHighlights) {
                            showNotification('Markdown clipped with highlights and rendered! Click Save to store it.');
                        } else {
                            showNotification('Markdown clipped and rendered! Click Save to store it.');
                        }
                    }, 200);
                    
                    window.history.replaceState({}, '', window.location.pathname + window.location.search.replace(/[?&]pending=[^&]+/, ''));
                }, 150);
            }, 500);
        }
    }
}

function fixBase64ImageSyntax(markdown) {
    let fixed = markdown.replace(/(\!\[.*?\]\(data:image\/[^;]+;base64,[A-Za-z0-9+/=\s]+)\s+"/g, (match, base64Part) => {
        if (!base64Part.endsWith(')')) {
            return base64Part + ') "';
        }
        return match;
    });
    
    fixed = fixed.replace(/(\!\[.*?\]\(data:image\/[^;]+;base64,[A-Za-z0-9+/=\s]+\))\s*"/g, '$1\n"');
    
    return fixed;
}

function showWorkspaceManager() {
    workspaceView = true;
    document.body.innerHTML = `
        <style>
            body {
                background: #1e1e1e;
                color: #d4d4d4;
                margin: 0;
                padding: 0;
                overflow-y: auto;
            }
            .workspace-container {
                max-width: 1400px;
                margin: 0 auto;
                padding: 2rem;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            .workspace-header {
                margin-bottom: 1.5rem;
            }
            .workspace-header h1 {
                color: #4ec9b0;
                margin: 0 0 1rem 0;
                font-size: 1.75rem;
            }
            .workspace-header-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }
            .total-storage {
                color: #858585;
                font-size: 0.9rem;
                text-align: left;
            }
            .workspace-actions-top {
                display: flex;
                gap: 0.75rem;
                margin-bottom: 1.5rem;
                align-items: center;
            }
            .workspace-actions-top button {
                padding: 0.6rem 1.25rem;
                font-size: 0.95rem;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            .btn-export-all {
                background: #0e639c;
                color: #fff;
            }
            .btn-export-all:hover {
                background: #1177bb;
            }
            .btn-import-all {
                background: #0e639c;
                color: #fff;
            }
            .btn-import-all:hover {
                background: #1177bb;
            }
            .btn-delete-all-workspaces {
                background: #d13438;
                color: #fff;
            }
            .btn-delete-all-workspaces:hover {
                background: #e13438;
            }
            .workspace-create {
                display: flex;
                gap: 0.5rem;
            }
            .workspace-create input {
                padding: 0.6rem;
                font-size: 0.95rem;
                width: 300px;
                border: 1px solid #3e3e42;
                border-radius: 4px;
                background: #3c3c3c;
                color: #d4d4d4;
            }
            .workspace-create button {
                padding: 0.6rem 1.25rem;
                font-size: 0.95rem;
                background: #0e639c;
                color: #fff;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            .workspace-create button:hover {
                background: #1177bb;
            }
            .workspace-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1rem;
            }
            @media (max-width: 1000px) {
                .workspace-grid {
                    grid-template-columns: 1fr;
                }
            }
            .workspace-card {
                background: #252526;
                padding: 1rem;
                border-radius: 6px;
                border: 2px solid #3e3e42;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: border-color 0.2s;
            }
            .workspace-card:hover {
                border-color: #0e639c;
            }
            .workspace-info h2 {
                color: #4ec9b0;
                margin: 0 0 0.35rem 0;
                font-size: 1.1rem;
            }
            .workspace-info p {
                color: #858585;
                margin: 0;
                font-size: 0.85rem;
            }
            .workspace-actions {
                display: flex;
                gap: 0.5rem;
            }
            .workspace-actions button {
                padding: 0.4rem 0.85rem;
                font-size: 0.85rem;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            .btn-open {
                background: #0e639c;
                color: #fff;
            }
            .btn-open:hover {
                background: #1177bb;
            }
            .btn-delete {
                background: #d13438;
                color: #fff;
            }
            .btn-delete:hover {
                background: #e13438;
            }
            .empty-message {
                color: #858585;
                text-align: center;
                padding: 3rem;
                grid-column: 1 / -1;
            }
            .btn-clear {
                background: #ff9944;
                color: #fff;
            }
            
            .btn-clear:hover {
                background: #ffaa55;
            }

            .btn-rename {
                background: #0e639c;
                color: #fff;
            }
            
            .btn-rename:hover {
                background: #1177bb;
            }

            .btn-import-source {
                background: #0e639c;
                color: #fff;
            }
            
            .btn-import-source:hover {
                background: #1177bb;
            }
        </style>
        <div class="workspace-container">
            <div class="workspace-header">
                <h1>ZooCage Workspaces</h1>
                <div class="workspace-header-row">
                    <div class="total-storage" id="totalStorage">Calculating...</div>
                    <div class="workspace-create">
                        <input type="text" id="newWorkspaceName" placeholder="New workspace name...">
                        <button id="createWorkspaceBtn">Create Workspace</button>
                    </div>
                </div>
                <div class="workspace-actions-top">
                    <button class="btn-export-all" id="exportAllBtn">Export All Workspaces zip</button>
                    <button class="btn-import-all" id="importAllBtn">Import Workspaces zip</button>
                    <button class="btn-import-source" id="importSourceBtn">Import Source Code zip</button>
                    <button class="btn-delete-all-workspaces" id="deleteAllWorkspacesBtn">Delete All Workspaces</button>
                    <button class="btn-export-all" id="cleanOrphanedImagesBtn">Clean Orphaned Images</button>
                </div>
            </div>
            <div class="workspace-grid" id="workspaceList"></div>
        </div>
        <input type="file" id="importFileWorkspaces" accept=".zip" style="display: none;">
        <input type="file" id="importSourceFile" accept=".zip" style="display: none;">
    `;
    
    loadWorkspaces();
    document.getElementById('cleanOrphanedImagesBtn').addEventListener('click', cleanOrphanedImages);
    document.getElementById('createWorkspaceBtn').addEventListener('click', createWorkspace);
    document.getElementById('newWorkspaceName').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') createWorkspace();
    });
    document.getElementById('exportAllBtn').addEventListener('click', exportAllWorkspaces);
    document.getElementById('importAllBtn').addEventListener('click', () => {
        document.getElementById('importFileWorkspaces').click();
    });    
    document.getElementById('importSourceBtn').addEventListener('click', () => {
        document.getElementById('importSourceFile').click();
    });
    document.getElementById('importSourceFile').addEventListener('change', importSourceFiles);
    document.getElementById('importFileWorkspaces').addEventListener('change', importAllWorkspaces);

    document.getElementById('deleteAllWorkspacesBtn').addEventListener('click', deleteAllWorkspaces);
}

function loadWorkspaces() {
    browser.storage.local.get(null).then(async (data) => {
        const aliases = data.zoocagealiases || {};
        const workspaces = {};
        let totalSnippetsSize = 0;
        
        Object.keys(data).forEach(key => {
            if (key.startsWith('zoocagesnippets_')) {
                const workspaceName = key.replace('zoocagesnippets_', '');
                const snippetsData = data[key] || [];
                const indexKey = `zoocageindexdata_${workspaceName}`;
                const indexData = data[indexKey] || '';
                
                const snippetsSize = JSON.stringify(snippetsData).length;
                const indexSize = typeof indexData === 'string' ? indexData.length : JSON.stringify(indexData).length;
                const totalSize = snippetsSize + indexSize;
                
                totalSnippetsSize += snippetsSize;
                
                workspaces[workspaceName] = {
                    count: snippetsData.length,
                    snippetsSize,
                    indexSize,
                    totalSize
                };
            } else if (key === 'zoocagesnippets') {
                const snippetsData = data[key] || [];
                const indexData = data['zoocageindexdata'] || '';
                
                const snippetsSize = JSON.stringify(snippetsData).length;
                const indexSize = typeof indexData === 'string' ? indexData.length : JSON.stringify(indexData).length;
                const totalSize = snippetsSize + indexSize;
                
                totalSnippetsSize += snippetsSize;
                
                workspaces['default'] = {
                    count: snippetsData.length,
                    snippetsSize,
                    indexSize,
                    totalSize
                };
            }
        });
        
        const browserStorageUsage = JSON.stringify(data).length;
        const browserStorageMB = (browserStorageUsage / (1024 * 1024)).toFixed(2);
        
        let indexedDBSize = 0;
        try {
            const avifCache = new AVIFCache();
            await avifCache.init();
            
            const avifKeys = await avifCache.getAllKeys();
            
            for (const key of avifKeys) {
                const data = await avifCache.getWithSize(key);
                if (data && data.size) {
                    indexedDBSize += data.size;
                }
            }
            
        } catch (error) {
        }
        
        const indexedDBMB = (indexedDBSize / (1024 * 1024)).toFixed(2);
        const totalStorageMB = (parseFloat(browserStorageMB) + parseFloat(indexedDBMB)).toFixed(2);
        
        document.getElementById('totalStorage').innerHTML = `
            <div style="text-align: left;">
                <div style="margin-right: 1rem;">Browser Storage: ${browserStorageMB}MB | IndexedDB: ${indexedDBMB}MB | Total: ${totalStorageMB}MB</div>
            </div>
        `;
        
        const list = document.getElementById('workspaceList');
        list.textContent = '';
        
        if (Object.keys(workspaces).length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty-message';
            emptyDiv.textContent = 'No workspaces yet. Create one above!';
            list.appendChild(emptyDiv);
            return;
        }
        
        Object.keys(workspaces).sort().forEach(async name => {
            const ws = workspaces[name];
            const displayName = name === 'default' ? 'Default Workspace' : (aliases[name] || name);
            
            let compressedSizeText;
            if (ws.snippetsSize < 1024 * 1024) {
                const totalKB = (ws.snippetsSize / 1024).toFixed(2);
                compressedSizeText = `${totalKB} KB`;
            } else {
                const totalMB = (ws.snippetsSize / (1024 * 1024)).toFixed(2);
                compressedSizeText = `${totalMB} MB`;
            }
            
            const snippetsData = name === 'default' ? data['zoocagesnippets'] : data[`zoocagesnippets_${name}`];
            let totalAVIFSize = 0;
            const avifHashes = new Set();
            
            if (snippetsData && Array.isArray(snippetsData)) {
                snippetsData.forEach(snippet => {
                    const code = snippet.code || '';
                    
                    const cacheMatchesWithSize = code.match(/avif-cache:\/\/([a-f0-9]+)#(\d+)/g) || [];
                    cacheMatchesWithSize.forEach(match => {
                        const parts = match.replace('avif-cache://', '').split('#');
                        const hash = parts[0];
                        const size = parseInt(parts[1]);
                        if (!isNaN(size) && !avifHashes.has(hash)) {
                            totalAVIFSize += size;
                            avifHashes.add(hash);
                        }
                    });
                    
                    const cacheMatchesNoSize = code.match(/avif-cache:\/\/([a-f0-9]+)(?!#)/g) || [];
                    cacheMatchesNoSize.forEach(match => {
                        const hash = match.replace('avif-cache://', '');
                        avifHashes.add(hash);
                    });
                });
            }
            
            let avifSizeText = '';
            if (avifHashes.size > 0) {
                if (totalAVIFSize === 0) {
                    avifSizeText = ` <span style="color: #ff3f3f;">${avifHashes.size} images</span>`;
                } else if (totalAVIFSize < 1024 * 1024) {
                    const totalKB = (totalAVIFSize / 1024).toFixed(2);
                    avifSizeText = ` <span style="color: #ff3f3f;">${totalKB}KB</span>`;
                } else {
                    const totalMB = (totalAVIFSize / (1024 * 1024)).toFixed(2);
                    avifSizeText = ` <span style="color: #ff3f3f;">${totalMB}MB</span>`;
                }
            }
            
            const card = document.createElement('div');
            card.className = 'workspace-card';
            card.innerHTML = `
                <div class="workspace-info">
                    <h2>${displayName}</h2>
                    <p>${compressedSizeText} (${ws.count} snippets)${avifSizeText}</p>
                </div>
                <div class="workspace-actions">
                    <button class="btn-open open-workspace" data-workspace="${name}">Open</button>
                    ${name !== 'default' 
                        ? `<button class="btn-rename rename-workspace" data-workspace="${name}">Rename</button>
                           <button class="btn-delete delete-workspace" data-workspace="${name}">Delete</button>` 
                        : `<button class="btn-clear clear-workspace" data-workspace="${name}">Clear</button>`
                    }
                </div>
            `;
            
            list.appendChild(card);
        });
        
        document.querySelectorAll('.open-workspace').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const workspace = e.target.dataset.workspace;
                saveLastWorkspace(workspace);
                window.location.href = `?workspace=${workspace}`;
            });
        });
        
        document.querySelectorAll('.delete-workspace').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const workspace = e.target.dataset.workspace;
                deleteWorkspace(workspace);
            });
        });

        document.querySelectorAll('.rename-workspace').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const workspace = e.target.dataset.workspace;
                renameWorkspace(workspace);
            });
        });
        
        document.querySelectorAll('.clear-workspace').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const workspace = e.target.dataset.workspace;
                clearWorkspace(workspace);
            });
        });
    });
}

function createWorkspace() {
    const name = document.getElementById('newWorkspaceName').value.trim();
    
    if (!name) {
        alert('Please enter a workspace name');
        return;
    }
    
    if (name === 'default') {
        alert('Cannot use "default" as workspace name');
        return;
    }
    
    if (!/^[a-zA-Z0-9\s_-]+$/.test(name)) {
        alert('Workspace name can only contain letters, numbers, spaces, hyphens, and underscores');
        return;
    }
    
    browser.storage.local.get(`zoocagesnippets_${name}`).then((result) => {
        if (result[`zoocagesnippets_${name}`]) {
            alert('Workspace already exists');
            return;
        }
        
        browser.storage.local.set({
            [`zoocagesnippets_${name}`]: []
        }).then(() => {
            document.getElementById('newWorkspaceName').value = '';
            loadWorkspaces();
        });
    });
}

async function deleteWorkspace(name) {
    if (!confirm(`Delete workspace "${name}" and all its snippets?\n\nThis cannot be undone!`)) {
        return;
    }
    
    const storageKey = name === 'default' ? 'zoocagesnippets' : `zoocagesnippets_${name}`;
    const result = await browser.storage.local.get(storageKey);
    const snippetsData = result[storageKey] || [];
    
    for (const snippet of snippetsData) {
        if (snippet.inIndexedDB && snippet.timestamp) {
            try {
                await snippetStorage.delete(`snippet_${snippet.timestamp}`);
            } catch (error) {
                console.error('Error deleting from IndexedDB:', error);
            }
        }
    }
    
    await browser.storage.local.remove([
        `zoocagesnippets_${name}`,
        `zoocageindexdata_${name}`,
        `zoocageindexhash_${name}`
    ]);
    
    loadWorkspaces();
}

function renameWorkspace(name) {
    browser.storage.local.get('zoocagealiases').then((result) => {
        const aliases = result.zoocagealiases || {};
        const currentAlias = aliases[name] || name;
        
        const newName = prompt(`Rename workspace:\n\nCurrent: ${currentAlias}\n\nEnter new display name:`, currentAlias);
        
        if (!newName || newName.trim() === '') return;
        
        const trimmedName = newName.trim();
        
        if (trimmedName === name) {
            delete aliases[name];
            browser.storage.local.set({ zoocagealiases: aliases }).then(() => {
                loadWorkspaces();
            });
            return;
        }
        
        if (trimmedName === 'default' || trimmedName === 'Default Workspace') {
            alert('Cannot use "default" or "Default Workspace" as a name');
            return;
        }
        
        browser.storage.local.get(null).then((data) => {
            const allWorkspaceNames = new Set();
            const allAliases = new Set(Object.values(aliases));
            
            Object.keys(data).forEach(key => {
                if (key.startsWith('zoocagesnippets_')) {
                    allWorkspaceNames.add(key.replace('zoocagesnippets_', ''));
                }
            });
            
            if (allWorkspaceNames.has(trimmedName) || allAliases.has(trimmedName)) {
                alert('A workspace with this name already exists');
                return;
            }
            
            aliases[name] = trimmedName;
            
            browser.storage.local.set({ zoocagealiases: aliases }).then(() => {
                loadWorkspaces();
            });
        });
    });
}

async function clearWorkspace(name) {
    const displayName = name === 'default' ? 'Default Workspace' : name;
    
    const storageKey = name === 'default' ? 'zoocagesnippets' : `zoocagesnippets_${name}`;
    const result = await browser.storage.local.get(storageKey);
    const snippetsData = result[storageKey] || [];
    const count = snippetsData.length;
    
    if (count === 0) {
        alert('Workspace is already empty');
        return;
    }
    
    if (!confirm(`Clear all ${count} snippet${count !== 1 ? 's' : ''} from ${displayName}?\n\nThis cannot be undone!`)) {
        return;
    }
    
    for (const snippet of snippetsData) {
        if (snippet.inIndexedDB && snippet.timestamp) {
            try {
                await snippetStorage.delete(`snippet_${snippet.timestamp}`);
            } catch (error) {
                console.error('Error deleting from IndexedDB:', error);
            }
        }
    }
    
    const storageObj = {};
    storageObj[storageKey] = [];
    
    const hashKey = name === 'default' ? 'zoocageindexhash' : `zoocageindexhash_${name}`;
    const indexKey = name === 'default' ? 'zoocageindexdata' : `zoocageindexdata_${name}`;
    
    storageObj[hashKey] = '';
    storageObj[indexKey] = null;
    
    await browser.storage.local.set(storageObj);
    
    loadWorkspaces();
    alert(`Cleared ${count} snippet${count !== 1 ? 's' : ''} from ${displayName}`);
}

async function deleteAllWorkspaces() {
    if (!confirm('Delete ALL workspaces and ALL snippets?\n\nThis cannot be undone!')) {
        return;
    }
    
    if (!confirm('Are you absolutely sure? This will delete EVERYTHING!')) {
        return;
    }
    
    try {
        await snippetStorage.init();
        const allKeys = await snippetStorage.getAllKeys();
        
        for (const key of allKeys) {
            await snippetStorage.delete(key);
        }
    } catch (error) {
        console.error('Error clearing snippet IndexedDB:', error);
    }
    
    try {
        const avifCache = new AVIFCache();
        await avifCache.init();
        
        await avifCache.clear();
    } catch (error) {
        console.error('Error clearing AVIF cache:', error);
    }
    
    const data = await browser.storage.local.get(null);
    
    const keysToDelete = Object.keys(data).filter(key => 
        key.startsWith('zoocagesnippets') || 
        key.startsWith('zoocageindexdata') || 
        key.startsWith('zoocageindexhash')
    );
    
    await browser.storage.local.remove(keysToDelete);
    
    loadWorkspaces();
    alert('All workspaces and AVIF cache deleted');
}

async function exportAllWorkspaces() {
    const data = await browser.storage.local.get(null);
    const zip = new JSZip();
    let hasWorkspaces = false;
    
    await snippetStorage.init();
    
    const avifToWorkspaces = new Map();
    
    for (const key of Object.keys(data)) {
        if (key.startsWith('zoocagesnippets_')) {
            const workspaceName = key.replace('zoocagesnippets_', '');
            const snippetsData = data[key] || [];
            
            if (snippetsData.length > 0) {
                const fullSnippets = await Promise.all(snippetsData.map(async (snippet) => {
                    if (snippet.inIndexedDB && snippet.timestamp) {
                        const fullSnippet = await snippetStorage.get(`snippet_${snippet.timestamp}`);
                        if (fullSnippet) {
                            return {
                                title: fullSnippet.title,
                                language: fullSnippet.language,
                                code: fullSnippet.code,
                                notes: fullSnippet.notes || '',
                                timestamp: fullSnippet.timestamp,
                                highlightedTerms: snippet.highlightedTerms || {}
                            };
                        }
                    }
                    
                    let code = snippet.code || '';
                    if (snippet.compressed && code) {
                        code = decompressText(code);
                    }
                    
                    return {
                        title: snippet.title,
                        language: snippet.language,
                        code: code,
                        notes: snippet.notes || '',
                        timestamp: snippet.timestamp,
                        highlightedTerms: snippet.highlightedTerms || {}
                    };
                }));
                
                fullSnippets.forEach(snippet => {
                    const cacheRefs = snippet.code.match(/avif-cache:\/\/([a-f0-9]+)/g) || [];
                    cacheRefs.forEach(ref => {
                        const hash = ref.replace('avif-cache://', '').split('#')[0];
                        if (!avifToWorkspaces.has(hash)) {
                            avifToWorkspaces.set(hash, new Set());
                        }
                        avifToWorkspaces.get(hash).add(workspaceName);
                    });
                });
                
                zip.file(`${workspaceName}.json`, JSON.stringify(fullSnippets, null, 2));
                hasWorkspaces = true;
            }
        } else if (key === 'zoocagesnippets') {
            const snippetsData = data[key] || [];
            
            if (snippetsData.length > 0) {
                const fullSnippets = await Promise.all(snippetsData.map(async (snippet) => {
                    if (snippet.inIndexedDB && snippet.timestamp) {
                        const fullSnippet = await snippetStorage.get(`snippet_${snippet.timestamp}`);
                        if (fullSnippet) {
                            return fullSnippet;
                        }
                    }
                    return snippet;
                }));
                
                fullSnippets.forEach(snippet => {
                    const cacheRefs = snippet.code.match(/avif-cache:\/\/([a-f0-9]+)/g) || [];
                    cacheRefs.forEach(ref => {
                        const hash = ref.replace('avif-cache://', '').split('#')[0];
                        if (!avifToWorkspaces.has(hash)) {
                            avifToWorkspaces.set(hash, new Set());
                        }
                        avifToWorkspaces.get(hash).add('default');
                    });
                });
                
                zip.file('default.json', JSON.stringify(fullSnippets, null, 2));
                hasWorkspaces = true;
            }
        }
    }
    
    if (!hasWorkspaces) {
        alert('No workspaces to export');
        return;
    }
    
    try {
        const avifCache = new AVIFCache();
        await avifCache.init();
        
        const avifKeys = await avifCache.getAllKeys();
        
        for (const hash of avifKeys) {
            const blob = await avifCache.get(hash);
            if (blob) {
                const workspaces = avifToWorkspaces.get(hash);
                
                if (workspaces && workspaces.size > 0) {
                    workspaces.forEach(workspaceName => {
                        const safeName = workspaceName.replace(/[^a-zA-Z0-9_-]/g, '_');
                        const filename = `${safeName}/${hash}#${blob.size}.avif`;
                        zip.file(filename, blob);
                    });
                } else {
                    const filename = `_orphaned/${hash}#${blob.size}.avif`;
                    zip.file(filename, blob);
                }
            }
        }
    } catch (error) {
    }
    
    const content = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
            level: 9
        }
    });
    
    const url = URL.createObjectURL(content);
    const timestamp = new Date().toISOString().split('T')[0];
    const link = document.createElement('a');
    link.href = url;
    link.download = `zoocage-workspaces-${timestamp}.zip`;
    link.click();
    URL.revokeObjectURL(url);
    
    showNotification(`Exported workspaces with ${avifKeys.length} AVIF images`);
}

function importAllWorkspaces(event) {
    const file = event.target.files[0];
    if (!file) return;
        
    JSZip.loadAsync(file).then(async (zip) => {
        const promises = [];
        const avifFiles = [];
        let totalImported = 0;
        let totalSkipped = 0;
        
        await snippetStorage.init();
        
        const avifCache = new AVIFCache();
        await avifCache.init();
        
        zip.forEach((relativePath, zipEntry) => {
            
            if (zipEntry.name.endsWith('.avif')) {
                avifFiles.push(zipEntry);
            }
        });
        
        for (const avifEntry of avifFiles) {
            try {
                const arrayBuffer = await avifEntry.async('arraybuffer');
                const blob = new Blob([arrayBuffer], { type: 'image/avif' });
                
                const filename = avifEntry.name.split('/').pop(); // Get just the filename
                const hashWithSize = filename.replace('.avif', '');
                const hash = hashWithSize.split('#')[0];
                
                await avifCache.set(hash, blob);
            } catch (error) {
                console.error('✗ Failed to import AVIF:', avifEntry.name, error);
            }
        }
        
        zip.forEach((relativePath, zipEntry) => {
            if (zipEntry.name.endsWith('.json')) {
                promises.push(
                    zipEntry.async('text').then(async (content) => {
                        try {
                            
                            const snippetsData = JSON.parse(content);
                            
                            const workspaceName = zipEntry.name.replace('.json', '');
                            
                            if (!Array.isArray(snippetsData)) {
                                console.error('Not an array!', typeof snippetsData);
                                return { imported: 0, skipped: 0 };
                            }
                            
                            const storageKey = workspaceName === 'default' ? 'zoocagesnippets' : `zoocagesnippets_${workspaceName}`;
                            
                            const result = await browser.storage.local.get(storageKey);
                            const existingSnippets = result[storageKey] || [];
                            
                            const existingSet = new Set(existingSnippets.map(s => 
                                `${s.title}|${s.timestamp}`
                            ));
                            
                            const newSnippets = [];
                            const storageSnippets = [];
                            
                            for (const snippet of snippetsData) {
                                const uniqueKey = `${snippet.title}|${snippet.timestamp}`;
                                
                                if (existingSet.has(uniqueKey)) {
                                    continue;
                                }
                                
                                const imageCount = (snippet.code || '').match(/data:image\/avif/g)?.length || 0;
                                const shouldUseIndexedDB = imageCount >= 1;
                                
                                if (shouldUseIndexedDB) {
                                    const timestamp = snippet.timestamp || Date.now();
                                    
                                    const fullSnippet = {
                                        title: snippet.title,
                                        language: snippet.language,
                                        code: snippet.code,
                                        notes: snippet.notes || '',
                                        timestamp: timestamp,
                                        highlightedTerms: snippet.highlightedTerms || {}
                                    };
                                    
                                    try {
                                        await snippetStorage.set(`snippet_${timestamp}`, fullSnippet);
                                        
                                        storageSnippets.push({
                                            title: snippet.title,
                                            language: snippet.language,
                                            code: '',
                                            notes: '',
                                            timestamp: timestamp,
                                            inIndexedDB: true,
                                            imageCount: imageCount,
                                            highlightedTerms: snippet.highlightedTerms || {}
                                        });
                                        
                                        newSnippets.push(fullSnippet);
                                    } catch (error) {
                                        console.error('✗ Failed to save to IndexedDB:', snippet.title, error);
                                        
                                        const compressedCode = compressText(snippet.code);
                                        storageSnippets.push({
                                            title: snippet.title,
                                            language: snippet.language,
                                            code: compressedCode,
                                            notes: snippet.notes || '',
                                            compressed: true,
                                            timestamp: snippet.timestamp || Date.now(),
                                            highlightedTerms: snippet.highlightedTerms || {}
                                        });
                                        newSnippets.push(snippet);
                                    }
                                } else {
                                    const compressedCode = compressText(snippet.code);
                                    storageSnippets.push({
                                        title: snippet.title,
                                        language: snippet.language,
                                        code: compressedCode,
                                        notes: snippet.notes || '',
                                        compressed: true,
                                        timestamp: snippet.timestamp || Date.now(),
                                        highlightedTerms: snippet.highlightedTerms || {}
                                    });
                                    newSnippets.push(snippet);
                                }
                            }
                            
                            const skipped = snippetsData.length - newSnippets.length;
                            
                            if (storageSnippets.length > 0) {
                                const merged = [...existingSnippets, ...storageSnippets];
                                
                                await browser.storage.local.set({ [storageKey]: merged });
                                
                                const hashKey = workspaceName === 'default' ? 'zoocageindexhash' : `zoocageindexhash_${workspaceName}`;
                                await browser.storage.local.set({ [hashKey]: '' });
                                
                                return {
                                    imported: newSnippets.length,
                                    skipped: skipped,
                                    workspace: workspaceName
                                };
                            }
                            
                            return { imported: 0, skipped: skipped, workspace: workspaceName };
                        } catch (error) {
                            console.error('Error parsing JSON for', zipEntry.name, ':', error);
                            return { imported: 0, skipped: 0 };
                        }
                    })
                );
            }
        });
        
        Promise.all(promises).then((results) => {
            
            const workspaceResults = {};
            
            results.forEach(result => {
                if (result.workspace) {
                    if (!workspaceResults[result.workspace]) {
                        workspaceResults[result.workspace] = { imported: 0, skipped: 0 };
                    }
                    workspaceResults[result.workspace].imported += result.imported;
                    workspaceResults[result.workspace].skipped += result.skipped;
                }
                totalImported += result.imported;
                totalSkipped += result.skipped;
            });
            
            loadWorkspaces();
            
            let message = `Imported ${totalImported} snippet${totalImported !== 1 ? 's' : ''}`;
            
            if (avifFiles.length > 0) {
                message += ` with ${avifFiles.length} AVIF image${avifFiles.length !== 1 ? 's' : ''}`;
            }
            
            const workspaceNames = Object.keys(workspaceResults);
            if (workspaceNames.length > 1) {
                message += ` across ${workspaceNames.length} workspace${workspaceNames.length !== 1 ? 's' : ''}:\n`;
                workspaceNames.forEach(name => {
                    const displayName = name === 'default' ? 'Default Workspace' : name;
                    const stats = workspaceResults[name];
                    if (stats.imported > 0) {
                        message += `\n- ${displayName}: ${stats.imported} snippet${stats.imported !== 1 ? 's' : ''}`;
                    }
                });
            }
            
            if (totalSkipped > 0) {
                message += `\n\nSkipped ${totalSkipped} duplicate${totalSkipped !== 1 ? 's' : ''}`;
            }
            
            alert(message);
        });
    }).catch((error) => {
        console.error('Error reading zip:', error);
        alert('Failed to import: invalid zip file');
    });
    
    event.target.value = '';
}

function importSourceFiles(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const MAX_WORKSPACE_SIZE = 100 * 1024 * 1024;
    
    const languageMap = {
        'js': 'javascript',
        'mjs': 'javascript',
        'jsx': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'py': 'python',
        'lua': 'lua',
        'md': 'markdown',
        'markdown': 'markdown',
        'java': 'java',
        'cpp': 'cpp',
        'cc': 'cpp',
        'cxx': 'cpp',
        'c': 'c',
        'h': 'c',
        'rs': 'rust',
        'go': 'go',
        'rb': 'ruby',
        'php': 'php',
        'sql': 'sql',
        'sh': 'bash',
        'bash': 'bash',
        'css': 'css',
        'scss': 'css',
        'sass': 'css',
        'html': 'xml',
        'htm': 'xml',
        'xml': 'xml',
        'svg': 'xml',
        'json': 'json',
        'yaml': 'yaml',
        'yml': 'yaml',
        'conf': 'ini',
        'config': 'ini',
        'ini': 'ini',
        'txt': 'plaintext',
        'cs': 'csharp',
        'swift': 'swift',
        'kt': 'kotlin',
        'pl': 'perl',
        'awk': 'awk',
        'diff': 'diff',
        'patch': 'diff',
        'makefile': 'makefile',
        'mk': 'makefile',
        'cmake': 'cmake',
        'dart': 'dart',
        'objc': 'objectivec',
        'm': 'objectivec',
        'mm': 'objectivec',
        'wasm': 'wasm',
        'wat': 'wasm'
    };
    
    const skipExtensions = new Set([
        'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'ico', 'tiff', 'tif', 'avif',
        'mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv', 'mpg', 'mpeg',
        'mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac', 'wma', 'opus', 'm4a', 'm4b',
        'exe', 'dll', 'so', 'dylib', 'bin', 'o', 'a', 'lib',
        'zip', 'tar', 'gz', 'bz2', '7z', 'rar', 'xz',
        'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt',
        'ttf', 'otf', 'woff', 'woff2', 'eot', 'lut', 'cube',
    ]);
    
    JSZip.loadAsync(file).then((zip) => {
        const sourceFiles = [];
        
        zip.forEach((relativePath, zipEntry) => {
            if (zipEntry.dir) return;
            
            const filename = zipEntry.name.split('/').pop();
            if (!filename || filename.startsWith('.')) return;
            
            const ext = filename.split('.').pop().toLowerCase();
            
            if (skipExtensions.has(ext)) return;
            
            const language = languageMap[ext] || 'plaintext';
            
            sourceFiles.push({
                entry: zipEntry,
                fullPath: zipEntry.name,
                language: language
            });
        });
        
        if (sourceFiles.length === 0) {
            alert('No source code files found in zip');
            event.target.value = '';
            return;
        }
        
        const workspaceChoices = [];
        
        browser.storage.local.get(null).then((data) => {
            Object.keys(data).forEach(key => {
                if (key.startsWith('zoocagesnippets_')) {
                    workspaceChoices.push(key.replace('zoocagesnippets_', ''));
                } else if (key === 'zoocagesnippets') {
                    workspaceChoices.push('default');
                }
            });
            
            let targetWorkspace = 'default';
            if (workspaceChoices.length >= 1) {
                const workspaceList = workspaceChoices.map((w, i) => `${i + 1}. ${w === 'default' ? 'Default Workspace' : w}`).join('\n');
                const choice = prompt(`Import ${sourceFiles.length} source file(s) into which workspace?\n\n${workspaceList}\n${workspaceChoices.length + 1}. Create new workspace\n\nEnter number (or press Cancel for Default):`);
                
                if (choice && !isNaN(choice)) {
                    const index = parseInt(choice) - 1;
                    if (index >= 0 && index < workspaceChoices.length) {
                        targetWorkspace = workspaceChoices[index];
                    } else if (index === workspaceChoices.length) {
                        const newName = prompt('Enter new workspace name:');
                        if (newName && newName.trim()) {
                            const trimmedName = newName.trim();
                            if (trimmedName === 'default') {
                                alert('Cannot use "default" as workspace name');
                                return;
                            }
                            if (!/^[a-zA-Z0-9\s_-]+$/.test(trimmedName)) {
                                alert('Workspace name can only contain letters, numbers, spaces, hyphens, and underscores');
                                return;
                            }
                            targetWorkspace = trimmedName;
                        }
                    }
                }
            }
            
            const promises = sourceFiles.map(fileInfo => {
                return fileInfo.entry.async('text').then((content) => {
                    return {
                        title: fileInfo.fullPath,
                        language: fileInfo.language,
                        code: content,
                        notes: '',
                        timestamp: Date.now()
                    };
                });
            });
            
            Promise.all(promises).then((newSnippets) => {
                let workspaceCounter = 1;
                let currentBatch = [];
                let currentSize = 0;
                const batches = [];
                
                newSnippets.forEach(snippet => {
                    const snippetSize = JSON.stringify(snippet).length;
                    
                    if (currentSize + snippetSize > MAX_WORKSPACE_SIZE && currentBatch.length > 0) {
                        batches.push({
                            snippets: currentBatch,
                            workspace: workspaceCounter === 1 ? targetWorkspace : `${targetWorkspace}#${workspaceCounter}`
                        });
                        workspaceCounter++;
                        currentBatch = [];
                        currentSize = 0;
                    }
                    
                    currentBatch.push(snippet);
                    currentSize += snippetSize;
                });
                
                if (currentBatch.length > 0) {
                    batches.push({
                        snippets: currentBatch,
                        workspace: workspaceCounter === 1 ? targetWorkspace : `${targetWorkspace}#${workspaceCounter}`
                    });
                }
                
                const importPromises = batches.map(batch => {
                    const storageKey = batch.workspace === 'default' ? 'zoocagesnippets' : `zoocagesnippets_${batch.workspace}`;
                    
                    return browser.storage.local.get(storageKey).then((result) => {
                        const existingSnippets = result[storageKey] || [];
                        
                        const existingSet = new Set(existingSnippets.map(s => 
                            `${s.title}|${s.code}|${s.notes}|${s.timestamp}`
                        ));
                        
                        const uniqueSnippets = batch.snippets.filter(s => 
                            !existingSet.has(`${s.title}|${s.code}|${s.notes}|${s.timestamp}`)
                        );
                        
                        if (uniqueSnippets.length === 0) {
                            return { imported: 0, skipped: batch.snippets.length, workspace: batch.workspace };
                        }
                        
                        const merged = [...existingSnippets, ...uniqueSnippets];
                        
                        return browser.storage.local.set({ [storageKey]: merged }).then(() => {
                            const hashKey = batch.workspace === 'default' ? 'zoocageindexhash' : `zoocageindexhash_${batch.workspace}`;
                            return browser.storage.local.set({ [hashKey]: '' }).then(() => ({
                                imported: uniqueSnippets.length,
                                skipped: batch.snippets.length - uniqueSnippets.length,
                                workspace: batch.workspace
                            }));
                        });
                    });
                });
                
                Promise.all(importPromises).then((results) => {
                    const totalImported = results.reduce((sum, r) => sum + r.imported, 0);
                    const totalSkipped = results.reduce((sum, r) => sum + r.skipped, 0);
                    
                    loadWorkspaces();
                    
                    let message = `Imported ${totalImported} source file${totalImported !== 1 ? 's' : ''}`;
                    
                    if (batches.length > 1) {
                        message += ` across ${batches.length} workspace${batches.length !== 1 ? 's' : ''}:\n`;
                        results.forEach(r => {
                            if (r.imported > 0) {
                                const displayName = r.workspace === 'default' ? 'Default Workspace' : r.workspace;
                                message += `\n- ${displayName}: ${r.imported} file${r.imported !== 1 ? 's' : ''}`;
                            }
                        });
                    } else {
                        const displayName = targetWorkspace === 'default' ? 'Default Workspace' : targetWorkspace;
                        message += ` into ${displayName}`;
                    }
                    
                    if (totalSkipped > 0) {
                        message += `\n\nSkipped ${totalSkipped} duplicate${totalSkipped !== 1 ? 's' : ''}`;
                    }
                    
                    alert(message);
                });
            });
        });
    }).catch((error) => {
        console.error('Error reading zip:', error);
        alert('Failed to import: invalid zip file');
    });
    
    event.target.value = '';
}

function updateWorkspaceIndicator() {
    browser.storage.local.get('zoocagealiases').then((result) => {
        const aliases = result.zoocagealiases || {};
        const displayName = currentWorkspace === 'default' ? 'Default' : (aliases[currentWorkspace] || currentWorkspace);
        
        const indicator = document.createElement('div');
        indicator.id = 'workspaceIndicator';
        indicator.style.cssText = 'color: #4ec9b0; font-weight: 600; font-size: 0.9rem;';
        indicator.innerHTML = `
            <a href="?view=workspaces" style="color: #4ec9b0; text-decoration: none;">← Workspaces</a> / ${displayName}
            <div id="snippetCount" style="color: #858585; font-weight: 400; font-size: 0.85rem; margin-top: 0.25rem;">${snippets.length}/${snippets.length} snippet${snippets.length !== 1 ? 's' : ''}</div>
        `;
        
        const headerLeft = document.querySelector('header > div:first-child > div:first-child');
        headerLeft.appendChild(indicator);
    });
}

function initApp() {
    initMode();
    loadThemes();
    migrateSnippets().then(() => {
        loadSnippets();
    });
    setupEventListeners();
    populateLanguageSelect();
    document.getElementById('searchInput').focus();
    updateWorkspaceIndicator();
    
    const preview = document.getElementById('codePreview');
    const codeTextarea = document.getElementById('snippetCode');
    const button = document.getElementById('toggleWrap');
    
    preview.classList.add('wrapped');
    codeTextarea.classList.add('wrapped');
    button.textContent = 'Unwrap';
    
    browser.storage.local.get('zoocageSplitView').then(({ zoocageSplitView = true }) => {
        if (zoocageSplitView) {
            setTimeout(() => {
                toggleSplitView();
            }, 100);
        }
    });

    async function migrateSnippets() {
        const storageKey = getStorageKey('snippets');
        const result = await browser.storage.local.get(storageKey);
        const rawSnippets = result[storageKey] || [];
        
        let modified = false;
        
        for (let snippet of rawSnippets) {
            if (!snippet.compressed && snippet.code) {
                snippet.code = compressText(snippet.code);
                snippet.compressed = true;
                modified = true;
            }
        }
        
        if (modified) {
            await browser.storage.local.set({ [storageKey]: rawSnippets });
        }
    }
}

async function requestPersistence() {
    if (navigator.storage && navigator.storage.persist) {
        const granted = await navigator.storage.persist();
    }
}

requestPersistence();

function updateSnippetCount(displayedCount) {
    const countElement = document.getElementById('snippetCount');
    if (countElement) {
        const total = snippets.length;
        countElement.textContent = `${displayedCount}/${total} snippet${total !== 1 ? 's' : ''}`;
    }
}

function getStorageKey(type) {
    if (currentWorkspace === 'default') {
        return type === 'snippets' ? 'zoocagesnippets' : 
               type === 'indexdata' ? 'zoocageindexdata' : 
               'zoocageindexhash';
    }
    return type === 'snippets' ? `zoocagesnippets_${currentWorkspace}` :
           type === 'indexdata' ? `zoocageindexdata_${currentWorkspace}` :
           `zoocageindexhash_${currentWorkspace}`;
}

function saveLastWorkspace(workspace) {
    browser.storage.local.set({ zoocagelastworkspace: workspace });
}

function getLastWorkspace() {
    return browser.storage.local.get('zoocagelastworkspace').then((result) => {
        return result.zoocagelastworkspace || 'default';
    });
}

function setupEventListeners() {
    document.getElementById('newSnippet').addEventListener('click', createNewSnippet);
    document.getElementById('deleteSnippet').addEventListener('click', deleteCurrentSnippet);
    document.getElementById('saveSnippet').addEventListener('click', saveCurrentSnippet);
    document.getElementById('copyCode').addEventListener('click', copyCode);
    document.getElementById('copyNotes').addEventListener('click', copyNotes);
    document.getElementById('clearTitle').addEventListener('click', clearTitle);
    document.getElementById('clearCode').addEventListener('click', clearCode);
    document.getElementById('clearNotes').addEventListener('click', clearNotes);
    document.getElementById('clearCode').addEventListener('click', clearCode);
    document.getElementById('titleCase').addEventListener('click', titleCase);
    document.getElementById('scrollToTop').addEventListener('click', scrollToTop);
    document.getElementById('scrollToNotes').addEventListener('click', scrollToNotes);
    document.getElementById('scrollToNotesFromPreview').addEventListener('click', scrollToNotes);
    document.getElementById('deleteSelectedBtn').addEventListener('click', deleteSelectedSnippets);
    document.getElementById('toggleWrap').addEventListener('click', toggleWrap);
    document.getElementById('toggleSplitView').addEventListener('click', toggleSplitView);
    document.getElementById('compareSelectedBtn').addEventListener('click', compareSelectedSnippets);
    document.getElementById('viewMarkdownBtn').addEventListener('click', toggleMarkdownView);
    document.getElementById('viewCsvBtn').addEventListener('click', viewCSVAsTable);
    document.getElementById('saveHtmlBtnTop').addEventListener('click', saveMarkdownAsHTML);
    document.getElementById('toggleFilePosition').addEventListener('click', toggleFilePosition);
    
    const saveNoImagesBtnTop = document.getElementById('saveNoImagesBtnTop');
    if (saveNoImagesBtnTop) {
        saveNoImagesBtnTop.addEventListener('click', saveSnippetWithoutImages);
    }

    document.getElementById('selectAllCheckbox').addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.snippet-checkbox');
        checkboxes.forEach(cb => cb.checked = e.target.checked);
        updateDeleteSelectedButton();
        updateCompareButton();
    });
    
    setupSortButtons();

    document.getElementById('searchInput').addEventListener('input', (e) => {
        document.getElementById('clearSearch').style.display = e.target.value ? 'flex' : 'none';
        const filterTerm = document.getElementById('filterInput').value.trim();
        if (filterTerm) {
            filterSnippets();
        } else {
            performSearch(e.target.value);
        }
    });

    document.getElementById('snippetTitle').addEventListener('focus', (e) => {
        lastFocusedElement = e.target;
    });
    document.getElementById('snippetCode').addEventListener('focus', (e) => {
        lastFocusedElement = e.target;
    });
    document.getElementById('snippetNotes').addEventListener('focus', (e) => {
        lastFocusedElement = e.target;
    });

    document.getElementById('excludeInput').addEventListener('input', (e) => {
        document.getElementById('clearExclude').style.display = e.target.value ? 'flex' : 'none';
        const searchTerm = document.getElementById('searchInput').value.trim();
        if (searchTerm.length >= 3) {
            performSearch(searchTerm);
        }
    });
    
    document.getElementById('filterInput').addEventListener('input', (e) => {
        document.getElementById('clearFilter').style.display = e.target.value ? 'flex' : 'none';
        filterSnippets();
    });

    document.getElementById('addTagBtn').addEventListener('click', addTagToSelected);
    document.getElementById('addTagInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTagToSelected();
        }
    });

    document.getElementById('pasteCode').addEventListener('click', () => {
        document.getElementById('snippetCode').focus();
    });
    
    document.getElementById('pasteNotes').addEventListener('click', () => {
        document.getElementById('snippetNotes').focus();
    });
    
    document.getElementById('clearSearch').addEventListener('click', () => {
        document.getElementById('searchInput').value = '';
        document.getElementById('clearSearch').style.display = 'none';
        renderSnippetList();
        document.getElementById('searchInput').focus();
    });

    document.getElementById('clearExclude').addEventListener('click', () => {
        document.getElementById('excludeInput').value = '';
        document.getElementById('clearExclude').style.display = 'none';
        const searchTerm = document.getElementById('searchInput').value.trim();
        if (searchTerm.length >= 3) {
            performSearch(searchTerm);
        }
        document.getElementById('excludeInput').focus();
    });

    document.getElementById('clearFilter').addEventListener('click', () => {
        document.getElementById('filterInput').value = '';
        document.getElementById('clearFilter').style.display = 'none';
        filterSnippets();
        document.getElementById('filterInput').focus();
    });
    
    document.querySelectorAll('input[name="search-mode"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const searchTerm = document.getElementById('searchInput').value.trim();
            if (searchTerm.length >= 3) {
                performSearch(searchTerm);
            }
        });
    });
    
    document.getElementById('snippetCode').addEventListener('input', () => {
        handleCodeInput();
        
        if (isMarkdownRendered) {
            clearTimeout(markdownRenderDebounceTimer);
            markdownRenderDebounceTimer = setTimeout(() => {
                renderMarkdownPreview();
            }, 400);
        } else {
            updatePreview();
        }
    });

    document.getElementById('snippetCode').addEventListener('paste', (e) => {
        setTimeout(() => {
            handleCodePaste(e);
        }, 10);
    });
    
    const notesTextarea = document.getElementById('snippetNotes');
    notesTextarea.addEventListener('input', autoResizeTextarea);
    notesTextarea.addEventListener('paste', (e) => {
        setTimeout(() => {
            handleNotesInput();
        }, 10);
    });

    setupDropdown('themeSelectorDark', true);
    setupDropdown('themeSelectorLight', false);
    
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            if (document.getElementById('editorContainer').classList.contains('active')) {
                saveCurrentSnippet();
            }
        }
        
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            createNewSnippet();
        }
    });

    document.getElementById('markdownSettingsBtn').addEventListener('click', () => {
        loadMarkdownSettings();
        document.getElementById('markdownSettingsModal').style.display = 'block';
    });
    
    document.getElementById('saveMarkdownSettings').addEventListener('click', saveMarkdownSettings);
    
    document.getElementById('closeMarkdownSettings').addEventListener('click', () => {
        document.getElementById('markdownSettingsModal').style.display = 'none';
    });
    
    document.querySelector('.modal-overlay').addEventListener('click', () => {
        document.getElementById('markdownSettingsModal').style.display = 'none';
    });

    let isSyncing = false;
    let syncScrollEnabled = true;
    
    const codeTextarea = document.getElementById('snippetCode');
    const preview = document.getElementById('codePreview');
    const toggleSyncBtn = document.getElementById('toggleSyncScroll');
    
    if (toggleSyncBtn) {
        toggleSyncBtn.addEventListener('click', () => {
            syncScrollEnabled = !syncScrollEnabled;
            toggleSyncBtn.textContent = syncScrollEnabled ? 'Sync' : 'Sync';
            toggleSyncBtn.style.opacity = syncScrollEnabled ? '1' : '0.5';
            showNotification(syncScrollEnabled ? 'Sync scroll enabled' : 'Sync scroll disabled');
        });
    }
    
    codeTextarea.addEventListener('scroll', () => {
        if (!syncScrollEnabled || isSyncing) return;
    
        isSyncing = true;
        const scrollPercentage = codeTextarea.scrollTop / (codeTextarea.scrollHeight - codeTextarea.clientHeight);
        const targetScrollTop = scrollPercentage * (preview.scrollHeight - preview.clientHeight);
        preview.scrollTop = targetScrollTop;
    
        setTimeout(() => {
            isSyncing = false;
        }, 50);
    });
    
    preview.addEventListener('scroll', () => {
        if (!syncScrollEnabled || isSyncing) return;
    
        isSyncing = true;
        const scrollPercentage = preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
        const targetScrollTop = scrollPercentage * (codeTextarea.scrollHeight - codeTextarea.clientHeight);
        codeTextarea.scrollTop = targetScrollTop;
    
        setTimeout(() => {
            isSyncing = false;
        }, 50);
    });
}

function sortSnippets() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    
    if (currentSortMode === 'default') {
        renderSnippetList(searchTerm);
        return;
    }
    
    let sorted = [...snippets];
    
    if (currentSortMode === 'alpha-asc') {
        sorted.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
    } else if (currentSortMode === 'alpha-desc') {
        sorted.sort((a, b) => b.title.toLowerCase().localeCompare(a.title.toLowerCase()));
    } else if (currentSortMode === 'size-asc') {
        sorted.sort((a, b) => (a.code || '').length - (b.code || '').length);
    } else if (currentSortMode === 'size-desc') {
        sorted.sort((a, b) => (b.code || '').length - (a.code || '').length);
    } else if (currentSortMode === 'date-asc') {
        sorted.sort((a, b) => a.timestamp - b.timestamp);
    } else if (currentSortMode === 'date-desc') {
        sorted.sort((a, b) => b.timestamp - a.timestamp);
    }
    
    renderSnippetList(searchTerm, sorted);
}

function setupSortButtons() {
    const alphaBtn = document.getElementById('sortAlphaBtn');
    const sizeBtn = document.getElementById('sortSizeBtn');
    const dateBtn = document.getElementById('sortDateBtn');
    
    alphaBtn.addEventListener('click', () => {
        if (currentSortMode === 'alpha-asc') {
            currentSortMode = 'alpha-desc';
            alphaBtn.textContent = 'A-Z';
            alphaBtn.title = 'Sort alphabetically';
        } else if (currentSortMode === 'alpha-desc') {
            currentSortMode = 'default';
            alphaBtn.textContent = 'A-Z';
            alphaBtn.title = 'Sort alphabetically';
        } else {
            currentSortMode = 'alpha-asc';
            alphaBtn.textContent = 'A-Z';
            alphaBtn.title = 'Sort alphabetically';
        }
        sortSnippets();
    });
    
    sizeBtn.addEventListener('click', () => {
        if (currentSortMode === 'size-desc') {
            currentSortMode = 'size-asc';
            sizeBtn.textContent = 'Size';
            sizeBtn.title = 'Sort by file size ';
        } else if (currentSortMode === 'size-asc') {
            currentSortMode = 'default';
            sizeBtn.textContent = 'Size';
            sizeBtn.title = 'Sort by file size';
        } else {
            currentSortMode = 'size-desc';
            sizeBtn.textContent = 'Size';
            sizeBtn.title = 'Sort by file size';
        }
        sortSnippets();
    });

    dateBtn.addEventListener('click', () => {
           if (currentSortMode === 'date-desc') {
               currentSortMode = 'date-asc';
               dateBtn.textContent = 'Date';
               dateBtn.title = 'Sort by date (oldest first)';
           } else if (currentSortMode === 'date-asc') {
               currentSortMode = 'default';
               dateBtn.textContent = 'Date';
               dateBtn.title = 'Sort by date';
           } else {
               currentSortMode = 'date-desc';
               dateBtn.textContent = 'Date';
               dateBtn.title = 'Sort by date (newest first)';
           }
           sortSnippets();
       });
}

function loadMarkdownSettings() {
    browser.storage.local.get({
        markdownIncludeTitle: true,
        markdownIncludeUrl: true,
        markdownIncludeAuthor: true,
        markdownIncludeDate: true,
        markdownPreserveTableLinebreaks: false,
        markdownFont: '0xProto' 
    }).then((settings) => {
        
        document.getElementById('includeTitle').checked = settings.markdownIncludeTitle;
        document.getElementById('includeUrl').checked = settings.markdownIncludeUrl;
        document.getElementById('includeAuthor').checked = settings.markdownIncludeAuthor;
        document.getElementById('includeDate').checked = settings.markdownIncludeDate;
        document.getElementById('preserveTableLinebreaks').checked = settings.markdownPreserveTableLinebreaks;
        document.getElementById('markdownFontSelect').value = settings.markdownFont; 
        currentMarkdownFont = settings.markdownFont;
    });
}

function saveMarkdownSettings() {    
    const settings = {
        markdownIncludeTitle: document.getElementById('includeTitle').checked,
        markdownIncludeUrl: document.getElementById('includeUrl').checked,
        markdownIncludeAuthor: document.getElementById('includeAuthor').checked,
        markdownIncludeDate: document.getElementById('includeDate').checked,
        markdownPreserveTableLinebreaks: document.getElementById('preserveTableLinebreaks').checked,
        markdownFont: document.getElementById('markdownFontSelect').value 
    };

    currentMarkdownFont = settings.markdownFont;
    
    browser.storage.local.set(settings).then(() => {
        document.getElementById('markdownSettingsModal').style.display = 'none';
        showNotification('Markdown settings saved!');
        
        if (isMarkdownRendered) {
            applyThemeToMarkdown();
        }
    });
}

function applyThemeToMarkdown() {
    const testPre = document.createElement('pre');
    testPre.className = 'hljs';
    testPre.innerHTML = `
        <span class="hljs-keyword">keyword</span>
        <span class="hljs-string">string</span>
        <span class="hljs-function">function</span>
        <span class="hljs-title">title</span>
        <span class="hljs-comment">comment</span>
    `;
    testPre.style.position = 'absolute';
    testPre.style.visibility = 'hidden';
    document.body.appendChild(testPre);
    
    const preStyles = window.getComputedStyle(testPre);
    const bgColor = preStyles.backgroundColor;
    const textColor = preStyles.color;
    
    const keywordEl = testPre.querySelector('.hljs-keyword');
    const stringEl = testPre.querySelector('.hljs-string');
    const titleEl = testPre.querySelector('.hljs-title');
    
    const keywordColor = keywordEl ? window.getComputedStyle(keywordEl).color : '#4ec9b0';
    const stringColor = stringEl ? window.getComputedStyle(stringEl).color : '#ce9178';
    const titleColor = titleEl ? window.getComputedStyle(titleEl).color : '#dcdcaa';
    
    document.body.removeChild(testPre);
    
    browser.storage.local.get({ markdownFont: '0xProto' }).then(({ markdownFont }) => {
        let styleEl = document.getElementById('markdown-theme-styles');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'markdown-theme-styles';
            document.head.appendChild(styleEl);
        }
        
        styleEl.textContent = `
            .markdown-preview-content {
                background: ${bgColor} !important;
                color: ${textColor} !important;
                font-family: '${markdownFont}', Consolas, Monaco, 'Courier New', monospace !important;
            }
            
            .markdown-preview-content h1,
            .markdown-preview-content h2 {
                color: ${titleColor} !important;
                border-bottom-color: rgba(255, 255, 255, 0.1) !important;
                font-family: '${markdownFont}', Consolas, Monaco, 'Courier New', monospace !important;
            }
            
            .markdown-preview-content h3,
            .markdown-preview-content h4,
            .markdown-preview-content h5,
            .markdown-preview-content h6 {
                color: ${titleColor} !important;
                font-family: '${markdownFont}', Consolas, Monaco, 'Courier New', monospace !important;
            }
            
            .markdown-preview-content p,
            .markdown-preview-content li,
            .markdown-preview-content td,
            .markdown-preview-content th {
                font-family: '${markdownFont}', Consolas, Monaco, 'Courier New', monospace !important;
            }
            
            .markdown-preview-content a {
                color: ${keywordColor} !important;
            }
            
            .markdown-preview-content a:hover {
                color: ${stringColor} !important;
            }
            
            .markdown-preview-content code:not(.hljs) {
                background: rgba(255, 255, 255, 0.1) !important;
                color: ${stringColor} !important;
                font-family: '${markdownFont}', Consolas, Monaco, 'Courier New', monospace !important;
            }
            
            .markdown-preview-content pre code {
                font-family: '${markdownFont}', Consolas, Monaco, 'Courier New', monospace !important;
            }
            
            .markdown-preview-content blockquote {
                border-left-color: ${keywordColor} !important;
                color: ${textColor} !important;
                opacity: 0.7;
                font-family: '${markdownFont}', Consolas, Monaco, 'Courier New', monospace !important;
            }
            
            .markdown-preview-content hr {
                border-top-color: rgba(255, 255, 255, 0.1) !important;
            }
            
            .markdown-preview-content strong {
                color: ${titleColor} !important;
            }
            
            .markdown-preview-content em {
                color: ${stringColor} !important;
            }
        `;
    });
}

async function renderMarkdownPreview() {
    
    const codeTextarea = document.getElementById('snippetCode');
    const preview = document.getElementById('codePreview');
    const saveHtmlBtnTop = document.getElementById('saveHtmlBtnTop');
    const saveNoImagesBtnTop = document.getElementById('saveNoImagesBtnTop');
    
    let code;
    if (isMarkdownRendered) {
        code = codeTextarea.value;
    } else if (currentSnippetIndex !== null && snippets[currentSnippetIndex]) {
        code = snippets[currentSnippetIndex].code;
    } else {
        code = codeTextarea.value;
    }
    
    if (!code) {
        preview.textContent = 'Preview will appear here...';
        preview.style.color = '#858585';
        if (saveHtmlBtnTop) saveHtmlBtnTop.style.display = 'none';
        if (saveNoImagesBtnTop) saveNoImagesBtnTop.style.display = 'none';
        return;
    }
    
    const imageUrlPattern = /!\[([^\]]*)\]\((https?:\/\/[^\)]+)\)/g;
    const imageMatches = [...code.matchAll(imageUrlPattern)];
    
    if (imageMatches.length > 0) {
        
        for (const match of imageMatches) {
            const fullMatch = match[0];
            const alt = match[1];
            const url = match[2];
            
            const encoder = new TextEncoder();
            const data = encoder.encode(url);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
            
            const cachedExists = await browser.runtime.sendMessage({
                type: 'checkAVIFCache',
                hash: hash
            });
            
            if (cachedExists) {
                
                try {
                    const data = await browser.runtime.sendMessage({
                        type: 'getAVIFCacheWithSize',
                        hash: hash
                    });
                    
                    if (data && data.size) {
                        const replacement = `![${alt}](avif-cache://${hash}#${data.size})`;
                        code = code.replace(fullMatch, replacement);
                    }
                } catch (error) {
                    console.error('Failed to get cached image with size:', error);
                }
            }
        }
    }
    
    const cacheRefs = code.match(/avif-cache:\/\/([a-f0-9]+)/g) || [];
        
    for (const ref of cacheRefs) {
        const fullRef = ref.replace('avif-cache://', '');
        const hash = fullRef.split('#')[0];
        const dataUrl = await browser.runtime.sendMessage({
            type: 'getAVIFCache',
            hash: hash
        });
        if (dataUrl && typeof dataUrl === 'string') {
            code = code.replace(ref, dataUrl);
        } else {
        }
    }
        
    if (typeof window.markdownit === 'undefined') {
        showNotification('Markdown-it library not loaded', 'error');
        return;
    }
    
    const md = window.markdownit({
        html: true,
        linkify: true,
        typographer: true,
        breaks: true,
        highlight: function (str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return '<pre class="hljs"><code class="hljs language-' + lang + '">' +
                           hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                           '</code></pre>';
                } catch (e) {
                    console.error('Highlight error:', e);
                }
            }
            return '<pre class="hljs"><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre>';
        }
    }).enable('image');
    
    md.validateLink = function(url) {
        if (url.startsWith('data:image/')) {
            return true;
        }
        const BAD_PROTO_RE = /^(vbscript|javascript|file|data):/;
        const GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp|avif);/;
        
        const str = url.trim().toLowerCase();
        return !BAD_PROTO_RE.test(str) || GOOD_DATA_RE.test(str);
    };
    
    let rendered = md.render(code);

    let highlightTerms = null;
    let cjkMode = false;
    
    if (currentSnippetIndex !== null) {
        const snippet = snippets[currentSnippetIndex];
        if (snippet.highlightedTerms) {
            highlightTerms = snippet.highlightedTerms;
        }
        if (snippet.cjkMode !== undefined) {
            cjkMode = snippet.cjkMode;
        }
    }
    
    if (!highlightTerms) {
        const codeTextarea = document.getElementById('snippetCode');
        if (codeTextarea.dataset.pendingHighlights) {
            try {
                highlightTerms = JSON.parse(codeTextarea.dataset.pendingHighlights);
            } catch (e) {
                console.error('Failed to parse pending highlights:', e);
            }
        }
        
        if (codeTextarea.dataset.pendingCjkMode !== undefined) {
            cjkMode = codeTextarea.dataset.pendingCjkMode === 'true';
        }
    }
    
    if (highlightTerms && Object.keys(highlightTerms).length > 0) {
        rendered = applyHighlightsWithColors(rendered, highlightTerms, cjkMode);
    }
    
    if (currentSnippetIndex !== null) {
        const snippet = snippets[currentSnippetIndex];
        
        if (snippet.highlightedTerms && Object.keys(snippet.highlightedTerms).length > 0) {
            rendered = applyHighlightsWithColors(rendered, snippet.highlightedTerms);
        } else {
        }
    } else {
    }
    
    preview.innerHTML = `<div class="markdown-preview-content" id="markdownPdfContent" style="padding: 1rem; max-width: 640px; line-height: 1.6;">
        ${rendered}
    </div>`;
    
    applyThemeToMarkdown();
    
    if (saveHtmlBtnTop) saveHtmlBtnTop.style.display = 'inline-block';
    if (saveNoImagesBtnTop) saveNoImagesBtnTop.style.display = 'inline-block';
}

async function toggleMarkdownView() {
    const codeTextarea = document.getElementById('snippetCode');
    const preview = document.getElementById('codePreview');
    const markdownBtn = document.getElementById('viewMarkdownBtn');
    const saveHtmlBtnTop = document.getElementById('saveHtmlBtnTop');
    const saveNoImagesBtnTop = document.getElementById('saveNoImagesBtnTop');
    const lang = getCurrentLanguage();
    
    let code;
    if (currentSnippetIndex !== null && snippets[currentSnippetIndex]) {
        code = snippets[currentSnippetIndex].code;
    } else {
        code = codeTextarea.value;
    }
    
    if (!code) return;
    
    if (!isMarkdownRendered) {
        if (lang !== 'markdown') {
            setLanguageDropdown('markdown');
        }
        
        await renderMarkdownPreview();
        
        markdownBtn.textContent = 'View as Code';
        if (saveHtmlBtnTop) saveHtmlBtnTop.style.display = 'inline-block';
        if (saveNoImagesBtnTop) saveNoImagesBtnTop.style.display = 'inline-block';
        isMarkdownRendered = true;
    } else {
        updatePreview(lang);
        markdownBtn.textContent = 'View as Markdown';
        if (saveHtmlBtnTop) saveHtmlBtnTop.style.display = 'none';
        if (saveNoImagesBtnTop) saveNoImagesBtnTop.style.display = 'none';
        isMarkdownRendered = false;
    }
}

function cleanupMarkdownPreview() {
    const preview = document.getElementById('codePreview');
    
    const images = preview.querySelectorAll('img');
    images.forEach(img => {
        img.src = ''; 
        img.remove();
    });
    
    preview.innerHTML = '';
}

function printMarkdown() {
    const title = document.getElementById('snippetTitle').value || 'markdown-export';
    const safeTitle = title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    
    const originalTitle = document.title;
    document.title = safeTitle;
    
    const printStyles = `
        @media print {
            body * {
                visibility: hidden;
            }
            #codePreview, #codePreview * {
                visibility: visible;
            }
            #codePreview {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
            }
            #printMarkdownBtn, #saveHtmlBtn {
                display: none !important;
            }
            #codePreview h1, #codePreview h2 {
                page-break-after: avoid;
            }
            #codePreview pre {
                page-break-inside: avoid;
            }
            #codePreview img {
                max-width: 100%;
                page-break-inside: avoid;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = printStyles;
    document.head.appendChild(styleSheet);
    
    window.print();
    
    setTimeout(() => {
        styleSheet.remove();
        document.title = originalTitle;
    }, 1000);
}

async function saveMarkdownAsHTML() {
    const content = document.getElementById('markdownPdfContent');
    if (!content) {
        const preview = document.getElementById('codePreview');
        if (!preview || !preview.innerHTML || preview.innerHTML.includes('Preview will appear here')) {
            showNotification('Please render markdown first (View as Markdown button)', 'error');
            return;
        }
    }
    
    const title = document.getElementById('snippetTitle').value || 'markdown-export';
    const safeTitle = title.replace(/[<>:"/\\|?*]/g, '-');

    const codeTextarea = document.getElementById('snippetCode');
    let code = currentSnippetIndex !== null && snippets[currentSnippetIndex] 
        ? snippets[currentSnippetIndex].code 
        : codeTextarea.value;

    const avifCache = new AVIFCache();
    await avifCache.init();
    
    const cacheRefs = code.match(/avif-cache:\/\/([a-f0-9]+)(?:#\d+)?/g) || [];
    for (const ref of cacheRefs) {
        const hash = ref.replace('avif-cache://', '').split('#')[0];
        const blob = await avifCache.get(hash);
        
        if (blob) {
            const arrayBuffer = await blob.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            let binary = '';
            for (let i = 0; i < uint8Array.length; i++) {
                binary += String.fromCharCode(uint8Array[i]);
            }
            const base64 = btoa(binary);
            const dataUrl = `data:image/avif;base64,${base64}`;
            
            code = code.replace(new RegExp(escapeRegex(ref), 'g'), dataUrl);
        }
    }

    const md = window.markdownit({
        html: true,
        linkify: true,
        typographer: true,
        breaks: true,
        highlight: function (str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return '<pre class="hljs"><code class="hljs language-' + lang + '">' +
                           hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                           '</code></pre>';
                } catch (e) {
                    console.error('Highlight error:', e);
                }
            }
            return '<pre class="hljs"><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre>';
        }
    }).enable('image');
    
    md.validateLink = function(url) {
        if (url.startsWith('data:image/')) {
            return true;
        }
        const BAD_PROTO_RE = /^(vbscript|javascript|file|data):/;
        const GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp|avif);/;
        
        const str = url.trim().toLowerCase();
        return !BAD_PROTO_RE.test(str) || GOOD_DATA_RE.test(str);
    };
    
    let rendered = md.render(code);

    if (currentSnippetIndex !== null) {
        const snippet = snippets[currentSnippetIndex];
        if (snippet.highlightedTerms && Object.keys(snippet.highlightedTerms).length > 0) {
            rendered = applyHighlightsWithColors(rendered, snippet.highlightedTerms, snippet.cjkMode || false);
        }
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = rendered;
    
    const buttonsDiv = tempDiv.querySelector('div[style*="border-top"]');
    if (buttonsDiv) {
        buttonsDiv.remove();
    }
    
    const themeStylesheet = document.getElementById('themeStylesheet');
    let themeCSS = '';
    
    try {
        const response = await fetch(themeStylesheet.href);
        themeCSS = await response.text();
    } catch (error) {
        console.error('Failed to fetch theme CSS:', error);
    }
    
    const isDarkTheme = themeStylesheet.href.includes('themesdark/');
    
    const testPre = document.createElement('pre');
    testPre.className = 'hljs';
    testPre.innerHTML = `
        <span class="hljs-keyword">keyword</span>
        <span class="hljs-string">string</span>
        <span class="hljs-function">function</span>
        <span class="hljs-title">title</span>
        <span class="hljs-comment">comment</span>
    `;
    testPre.style.position = 'absolute';
    testPre.style.visibility = 'hidden';
    document.body.appendChild(testPre);
    
    const preStyles = window.getComputedStyle(testPre);
    const bgColor = preStyles.backgroundColor;
    const textColor = preStyles.color;
    
    const keywordEl = testPre.querySelector('.hljs-keyword');
    const stringEl = testPre.querySelector('.hljs-string');
    const titleEl = testPre.querySelector('.hljs-title');
    
    const keywordColor = keywordEl ? window.getComputedStyle(keywordEl).color : '#4ec9b0';
    const stringColor = stringEl ? window.getComputedStyle(stringEl).color : '#ce9178';
    const titleColor = titleEl ? window.getComputedStyle(titleEl).color : '#dcdcaa';
    
    document.body.removeChild(testPre);
    
    const bodyBgColor = isDarkTheme ? '#1e1e1e' : '#f5f5f5';
    const bodyTextColor = textColor;
    
    const { markdownFont = '0xProto' } = await browser.storage.local.get({ markdownFont: '0xProto' });
    
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <style>
        ${themeCSS}
        
        body {
            font-family: '${markdownFont}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            max-width: 640px;
            margin: 0 auto;
            padding: 2rem;
            background: ${bodyBgColor};
            color: ${bodyTextColor};
        }
        
        p {
            color: ${bodyTextColor};
        }
        
        img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 1rem 0;
        }
        
        pre {
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
            margin: 1rem 0;
        }
        
        code {
            font-family: '${markdownFont}', 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 0.9em;
        }
        
        pre code {
            background: none !important;
            padding: 0;
        }
        
        :not(pre) > code {
            background: ${isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
            color: ${stringColor};
            padding: 2px 6px;
            border-radius: 3px;
        }
        
        blockquote {
            border-left: 4px solid ${keywordColor};
            margin: 1rem 0;
            padding-left: 1rem;
            color: ${bodyTextColor};
            opacity: 0.7;
        }
        
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1rem 0;
        }
        
        th, td {
            border: 1px solid ${isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
            padding: 0.5rem;
            text-align: left;
        }
        
        th {
            background: ${isDarkTheme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
            font-weight: 600;
        }
        
        a {
            color: ${keywordColor};
            text-decoration: none;
        }
        
        a:hover {
            color: ${stringColor};
            text-decoration: underline;
        }
        
        h1, h2, h3, h4, h5, h6 {
            margin-top: 1.5rem;
            margin-bottom: 0.5rem;
            color: ${titleColor};
        }
        
        h1 { 
            font-size: 2em; 
            border-bottom: 2px solid ${isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}; 
            padding-bottom: 0.3rem; 
        }
        h2 { 
            font-size: 1.5em; 
            border-bottom: 1px solid ${isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}; 
            padding-bottom: 0.3rem; 
        }
        h3 { font-size: 1.25em; }
        
        ul, ol {
            padding-left: 2rem;
        }
        
        li {
            margin: 0.25rem 0;
        }
        
        hr {
            border: none;
            border-top: 1px solid ${isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
            margin: 2rem 0;
        }
        
        strong {
            color: ${titleColor};
        }
        
        em {
            color: ${stringColor};
        }
        
        .hide-highlights mark.zoocage-highlight {
            background-color: transparent !important;
            color: inherit !important;
            padding: 0 !important;
        }
        
        @media print {
            body {
                background: white;
                color: black;
            }
            
            p {
                color: black;
            }
            
            h1, h2, h3, h4, h5, h6 {
                color: #333;
            }
            
            pre {
                background: #f5f5f5;
                border: 1px solid #ddd;
            }
            
            :not(pre) > code {
                background: #f5f5f5;
                border: 1px solid #ddd;
                color: #333;
            }
            
            a {
                color: #0066cc;
            }
            
            th, td {
                border-color: #ddd;
            }
            
            th {
                background: #f5f5f5;
            }
            
            blockquote {
                border-left-color: #0066cc;
                color: #333;
            }
            
            #toggleHighlights {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div id="toggleHighlights" onclick="document.body.classList.toggle('hide-highlights'); this.style.opacity = document.body.classList.contains('hide-highlights') ? '0.3' : '1';" style="position: fixed; top: 10px; right: 10px; background: ${isDarkTheme ? '#2d2d2d' : 'white'}; padding: 10px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); cursor: pointer; z-index: 1000; font-size: 14px; line-height: 1; user-select: none;" title="Toggle Highlights">
        🟧
    </div>
    
    ${tempDiv.innerHTML}
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${safeTitle}.html`;
    link.click();
    
    URL.revokeObjectURL(url);
}

function getContrastColor(bgColor) {
    let r, g, b;
    
    if (bgColor.startsWith('rgb')) {
        const match = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
            r = parseInt(match[1]);
            g = parseInt(match[2]);
            b = parseInt(match[3]);
        }
    } else if (bgColor.startsWith('#')) {
        let hex = bgColor.replace('#', '');
        if (hex.length === 3) {
            hex = hex.split('').map(c => c + c).join('');
        }
        r = parseInt(hex.substr(0, 2), 16);
        g = parseInt(hex.substr(2, 2), 16);
        b = parseInt(hex.substr(4, 2), 16);
    }
    
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

function applyHighlightsWithColors(htmlContent, termColorMap, cjkMode = false) {
    if (!termColorMap || Object.keys(termColorMap).length === 0) return htmlContent;
        
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    function highlightTextNodes(node, term, bgColor) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            let regex;
            
            if (cjkMode) {
                regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
            } else {
                regex = new RegExp(`\\b(\\w*${escapeRegex(term)}\\w*)\\b`, 'gi');
            }
            
            if (regex.test(text)) {
                const textColor = getContrastColor(bgColor);
                const replaceRegex = cjkMode 
                    ? new RegExp(`(${escapeRegex(term)})`, 'gi')
                    : new RegExp(`\\b(\\w*${escapeRegex(term)}\\w*)\\b`, 'gi');
                
                const highlightedText = text.replace(replaceRegex, 
                    `<mark class="zoocage-highlight" style="background-color: ${bgColor}; color: ${textColor}; padding: 2px 4px; border-radius: 3px;">$1</mark>`);
                
                const span = document.createElement('span');
                span.innerHTML = highlightedText;
                node.parentNode.replaceChild(span, node);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE && 
                   node.tagName !== 'MARK' && 
                   node.tagName !== 'SCRIPT' && 
                   node.tagName !== 'STYLE') {
            Array.from(node.childNodes).forEach(child => highlightTextNodes(child, term, bgColor));
        }
    }
    
    Object.entries(termColorMap).forEach(([term, bgColor]) => {
        highlightTextNodes(tempDiv, term, bgColor);
    });
    
    return tempDiv.innerHTML;
}

function autoResizeTextarea(e) {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.max(120, textarea.scrollHeight + 2) + 'px';
}

function clearTitle() {
    document.getElementById('snippetTitle').value = '';
    document.getElementById('snippetTitle').focus();
}

function clearCode() {
    if (document.getElementById('snippetCode').value && 
        !confirm('Clear all code?')) {
        return;
    }
    document.getElementById('snippetCode').value = '';
    document.getElementById('codePreview').textContent = 'Preview will appear here...';
    document.getElementById('codePreview').style.color = '#858585';
    document.getElementById('snippetCode').focus();
}

function clearNotes() {
    if (document.getElementById('snippetNotes').value && 
        !confirm('Clear all notes?')) {
        return;
    }
    document.getElementById('snippetNotes').value = '';
    document.getElementById('snippetNotes').style.height = '120px';
    clearNotesHighlight();
    document.getElementById('snippetNotes').focus();
}

function scrollToTop() {
    document.getElementById('editorContainer').scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function skipToStartOfBase64() {
    const codeTextarea = document.getElementById('snippetCode');
    const cursorPos = codeTextarea.selectionStart;
    const code = codeTextarea.value;
    
    const base64Pattern = /data:image\/[^;]+;base64,[A-Za-z0-9+/=\s]+/g;
    let match;
    let foundMatch = null;
    
    while ((match = base64Pattern.exec(code)) !== null) {
        const start = match.index;
        const end = start + match[0].length;
        
        if (cursorPos >= start && cursorPos <= end) {
            foundMatch = { start, end };
            break;
        }
    }
    
    if (foundMatch) {
        codeTextarea.focus();
        codeTextarea.setSelectionRange(foundMatch.start, foundMatch.start);
        
        const lines = code.substring(0, foundMatch.start).split('\n');
        const lineNumber = lines.length;
        const lineHeight = 1.6 * parseFloat(getComputedStyle(codeTextarea).fontSize);
        codeTextarea.scrollTop = Math.max(0, (lineNumber - 5) * lineHeight);
        
        showNotification('Jumped to start of base64 image');
    }
}

function scrollToNotes() {
    const notesSection = document.getElementById('notesSection');
    if (notesSection) {
        notesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        setTimeout(() => {
            document.getElementById('snippetNotes').focus();
        }, 500);
    }
}

function skipToEndOfBase64() {
    const codeTextarea = document.getElementById('snippetCode');
    const cursorPos = codeTextarea.selectionStart;
    const code = codeTextarea.value;
    
    const base64Pattern = /data:image\/[^;]+;base64,[A-Za-z0-9+/=\s]+/g;
    let match;
    let foundMatch = null;
    
    while ((match = base64Pattern.exec(code)) !== null) {
        const start = match.index;
        const end = start + match[0].length;
        
        if (cursorPos >= start && cursorPos <= end) {
            foundMatch = { start, end };
            break;
        }
    }
    
    if (foundMatch) {
        codeTextarea.focus();
        codeTextarea.setSelectionRange(foundMatch.end, foundMatch.end);
        
        const lines = code.substring(0, foundMatch.end).split('\n');
        const lineNumber = lines.length;
        const lineHeight = 1.6 * parseFloat(getComputedStyle(codeTextarea).fontSize);
        codeTextarea.scrollTop = (lineNumber - 5) * lineHeight;
        
        showNotification('Jumped to end of base64 image');
    }
}

function toggleFilePosition() {
    const codeTextarea = document.getElementById('snippetCode');
    const button = document.getElementById('toggleFilePosition');
    
    if (filePositionAtEnd) {
        codeTextarea.focus();
        codeTextarea.setSelectionRange(0, 0);
        codeTextarea.scrollTop = 0;
        button.textContent = '↓File';
        button.title = 'Jump to end of file';
        filePositionAtEnd = false;
        showNotification('Jumped to start of file');
    } else {
        codeTextarea.focus();
        codeTextarea.setSelectionRange(codeTextarea.value.length, codeTextarea.value.length);
        codeTextarea.scrollTop = codeTextarea.scrollHeight;
        button.textContent = '↑File';
        button.title = 'Jump to start of file';
        filePositionAtEnd = true;
        showNotification('Jumped to end of file');
    }
}

function checkCursorInBase64() {
    const codeTextarea = document.getElementById('snippetCode');
    const skipStartBtn = document.getElementById('skipBase64Start');
    const skipEndBtn = document.getElementById('skipBase64End');
    const cursorPos = codeTextarea.selectionStart;
    const code = codeTextarea.value;
    
    const base64Pattern = /data:image\/[^;]+;base64,[A-Za-z0-9+/=\s]+/g;
    let match;
    let isInBase64 = false;
    
    while ((match = base64Pattern.exec(code)) !== null) {
        const start = match.index;
        const end = start + match[0].length;
        
        if (cursorPos >= start && cursorPos <= end) {
            isInBase64 = true;
            break;
        }
    }
    
    skipStartBtn.style.display = isInBase64 ? 'inline-block' : 'none';
    skipEndBtn.style.display = isInBase64 ? 'inline-block' : 'none';
}

function handleCodeInput() {
    clearTimeout(titleDebounceTimer);
    
    titleDebounceTimer = setTimeout(() => {
        const code = document.getElementById('snippetCode').value;
        const title = document.getElementById('snippetTitle').value.trim();
        
        if (code && !currentSnippetIndex) {
            detectAndSetLanguage();
            
            if (!title) {
                setDefaultTitle(code);
            }
        }
    }, 300);
}

function handleNotesInput() {
    clearTimeout(titleDebounceTimer);
    
    titleDebounceTimer = setTimeout(() => {
        const notes = document.getElementById('snippetNotes').value.trim();
        const code = document.getElementById('snippetCode').value.trim();
        const titleInput = document.getElementById('snippetTitle');
        
        if (notes && !code && !currentSnippetIndex) {
            if (!titleInput.value.trim()) {
                setDefaultTitleFromNotes(notes);
            }
        }
    }, 300);
}

function toggleSplitView() {
    const editorContainer = document.getElementById('editorContainer');
    const toggleBtn = document.getElementById('toggleSplitView');
    const syncBtn = document.getElementById('toggleSyncScroll');
    const titleGroup = document.querySelector('.form-group:has(#snippetTitle)');
    const codeGroup = document.querySelector('.form-group:has(#snippetCode)');
    const previewGroup = document.querySelector('.form-group:has(#codePreview)');
    const notesSection = document.getElementById('notesSection');
    const codeTextarea = document.getElementById('snippetCode');
    const codePreview = document.getElementById('codePreview');
    
    isSplitView = !isSplitView;

    browser.storage.local.set({ zoocageSplitView: isSplitView });
    
    if (isSplitView) {
        toggleBtn.textContent = '⬌';
        toggleBtn.title = 'Exit split view (return to horizontal)';
        syncBtn.style.display = 'inline-block'; 
        
        const splitContainer = document.createElement('div');
        splitContainer.className = 'editor-split-view';
        splitContainer.id = 'splitContainer';
        
        const leftColumn = document.createElement('div');
        leftColumn.className = 'split-column';
        
        const rightColumn = document.createElement('div');
        rightColumn.className = 'split-column';
        
        editorContainer.insertBefore(splitContainer, codeGroup);
        
        leftColumn.appendChild(codeGroup);
        rightColumn.appendChild(previewGroup);
        
        splitContainer.appendChild(leftColumn);
        splitContainer.appendChild(rightColumn);
        
        showNotification('Split view enabled');
    } else {
        toggleBtn.textContent = '⬍';
        toggleBtn.title = 'Enable split view (vertical)';
        syncBtn.style.display = 'none';
        
        const splitContainer = document.getElementById('splitContainer');
        if (splitContainer) {
            editorContainer.insertBefore(codeGroup, splitContainer);
            editorContainer.insertBefore(previewGroup, splitContainer);
            splitContainer.remove();
        }
        
        codeTextarea.style.height = '';
        codeTextarea.style.minHeight = '';
        codeTextarea.style.maxHeight = '';
        codeTextarea.style.resize = '';
        
        codePreview.style.height = '';
        codePreview.style.minHeight = '';
        codePreview.style.maxHeight = '';
        
        showNotification('Split view disabled');
    }
}

function setDefaultTitleFromNotes(notes) {
    const titleInput = document.getElementById('snippetTitle');
    
    if (!notes) return;
    
    const lines = notes.split('\n');
    let title = '';
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.length > 0) {
            title += (title ? ' ' : '') + line;
            if (title.length >= 15) {
                break;
            }
        }
    }
    
    if (title.length > 0) {
        titleInput.value = title.substring(0, 80);
    }
}

function setDefaultTitle(code) {
    const titleInput = document.getElementById('snippetTitle');
    
    if (titleInput.value.trim()) return;
    
    if (!code) return;
    
    const lines = code.split('\n');
    let title = '';
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.length > 0) {
            title += (title ? ' ' : '') + line;
            if (title.length >= 15) {
                break;
            }
        }
    }
    
    if (title.length > 0) {
        titleInput.value = title.substring(0, 80);
    }
}

function detectAndSetLanguage() {
    const code = document.getElementById('snippetCode').value.trim();
    if (!code) return;

    const subtitleFormat = detectSubtitleFormat(code);
    if (subtitleFormat) {
        setLanguageDropdown('plaintext');
        return;
    }
    
    let detectedLang = 'plaintext';
    
    if (code.includes('<?xml') || code.includes('<svg')) {
        detectedLang = 'xml';
    }
    else if ((code.startsWith('{') || code.startsWith('[')) && (code.includes(':') || code.includes('"'))) {
        try {
            JSON.parse(code);
            detectedLang = 'json';
        } catch (e) {
        }
    }
    else if (code.includes('def ') || code.includes('import ') || code.includes('print(') || 
             code.includes('class ') && code.includes('__init__')) {
        detectedLang = 'python';
    }
    else if (code.includes('function ') || code.includes('const ') || code.includes('let ') || 
             code.includes('=>') || code.includes('var ') || code.includes('document.') ||
             code.includes('console.')) {
        detectedLang = 'javascript';
    }
    else if (code.includes('interface ') || code.includes(': string') || code.includes(': number') ||
             code.includes('type ')) {
        detectedLang = 'typescript';
    }
    else if ((code.includes('{') && code.includes('}') && code.includes(':')) && 
             (code.includes('color') || code.includes('background') || code.includes('margin') || 
              code.includes('padding') || code.includes('font'))) {
        detectedLang = 'css';
    }
    else if (code.startsWith('#!') || code.includes('#!/bin/bash') || code.includes('#!/bin/sh') ||
             code.includes('echo ') || code.includes('export ')) {
        detectedLang = 'bash';
    }
    else if (code.toUpperCase().includes('SELECT ') || code.toUpperCase().includes('INSERT ') ||
             code.toUpperCase().includes('UPDATE ') || code.toUpperCase().includes('DELETE ') ||
             code.toUpperCase().includes('CREATE TABLE')) {
        detectedLang = 'sql';
    }
    else if (code.includes('# ') || code.includes('## ') || code.includes('```') ||
             code.includes('](') || code.includes('**')) {
        detectedLang = 'markdown';
    }
    else if (code.includes('fn main()') || code.includes('use std::') || code.includes('impl ')) {
        detectedLang = 'rust';
    }
    else if (code.includes('package main') || code.includes('func ') || code.includes('import (')) {
        detectedLang = 'go';
    }
    else if (code.includes('public class ') || code.includes('public static void main')) {
        detectedLang = 'java';
    }
    else if (code.includes('#include') || code.includes('int main()') || code.includes('printf(') ||
             code.includes('cout <<')) {
        if (code.includes('cout <<') || code.includes('std::') || code.includes('namespace ')) {
            detectedLang = 'cpp';
        } else {
            detectedLang = 'c';
        }
    }
    else if (code.includes('def ') && code.includes('end') || code.includes('puts ')) {
        detectedLang = 'ruby';
    }
    else if (code.includes('<?php') || code.includes('$_')) {
        detectedLang = 'php';
    }
    else if (code.includes('---') || (code.includes(':') && !code.includes('{') && !code.includes(';'))) {
        detectedLang = 'yaml';
    }
    else if (code.includes('function ') && code.includes('end') || code.includes('local ')) {
        detectedLang = 'lua';
    }
    
    setLanguageDropdown(detectedLang);
}

function setLanguageDropdown(lang) {
    const dropdown = document.getElementById('languageSelector');
    const displayName = lang.charAt(0).toUpperCase() + lang.slice(1);
    dropdown.querySelector('.selected').textContent = displayName;
}

function setupDropdown(dropdownId, isDark, isLanguage = false) {
    const dropdown = document.getElementById(dropdownId);
    const selected = dropdown.querySelector('.selected');
    const options = dropdown.querySelector('.options');
    let currentIndex = -1;
    let typeBuffer = '';
    let typeTimer = null;
    
    dropdown.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.dropdown').forEach(d => {
            if (d !== dropdown) d.classList.remove('open');
        });
        dropdown.classList.toggle('open');
        if (dropdown.classList.contains('open')) {
            const optionElements = Array.from(options.querySelectorAll('.option'));
            const selectedText = selected.textContent;
            
            currentIndex = optionElements.findIndex(opt => {
                if (isLanguage) {
                    return opt.textContent === selectedText;
                } else {
                    return opt.dataset.theme === selectedText;
                }
            });
            
            if (currentIndex !== -1) {
                highlightOption(optionElements, currentIndex);
            }
        }
    });
    
    dropdown.addEventListener('keydown', (e) => {
        if (!dropdown.classList.contains('open')) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                e.preventDefault();
                dropdown.classList.add('open');
                const optionElements = Array.from(options.querySelectorAll('.option'));
                const selectedText = selected.textContent;
                
                currentIndex = optionElements.findIndex(opt => {
                    if (isLanguage) {
                        return opt.textContent === selectedText;
                    } else {
                        return opt.dataset.theme === selectedText;
                    }
                });
                
                if (currentIndex !== -1) {
                    highlightOption(optionElements, currentIndex);
                }
            }
            return;
        }
        
        const optionElements = Array.from(options.querySelectorAll('.option'));
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentIndex = (currentIndex + 1) % optionElements.length;
            highlightOption(optionElements, currentIndex);
            
            if (isLanguage) {
                const lang = optionElements[currentIndex].dataset.language;
                const displayName = optionElements[currentIndex].textContent;
                changeLanguage(lang, displayName);
            } else {
                const themeName = optionElements[currentIndex].dataset.theme;
                const themeFile = optionElements[currentIndex].dataset.file;
                changeTheme(themeFile, isDark);
                selected.textContent = themeName;
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentIndex = (currentIndex - 1 + optionElements.length) % optionElements.length;
            highlightOption(optionElements, currentIndex);
            
            if (isLanguage) {
                const lang = optionElements[currentIndex].dataset.language;
                const displayName = optionElements[currentIndex].textContent;
                changeLanguage(lang, displayName);
            } else {
                const themeName = optionElements[currentIndex].dataset.theme;
                const themeFile = optionElements[currentIndex].dataset.file;
                changeTheme(themeFile, isDark);
                selected.textContent = themeName;
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            dropdown.classList.remove('open');
        } else if (e.key === 'Escape') {
            e.preventDefault();
            dropdown.classList.remove('open');
        } else if (e.key.length === 1 && /[a-zA-Z0-9]/.test(e.key)) {
            e.preventDefault();
            
            clearTimeout(typeTimer);
            
            typeBuffer += e.key.toLowerCase();
            
            const matchIndex = isLanguage 
                ? findLanguageByPrefix(optionElements, typeBuffer)
                : findThemeByPrefix(optionElements, typeBuffer);
            
            if (matchIndex !== -1) {
                currentIndex = matchIndex;
                highlightOption(optionElements, currentIndex);
                
                if (isLanguage) {
                    const lang = optionElements[currentIndex].dataset.language;
                    const displayName = optionElements[currentIndex].textContent;
                    changeLanguage(lang, displayName);
                } else {
                    const themeName = optionElements[currentIndex].dataset.theme;
                    const themeFile = optionElements[currentIndex].dataset.file;
                    changeTheme(themeFile, isDark);
                    selected.textContent = themeName;
                }
            }
            
            typeTimer = setTimeout(() => {
                typeBuffer = '';
            }, 1000);
        }
    });
    
    document.addEventListener('click', () => {
        dropdown.classList.remove('open');
        typeBuffer = '';
    });
}

function detectCSV(code) {
    const lines = code.split('\n').filter(l => l.trim());
    
    if (lines.length < 2) {
        return false;
    }
    
    const cleanLine = (line) => {
        let inQuote = false;
        let commaCount = 0;
        
        for (let i = 0; i < line.length; i++) {
            if (line[i] === '"' || line[i] === '`') {
                inQuote = !inQuote;
            } else if (line[i] === ',' && !inQuote) {
                commaCount++;
            }
        }
        
        return commaCount;
    };
    
    const firstCount = cleanLine(lines[0]);
    
    if (firstCount === 0) {
        return false;
    }
    
    const checkLines = lines.slice(0, Math.min(5, lines.length));
    
    const allMatch = checkLines.every((line, idx) => {
        const count = cleanLine(line);
        return count === firstCount;
    });
    
    return allMatch;
}

function viewCSVAsTable() {
    let code = document.getElementById('snippetCode').value;
    
    code = code.split('\n').filter(l => l.trim()).join('\n');
    
    if (!detectCSV(code)) {
        showNotification('Not a valid CSV format', 'error');
        return;
    }
    
    const detectDelimiter = (data) => {
        const delimiters = [',', ';', '\t', '|', ':'];
        const firstLine = data.split('\n')[0];
        let maxCount = 0;
        let detectedDelimiter = ',';
        
        delimiters.forEach(delim => {
            const count = firstLine.split(delim).length;
            if (count > maxCount) {
                maxCount = count;
                detectedDelimiter = delim;
            }
        });
        
        return detectedDelimiter;
    };
    
    const delimiter = detectDelimiter(code);
    const delimiterNames = {',': ',', ';': ';', '\t': 'Tab', '|': '|', ':': ':'};
    const delimiterName = delimiterNames[delimiter] || delimiter;
    
    const result = Papa.parse(code, { 
        header: true,
        delimiter: delimiter,
        skipEmptyLines: true
    });
    
    if (result.errors.length > 0) {
        showNotification('CSV parsing error', 'error');
        console.error(result.errors);
        return;
    }
    
    const preview = document.getElementById('codePreview');
    preview.textContent = '';
    
    let sortColumn = null;
    let sortAscending = true;
    let sortedData = [...result.data];
    let matchedRows = [];
    let currentMatchIndex = -1;
    let selectedRows = new Set();
    let selectedColumns = new Set();
    let undoData = null;
    let undoIndices = null;
    
    const outerContainer = document.createElement('div');
    outerContainer.style.cssText = 'border: 1px solid #3e3e42; border-radius: 4px; overflow: hidden;';
    
    const searchContainer = document.createElement('div');
    searchContainer.style.cssText = 'position: sticky; top: 0; z-index: 20; background: #1e1e1e; padding: 0.75rem; display: flex; gap: 0.5rem; align-items: center; border-bottom: 1px solid #3e3e42;';
    searchContainer.className = 'csv-search-bar';
    
    const viewDataBtn = document.createElement('button');
    viewDataBtn.textContent = `View CSV Data (${result.data.length})`;
    viewDataBtn.className = 'secondary';
    viewDataBtn.style.cssText = 'padding: 0.35rem 0.75rem; font-size: 0.85rem;';
    viewDataBtn.addEventListener('click', () => {
        updatePreview();
    });
    
    searchContainer.appendChild(viewDataBtn);
    
    const delimiterInfo = document.createElement('span');
    delimiterInfo.textContent = `Delimiter: ${delimiterName}`;
    delimiterInfo.style.cssText = 'color: #858585; font-size: 0.85rem; margin-left: 0.5rem;';
    searchContainer.appendChild(delimiterInfo);
    
    const copySelectedBtn = document.createElement('button');
    copySelectedBtn.textContent = 'Copy Selected';
    copySelectedBtn.className = 'secondary';
    copySelectedBtn.style.cssText = 'padding: 0.35rem 0.75rem; font-size: 0.85rem; display: none;';
    copySelectedBtn.addEventListener('click', () => {
        if (selectedRows.size === 0) {
            showNotification('No rows selected', 'error');
            return;
        }
        
        const selectedData = Array.from(selectedRows).map(idx => sortedData[idx]);
        const csvOutput = Papa.unparse(selectedData, { 
            header: true,
            delimiter: delimiter
        });
        
        navigator.clipboard.writeText(csvOutput).then(() => {
            showNotification(`Copied ${selectedRows.size} row${selectedRows.size !== 1 ? 's' : ''} with header to clipboard!`);
        }).catch(err => {
            console.error('Failed to copy:', err);
            showNotification('Failed to copy to clipboard', 'error');
        });
    });
    
    searchContainer.appendChild(copySelectedBtn);
    
    const deleteSelectedBtn = document.createElement('button');
    deleteSelectedBtn.textContent = 'Delete Rows';
    deleteSelectedBtn.className = 'danger';
    deleteSelectedBtn.style.cssText = 'padding: 0.35rem 0.75rem; font-size: 0.85rem; display: none;';
    deleteSelectedBtn.addEventListener('click', () => {
        if (selectedRows.size === 0) {
            showNotification('No rows selected', 'error');
            return;
        }
        
        if (!confirm(`Delete ${selectedRows.size} selected row${selectedRows.size !== 1 ? 's' : ''}?`)) {
            return;
        }
        
        const selectedIndices = Array.from(selectedRows).sort((a, b) => a - b);
        
        undoData = selectedIndices.map(idx => ({ ...sortedData[idx] }));
        undoIndices = selectedIndices.map((idx, i) => ({ 
            originalIdx: idx - i, 
            data: undoData[i] 
        }));
        
        selectedIndices.reverse().forEach(idx => {
            sortedData.splice(idx, 1);
        });
        
        const newCSV = Papa.unparse(sortedData, { 
            header: true,
            delimiter: delimiter
        });
        document.getElementById('snippetCode').value = newCSV;
        
        selectedRows.clear();
        updateCopyButton();
        undoBtn.style.display = 'inline-block';
        renderTable();
        
        showNotification(`Deleted ${selectedIndices.length} row${selectedIndices.length !== 1 ? 's' : ''}`);
    });
    
    searchContainer.appendChild(deleteSelectedBtn);
    
    const undoBtn = document.createElement('button');
    undoBtn.textContent = 'Undo Delete';
    undoBtn.className = 'secondary';
    undoBtn.style.cssText = 'padding: 0.35rem 0.75rem; font-size: 0.85rem; display: none;';
    undoBtn.addEventListener('click', () => {
        if (!undoData || !undoIndices) return;
        
        undoIndices.forEach(({ originalIdx, data }) => {
            sortedData.splice(originalIdx, 0, data);
        });
        
        const newCSV = Papa.unparse(sortedData, { 
            header: true,
            delimiter: delimiter
        });
        document.getElementById('snippetCode').value = newCSV;
        
        undoData = null;
        undoIndices = null;
        undoBtn.style.display = 'none';
        selectedRows.clear();
        updateCopyButton();
        renderTable();
        
        showNotification('Delete undone!');
    });
    
    searchContainer.appendChild(undoBtn);
    
    const copyColumnsBtn = document.createElement('button');
    copyColumnsBtn.textContent = 'Copy Columns';
    copyColumnsBtn.className = 'secondary';
    copyColumnsBtn.style.cssText = 'padding: 0.35rem 0.75rem; font-size: 0.85rem; display: none;';
    copyColumnsBtn.addEventListener('click', () => {
        if (selectedColumns.size === 0) {
            showNotification('No columns selected', 'error');
            return;
        }
        
        const selectedFields = Array.from(selectedColumns);
        const columnData = sortedData.map(row => {
            const newRow = {};
            selectedFields.forEach(field => {
                newRow[field] = row[field];
            });
            return newRow;
        });
        
        const csvOutput = Papa.unparse(columnData, { 
            header: true,
            delimiter: delimiter,
            columns: selectedFields
        });
        
        navigator.clipboard.writeText(csvOutput).then(() => {
            showNotification(`Copied ${selectedColumns.size} column${selectedColumns.size !== 1 ? 's' : ''} to clipboard!`);
        }).catch(err => {
            console.error('Failed to copy:', err);
            showNotification('Failed to copy to clipboard', 'error');
        });
    });
    
    searchContainer.appendChild(copyColumnsBtn);
    
    const deleteColumnsBtn = document.createElement('button');
    deleteColumnsBtn.textContent = 'Delete Columns';
    deleteColumnsBtn.className = 'danger';
    deleteColumnsBtn.style.cssText = 'padding: 0.35rem 0.75rem; font-size: 0.85rem; display: none;';
    deleteColumnsBtn.addEventListener('click', () => {
        if (selectedColumns.size === 0) {
            showNotification('No columns selected', 'error');
            return;
        }
        
        if (!confirm(`Delete ${selectedColumns.size} selected column${selectedColumns.size !== 1 ? 's' : ''}?`)) {
            return;
        }
        
        const remainingFields = result.meta.fields.filter(f => !selectedColumns.has(f));
        
        if (remainingFields.length === 0) {
            showNotification('Cannot delete all columns', 'error');
            return;
        }
        
        const newData = sortedData.map(row => {
            const newRow = {};
            remainingFields.forEach(field => {
                newRow[field] = row[field];
            });
            return newRow;
        });
        
        const newCSV = Papa.unparse(newData, { 
            header: true,
            delimiter: delimiter,
            columns: remainingFields
        });
        
        document.getElementById('snippetCode').value = newCSV;
        
        selectedColumns.clear();
        updateColumnButtons();
        updatePreview();
        
        showNotification(`Deleted ${selectedColumns.size} column${selectedColumns.size !== 1 ? 's' : ''}`);
    });
    
    searchContainer.appendChild(deleteColumnsBtn);
    
    const spacer = document.createElement('div');
    spacer.style.cssText = 'margin-right: auto;';
    searchContainer.appendChild(spacer);
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search table...';
    searchInput.style.cssText = 'padding: 0.35rem 0.75rem; font-size: 0.85rem; border: 1px solid #3e3e42; border-radius: 4px; background: #3c3c3c; color: #d4d4d4; width: 200px;';
    searchInput.className = 'csv-search-input';
    
    const searchBtn = document.createElement('button');
    searchBtn.textContent = 'Search';
    searchBtn.className = 'secondary';
    searchBtn.style.cssText = 'padding: 0.35rem 0.75rem; font-size: 0.85rem;';
    
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '←';
    prevBtn.className = 'secondary';
    prevBtn.style.cssText = 'padding: 0.35rem 0.75rem; font-size: 0.85rem; display: none;';
    
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '→';
    nextBtn.className = 'secondary';
    nextBtn.style.cssText = 'padding: 0.35rem 0.75rem; font-size: 0.85rem; display: none;';
    
    const matchInfo = document.createElement('span');
    matchInfo.style.cssText = 'color: #4ec9b0; font-size: 0.85rem; display: none;';
    
    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchBtn);
    searchContainer.appendChild(prevBtn);
    searchContainer.appendChild(nextBtn);
    searchContainer.appendChild(matchInfo);
    
    const updateCopyButton = () => {
        if (selectedRows.size > 0) {
            copySelectedBtn.style.display = 'inline-block';
            copySelectedBtn.textContent = `Copy Selected (${selectedRows.size})`;
            deleteSelectedBtn.style.display = 'inline-block';
            deleteSelectedBtn.textContent = `Delete Rows (${selectedRows.size})`;
        } else {
            copySelectedBtn.style.display = 'none';
            deleteSelectedBtn.style.display = 'none';
        }
    };
    
    const updateColumnButtons = () => {
        if (selectedColumns.size > 0) {
            copyColumnsBtn.style.display = 'inline-block';
            copyColumnsBtn.textContent = `Copy Columns (${selectedColumns.size})`;
            deleteColumnsBtn.style.display = 'inline-block';
            deleteColumnsBtn.textContent = `Delete Columns (${selectedColumns.size})`;
        } else {
            copyColumnsBtn.style.display = 'none';
            deleteColumnsBtn.style.display = 'none';
        }
    };
    
    const performSearch = () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (!searchTerm) {
            matchedRows = [];
            currentMatchIndex = -1;
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            matchInfo.style.display = 'none';
            renderTable();
            return;
        }
        
        matchedRows = [];
        sortedData.forEach((row, idx) => {
            const rowText = result.meta.fields.map(field => (row[field] || '')).join(' ').toLowerCase();
            if (rowText.includes(searchTerm)) {
                matchedRows.push(idx);
            }
        });
        
        if (matchedRows.length > 0) {
            currentMatchIndex = 0;
            prevBtn.style.display = 'inline-block';
            nextBtn.style.display = 'inline-block';
            matchInfo.style.display = 'inline-block';
            matchInfo.textContent = `${currentMatchIndex + 1}/${matchedRows.length}`;
            renderTable();
            scrollToMatch();
        } else {
            currentMatchIndex = -1;
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            matchInfo.style.display = 'inline-block';
            matchInfo.textContent = 'No matches found';
            renderTable();
        }
    };
    
    const scrollToMatch = () => {
        if (currentMatchIndex >= 0 && currentMatchIndex < matchedRows.length) {
            const rowIdx = matchedRows[currentMatchIndex];
            const row = tableWrapper.querySelector(`tr[data-row-idx="${rowIdx}"]`);
            if (row) {
                const rowTop = row.offsetTop;
                const containerHeight = tableWrapper.clientHeight;
                const rowHeight = row.offsetHeight;
                tableWrapper.scrollTop = rowTop - (containerHeight / 2) + (rowHeight / 2);
            }
        }
    };
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    
    prevBtn.addEventListener('click', () => {
        if (currentMatchIndex > 0) {
            currentMatchIndex--;
            matchInfo.textContent = `${currentMatchIndex + 1}/${matchedRows.length}`;
            renderTable();
            scrollToMatch();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentMatchIndex < matchedRows.length - 1) {
            currentMatchIndex++;
            matchInfo.textContent = `${currentMatchIndex + 1}/${matchedRows.length}`;
            renderTable();
            scrollToMatch();
        }
    });
    
    const tableWrapper = document.createElement('div');
    tableWrapper.style.cssText = 'max-height: 70vh; overflow-y: auto; position: relative;';
    
    outerContainer.appendChild(searchContainer);
    outerContainer.appendChild(tableWrapper);
    preview.appendChild(outerContainer);
    
    const renderTable = () => {
        tableWrapper.textContent = '';
        
        const table = document.createElement('table');
        table.style.cssText = 'border-collapse: collapse; width: 100%; font-size: 0.85rem;';
        
        const thead = document.createElement('thead');
        thead.style.cssText = 'position: sticky; top: 0; z-index: 10;';
        
        const checkboxRow = document.createElement('tr');
        
        const emptyTh = document.createElement('th');
        emptyTh.style.cssText = 'border: 1px solid #3e3e42; padding: 0.5rem; background: #2d2d30;';
        checkboxRow.appendChild(emptyTh);
        
        result.meta.fields.forEach(field => {
            const th = document.createElement('th');
            th.style.cssText = 'border: 1px solid #3e3e42; padding: 0.5rem; background: #2d2d30; text-align: center;';
            
            const colCheckbox = document.createElement('input');
            colCheckbox.type = 'checkbox';
            colCheckbox.className = 'csv-checkbox';
            colCheckbox.style.cssText = 'width: 16px; height: 16px; cursor: pointer; accent-color: #4ec9b0;';
            colCheckbox.checked = selectedColumns.has(field);
            colCheckbox.addEventListener('change', (e) => {
                e.stopPropagation();
                if (e.target.checked) {
                    selectedColumns.add(field);
                } else {
                    selectedColumns.delete(field);
                }
                updateColumnButtons();
            });
            
            th.appendChild(colCheckbox);
            checkboxRow.appendChild(th);
        });
        
        thead.appendChild(checkboxRow);
        
        const headerRow = document.createElement('tr');
        
        const selectAllTh = document.createElement('th');
        selectAllTh.style.cssText = 'border: 1px solid #3e3e42; padding: 0.5rem; background: #2d2d30; text-align: center; width: 40px;';
        
        const selectAllCheckbox = document.createElement('input');
        selectAllCheckbox.type = 'checkbox';
        selectAllCheckbox.className = 'csv-checkbox';
        selectAllCheckbox.style.cssText = 'width: 16px; height: 16px; cursor: pointer; accent-color: #4ec9b0;';
        selectAllCheckbox.checked = selectedRows.size === sortedData.length && sortedData.length > 0;
        selectAllCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                sortedData.forEach((_, idx) => selectedRows.add(idx));
            } else {
                selectedRows.clear();
            }
            updateCopyButton();
            renderTable();
        });
        selectAllTh.appendChild(selectAllCheckbox);
        headerRow.appendChild(selectAllTh);
        
        result.meta.fields.forEach(field => {
            const th = document.createElement('th');
            th.textContent = field;
            th.style.cssText = 'border: 1px solid #3e3e42; padding: 0.5rem; background: #2d2d30; text-align: left; font-weight: 600; cursor: pointer; user-select: none;';
            
            if (sortColumn === field) {
                th.textContent += sortAscending ? ' ▲' : ' ▼';
                th.style.background = '#0e639c';
            }
            
            th.addEventListener('mouseenter', () => {
                if (sortColumn !== field) {
                    th.style.background = '#3e3e42';
                }
            });
            
            th.addEventListener('mouseleave', () => {
                if (sortColumn !== field) {
                    th.style.background = '#2d2d30';
                }
            });
            
            th.addEventListener('click', () => {
                if (sortColumn === field) {
                    sortAscending = !sortAscending;
                } else {
                    sortColumn = field;
                    sortAscending = true;
                }
                
                sortedData.sort((a, b) => {
                    let aVal = a[field] || '';
                    let bVal = b[field] || '';
                    
                    const aDate = new Date(aVal);
                    const bDate = new Date(bVal);
                    
                    if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime()) && aVal.length >= 8 && aVal.length <= 30) {
                        return sortAscending ? aDate - bDate : bDate - aDate;
                    }
                    
                    const aNum = parseFloat(aVal);
                    const bNum = parseFloat(bVal);
                    
                    if (!isNaN(aNum) && !isNaN(bNum)) {
                        return sortAscending ? aNum - bNum : bNum - aNum;
                    }
                    
                    aVal = aVal.toString().toLowerCase();
                    bVal = bVal.toString().toLowerCase();
                    
                    if (sortAscending) {
                        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
                    } else {
                        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
                    }
                });
                
                selectedRows.clear();
                updateCopyButton();
                renderTable();
            });
            
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        const tbody = document.createElement('tbody');
        sortedData.forEach((row, idx) => {
            const tr = document.createElement('tr');
            tr.setAttribute('data-row-idx', idx);
            
            const isMatch = matchedRows.includes(idx);
            const isCurrentMatch = currentMatchIndex >= 0 && matchedRows[currentMatchIndex] === idx;
            
            if (isCurrentMatch) {
                tr.style.background = '#0e639c';
                tr.className = 'csv-match-current';
            } else if (isMatch) {
                tr.style.background = '#3e3e42';
            } else if (idx % 2 === 1) {
                tr.className = 'csv-table-row-alt';
                tr.style.background = '#252526';
            }
            
            const checkboxTd = document.createElement('td');
            checkboxTd.style.cssText = 'border: 1px solid #3e3e42; padding: 0.5rem; text-align: center;';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'csv-checkbox';
            checkbox.style.cssText = 'width: 16px; height: 16px; cursor: pointer; accent-color: #4ec9b0;';
            checkbox.checked = selectedRows.has(idx);
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                if (e.target.checked) {
                    selectedRows.add(idx);
                } else {
                    selectedRows.delete(idx);
                }
                updateCopyButton();
            });
            checkboxTd.appendChild(checkbox);
            tr.appendChild(checkboxTd);
            
            result.meta.fields.forEach(field => {
                const td = document.createElement('td');
                td.textContent = row[field] || '';
                td.style.cssText = 'border: 1px solid #3e3e42; padding: 0.5rem; white-space: nowrap; cursor: text;';
                
                td.addEventListener('dblclick', () => {
                    const originalValue = td.textContent;
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = originalValue;
                    input.style.cssText = 'width: 100%; padding: 0.25rem; background: #3c3c3c; color: #d4d4d4; border: 2px solid #4ec9b0; font-size: 0.85rem; font-family: Consolas, monospace;';
                    input.className = 'csv-cell-edit';
                    
                    td.textContent = '';
                    td.appendChild(input);
                    input.focus();
                    input.select();
                    
                    const saveEdit = () => {
                        const newValue = input.value;
                        sortedData[idx][field] = newValue;
                        
                        const newCSV = Papa.unparse(sortedData, { 
                            header: true,
                            delimiter: delimiter
                        });
                        document.getElementById('snippetCode').value = newCSV;
                        
                        td.textContent = newValue;
                        showNotification('Cell updated');
                    };
                    
                    input.addEventListener('blur', saveEdit);
                    input.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            saveEdit();
                        } else if (e.key === 'Escape') {
                            td.textContent = originalValue;
                        }
                    });
                });
                
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        
        tableWrapper.appendChild(table);
    };
    
    renderTable();
    showNotification(`Table view: ${result.data.length} rows - Click headers to sort`);
}

function findLanguageByPrefix(optionElements, prefix) {
    for (let i = 0; i < optionElements.length; i++) {
        const langName = optionElements[i].textContent.toLowerCase();
        if (langName.startsWith(prefix)) {
            return i;
        }
    }
    return -1;
}

function findThemeByPrefix(optionElements, prefix) {
    for (let i = 0; i < optionElements.length; i++) {
        const themeName = optionElements[i].dataset.theme.toLowerCase();
        if (themeName.startsWith(prefix)) {
            return i;
        }
    }
    
    if (prefix.length >= 2) {
        for (let i = 0; i < optionElements.length; i++) {
            const themeName = optionElements[i].dataset.theme.toLowerCase();
            const words = themeName.split(/\s+/);
            
            for (const word of words) {
                if (word.startsWith(prefix)) {
                    return i;
                }
            }
        }
    }
    
    return -1;
}

function highlightOption(options, index) {
    options.forEach((opt, i) => {
        if (i === index) {
            opt.style.background = '#0e639c';
            opt.style.color = '#fff';
            opt.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } else {
            opt.style.background = '';
            opt.style.color = '';
        }
    });
}

function initMode() {
    browser.storage.local.get('zoocagesettings').then((result) => {
        const settings = result.zoocagesettings || { mode: 'dark', theme: 'themesdark/gradient-dark.min.css' };
        currentMode = settings.mode;
        if (currentMode === 'light') {
            document.body.classList.add('light-mode');
        }
        if (settings.theme) {
            document.getElementById('themeStylesheet').href = settings.theme;
            
            const isDark = settings.theme.includes('themesdark/');
            const themeFile = settings.theme.split('/').pop();
            const themeName = getThemeNameFromFile(themeFile, isDark);
            
            if (themeName) {
                const dropdownId = isDark ? 'themeSelectorDark' : 'themeSelectorLight';
                const dropdown = document.getElementById(dropdownId);
                const selected = dropdown.querySelector('.selected');
                selected.textContent = themeName;
            }
        }
    });
}

function getThemeNameFromFile(filename, isDark) {
    const darkThemes = {
        'a11y-dark.min.css': 'A11y Dark',
        'agate.min.css': 'Agate',
        'an-old-hope.min.css': 'An Old Hope',
        'atom-one-dark.min.css': 'Atom One Dark',
        'atom-one-dark-reasonable.min.css': 'Atom One Dark Reasonable',
        'codepen-embed.min.css': 'Codepen Embed',
        'cybertopia-saturated.min.css': 'Cybertopia Saturated',
        'github-dark.min.css': 'GitHub Dark',
        'gradient-dark.min.css': 'Gradient Dark',
        'hybrid.min.css': 'Hybrid',
        'kimbie-dark.min.css': 'Kimbie Dark',
        'lioshi.min.css': 'Lioshi',
        'monokai-sublime.min.css': 'Monokai Sublime',
        'night-owl.min.css': 'Night Owl',
        'nord.min.css': 'Nord',
        'obsidian.min.css': 'Obsidian',
        'panda-syntax-dark.min.css': 'Panda Syntax Dark',
        'paraiso-dark.min.css': 'Paraiso Dark',
        'pojoaque.min.css': 'Pojoaque',
        'rainbow.min.css': 'Rainbow',
        'sandworm.min.css': 'Sandworm',
        'shades-of-purple.min.css': 'Shades of Purple',
        'srcery.min.css': 'Srcery',
        'stackoverflow-dark.min.css': 'Stack Overflow Dark',
        'tokyo-night-dark.min.css': 'Tokyo Night Dark',
        'tomorrow-night-blue.min.css': 'Tomorrow Night Blue',
        'tomorrow-night-bright.min.css': 'Tomorrow Night Bright',
        'xt256.min.css': 'XT256'
    };
    
    const lightThemes = {
        'a11y-light.min.css': 'A11y Light',
        'arduino-light.min.css': 'Arduino Light',
        'ascetic.min.css': 'Ascetic',
        'atom-one-light.min.css': 'Atom One Light',
        'cybertopia-icecap.min.css': 'Cybertopia Icecap',
        'default.min.css': 'Default',
        'devibeans.min.css': 'Devibeans',
        'docco.min.css': 'Docco',
        'github.min.css': 'GitHub',
        'gradient-light.min.css': 'Gradient Light',
        'grayscale.min.css': 'Grayscale',
        'intellij-light.min.css': 'IntelliJ Light',
        'isbl-editor-light.min.css': 'ISBL Editor Light',
        'kimbie-light.min.css': 'Kimbie Light',
        'lightfair.min.css': 'Lightfair',
        'magula.min.css': 'Magula',
        'mono-blue.min.css': 'Mono Blue',
        'panda-syntax-light.min.css': 'Panda Syntax Light',
        'paraiso-light.min.css': 'Paraiso Light',
        'purebasic.min.css': 'PureBasic',
        'rose-pine-dawn.min.css': 'Rose Pine Dawn',
        'routeros.min.css': 'RouterOS',
        'stackoverflow-light.min.css': 'Stack Overflow Light',
        'vs.min.css': 'VS',
        'xcode.min.css': 'Xcode'
    };
    
    return isDark ? darkThemes[filename] : lightThemes[filename];
}

function switchToLightMode() {
    document.body.classList.add('light-mode');
    currentMode = 'light';
    saveSettings();
}

function switchToDarkMode() {
    document.body.classList.remove('light-mode');
    currentMode = 'dark';
    saveSettings();
}

function saveSettings() {
    browser.storage.local.set({
        zoocagesettings: {
            theme: document.getElementById('themeStylesheet').getAttribute('href'),
            mode: currentMode
        }
    });
}

function loadThemes() {
    const darkThemes = [
        { name: 'A11y Dark', file: 'a11y-dark.min.css' },
        { name: 'Agate', file: 'agate.min.css' },
        { name: 'An Old Hope', file: 'an-old-hope.min.css' },
        { name: 'Atom One Dark', file: 'atom-one-dark.min.css' },
        { name: 'Atom One Dark Reasonable', file: 'atom-one-dark-reasonable.min.css' },
        { name: 'Codepen Embed', file: 'codepen-embed.min.css' },
        { name: 'Cybertopia Saturated', file: 'cybertopia-saturated.min.css' },
        { name: 'GitHub Dark', file: 'github-dark.min.css' },
        { name: 'Gradient Dark', file: 'gradient-dark.min.css' },
        { name: 'Hybrid', file: 'hybrid.min.css' },
        { name: 'Kimbie Dark', file: 'kimbie-dark.min.css' },
        { name: 'Lioshi', file: 'lioshi.min.css' },
        { name: 'Monokai Sublime', file: 'monokai-sublime.min.css' },
        { name: 'Night Owl', file: 'night-owl.min.css' },
        { name: 'Nord', file: 'nord.min.css' },
        { name: 'Obsidian', file: 'obsidian.min.css' },
        { name: 'Panda Syntax Dark', file: 'panda-syntax-dark.min.css' },
        { name: 'Paraiso Dark', file: 'paraiso-dark.min.css' },
        { name: 'Pojoaque', file: 'pojoaque.min.css' },
        { name: 'Rainbow', file: 'rainbow.min.css' },
        { name: 'Sandworm', file: 'sandworm.min.css' },
        { name: 'Shades of Purple', file: 'shades-of-purple.min.css' },
        { name: 'Srcery', file: 'srcery.min.css' },
        { name: 'Stack Overflow Dark', file: 'stackoverflow-dark.min.css' },
        { name: 'Tokyo Night Dark', file: 'tokyo-night-dark.min.css' },
        { name: 'Tomorrow Night Blue', file: 'tomorrow-night-blue.min.css' },
        { name: 'Tomorrow Night Bright', file: 'tomorrow-night-bright.min.css' },
        { name: 'XT256', file: 'xt256.min.css' }
    ];
    
    const lightThemes = [
        { name: 'A11y Light', file: 'a11y-light.min.css' },
        { name: 'Arduino Light', file: 'arduino-light.min.css' },
        { name: 'Ascetic', file: 'ascetic.min.css' },
        { name: 'Atom One Light', file: 'atom-one-light.min.css' },
        { name: 'Cybertopia Icecap', file: 'cybertopia-icecap.min.css' },
        { name: 'Default', file: 'default.min.css' },
        { name: 'Devibeans', file: 'devibeans.min.css' },
        { name: 'Docco', file: 'docco.min.css' },
        { name: 'GitHub', file: 'github.min.css' },
        { name: 'Gradient Light', file: 'gradient-light.min.css' },
        { name: 'Grayscale', file: 'grayscale.min.css' },
        { name: 'IntelliJ Light', file: 'intellij-light.min.css' },
        { name: 'ISBL Editor Light', file: 'isbl-editor-light.min.css' },
        { name: 'Kimbie Light', file: 'kimbie-light.min.css' },
        { name: 'Lightfair', file: 'lightfair.min.css' },
        { name: 'Magula', file: 'magula.min.css' },
        { name: 'Mono Blue', file: 'mono-blue.min.css' },
        { name: 'Panda Syntax Light', file: 'panda-syntax-light.min.css' },
        { name: 'Paraiso Light', file: 'paraiso-light.min.css' },
        { name: 'PureBasic', file: 'purebasic.min.css' },
        { name: 'Rose Pine Dawn', file: 'rose-pine-dawn.min.css' },
        { name: 'RouterOS', file: 'routeros.min.css' },
        { name: 'Stack Overflow Light', file: 'stackoverflow-light.min.css' },
        { name: 'VS', file: 'vs.min.css' },
        { name: 'Xcode', file: 'xcode.min.css' }
    ];
    
    populateThemeDropdown('themeSelectorDark', darkThemes, true);
    populateThemeDropdown('themeSelectorLight', lightThemes, false);
}

function populateThemeDropdown(dropdownId, themes, isDark) {
    const dropdown = document.getElementById(dropdownId);
    const options = dropdown.querySelector('.options');
    
    options.textContent = '';
    themes.forEach(theme => {
        const option = document.createElement('div');
        option.className = 'option';
        option.textContent = theme.name;
        option.dataset.theme = theme.name;
        option.dataset.file = isDark ? `themesdark/${theme.file}` : `themeslight/${theme.file}`;
        option.addEventListener('click', () => {
            changeTheme(option.dataset.file, isDark);
            dropdown.querySelector('.selected').textContent = theme.name;
        });
        options.appendChild(option);
    });
}

function highlightHexColors(code, language) {
    const supportedLanguages = ['css', 'javascript', 'typescript', 'html', 'xml', 'json', 'plaintext'];
    
    if (!supportedLanguages.includes(language)) {
        return code;
    }
    
    const hexPattern = /(#[0-9a-fA-F]{6})|(['"])([0-9a-fA-F]{6})\2/g;
    
    return code.replace(hexPattern, (match, hashHex, quote, quotedHex) => {
        let hexColor;
        
        if (hashHex) {
            hexColor = hashHex;
        } else if (quotedHex) {
            hexColor = '#' + quotedHex;
            return `${quote}<span class="hex-color-indicator" style="background-color: ${hexColor};" title="${hexColor}"></span>${quotedHex}${quote}`;
        }
        
        return `<span class="hex-color-indicator" style="background-color: ${hexColor};" title="${hexColor}"></span>${match}`;
    });
}

function changeTheme(themeFile, isDark) {
    document.getElementById('themeStylesheet').href = themeFile;
    if (isDark) {
        switchToDarkMode();
    } else {
        switchToLightMode();
    }
    saveSettings();
    
    if (isMarkdownRendered) {
        setTimeout(() => {
            applyThemeToMarkdown();
        }, 100);
    }
}

function populateLanguageSelect() {
    const dropdown = document.getElementById('languageSelector');
    const options = dropdown.querySelector('.options');
    
    options.innerHTML = '';
    availableLanguages.forEach(lang => {
        const option = document.createElement('div');
        option.className = 'option';
        const displayName = lang.charAt(0).toUpperCase() + lang.slice(1);
        option.textContent = displayName;
        option.dataset.language = lang;
        option.addEventListener('click', () => {
            changeLanguage(lang, displayName);
        });
        options.appendChild(option);
    });
    
    setupDropdown('languageSelector', false, true);
}

function changeLanguage(lang, displayName) {
    const dropdown = document.getElementById('languageSelector');
    dropdown.querySelector('.selected').textContent = displayName;
    updatePreview(lang);
}

function calculateHash(data) {
    return JSON.stringify(data.map(s => s.timestamp + s.title)).substring(0, 50);
}

function buildSearchIndex() {
    return new Promise((resolve) => {
        const currentHash = calculateHash(snippets);
        
        if (indexHash === currentHash && searchIndex && snippets.length > 0) {
            return resolve();
        }
        
        const indicatorContainer = document.getElementById('indexingIndicator');
        let showIndicator = snippets.length > 10;
        
        if (showIndicator) {
            indicatorContainer.style.display = 'block';
            indicatorContainer.className = 'indexing-indicator';
            indicatorContainer.innerHTML = '<div class="spinner"></div> Indexing...';
        }
        
        setTimeout(() => {
            const startTime = performance.now();
            
            searchIndex = new FlexSearch.Document({
                document: {
                    id: 'id',
                    index: ['title', 'code', 'notes', 'language']
                },
                tokenize: 'forward',
                context: true
            });
            
            snippets.forEach((snippet, i) => {
                searchIndex.add({
                    id: i,
                    title: snippet.title,
                    code: snippet.code,
                    notes: snippet.notes || '',
                    language: snippet.language
                });
            });
            
            indexHash = currentHash;
            
            const endTime = performance.now();
            const indexTime = ((endTime - startTime) / 1000).toFixed(2);
            
            if (showIndicator) {
                indicatorContainer.style.display = 'none';
            }
            resolve();
        }, 50);
    });
}

function filterSnippets() {
    const filterTerm = document.getElementById('filterInput').value.trim().toLowerCase();
    const searchTerm = document.getElementById('searchInput').value.trim();
    
    if (!filterTerm) {
        if (searchTerm.length >= 3) {
            performSearch(searchTerm);
        } else {
            renderSnippetList();
        }
        return;
    }
    
    if (searchTerm.length >= 3) {
        buildSearchIndex().then(() => {
            const searchMode = document.querySelector('input[name="search-mode"]:checked').value;
            const excludeTerms = document.getElementById('excludeInput').value.trim().toLowerCase();
            const searchTerms = searchTerm.toLowerCase().split(/\s+/).filter(t => t.length >= 3);
            
            let filteredSnippets = [];
            
            if (searchMode === 'and' && searchTerms.length > 1) {
                const termResults = searchTerms.map(term => {
                    const results = searchIndex.search(term, { limit: 1000 });
                    
                    const ids = new Set();
                    results.forEach(fieldResults => {
                        if (fieldResults.result) {
                            fieldResults.result.forEach(id => ids.add(id));
                        }
                    });
                    return ids;
                });
                
                let commonIds = termResults[0];
                for (let i = 1; i < termResults.length; i++) {
                    commonIds = new Set([...commonIds].filter(id => termResults[i].has(id)));
                }
                
                filteredSnippets = Array.from(commonIds).map(id => snippets[id]).filter(s => s !== undefined);
            } else {
                const results = searchIndex.search(searchTerm, { limit: 1000 });
                
                const uniqueIds = new Set();
                results.forEach(fieldResults => {
                    if (fieldResults.result) {
                        fieldResults.result.forEach(id => uniqueIds.add(id));
                    }
                });
                
                filteredSnippets = Array.from(uniqueIds).map(id => snippets[id]).filter(s => s !== undefined);
            }
            
            if (excludeTerms) {
                const excludeTermsList = excludeTerms.split(/\s+/).filter(t => t.length >= 2);
                
                filteredSnippets = filteredSnippets.filter(snippet => {
                    const searchText = `${snippet.title} ${snippet.code} ${snippet.notes || ''}`.toLowerCase();
                    const shouldExclude = excludeTermsList.some(term => searchText.includes(term));
                    
                    return !shouldExclude;
                });
                
            }
            
            const filterTerms = filterTerm.split(/\s+/).filter(t => t.length > 0);
            filteredSnippets = filteredSnippets.filter(snippet => {
                const titleText = snippet.title.toLowerCase();
                return filterTerms.every(term => titleText.includes(term));
            });
            
            const combinedTerms = searchTerm + ' ' + filterTerm;
            renderSnippetList(combinedTerms.trim(), filteredSnippets, null);
        });
    } else {
        const filterTerms = filterTerm.split(/\s+/).filter(t => t.length > 0);
        
        const filtered = snippets.filter(snippet => {
            const titleText = snippet.title.toLowerCase();
            return filterTerms.every(term => titleText.includes(term));
        });
        
        renderSnippetList(filterTerm, filtered, null);
    }
}

function performSearch(searchTerm) {
    clearTimeout(searchDebounceTimer);
    
    if (!searchTerm.trim()) {
        renderSnippetList();
        if (currentSnippetIndex !== null) {
            updatePreview();
            clearNotesHighlight();
        }
        return;
    }
    
    if (searchTerm.trim().length < 3) {
        renderSnippetList();
        if (currentSnippetIndex !== null) {
            updatePreview();
            clearNotesHighlight();
        }
        return;
    }
    
    searchDebounceTimer = setTimeout(() => {
        buildSearchIndex().then(() => {
            try {
                const excludeTerms = document.getElementById('excludeInput').value.trim().toLowerCase();
                const filterTerm = document.getElementById('filterInput').value.trim().toLowerCase();
                
                const quotedPhrases = searchTerm.match(/"([^"]+)"/g) || [];
                const phrases = quotedPhrases.map(p => p.replace(/"/g, '').toLowerCase());
                
                const searchWithoutQuotes = searchTerm.replace(/"[^"]+"/g, '').trim();
                
                let filteredSnippets = [];
                
                if (searchWithoutQuotes) {
                    const searchMode = document.querySelector('input[name="search-mode"]:checked').value;
                    const searchTerms = searchWithoutQuotes.toLowerCase().split(/\s+/).filter(t => t.length >= 3);
                    
                    if (searchMode === 'and' && searchTerms.length > 1) {
                        const termResults = searchTerms.map(term => {
                            const results = searchIndex.search(term, { limit: 1000 });
                            
                            const ids = new Set();
                            results.forEach(fieldResults => {
                                if (fieldResults.result) {
                                    fieldResults.result.forEach(id => ids.add(id));
                                }
                            });
                            return ids;
                        });
                        
                        let commonIds = termResults[0];
                        for (let i = 1; i < termResults.length; i++) {
                            commonIds = new Set([...commonIds].filter(id => termResults[i].has(id)));
                        }
                        
                        filteredSnippets = Array.from(commonIds).map(id => snippets[id]);
                    } else if (searchMode === 'or' && searchTerms.length > 1) {
                        const allIds = new Set();
                        
                        searchTerms.forEach(term => {
                            const results = searchIndex.search(term, { limit: 1000 });
                            results.forEach(fieldResults => {
                                if (fieldResults.result) {
                                    fieldResults.result.forEach(id => allIds.add(id));
                                }
                            });
                        });
                        
                        filteredSnippets = Array.from(allIds).map(id => snippets[id]).filter(s => s !== undefined);
                    } else {
                        const results = searchIndex.search(searchWithoutQuotes, { limit: 1000 });
                        
                        const uniqueIds = new Set();
                        results.forEach(fieldResults => {
                            if (fieldResults.result) {
                                fieldResults.result.forEach(id => uniqueIds.add(id));
                            }
                        });
                        
                        filteredSnippets = Array.from(uniqueIds).map(id => snippets[id]).filter(s => s !== undefined);
                    }
                } else {
                    filteredSnippets = [...snippets];
                }
                
                if (phrases.length > 0) {
                    filteredSnippets = filteredSnippets.filter(snippet => {
                        const searchText = `${snippet.title} ${snippet.code} ${snippet.notes || ''}`.toLowerCase();
                        return phrases.every(phrase => searchText.includes(phrase));
                    });
                }
                
                if (excludeTerms) {
                    const excludeTermsList = excludeTerms.split(/\s+/).filter(t => t.length >= 2);
                    
                    filteredSnippets = filteredSnippets.filter(snippet => {
                        const searchText = `${snippet.title} ${snippet.code} ${snippet.notes || ''}`.toLowerCase();
                        return !excludeTermsList.some(term => searchText.includes(term));
                    });
                }
                
                if (filterTerm) {
                    const filterTerms = filterTerm.split(/\s+/).filter(t => t.length > 0);
                    filteredSnippets = filteredSnippets.filter(snippet => {
                        const titleText = snippet.title.toLowerCase();
                        return filterTerms.every(term => titleText.includes(term));
                    });
                }
                                
                renderSnippetList(searchTerm, filteredSnippets, null);
                
                if (currentSnippetIndex !== null) {
                    isMarkdownRendered = false;
                    
                    const markdownBtn = document.getElementById('viewMarkdownBtn');
                    if (markdownBtn) {
                        markdownBtn.textContent = 'View as Markdown';
                    }
                    
                    updatePreview();
                    
                    const currentSnippet = snippets[currentSnippetIndex];
                    const notesValue = currentSnippet.notes || '';
                    
                    if (searchTerm && searchTerm.length >= 3 && notesValue) {
                        highlightNotesMatches(notesValue, searchTerm);
                    } else {
                        clearNotesHighlight();
                    }
                }
            } catch (error) {
                console.error('Search error:', error);
                renderSnippetList();
                if (currentSnippetIndex !== null) {
                    isMarkdownRendered = false;
                    
                    const markdownBtn = document.getElementById('viewMarkdownBtn');
                    if (markdownBtn) {
                        markdownBtn.textContent = 'View as Markdown';
                    }
                    
                    updatePreview();
                    clearNotesHighlight();
                }
            }
        });
    }, 300);
}

function highlightMatches(text, searchTerm) {
    if (!searchTerm) return escapeHtml(text);
    
    const quotedPhrases = searchTerm.match(/"([^"]+)"/g) || [];
    const phrases = quotedPhrases.map(p => p.replace(/"/g, ''));
    
    const searchWithoutQuotes = searchTerm.replace(/"[^"]+"/g, '').trim();
    const terms = searchWithoutQuotes ? searchWithoutQuotes.toLowerCase().split(/\s+/).filter(t => t.length >= 2) : [];
    
    let result = escapeHtml(text);
    let matchIndex = 0;
    
    phrases.forEach(phrase => {
        const regex = new RegExp(`(${escapeRegex(phrase)})`, 'gi');
        result = result.replace(regex, (match) => {
            return `<mark class="search-match" data-match-index="${matchIndex++}">${match}</mark>`;
        });
    });
    
    terms.forEach(term => {
        const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
        result = result.replace(regex, (match) => {
            return `<mark class="search-match" data-match-index="${matchIndex++}">${match}</mark>`;
        });
    });
    
    return result;
}

function highlightTags(html) {
    return html.replace(/(#[a-zA-Z0-9_-]+)/g, '<span class="tag">$1</span>');
}

async function loadSnippets() {
    try {
        const result = await browser.storage.local.get(getStorageKey('snippets'));
        const rawSnippets = result[getStorageKey('snippets')] || [];
        
        const loadedSnippets = await Promise.all(rawSnippets.map(async (snippet) => {
            if (snippet.inIndexedDB && snippet.timestamp) {
                try {
                    const idbSnippet = await snippetStorage.get(`snippet_${snippet.timestamp}`);
                    if (idbSnippet) {
                        return {
                            ...idbSnippet,
                            inIndexedDB: true
                        };
                    }
                } catch (error) {
                    console.error('Error loading from IndexedDB:', error);
                }
            }

            if (snippet.code && snippet.code.includes && snippet.code.includes('avif-cache://')) {
                return {
                    ...snippet,
                    compressed: false,
                    code: snippet.code
                };
            }
            
            if (snippet.compressed && snippet.code && snippet.code.trim().length > 0) {
                try {
                    const decompressed = decompressText(snippet.code);
                    if (!decompressed || decompressed.length === 0) {
                        console.warn('Decompression returned empty for:', snippet.title);
                        return {
                            ...snippet,
                            compressed: false
                        };
                    }
                    return {
                        ...snippet,
                        code: decompressed
                    };
                } catch (error) {
                    console.error('Decompression error for snippet:', snippet.title, error);
                    return {
                        ...snippet,
                        compressed: false
                    };
                }
            }
            
            return snippet;
        }));
        
        snippets = loadedSnippets;
        renderSnippetList();
    } catch (error) {
        console.error('Failed to load snippets:', error);
        snippets = [];
        renderSnippetList();
    }
}

function renderSnippetList(searchTerm = '', filtered = null, scores = null) {
    const list = document.getElementById('snippetList');
    
    const displaySnippets = filtered || snippets;

    updateSnippetCount(displaySnippets.length);
    
    if (displaySnippets.length === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.style.cssText = 'padding: 2rem; text-align: center; color: #858585;';
        emptyDiv.textContent = 'No snippets found';
        list.appendChild(emptyDiv);
        return;
    }
    
    list.innerHTML = displaySnippets.map((snippet, index) => {
        const actualIndex = snippets.indexOf(snippet);
        const isActive = actualIndex === currentSnippetIndex ? 'active' : '';
        
        const utcDate = new Date(snippet.timestamp);
        const localDate = new Date(utcDate.getTime() - (utcDate.getTimezoneOffset() * 60000));
        
        const date = localDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            timeZone: 'UTC' 
        });
        
        const hours = localDate.getUTCHours().toString().padStart(2, '0');
        const minutes = localDate.getUTCMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;
        
        let highlightedTitle = searchTerm ? highlightMatches(snippet.title, searchTerm) : escapeHtml(snippet.title);
        highlightedTitle = highlightTags(highlightedTitle);
        const displayLang = snippet.code 
            ? snippet.language.charAt(0).toUpperCase() + snippet.language.slice(1)
            : 'Note';

       const compressedCode = compressText(snippet.code || '');
       const compressedSize = new Blob([compressedCode]).size;
       const decompressedSize = new Blob([snippet.code || '']).size;
       
       const base64ImageRatio = snippet.code 
           ? (snippet.code.match(/data:image\/avif;base64,[A-Za-z0-9+/=]+/g) || []).join('').length / snippet.code.length
           : 0;
       
        const compressedDisplay = formatFileSize(compressedSize);
        const decompressedDisplay = formatFileSize(decompressedSize);
        
        const avifImageCount = (snippet.code.match(/data:image\/avif/g) || []).length;
        const cachedImageCount = (snippet.code.match(/avif-cache:\/\/[a-f0-9]+/g) || []).length;
        const totalImageCount = avifImageCount + cachedImageCount;
        
        let totalImageSize = 0;
        if (totalImageCount > 0) {
            const avifMatches = snippet.code.match(/data:image\/avif;base64,[A-Za-z0-9+/=]+/g) || [];
            avifMatches.forEach(dataUrl => {
                const base64 = dataUrl.split(',')[1];
                totalImageSize += (base64.length * 3) / 4;
            });
            
            const cacheMatchesWithSize = snippet.code.match(/avif-cache:\/\/[a-f0-9]+#(\d+)/g) || [];
            cacheMatchesWithSize.forEach(match => {
                const size = parseInt(match.split('#')[1]);
                if (!isNaN(size)) {
                    totalImageSize += size;
                }
            });
        }
        
        const imageCountDisplay = totalImageCount > 0 
            ? `<span style="color: #ff3f3f; margin-left: 0.2rem;"> ${totalImageCount}</span> <span style="color: #38d430;">${formatFileSize(totalImageSize)}</span>` 
            : '';
        
        const sizeDisplay = base64ImageRatio > 0.7 || totalImageCount > 0
            ? `${compressedDisplay}${imageCountDisplay}`
            : `<span style="color: #38d430;">${compressedDisplay} / ${decompressedDisplay}</span>${imageCountDisplay}`; 
        
        const scoreDisplay = scores && scores[actualIndex] !== undefined 
            ? `<div class="snippet-score">${scores[actualIndex].toFixed(1)}</div>` 
            : '';
        
        return `
            <div class="snippet-item ${isActive}" data-index="${actualIndex}">
                <input type="checkbox" class="snippet-checkbox" data-index="${actualIndex}">
                <div class="snippet-item-content">
                    <div class="snippet-title">${highlightedTitle}</div>
                    <div class="snippet-meta-row">
                        <div class="snippet-lang">${sizeDisplay} ${displayLang}</div>
                        ${scoreDisplay}
                        <div class="snippet-date" title="${timeString}">${date}</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    document.querySelectorAll('.snippet-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.classList.contains('snippet-checkbox')) {
                return;
            }
            loadSnippet(parseInt(item.getAttribute('data-index')));
        });
    });
    
    document.querySelectorAll('.snippet-checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', (e) => {
            e.stopPropagation();
            updateDeleteSelectedButton();
            updateCompareButton();
        });
    });
}

function createNewSnippet() {
    currentSnippetIndex = null;
    const searchTerm = document.getElementById('searchInput').value.trim();

    isMarkdownRendered = false;
    
    const saveHtmlBtnTop = document.getElementById('saveHtmlBtnTop');
    const saveNoImagesBtnTop = document.getElementById('saveNoImagesBtnTop');
    
    if (saveHtmlBtnTop) saveHtmlBtnTop.style.display = 'none';
    if (saveNoImagesBtnTop) saveNoImagesBtnTop.style.display = 'none';
    
    document.getElementById('snippetTitle').value = '';
    setLanguageDropdown('javascript');
    document.getElementById('snippetCode').value = '';
    document.getElementById('snippetNotes').value = '';
    document.getElementById('snippetNotes').style.height = '120px';
    document.getElementById('codePreview').textContent = 'Preview will appear here...';
    document.getElementById('codePreview').style.color = '#858585';
    
    clearNotesHighlight();
    
    const freqContainer = document.getElementById('frequencyAnalysisDisplay');
    if (freqContainer) {
        freqContainer.innerHTML = '';
    }
    
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('editorContainer').classList.add('active');
    
    if (searchTerm && searchTerm.length >= 2) {
        performSearch(searchTerm);
    } else {
        renderSnippetList();
    }
    
    document.getElementById('snippetCode').focus();
}

function highlightNotesMatches(notesText, searchTerm) {
    const notesTextarea = document.getElementById('snippetNotes');
    const notesSection = document.querySelector('.notes-section');
    
    let existingHighlight = notesSection.querySelector('.notes-highlight-overlay');
    if (!existingHighlight) {
        existingHighlight = document.createElement('div');
        existingHighlight.className = 'notes-highlight-overlay';
        notesSection.appendChild(existingHighlight);
    }
    
    const quotedPhrases = searchTerm.match(/"([^"]+)"/g) || [];
    const phrases = quotedPhrases.map(p => p.replace(/"/g, ''));
    
    const searchWithoutQuotes = searchTerm.replace(/"[^"]+"/g, '').trim();
    const terms = searchWithoutQuotes ? searchWithoutQuotes.toLowerCase().split(/\s+/).filter(t => t.length >= 2) : [];
    
    if (terms.length === 0 && phrases.length === 0) {
        clearNotesHighlight();
        return;
    }
    
    let highlightedHtml = escapeHtml(notesText);
    
    phrases.forEach(phrase => {
        const regex = new RegExp(`(${escapeRegex(phrase)})`, 'gi');
        highlightedHtml = highlightedHtml.replace(regex, '<mark>$1</mark>');
    });
    
    terms.forEach(term => {
        const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
        highlightedHtml = highlightedHtml.replace(regex, '<mark>$1</mark>');
    });
    
    const textareaHeight = notesTextarea.scrollHeight;
    existingHighlight.style.height = textareaHeight + 'px';
    existingHighlight.innerHTML = highlightedHtml;
    existingHighlight.style.display = 'block';
    notesTextarea.classList.add('has-highlights');
}

function clearNotesHighlight() {
    const notesTextarea = document.getElementById('snippetNotes');
    const notesSection = document.querySelector('.notes-section');
    const existingHighlight = notesSection.querySelector('.notes-highlight-overlay');
    
    if (existingHighlight) {
        existingHighlight.style.display = 'none';
    }
    
    notesTextarea.classList.remove('has-highlights');
}

function loadSnippet(index) {
    currentSnippetIndex = index;
    const snippet = snippets[index];
    const searchTerm = document.getElementById('searchInput').value.trim();

    isMarkdownRendered = false;
    
    const saveHtmlBtnTop = document.getElementById('saveHtmlBtnTop');
    const saveNoImagesBtnTop = document.getElementById('saveNoImagesBtnTop');
    
    if (saveHtmlBtnTop) saveHtmlBtnTop.style.display = 'none';
    if (saveNoImagesBtnTop) saveNoImagesBtnTop.style.display = 'none';
    
    document.getElementById('snippetTitle').value = snippet.title;
    setLanguageDropdown(snippet.language);
    document.getElementById('snippetCode').value = snippet.code;
    
    const notesTextarea = document.getElementById('snippetNotes');
    const notesValue = snippet.notes || '';
    notesTextarea.value = notesValue;
    
    setTimeout(() => {
        notesTextarea.style.height = 'auto';
        notesTextarea.style.height = Math.max(120, notesTextarea.scrollHeight + 2) + 'px';
    }, 0);
    
    setTimeout(() => {
        if (searchTerm && searchTerm.length >= 2 && notesValue) {
            highlightNotesMatches(notesValue, searchTerm);
        } else {
            clearNotesHighlight();
        }
    }, 50);
    
    if (snippet.language === 'markdown') {
        updatePreview();
        setTimeout(() => {
            if (!isMarkdownRendered) {
                toggleMarkdownView();
            }
        }, 100);
    } else {
        updatePreview();
    }
    
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('editorContainer').classList.add('active');
    
    if (searchTerm && searchTerm.length >= 2) {
        performSearch(searchTerm);
    } else {
        renderSnippetList();
    }
    
    document.getElementById('editorContainer').scrollTop = 0;
    
    displayFrequencyAnalysis(snippet.code);
}

function detectSubtitleFormat(code) {
    if (/^WEBVTT/m.test(code)) {
        return 'vtt';
    }
    
    const lines = code.split('\n');
    for (let i = 0; i < Math.min(lines.length, 10); i++) {
        if (/^\d+$/.test(lines[i].trim())) {
            if (i + 1 < lines.length && /\d{2}:\d{2}:\d{2}[,.]\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}[,.]\d{3}/.test(lines[i + 1])) {
                return 'srt';
            }
        }
    }
    
    if (/\d{2}:\d{2}:\d{2}[,.]\d{3}\s*(?:-->|,)\s*\d{2}:\d{2}:\d{2}[,.]\d{3}/.test(code)) {
        return 'subtitle';
    }
    
    return null;
}

function highlightSubtitles(code) {
    const lines = code.split('\n');
    const highlightedLines = [];
    
    for (let line of lines) {
        let highlighted = line;
        
        if (/^(WEBVTT|NOTE|STYLE)(\s|$)/.test(highlighted)) {
            highlighted = highlighted.replace(/^(WEBVTT|NOTE|STYLE)(\s|$)/, 
                '<span class="subtitle-keyword">$1</span>$2');
        }
        else if (/^\d+$/.test(highlighted.trim())) {
            highlighted = `<span class="subtitle-number">${escapeHtml(highlighted)}</span>`;
        }
        else if (/\d{1,2}:\d{2}:\d{2}[,.]\d{1,3}\s*(?:-->|,)\s*\d{1,2}:\d{2}:\d{2}[,.]\d{1,3}/.test(highlighted)) {
            highlighted = escapeHtml(highlighted);
            highlighted = highlighted.replace(
                /(\d{1,2}:\d{2}:\d{2}[,.]\d{1,3})\s*(--&gt;|,)\s*(\d{1,2}:\d{2}:\d{2}[,.]\d{1,3})/g,
                '<span class="subtitle-timeline">$1</span> <span class="subtitle-arrow">$2</span> <span class="subtitle-timeline">$3</span>'
            );
        }
        else {
            highlighted = escapeHtml(highlighted);
            highlighted = highlighted.replace(
                /(&lt;\/?)(b|i|u|font|v|c)([^&]*?)(&gt;)/gi,
                '<span class="subtitle-tag-bracket">$1</span><span class="subtitle-tag">$2$3</span><span class="subtitle-tag-bracket">$4</span>'
            );
        }
        
        highlightedLines.push(highlighted || '&nbsp;');
    }
    
    return highlightedLines.join('\n');
}

function getCurrentLanguage() {
    const dropdown = document.getElementById('languageSelector');
    const selected = dropdown.querySelector('.selected').textContent.toLowerCase();
    return availableLanguages.find(lang => 
        lang.charAt(0).toUpperCase() + lang.slice(1) === dropdown.querySelector('.selected').textContent
    ) || 'javascript';
}

function toggleWrap() {
    const preview = document.getElementById('codePreview');
    const codeTextarea = document.getElementById('snippetCode');
    const button = document.getElementById('toggleWrap');
    
    const isWrapped = preview.classList.contains('wrapped');
    
    if (isWrapped) {
        preview.classList.remove('wrapped');
        codeTextarea.classList.remove('wrapped');
        button.textContent = 'Wrap';
    } else {
        preview.classList.add('wrapped');
        codeTextarea.classList.add('wrapped');
        button.textContent = 'Unwrap';
    }
}

function updatePreview(overrideLang) {
    const code = document.getElementById('snippetCode').value;
    const lang = overrideLang || getCurrentLanguage();
    const preview = document.getElementById('codePreview');
    const searchTerm = document.getElementById('searchInput').value.trim();
    const markdownBtn = document.getElementById('viewMarkdownBtn');
    const saveHtmlBtnTop = document.getElementById('saveHtmlBtnTop');
    const saveNoImagesBtnTop = document.getElementById('saveNoImagesBtnTop');
        
    if (code) {
        markdownBtn.style.display = 'inline-block';
        markdownBtn.textContent = isMarkdownRendered ? 'View as Code' : 'View as Markdown';
        
        const csvBtn = document.getElementById('viewCsvBtn');
        if (detectCSV(code)) {
            csvBtn.style.display = 'inline-block';
        } else {
            csvBtn.style.display = 'none';
        }
    } else {
        markdownBtn.style.display = 'none';
        const csvBtn = document.getElementById('viewCsvBtn');
        if (csvBtn) csvBtn.style.display = 'none';
    }
    
    if (!code) {
        preview.textContent = 'Preview will appear here...';
        preview.style.color = '#858585';
        return;
    }
    
    preview.style.color = '';
    
    if (saveHtmlBtnTop) saveHtmlBtnTop.style.display = 'none';
    if (saveNoImagesBtnTop) saveNoImagesBtnTop.style.display = 'none';
    
    try {
        if (detectCSV(code)) {
            viewCSVAsTable();
            return;
        }

        const lines = code.split('\n');
        const totalLines = lines.length;
        
        const digits = Math.max(2, totalLines.toString().length);
        const lineNumWidth = (digits * 0.7 + 0.6);
        const codePaddingLeft = (digits * 0.7 + 1.6);

        const matchedLines = new Set();
        
        if (searchTerm && searchTerm.length >= 2) {
            const terms = searchTerm.toLowerCase().split(/\s+/).filter(t => t.length >= 2);
            
            lines.forEach((line, lineIndex) => {
                const lineLower = line.toLowerCase();
                if (terms.some(term => lineLower.includes(term))) {
                    matchedLines.add(lineIndex);
                }
            });
        }
        
        const subtitleFormat = detectSubtitleFormat(code);
        
        if (subtitleFormat) {
            const highlighted = highlightSubtitles(code);
            const highlightedLines = highlighted.split('\n');
            const pre = document.createElement('pre');
            
            highlightedLines.forEach((line, index) => {
                const lineDiv = document.createElement('div');
                lineDiv.className = 'code-line';
                
                if (matchedLines.has(index)) {
                    lineDiv.classList.add('code-line-highlighted');
                }
                
                const content = document.createElement('div');
                content.className = 'code-line-content';
                
                let contentHTML = line || '&nbsp;';
                if (searchTerm && searchTerm.length >= 2) {
                    contentHTML = highlightSearchTermsInHTML(contentHTML, searchTerm);
                }
                content.innerHTML = contentHTML;
                
                lineDiv.appendChild(content);
                pre.appendChild(lineDiv);
            });
            
            preview.textContent = '';
            preview.appendChild(pre);
        } else {
            const highlightedLines = lines.map((line, index) => {
                try {
                    let lineHighlighted = hljs.highlight(line || ' ', { language: lang }).value;
                    lineHighlighted = highlightHexColors(lineHighlighted, lang);
                    
                    if (searchTerm && searchTerm.length >= 2) {
                        lineHighlighted = highlightSearchTermsInHTML(lineHighlighted, searchTerm);
                    }
                    
                    const lineDiv = document.createElement('div');
                    
                    if (matchedLines.has(index)) {
                        lineDiv.classList.add('code-line-highlighted');
                    }
                    
                    lineDiv.style.cssText = `
                        position: relative;
                        padding-left: ${codePaddingLeft}rem;
                        line-height: 1.6;
                    `;
                    lineDiv.innerHTML = lineHighlighted;
                    return lineDiv;
                } catch (e) {
                    const lineDiv = document.createElement('div');
                    lineDiv.style.cssText = `
                        position: relative;
                        padding-left: ${codePaddingLeft}rem;
                        line-height: 1.6;
                    `;
                    lineDiv.textContent = line;
                    return lineDiv;
                }
            });
            
            const codeElem = document.createElement('code');
            codeElem.className = 'hljs';
            codeElem.style.display = 'block';
            preview.textContent = '';
            highlightedLines.forEach(lineDiv => codeElem.appendChild(lineDiv));
            preview.appendChild(codeElem);
            
            const styleId = 'dynamic-line-numbers';
            let styleElement = document.getElementById(styleId);
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = styleId;
                document.head.appendChild(styleElement);
            }
            
            styleElement.textContent = `
                #codePreview code > div::before {
                    content: counter(line);
                    counter-increment: line;
                    position: absolute;
                    left: 0.25rem;
                    width: ${lineNumWidth}rem !important;
                    text-align: right;
                    padding-right: 0.25rem;
                    color: #858585;
                    user-select: none;
                }
                #codePreview code {
                    counter-reset: line;
                }
            `;
        }
    } catch (error) {
        preview.textContent = code;
    }
}

function highlightSearchTermsInHTML(html, searchTerm) {
    const quotedPhrases = searchTerm.match(/"([^"]+)"/g) || [];
    const phrases = quotedPhrases.map(p => p.replace(/"/g, ''));
    
    const searchWithoutQuotes = searchTerm.replace(/"[^"]+"/g, '').trim();
    const terms = searchWithoutQuotes ? searchWithoutQuotes.toLowerCase().split(/\s+/).filter(t => t.length >= 2) : [];
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const highlightTextNodes = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.textContent;
            let highlighted = false;
            
            phrases.forEach(phrase => {
                const regex = new RegExp(`(${escapeRegex(phrase)})`, 'gi');
                if (regex.test(text)) {
                    text = text.replace(regex, '<mark>$1</mark>');
                    highlighted = true;
                }
            });
            
            terms.forEach(term => {
                const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
                if (regex.test(text)) {
                    text = text.replace(regex, '<mark>$1</mark>');
                    highlighted = true;
                }
            });
            
            if (highlighted) {
                const span = document.createElement('span');
                span.innerHTML = text;
                node.parentNode.replaceChild(span, node);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'MARK') {
            Array.from(node.childNodes).forEach(highlightTextNodes);
        }
    };
    
    highlightTextNodes(tempDiv);
    return tempDiv.innerHTML;
}

function displayFrequencyAnalysis(code) {
    let freqContainer = document.getElementById('frequencyAnalysisDisplay');
    
    if (!freqContainer) {
        freqContainer = document.createElement('div');
        freqContainer.id = 'frequencyAnalysisDisplay';
        freqContainer.style.cssText = 'margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #3e3e42;';
        document.getElementById('notesSection').appendChild(freqContainer);
    }
    
    if (!code || code.length < 1000) {
        freqContainer.innerHTML = '';
        return;
    }
    
    const wordFreq = processWords(code);
    
    if (wordFreq.length === 0) {
        freqContainer.innerHTML = '';
        return;
    }
    
    const freqItems = wordFreq.map(item => 
        `<span style="color: #38d430;">${item.freq}</span>&#x2007;${item.word}`
    ).join('&#x2007; ');
    
    freqContainer.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
            <h4 style="color: #858585; margin: 0; font-size: 0.85rem;">Word Frequencies</h4>
            <button id="copyFreqWords" class="secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Copy All Words</button>
            <span style="color: #858585; font-size: 0.75rem;">Save html and paste into Multi-Term Page Highlighter</span>
        </div>
        <div style="color: #d4d4d4; font-size: 0.8rem; line-height: 1.6;">${freqItems}</div>
    `;
    
    const copyBtn = document.getElementById('copyFreqWords');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const words = wordFreq.map(item => item.word).join(' ');
            navigator.clipboard.writeText(words).then(() => {
                showNotification(`Copied ${wordFreq.length} words to clipboard!`);
            }).catch(err => {
                console.error('Failed to copy:', err);
                showNotification('Failed to copy to clipboard', 'error');
            });
        });
    }
}

function processWords(text) {
    text = text.replace(/['']/g, "'");
    
    const cleanText = text.replace(/[^A-Za-z'\s]/g, ' ').toLowerCase();
    
    const rawWords = cleanText.split(/\s+/);
    const words = [];
    
    for (const word of rawWords) {
        const trimmed = word.replace(/^'+|'+$/g, '');
        if (trimmed.length >= 4) {
            words.push(trimmed);
        }
    }
    
    const wordFreq = {};
    words.forEach(word => {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
        
    const commonWords = new Set([
        "about", "actually", "after", "all", "also", "always", "and",
        "another", "any", "are", "ask", "away", "avif", "because", "been", "before", "but", "blog",
        "cache", "came", "can", "come", "could", "day", "did", "didn", "didn't", "does", "doesn't",
        "doing", "don't", "even", "every", "everything", "find", "for", "from",
        "get", "going", "got", "had", "has", "have", "her", "here", "him", "his",
        "how", "into", "just", "know", "let", "let's",
        "like", "look", "made", "make", "many", "may", "maybe", "mean", "more",
        "most", "much", "need", "news", "never", "nor", "not", "now", "okay", "one",
        "only", "other", "our", "out", "over", "put", "rather", "really",
        "right", "said", "same", "say", "saying", "says", "see", "she", "some",
        "something", "sort", "still", "sure", "take", "than", "that", "that's",
        "the", "their", "them", "then", "there", "these", "they", "thing", "things",
        "think", "this", "those", "through", "too", "two", "until",
        "upon", "very", "want", "was", "way", "well", "were", "what", "when",
        "where", "which", "who", "why", "will", "with", "would", "yeah", "yet",
        "you", "you're", "your", "yourself", "each", "amongst", "except",
        "should", "whom", "new", "both", "best", "first", "yes", "great",
        "three", "back", "next", "whoever", "comes", "between",
        "beautiful", "better", "whatever", "went", "last", "gave", "its",
        "four", "others", "around", "it's", "that's", "you'll", "he's", "don't",
        "they're", "there's", "clear", "we'll", "understand", "word", "within",
        "keep", "though", "goes", "let's", "however", "based", "what's", "we're",
        "anything", "you're", "means", "used", "such", "far", "part", "call",
        "against", "stop", "become", "became", "down", "lot", "clearly", "form",
        "known", "off", "i'll", "else", "anyone", "who's", "without", "end",
        "try", "own", "brought", "knows", "due", "given", "someone",
        "today", "bring", "already", "might", "use", "either", "during",
        "themselves", "again", "days", "can't", "cannot",
        "important", "they'll", "able", "coming", "left", "having",
        "little", "third", "done", "whether", "wants", "once", "becomes",
        "exactly", "sees", "later", "ones", "absolute", "absolutely", "cause",
        "long", "takes", "ago", "i've", "we've", "wasn't", "knew", "anyway",
        "tell", "he'll", "asked", "one's", "time", "type", "being", "called",
        "order", "course", "place", "certain", "himself", "different", "proper",
        "talk", "similar", "give", "nothing", "correct", "mention", "happened",
        "talked", "hear", "greatest", "heard", "especially", "seen", "wanted",
        "talking", "true", "happen", "fell", "complete", "times", "high", "past",
        "close", "read", "show", "greater", "set", "year", "everywhere",
        "taken", "self", "totally", "under", "gives", "makes", "took", "brings",
        "years", "https", "http", "www", "com", "org", "net", "edu"
    ]);
    
    Object.keys(wordFreq).forEach(word => {
        const normalizedWord = word.replace(/['']/g, "'");
        if (commonWords.has(normalizedWord)) {
            delete wordFreq[word];
        }
    });
        
    const output = [];
    for (const [word, freq] of Object.entries(wordFreq)) {
        if (freq >= 4) {
            output.push({ word, freq });
        }
    }
    
    output.sort((a, b) => b.freq - a.freq);
    
    output.forEach(item => {
        const charCodes = item.word.split('').map(c => c.charCodeAt(0)).join(',');
    });
    
    return output.slice(0, 2000);
    
}

function analyzeFrequency(code) {
    const startTime = performance.now();
    
    showNotification('Analyzing word frequencies...', 'success');
    
    const wordFreq = processWords(code);
    const totalTime = performance.now() - startTime;
        
    if (wordFreq.length === 0) {
        return '';
    }
    
    const freqItems = wordFreq.map(item => 
        `<span style="color: #38d430;">${item.freq}x</span> ${item.word}`
    ).join(' • ');
    
    const freqText = `\n\n<h4 style="color: #858585; margin-top: 2rem; margin-bottom: 0.5rem; font-size: 0.85rem;">Word Frequencies</h4>\n<div style="color: #d4d4d4; font-size: 0.8rem; line-height: 1.6;">${freqItems}</div>\n`;
    
    showNotification(`Word frequency analysis complete (${totalTime.toFixed(0)}ms)`, 'success');
    
    return freqText;
}

async function saveCurrentSnippet() {
    let title = document.getElementById('snippetTitle').value.trim();
    const language = getCurrentLanguage();
    const codeTextarea = document.getElementById('snippetCode');
    let code = codeTextarea.value.trim();
    const notesTextarea = document.getElementById('snippetNotes');
    let notes = notesTextarea.value.trim();
    
    let highlightedTerms = {};
    let cjkMode = false;
    
    if (codeTextarea.dataset.pendingHighlights) {
        try {
            highlightedTerms = JSON.parse(codeTextarea.dataset.pendingHighlights);
            delete codeTextarea.dataset.pendingHighlights;
        } catch (e) {
            console.error('Failed to parse pending highlights:', e);
        }
    } 
    else if (currentSnippetIndex !== null && snippets[currentSnippetIndex].highlightedTerms) {
        highlightedTerms = snippets[currentSnippetIndex].highlightedTerms;
    }
    
    if (codeTextarea.dataset.pendingCjkMode !== undefined) {
        cjkMode = codeTextarea.dataset.pendingCjkMode === 'true';
        delete codeTextarea.dataset.pendingCjkMode;
    } else if (currentSnippetIndex !== null && snippets[currentSnippetIndex].cjkMode !== undefined) {
        cjkMode = snippets[currentSnippetIndex].cjkMode;
    }
    
    if (!title && notes) {
        const lines = notes.split('\n');
        const firstLine = lines.find(line => line.trim().length > 0);
        if (firstLine) {
            title = firstLine.trim().substring(0, 80);
            document.getElementById('snippetTitle').value = title;
        }
    }
    
    if (!title && code) {
        const lines = code.split('\n');
        const firstLine = lines.find(line => line.trim().length > 0);
        if (firstLine) {
            title = firstLine.trim().substring(0, 80);
            document.getElementById('snippetTitle').value = title;
        }
    }
    
    if (!title) {
        showNotification('Please provide a title', 'error');
        document.getElementById('snippetTitle').focus();
        return;
    }
    
    if (!code && !notes) {
        showNotification('Please provide code or notes', 'error');
        return;
    }

    const imageCount = (code.match(/data:image\/avif/g) || []).length;
    
    if (imageCount >= 64) {
        const sizeKB = (code.length / 1024).toFixed(0);
        
        const choice = confirm(
            `This snippet contains ${imageCount} embedded AVIF images (${sizeKB} KB).\n\n` +
            `Saving may cause a momentary RAM spike.\n\n` +
            `TIP: Use "Save 🌄" to save HTML or "Save ❌🌄" to strip images.\n\n` +
            `OK = Continue saving with images\n` +
            `Cancel = Don't save`
        );
        
        if (!choice) return;
        
        showNotification('Saving large snippet... This may take 5-60 seconds', 'error');
    }

    const timestamp = currentSnippetIndex !== null ? snippets[currentSnippetIndex].timestamp : Date.now();
    
    const shouldUseIndexedDB = imageCount >= 1;
    
    let snippet;
    
    if (shouldUseIndexedDB) {
        const fullSnippet = {
            title,
            language,
            code,
            notes,
            timestamp,
            highlightedTerms,
            cjkMode
        };
        
        try {
            await snippetStorage.set(`snippet_${timestamp}`, fullSnippet);
            
            snippet = {
                title,
                language,
                code: '',
                notes: '',
                timestamp,
                inIndexedDB: true,
                imageCount: imageCount,
                highlightedTerms,
                cjkMode
            };
        } catch (error) {
            console.error('Failed to save to IndexedDB:', error);
            showNotification('Failed to save to IndexedDB, using fallback', 'error');
            snippet = {
                title,
                language,
                code: compressText(code),
                notes,
                compressed: true,
                timestamp,
                highlightedTerms,
                cjkMode
            };
        }
    } else {
        const compressedCode = compressText(code);
        
        snippet = {
            title,
            language,
            code: compressedCode,
            notes,
            compressed: true,
            timestamp,
            highlightedTerms,
            cjkMode
        };
    }
    
    if (currentSnippetIndex !== null) {
        const uncompressedSnippet = {
            title,
            language,
            code,
            notes,
            timestamp,
            inIndexedDB: shouldUseIndexedDB,
            highlightedTerms,
            cjkMode
        };
        snippets[currentSnippetIndex] = uncompressedSnippet;
        
        if (imageCount < 64) {
            showNotification('Snippet updated!');
        }
    } else {
        const uncompressedSnippet = {
            title,
            language,
            code,
            notes,
            timestamp,
            inIndexedDB: shouldUseIndexedDB,
            highlightedTerms,
            cjkMode
        };
        snippets.unshift(uncompressedSnippet);
        currentSnippetIndex = 0;
        if (imageCount < 64) {
            showNotification('Snippet saved!');
        }
    }
    
    const storageObj = {};
    const storageSnippets = snippets.map(s => {
        if (s.inIndexedDB) {
            return {
                title: s.title,
                language: s.language,
                code: '',
                notes: '',
                timestamp: s.timestamp,
                inIndexedDB: true,
                imageCount: (s.code.match(/data:image\/avif/g) || []).length,
                highlightedTerms: s.highlightedTerms || {},
                cjkMode: s.cjkMode || false
            };
        } else {
            return {
                title: s.title,
                language: s.language,
                code: compressText(s.code || ''),
                notes: s.notes,
                compressed: true,
                timestamp: s.timestamp,
                highlightedTerms: s.highlightedTerms || {},
                cjkMode: s.cjkMode || false
            };
        }
    });
    storageObj[getStorageKey('snippets')] = storageSnippets;
    
    await browser.storage.local.set(storageObj);
    const hashKey = getStorageKey('indexhash');
    await browser.storage.local.set({ [hashKey]: '' });
    
    renderSnippetList();
    displayFrequencyAnalysis(code);
}

async function saveSnippetWithoutImages() {
    let title = document.getElementById('snippetTitle').value.trim();
    const language = getCurrentLanguage();
    const codeTextarea = document.getElementById('snippetCode');
    let code = codeTextarea.value.trim(); 
    const notes = document.getElementById('snippetNotes').value.trim();
    
    let highlightedTerms = {};
    let cjkMode = false;
    
    if (codeTextarea.dataset.pendingHighlights) {
        try {
            highlightedTerms = JSON.parse(codeTextarea.dataset.pendingHighlights);
            delete codeTextarea.dataset.pendingHighlights;
        } catch (e) {
            console.error('Failed to parse pending highlights:', e);
        }
    } else if (currentSnippetIndex !== null && snippets[currentSnippetIndex].highlightedTerms) {
        highlightedTerms = snippets[currentSnippetIndex].highlightedTerms;
    }
    
    if (codeTextarea.dataset.pendingCjkMode !== undefined) {
        cjkMode = codeTextarea.dataset.pendingCjkMode === 'true';
        delete codeTextarea.dataset.pendingCjkMode;
    } else if (currentSnippetIndex !== null && snippets[currentSnippetIndex].cjkMode !== undefined) {
        cjkMode = snippets[currentSnippetIndex].cjkMode;
    }
    
    if (!title && notes) {
        const lines = notes.split('\n');
        const firstLine = lines.find(line => line.trim().length > 0);
        if (firstLine) {
            title = firstLine.trim().substring(0, 80);
        }
    }
    
    if (!title && code) {
        const lines = code.split('\n');
        const firstLine = lines.find(line => line.trim().length > 0);
        if (firstLine) {
            title = firstLine.trim().substring(0, 80);
        }
    }
    
    if (!title) {
        showNotification('Please provide a title', 'error');
        document.getElementById('snippetTitle').focus();
        return;
    }
    
    if (!code && !notes) {
        showNotification('Please provide code or notes', 'error');
        return;
    }

    const base64ImageCount = (code.match(/!\[.*?\]\(data:image\/[^;]+;base64,[^)]+\)/g) || []).length;
    const avifCacheCount = (code.match(/!\[.*?\]\(avif-cache:\/\/[a-f0-9]+(?:#\d+)?\)/g) || []).length;
    const emptyMarkdownCount = (code.match(/!\[.*?\]\(\)/g) || []).length;
    const htmlImgCount = (code.match(/<img[^>]*>/gi) || []).length;
    
    const totalImageCount = base64ImageCount + avifCacheCount + emptyMarkdownCount + htmlImgCount;
    
    if (totalImageCount === 0) {
        showNotification('No images found to strip', 'error');
        return;
    }
    
    const safeTitle = title.replace(/[<>:"/\\|?*]/g, '-');
    const htmlFilename = `${safeTitle}.html`;
    
    let strippedCode = code;
    
    strippedCode = strippedCode.replace(/!\[.*?\]\(data:image\/[^;]+;base64,[^)]+\)\n?/g, '');
    
    strippedCode = strippedCode.replace(/!\[.*?\]\(avif-cache:\/\/[a-f0-9]+(?:#\d+)?\)\n?/g, '');
    
    strippedCode = strippedCode.replace(/!\[.*?\]\(\)\n?/g, '');
    
    strippedCode = strippedCode.replace(/<img[^>]*>/gi, '');
    
    strippedCode = strippedCode.replace(/\n{3,}/g, '\n\n');
    
    const imageReference = `---\n**Images:** See \`${htmlFilename}\` (${totalImageCount} image${totalImageCount !== 1 ? 's' : ''} removed)\n---\n\n`;
    const newCode = imageReference + strippedCode;
    
    const newTitle = title;

    const compressedCode = compressText(newCode);
    
    const snippet = {
        title: newTitle,
        language,
        code: compressedCode,
        notes,
        compressed: true,
        timestamp: Date.now(),
        highlightedTerms,
        cjkMode
    };
    
    const uncompressedSnippet = {
        ...snippet,
        code: newCode
    };
    
    snippets.unshift(uncompressedSnippet);
    currentSnippetIndex = 0;
    
    document.getElementById('snippetTitle').value = newTitle;
    document.getElementById('snippetCode').value = newCode;
    
    setLanguageDropdown('markdown');
    
    const imageBreakdown = [];
    if (base64ImageCount > 0) imageBreakdown.push(`${base64ImageCount} base64`);
    if (avifCacheCount > 0) imageBreakdown.push(`${avifCacheCount} AVIF`);
    if (emptyMarkdownCount > 0) imageBreakdown.push(`${emptyMarkdownCount} empty`);
    if (htmlImgCount > 0) imageBreakdown.push(`${htmlImgCount} HTML`);
    
    showNotification(`New snippet created! ${totalImageCount} image${totalImageCount !== 1 ? 's' : ''} stripped (${imageBreakdown.join(', ')})`);
    
    const storageObj = {};
    const storageSnippets = snippets.map(s => ({
        title: s.title,
        language: s.language,
        code: compressText(s.code),
        notes: s.notes,
        compressed: true,
        timestamp: s.timestamp,
        highlightedTerms: s.highlightedTerms || {},
        cjkMode: s.cjkMode || false
    }));
    storageObj[getStorageKey('snippets')] = storageSnippets;
    
    browser.storage.local.set(storageObj).then(() => {
        const hashKey = getStorageKey('indexhash');
        browser.storage.local.set({ [hashKey]: '' });
        
        renderSnippetList();
        
        isMarkdownRendered = false;
        setTimeout(() => {
            toggleMarkdownView();
        }, 100);
    });

    if (newCode && newCode.length > 1000) {
        const freqAnalysis = analyzeFrequency(newCode);
        if (freqAnalysis) {
            notes = notes + freqAnalysis;
        }
    }
}

async function cleanupOrphanedAVIFImages(deletedSnippets, remainingSnippets) {
    const deletedHashes = new Set();
    
    deletedSnippets.forEach(snippet => {
        const hashes = (snippet.code.match(/avif-cache:\/\/([a-f0-9]+)/g) || [])
            .map(ref => ref.replace('avif-cache://', '').split('#')[0]);
        hashes.forEach(hash => deletedHashes.add(hash));
    });
    
    if (deletedHashes.size === 0) return 0;
    
    const hashesInUse = new Set();
    remainingSnippets.forEach(snippet => {
        const hashes = (snippet.code.match(/avif-cache:\/\/([a-f0-9]+)/g) || [])
            .map(ref => ref.replace('avif-cache://', '').split('#')[0]);
        hashes.forEach(hash => hashesInUse.add(hash));
    });
    
    const orphanedHashes = Array.from(deletedHashes).filter(hash => !hashesInUse.has(hash));
    
    if (orphanedHashes.length === 0) {
        return 0;
    }
        
    for (const hash of orphanedHashes) {
        try {
            await browser.runtime.sendMessage({
                type: 'deleteAVIFCache',
                hash: hash
            });
        } catch (error) {
            console.error('✗ Failed to delete AVIF:', hash, error);
        }
    }
    
    return orphanedHashes.length;
}

async function deleteCurrentSnippet() {
    if (currentSnippetIndex === null) return;
    
    const snippet = snippets[currentSnippetIndex];
    
    if (!confirm(`Delete "${snippet.title}"?`)) return;
    
    const remainingSnippets = snippets.filter((s, idx) => idx !== currentSnippetIndex);
    const deletedCount = await cleanupOrphanedAVIFImages([snippet], remainingSnippets);
    
    if (snippet.inIndexedDB && snippet.timestamp) {
        try {
            await snippetStorage.delete(`snippet_${snippet.timestamp}`);
        } catch (error) {
            console.error('Error deleting from IndexedDB:', error);
        }
    }
    
    snippets.splice(currentSnippetIndex, 1);
    
    const storageObj = {};
    storageObj[getStorageKey('snippets')] = snippets.map(s => {
        if (s.inIndexedDB) {
            return {
                title: s.title,
                language: s.language,
                code: '',
                notes: '',
                timestamp: s.timestamp,
                inIndexedDB: true
            };
        } else {
            return {
                title: s.title,
                language: s.language,
                code: s.compressed ? compressText(s.code) : s.code,
                notes: s.notes,
                compressed: true,
                timestamp: s.timestamp
            };
        }
    });
    
    await browser.storage.local.set(storageObj);
    
    currentSnippetIndex = null;
    document.getElementById('emptyState').style.display = 'flex';
    document.getElementById('editorContainer').classList.remove('active');
    
    const hashKey = getStorageKey('indexhash');
    await browser.storage.local.set({ [hashKey]: '' });
    
    sortSnippets();
    
    if (deletedCount > 0) {
        showNotification(`Deleted snippet and ${deletedCount} orphaned image${deletedCount !== 1 ? 's' : ''}`);
    } else {
        showNotification('Snippet deleted');
    }
}

function updateDeleteSelectedButton() {
    const checkboxes = document.querySelectorAll('.snippet-checkbox:checked');
    const deleteBtn = document.getElementById('deleteSelectedBtn');
    const addTagContainer = document.getElementById('addTagContainer');
    
    if (checkboxes.length > 0) {
        deleteBtn.style.display = 'block';
        deleteBtn.textContent = `Delete Selected (${checkboxes.length})`;
        addTagContainer.style.display = 'flex';
    } else {
        deleteBtn.style.display = 'none';
        addTagContainer.style.display = 'none';
    }
}

async function cleanOrphanedImages() {
    if (!confirm('Scan all workspaces and remove orphaned AVIF images?\n\nThis will delete images not referenced by any snippet.')) {
        return;
    }
    
    try {
        const data = await browser.storage.local.get(null);
        const allHashes = new Set();
        
        Object.keys(data).forEach(key => {
            if (key.startsWith('zoocagesnippets') || key === 'zoocagesnippets') {
                const snippetsData = data[key] || [];
                snippetsData.forEach(snippet => {
                    const code = snippet.code || '';
                    const hashes = (code.match(/avif-cache:\/\/([a-f0-9]+)/g) || [])
                        .map(ref => ref.replace('avif-cache://', '').split('#')[0]);
                    hashes.forEach(hash => allHashes.add(hash));
                });
            }
        });
                
        const avifCache = new AVIFCache();
        await avifCache.init();
        const cachedHashes = await avifCache.getAllKeys();
                
        const orphanedHashes = cachedHashes.filter(hash => !allHashes.has(hash));
        
        if (orphanedHashes.length === 0) {
            alert('No orphaned images found! All cached images are referenced by snippets.');
            return;
        }
        
        let totalSize = 0;
        for (const hash of orphanedHashes) {
            const data = await avifCache.getWithSize(hash);
            if (data && data.size) {
                totalSize += data.size;
            }
        }
        
        const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
        
        if (!confirm(`Found ${orphanedHashes.length} orphaned image${orphanedHashes.length !== 1 ? 's' : ''} (${sizeMB}MB).\n\nDelete them?`)) {
            return;
        }
        
        let deletedCount = 0;
        for (const hash of orphanedHashes) {
            try {
                await avifCache.delete(hash);
                deletedCount++;
            } catch (error) {
                console.error('Failed to delete:', hash, error);
            }
        }
        
        loadWorkspaces();
        alert(`Cleaned up ${deletedCount} orphaned image${deletedCount !== 1 ? 's' : ''} (${sizeMB}MB freed)`);
        
    } catch (error) {
        console.error('Failed to clean orphaned images:', error);
        alert('Failed to clean orphaned images: ' + error.message);
    }
}

function updateCompareButton() {
    const checkboxes = document.querySelectorAll('.snippet-checkbox:checked');
    const compareBtn = document.getElementById('compareSelectedBtn');
    
    if (checkboxes.length === 2) {
        compareBtn.style.display = 'block';
        compareBtn.textContent = 'Compare Selected (2)';
        compareBtn.onclick = compareSelectedSnippets;
        compareBtn.className = 'secondary';
    } else if (checkboxes.length >= 3) {
        compareBtn.style.display = 'block';
        compareBtn.textContent = `Zip to html (${checkboxes.length})`;
        compareBtn.onclick = zipSelectedToHTML;
        compareBtn.className = 'secondary';
    } else {
        compareBtn.style.display = 'none';
    }
}

function compareSelectedSnippets() {
    const checkboxes = document.querySelectorAll('.snippet-checkbox:checked');
    const indices = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));
    
    if (indices.length !== 2) {
        showNotification('Please select exactly 2 snippets to compare', 'error');
        return;
    }
    
    const snippet1 = snippets[indices[0]];
    const snippet2 = snippets[indices[1]];
    
    showDiffView(snippet1, snippet2);
}

async function zipSelectedToHTML() {
    const checkboxes = document.querySelectorAll('.snippet-checkbox:checked');
    const indices = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));
    
    if (indices.length < 3) {
        showNotification('Please select at least 3 snippets', 'error');
        return;
    }
    
    const zip = new JSZip();
    const avifCache = new AVIFCache();
    await avifCache.init();
    
    const storageData = await browser.storage.local.get('cjkMode');
    const cjkMode = storageData.cjkMode || false;
    
    showNotification(`Processing ${indices.length} snippets...`);
    
    const themeStylesheet = document.getElementById('themeStylesheet');
    const isDarkTheme = themeStylesheet.href.includes('themesdark/');
    
    const indexEntries = [];
    
    for (let i = 0; i < indices.length; i++) {
        const snippet = snippets[indices[i]];
        const safeTitle = snippet.title.replace(/[<>:"/\\|?*]/g, '-');
        const filename = `${String(i + 1).padStart(3, '0')}_${safeTitle}.html`;
        
        let code = snippet.code || '';
        
        const cacheRefs = code.match(/avif-cache:\/\/([a-f0-9]+)/g) || [];
        const imageDataUrls = [];
        
        if (cacheRefs.length > 0) {
            for (const ref of cacheRefs) {
                const hash = ref.replace('avif-cache://', '').split('#')[0];
                const blob = await avifCache.get(hash);
                
                if (blob) {
                    const arrayBuffer = await blob.arrayBuffer();
                    const uint8Array = new Uint8Array(arrayBuffer);
                    let binary = '';
                    for (let i = 0; i < uint8Array.length; i++) {
                        binary += String.fromCharCode(uint8Array[i]);
                    }
                    const base64 = btoa(binary);
                    const dataUrl = `data:image/avif;base64,${base64}`;
                    
                    if (imageDataUrls.length < 3) {
                        imageDataUrls.push(dataUrl);
                    }
                    
                    code = code.replace(new RegExp(ref, 'g'), dataUrl);
                }
            }
        }
        
        const isMarkdown = snippet.language === 'markdown';

        let htmlContent;
        if (isMarkdown) {
            htmlContent = await generateMarkdownHTML(snippet.title, code, snippet.highlightedTerms, cjkMode);
        } else {
            htmlContent = await generateCodeHTML(snippet.title, snippet.language, code);
        }
        
        zip.file(filename, htmlContent);
        
        const sizeBytes = new Blob([htmlContent]).size;
        
        indexEntries.push({
            filename: filename,
            title: snippet.title,
            language: snippet.language,
            imageCount: cacheRefs.length,
            images: imageDataUrls,
            sizeBytes: sizeBytes
        });
    }
    
    const indexHTML = generateIndexHTML(indexEntries);
    zip.file('000_index.html', indexHTML);
    
    const content = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
            level: 9
        }
    });
    
    const url = URL.createObjectURL(content);
    const timestamp = new Date().toISOString().split('T')[0];
    const link = document.createElement('a');
    link.href = url;
    link.download = `zoocage-snippets-${timestamp}.zip`;
    link.click();
    URL.revokeObjectURL(url);
    
    showNotification(`Exported ${indices.length} snippet${indices.length !== 1 ? 's' : ''} to html!`);
}

function generateIndexHTML(entries) {
    const themeStylesheet = document.getElementById('themeStylesheet');
    const isDarkTheme = themeStylesheet.href.includes('themesdark/');
    const bgColor = isDarkTheme ? '#1e1e1e' : '#f5f5f5';
    const textColor = isDarkTheme ? '#d4d4d4' : '#333333';
    
    const entriesHTML = entries.map(entry => {
        let sizeDisplay;
        if (entry.sizeBytes < 1024) {
            sizeDisplay = `${entry.sizeBytes}B`;
        } else if (entry.sizeBytes < 1024 * 1024) {
            sizeDisplay = `${(entry.sizeBytes / 1024).toFixed(1)}KB`;
        } else {
            sizeDisplay = `${(entry.sizeBytes / (1024 * 1024)).toFixed(1)}MB`;
        }
        
        const languageDisplay = entry.language.charAt(0).toUpperCase() + entry.language.slice(1);
        
        const fileNumber = entry.filename.substring(0, 3);
        
        return `<div style="display: flex; gap: 1rem; padding: 0.35rem 0; border-bottom: 1px solid ${isDarkTheme ? '#3e3e42' : '#e0e0e0'};">
            <span style="color: #858585; font-family: monospace; min-width: 2.5rem;">${fileNumber}</span>
            <a href="${entry.filename}" style="color: #4ec9b0; text-decoration: none; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(entry.title)}</a>
            <span style="color: #ffab4d; min-width: 5rem;">${languageDisplay}</span>
            ${entry.imageCount > 0 ? `<span style="color: #ff3f3f; min-width: 2.5rem;">${entry.imageCount}</span>` : '<span style="min-width: 2.5rem;"></span>'}
            <span style="color: #38d430; min-width: 4rem; text-align: right;">${sizeDisplay}</span>
        </div>`;
    }).join('');
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ZooCage Code Snippets</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            margin: 0;
            padding: 2rem;
            background: ${bgColor};
            color: ${textColor};
            line-height: 1.6;
            font-size: 0.9rem;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .header {
            margin-bottom: 1rem;
            font-size: 0.9rem;
            color: #858585;
        }
        
        a {
            color: #4ec9b0;
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <span style="color: #d34f02;">Z</span><span style="color: #bb4838;">o</span><span style="color: #af6743;">o</span><span style="color: #caa98a;">C</span><span style="color: #c9a16e;">a</span><span style="color: #b79767;">g</span><span style="color: #8e6845;">e</span> <span style="color: #d34f02;">C</span><span style="color: #bb4838;">o</span><span style="color: #af6743;">d</span><span style="color: #caa98a;">e</span> <span style="color: #c9a16e;">S</span><span style="color: #b79767;">n</span><span style="color: #8e6845;">i</span><span style="color: #d34f02;">p</span><span style="color: #bb4838;">p</span><span style="color: #af6743;">e</span><span style="color: #caa98a;">t</span><span style="color: #c9a16e;">t</span><span style="color: #b79767;">s</span>
            &nbsp;&nbsp;&nbsp;Exported ${entries.length} snippet${entries.length !== 1 ? 's' : ''} on ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
        ${entriesHTML}
    </div>
</body>
</html>`;
}

async function generateMarkdownHTML(title, markdownCode, highlightedTerms = {}, cjkMode = false) {
    const themeStylesheet = document.getElementById('themeStylesheet');
    let themeCSS = '';
    
    try {
        const response = await fetch(themeStylesheet.href);
        themeCSS = await response.text();
    } catch (error) {
        console.error('Failed to fetch theme CSS:', error);
    }
    
    const isDarkTheme = themeStylesheet.href.includes('themesdark/');
    
    const testPre = document.createElement('pre');
    testPre.className = 'hljs';
    testPre.innerHTML = `
        <span class="hljs-keyword">keyword</span>
        <span class="hljs-string">string</span>
        <span class="hljs-title">title</span>
    `;
    testPre.style.position = 'absolute';
    testPre.style.visibility = 'hidden';
    document.body.appendChild(testPre);
    
    const preStyles = window.getComputedStyle(testPre);
    const bgColor = preStyles.backgroundColor;
    const textColor = preStyles.color;
    
    const keywordEl = testPre.querySelector('.hljs-keyword');
    const stringEl = testPre.querySelector('.hljs-string');
    const titleEl = testPre.querySelector('.hljs-title');
    
    const keywordColor = keywordEl ? window.getComputedStyle(keywordEl).color : '#4ec9b0';
    const stringColor = stringEl ? window.getComputedStyle(stringEl).color : '#ce9178';
    const titleColor = titleEl ? window.getComputedStyle(titleEl).color : '#dcdcaa';
    
    document.body.removeChild(testPre);
    
    const bodyBgColor = isDarkTheme ? '#1e1e1e' : '#f5f5f5';
    
    const { markdownFont = '0xProto' } = await browser.storage.local.get({ markdownFont: '0xProto' });
    
    const md = window.markdownit({
        html: true,
        linkify: true,
        typographer: true,
        breaks: true,
        highlight: function (str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return '<pre class="hljs"><code class="hljs language-' + lang + '">' +
                           hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                           '</code></pre>';
                } catch (e) {
                    console.error('Highlight error:', e);
                }
            }
            return '<pre class="hljs"><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre>';
        }
    }).enable('image');
    
    md.validateLink = function(url) {
        if (url.startsWith('data:image/')) {
            return true;
        }
        const BAD_PROTO_RE = /^(vbscript|javascript|file|data):/;
        const GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp|avif);/;
        
        const str = url.trim().toLowerCase();
        return !BAD_PROTO_RE.test(str) || GOOD_DATA_RE.test(str);
    };
    
    let rendered = md.render(markdownCode);

    if (highlightedTerms && Object.keys(highlightedTerms).length > 0) {
        rendered = applyHighlightsWithColors(rendered, highlightedTerms, cjkMode);
    }
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <style>
        ${themeCSS}
        
        body {
            font-family: '${markdownFont}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            max-width: 640px;
            margin: 0 auto;
            padding: 2rem;
            background: ${bodyBgColor};
            color: ${textColor};
        }
        
        p { color: ${textColor}; }
        
        img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 1rem 0;
        }
        
        pre {
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
            margin: 1rem 0;
        }
        
        code {
            font-family: '${markdownFont}', 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 0.9em;
        }
        
        pre code {
            background: none !important;
            padding: 0;
        }
        
        :not(pre) > code {
            background: ${isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
            color: ${stringColor};
            padding: 2px 6px;
            border-radius: 3px;
        }
        
        blockquote {
            border-left: 4px solid ${keywordColor};
            margin: 1rem 0;
            padding-left: 1rem;
            color: ${textColor};
            opacity: 0.7;
        }
        
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1rem 0;
        }
        
        th, td {
            border: 1px solid ${isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
            padding: 0.5rem;
            text-align: left;
        }
        
        th {
            background: ${isDarkTheme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
            font-weight: 600;
        }
        
        a {
            color: ${keywordColor};
            text-decoration: none;
        }
        
        a:hover {
            color: ${stringColor};
            text-decoration: underline;
        }
        
        h1, h2, h3, h4, h5, h6 {
            margin-top: 1.5rem;
            margin-bottom: 0.5rem;
            color: ${titleColor};
        }
        
        h1 { 
            font-size: 2em; 
            border-bottom: 2px solid ${isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}; 
            padding-bottom: 0.3rem; 
        }
        h2 { 
            font-size: 1.5em; 
            border-bottom: 1px solid ${isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}; 
            padding-bottom: 0.3rem; 
        }
        h3 { font-size: 1.25em; }
        
        ul, ol { padding-left: 2rem; }
        li { margin: 0.25rem 0; }
        
        hr {
            border: none;
            border-top: 1px solid ${isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
            margin: 2rem 0;
        }
        
        strong { color: ${titleColor}; }
        em { color: ${stringColor}; }
        
        .hide-highlights mark.zoocage-highlight {
            background-color: transparent !important;
            color: inherit !important;
            padding: 0 !important;
        }
        
        @media print {
            #toggleHighlights {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div id="toggleHighlights" onclick="document.body.classList.toggle('hide-highlights'); this.style.opacity = document.body.classList.contains('hide-highlights') ? '0.3' : '1';" style="position: fixed; top: 10px; right: 10px; background: ${isDarkTheme ? '#2d2d2d' : 'white'}; padding: 10px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); cursor: pointer; z-index: 1000; font-size: 14px; line-height: 1; user-select: none;" title="Toggle Highlights">
        🟧
    </div>
    
    ${rendered}
</body>
</html>`;
}

async function generateCodeHTML(title, language, code) {
    const themeStylesheet = document.getElementById('themeStylesheet');
    let themeCSS = '';
    
    try {
        const response = await fetch(themeStylesheet.href);
        themeCSS = await response.text();
    } catch (error) {
        console.error('Failed to fetch theme CSS:', error);
    }
    
    const isDarkTheme = themeStylesheet.href.includes('themesdark/');
    const bgColor = isDarkTheme ? '#1e1e1e' : '#f5f5f5';
    
    let highlighted;
    try {
        highlighted = hljs.highlight(code, { language: language, ignoreIllegals: true }).value;
    } catch (e) {
        highlighted = escapeHtml(code);
    }
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <style>
        ${themeCSS}
        
        body {
            font-family: '0xProto', Consolas, Monaco, 'Courier New', monospace;
            margin: 0;
            padding: 2rem;
            background: ${bgColor};
        }
        
        h1 {
            color: #4ec9b0;
            margin-bottom: 1rem;
            font-size: 1.5rem;
        }
        
        pre {
            margin: 0;
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        
        code {
            font-family: '0xProto', Consolas, Monaco, 'Courier New', monospace;
            font-size: 0.9rem;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <h1>${escapeHtml(title)}</h1>
    <pre><code class="hljs language-${escapeHtml(language)}">${highlighted}</code></pre>
</body>
</html>`;
}

function showDiffView(snippet1, snippet2) {
    document.getElementById('emptyState').style.display = 'none';
    const editorContainer = document.getElementById('editorContainer');
    editorContainer.classList.add('active');
    
    let currentMode = 'highlighted';
    
    function renderDiff(mode) {
        if (mode === 'editable') {
            renderEditableDiff(snippet1, snippet2);
        } else if (mode === 'inline') {
            renderInlineDiff(snippet1, snippet2);
        } else {
            renderHighlightedDiff(snippet1, snippet2);
        }
    }
    
    renderDiff(currentMode);
    
    function renderInlineDiff(snip1, snip2) {
        const diff = Diff.diffLines(snip1.code, snip2.code);
        
        let allLines = [];
        let addedCount = 0;
        let removedCount = 0;
        
        diff.forEach(part => {
            const lines = part.value.split('\n');
            if (lines[lines.length - 1] === '') lines.pop();
            
            if (part.added) {
                addedCount += lines.length;
                lines.forEach(line => {
                    allLines.push({ type: 'added', content: line });
                });
            } else if (part.removed) {
                removedCount += lines.length;
                lines.forEach(line => {
                    allLines.push({ type: 'removed', content: line });
                });
            } else {
                lines.forEach(line => {
                    allLines.push({ type: 'unchanged', content: line });
                });
            }
        });
        
        const lang = snip1.language || 'plaintext';
        
        function highlightLine(content, language) {
            if (!content || content.trim() === '') return '&nbsp;';
            
            try {
                const highlighted = hljs.highlight(content, { language: language }).value;
                return highlighted;
            } catch (e) {
                return escapeHtml(content);
            }
        }
        
        editorContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h2 style="color: #4ec9b0; margin: 0;">Comparing: ${addedCount} additions, ${removedCount} deletions (Inline)</h2>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="secondary" id="toggleSideBySideBtn">Side-by-Side View</button>
                    <button class="secondary" id="toggleEditableBtn">Editable View</button>
                    <button class="close-diff-btn" id="closeDiffBtn">Close Diff</button>
                </div>
            </div>
            <div style="border: 1px solid #3e3e42; border-radius: 4px; overflow: hidden;">
                <div style="background: #2d2d30; padding: 0.75rem; border-bottom: 1px solid #3e3e42; font-weight: 600; color: #858585;">
                    <span>${escapeHtml(snip1.title)} vs ${escapeHtml(snip2.title)}</span>
                    <span style="margin-left: 1rem;">
                        <span class="diff-stat-removed">-${removedCount}</span>
                        <span class="diff-stat-added" style="margin-left: 0.5rem;">+${addedCount}</span>
                    </span>
                </div>
                <div style="max-height: calc(100vh - 200px); overflow-y: auto; padding: 1rem; font-family: '0xProto', Consolas, monospace; font-size: 0.85rem; line-height: 1.6;">
                    ${allLines.map(line => {
                        if (line.type === 'added') {
                            const highlightedContent = highlightLine(line.content, lang);
                            return `<div style="background-color: rgba(46, 160, 67, 0.2); padding: 2px 4px; border-left: 3px solid #2ea043;"><span style="color: #4ec9b0; margin-right: 1rem;">+</span>${highlightedContent}</div>`;
                        } else if (line.type === 'removed') {
                            const highlightedContent = highlightLine(line.content, lang);
                            return `<div style="background-color: rgba(248, 81, 73, 0.2); padding: 2px 4px; border-left: 3px solid #f85149;"><span style="color: #f88379; margin-right: 1rem;">-</span>${highlightedContent}</div>`;
                        } else {
                            const highlightedContent = highlightLine(line.content, lang);
                            return `<div style="padding: 2px 4px;"><span style="color: transparent; margin-right: 1rem;">.</span>${highlightedContent}</div>`;
                        }
                    }).join('')}
                </div>
            </div>
        `;
        
        document.getElementById('toggleSideBySideBtn').addEventListener('click', () => {
            currentMode = 'highlighted';
            renderDiff(currentMode);
        });
        
        document.getElementById('toggleEditableBtn').addEventListener('click', () => {
            currentMode = 'editable';
            renderDiff(currentMode);
        });
        
        document.getElementById('closeDiffBtn').addEventListener('click', () => {
            window.location.reload();
        });
    }
    
    function renderEditableDiff(snip1, snip2) {
        const diff = Diff.diffLines(snip1.code, snip2.code);
        
        let leftCode = [];
        let rightCode = [];
        let addedCount = 0;
        let removedCount = 0;
        
        diff.forEach(part => {
            const lines = part.value.split('\n');
            if (lines[lines.length - 1] === '') lines.pop();
            
            if (part.added) {
                addedCount += lines.length;
                lines.forEach(line => {
                    leftCode.push('');
                    rightCode.push(line);
                });
            } else if (part.removed) {
                removedCount += lines.length;
                lines.forEach(line => {
                    leftCode.push(line);
                    rightCode.push('');
                });
            } else {
                lines.forEach(line => {
                    leftCode.push(line);
                    rightCode.push(line);
                });
            }
        });
        
        editorContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h2 style="color: #4ec9b0; margin: 0;">Comparing: ${addedCount} additions, ${removedCount} deletions (Editable)</h2>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="secondary" id="toggleDiffMode">Side-by-Side View</button>
                    <button class="secondary" id="toggleInlineBtn">Inline View</button>
                    <button class="close-diff-btn" id="closeDiffBtn">Close Diff</button>
                </div>
            </div>
            <div style="color: #858585; margin-bottom: 1rem; font-size: 0.9rem; font-style: italic;">
                Switch to "Side-by-Side View" to see colored differences.
            </div>
            <div class="diff-container">
                <div class="diff-panel">
                    <div class="diff-header">
                        <span>${escapeHtml(snip1.title)}</span>
                        <span class="diff-stats">
                            <span class="diff-stat-removed">-${removedCount}</span>
                            <span style="color: #858585; margin-left: 0.5rem;">${snip1.language}</span>
                            <button class="secondary" id="saveLeftBtn" style="margin-left: 0.5rem; padding: 0.35rem 0.75rem; font-size: 0.85rem;">Save Left</button>
                        </span>
                    </div>
                    <div style="flex: 1; overflow: auto; padding: 0;">
                        <textarea id="diffLeftEdit" style="width: 100%; height: 100%; resize: none; font-family: '0xProto', Consolas, monospace; font-size: 0.85rem; padding: 0.75rem; border: none; line-height: 1.6; white-space: pre;">${escapeHtml(leftCode.join('\n'))}</textarea>
                    </div>
                </div>
                <div class="diff-panel">
                    <div class="diff-header">
                        <span>${escapeHtml(snip2.title)}</span>
                        <span class="diff-stats">
                            <span class="diff-stat-added">+${addedCount}</span>
                            <span style="color: #858585; margin-left: 0.5rem;">${snip2.language}</span>
                            <button class="secondary" id="saveRightBtn" style="margin-left: 0.5rem; padding: 0.35rem 0.75rem; font-size: 0.85rem;">Save Right</button>
                        </span>
                    </div>
                    <div style="flex: 1; overflow: auto; padding: 0;">
                        <textarea id="diffRightEdit" style="width: 100%; height: 100%; resize: none; font-family: '0xProto', Consolas, monospace; font-size: 0.85rem; padding: 0.75rem; border: none; line-height: 1.6; white-space: pre;">${escapeHtml(rightCode.join('\n'))}</textarea>
                    </div>
                </div>
            </div>
        `;
        
        const leftTextarea = document.getElementById('diffLeftEdit');
        const rightTextarea = document.getElementById('diffRightEdit');
        
        let isSyncing = false;
        
        leftTextarea.addEventListener('scroll', () => {
            if (!isSyncing) {
                isSyncing = true;
                rightTextarea.scrollTop = leftTextarea.scrollTop;
                setTimeout(() => { isSyncing = false; }, 10);
            }
        });
        
        rightTextarea.addEventListener('scroll', () => {
            if (!isSyncing) {
                isSyncing = true;
                leftTextarea.scrollTop = rightTextarea.scrollTop;
                setTimeout(() => { isSyncing = false; }, 10);
            }
        });
        
        document.getElementById('saveLeftBtn').addEventListener('click', () => {
            const leftIndex = snippets.indexOf(snip1);
            if (leftIndex !== -1) {
                snippets[leftIndex].code = leftTextarea.value;
                snip1.code = leftTextarea.value;
                
                const storageObj = {};
                storageObj[getStorageKey('snippets')] = snippets;
                
                browser.storage.local.set(storageObj).then(() => {
                    const hashKey = getStorageKey('indexhash');
                    browser.storage.local.set({ [hashKey]: '' });
                    showNotification('Left snippet saved! Switch to Highlighted Diff to see changes.');
                });
            }
        });
        
        document.getElementById('saveRightBtn').addEventListener('click', () => {
            const rightIndex = snippets.indexOf(snip2);
            if (rightIndex !== -1) {
                snippets[rightIndex].code = rightTextarea.value;
                snip2.code = rightTextarea.value;
                
                const storageObj = {};
                storageObj[getStorageKey('snippets')] = snippets;
                
                browser.storage.local.set(storageObj).then(() => {
                    const hashKey = getStorageKey('indexhash');
                    browser.storage.local.set({ [hashKey]: '' });
                    showNotification('Right snippet saved! Switch to Highlighted Diff to see changes.');
                });
            }
        });
        
        document.getElementById('toggleDiffMode').addEventListener('click', () => {
            currentMode = 'highlighted';
            renderDiff(currentMode);
        });
        
        document.getElementById('toggleInlineBtn').addEventListener('click', () => {
            currentMode = 'inline';
            renderDiff(currentMode);
        });
        
        document.getElementById('closeDiffBtn').addEventListener('click', () => {
            window.location.reload();
        });
    }
    
    function renderHighlightedDiff(snip1, snip2) {
        const diff = Diff.diffLines(snip1.code, snip2.code);
        
        let leftLines = [];
        let rightLines = [];
        let addedCount = 0;
        let removedCount = 0;
        
        diff.forEach(part => {
            const lines = part.value.split('\n');
            if (lines[lines.length - 1] === '') lines.pop();
            
            if (part.added) {
                addedCount += lines.length;
                lines.forEach(line => {
                    leftLines.push({ type: 'empty', content: '' });
                    rightLines.push({ type: 'added', content: line });
                });
            } else if (part.removed) {
                removedCount += lines.length;
                lines.forEach(line => {
                    leftLines.push({ type: 'removed', content: line });
                    rightLines.push({ type: 'empty', content: '' });
                });
            } else {
                lines.forEach(line => {
                    leftLines.push({ type: 'unchanged', content: line });
                    rightLines.push({ type: 'unchanged', content: line });
                });
            }
        });
        
        const lang1 = snip1.language || 'plaintext';
        const lang2 = snip2.language || 'plaintext';
        
        function highlightLine(content, language) {
            if (!content || content.trim() === '') return '&nbsp;';
            
            try {
                const highlighted = hljs.highlight(content, { language: language }).value;
                return highlighted;
            } catch (e) {
                return escapeHtml(content);
            }
        }
        
        editorContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h2 style="color: #4ec9b0; margin: 0;">Comparing: ${addedCount} additions, ${removedCount} deletions</h2>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="secondary" id="toggleDiffMode">Editable View</button>
                    <button class="secondary" id="toggleInlineBtn">Inline View</button>
                    <button class="close-diff-btn" id="closeDiffBtn">Close Diff</button>
                </div>
            </div>
            <div class="diff-container">
                <div class="diff-panel">
                    <div class="diff-header">
                        <span>${escapeHtml(snip1.title)}</span>
                        <span class="diff-stats">
                            <span class="diff-stat-removed">-${removedCount}</span>
                            <span style="color: var(--text-secondary); margin-left: 0.5rem;">${lang1}</span>
                        </span>
                    </div>
                    <div class="diff-content" id="diffLeft">
                        ${leftLines.map(line => {
                            if (line.type === 'empty') {
                                return '<div class="diff-line">&nbsp;</div>';
                            }
                            const highlightedContent = highlightLine(line.content, lang1);
                            return `<div class="diff-line diff-${line.type}">${highlightedContent}</div>`;
                        }).join('')}
                    </div>
                </div>
                <div class="diff-panel">
                    <div class="diff-header">
                        <span>${escapeHtml(snip2.title)}</span>
                        <span class="diff-stats">
                            <span class="diff-stat-added">+${addedCount}</span>
                            <span style="color: var(--text-secondary); margin-left: 0.5rem;">${lang2}</span>
                        </span>
                    </div>
                    <div class="diff-content" id="diffRight">
                        ${rightLines.map(line => {
                            if (line.type === 'empty') {
                                return '<div class="diff-line">&nbsp;</div>';
                            }
                            const highlightedContent = highlightLine(line.content, lang2);
                            return `<div class="diff-line diff-${line.type}">${highlightedContent}</div>`;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
        
        const leftPanel = document.getElementById('diffLeft');
        const rightPanel = document.getElementById('diffRight');
        
        let isSyncing = false;
        
        leftPanel.addEventListener('scroll', () => {
            if (!isSyncing) {
                isSyncing = true;
                rightPanel.scrollTop = leftPanel.scrollTop;
                setTimeout(() => { isSyncing = false; }, 10);
            }
        });
        
        rightPanel.addEventListener('scroll', () => {
            if (!isSyncing) {
                isSyncing = true;
                leftPanel.scrollTop = rightPanel.scrollTop;
                setTimeout(() => { isSyncing = false; }, 10);
            }
        });
        
        document.getElementById('toggleDiffMode').addEventListener('click', () => {
            currentMode = 'editable';
            renderDiff(currentMode);
        });
        
        document.getElementById('toggleInlineBtn').addEventListener('click', () => {
            currentMode = 'inline';
            renderDiff(currentMode);
        });
        
        document.getElementById('closeDiffBtn').addEventListener('click', () => {
            window.location.reload();
        });
    }
}

const updateColumnButtons = () => {
    if (selectedColumns.size > 0) {
        copyColumnsBtn.style.display = 'inline-block';
        copyColumnsBtn.textContent = `Copy Columns (${selectedColumns.size})`;
        deleteColumnsBtn.style.display = 'inline-block';
        deleteColumnsBtn.textContent = `Delete Columns (${selectedColumns.size})`;
    } else {
        copyColumnsBtn.style.display = 'none';
        deleteColumnsBtn.style.display = 'none';
    }
};

async function deleteSelectedSnippets() {
    const checkboxes = document.querySelectorAll('.snippet-checkbox:checked');
    const indicesToDelete = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));
    
    if (indicesToDelete.length === 0) return;
    
    const count = indicesToDelete.length;
    const confirmed = confirm(`Delete ${count} selected snippet${count !== 1 ? 's' : ''}?\n\nThis cannot be undone!`);
    
    if (!confirmed) return;
    
    indicesToDelete.sort((a, b) => b - a);
    
    const deletedSnippets = indicesToDelete.map(idx => snippets[idx]);
    const remainingSnippets = snippets.filter((s, idx) => !indicesToDelete.includes(idx));
    
    const deletedImageCount = await cleanupOrphanedAVIFImages(deletedSnippets, remainingSnippets);
    
    for (const index of indicesToDelete) {
        const snippet = snippets[index];
        if (snippet.inIndexedDB && snippet.timestamp) {
            try {
                await snippetStorage.delete(`snippet_${snippet.timestamp}`);
            } catch (error) {
                console.error('Error deleting from IndexedDB:', error);
            }
        }
    }
    
    indicesToDelete.forEach(index => {
        snippets.splice(index, 1);
    });
    
    if (currentSnippetIndex !== null && indicesToDelete.includes(currentSnippetIndex)) {
        currentSnippetIndex = null;
        document.getElementById('emptyState').style.display = 'flex';
        document.getElementById('editorContainer').classList.remove('active');
    }
    
    const storageObj = {};
    storageObj[getStorageKey('snippets')] = snippets.map(s => {
        if (s.inIndexedDB) {
            return {
                title: s.title,
                language: s.language,
                code: '',
                notes: '',
                timestamp: s.timestamp,
                inIndexedDB: true
            };
        } else {
            return {
                title: s.title,
                language: s.language,
                code: s.compressed ? compressText(s.code) : s.code,
                notes: s.notes,
                compressed: true,
                timestamp: s.timestamp
            };
        }
    });
    
    await browser.storage.local.set(storageObj);
    
    const hashKey = getStorageKey('indexhash');
    await browser.storage.local.set({ [hashKey]: '' });
    
    sortSnippets();
    document.getElementById('deleteSelectedBtn').style.display = 'none';
    
    if (deletedImageCount > 0) {
        showNotification(`Deleted ${count} snippet${count !== 1 ? 's' : ''} and ${deletedImageCount} orphaned image${deletedImageCount !== 1 ? 's' : ''}`);
    } else {
        showNotification(`Deleted ${count} snippet${count !== 1 ? 's' : ''}`);
    }
}

function addTagToSelected() {
    const checkboxes = document.querySelectorAll('.snippet-checkbox:checked');
    const indicesToTag = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));
    
    if (indicesToTag.length === 0) return;
    
    const tagInput = document.getElementById('addTagInput');
    let tag = tagInput.value.trim();
    
    if (!tag) {
        showNotification('Please enter a tag', 'error');
        return;
    }
    
    if (!tag.startsWith('#')) {
        tag = '#' + tag;
    }
    
    indicesToTag.forEach(index => {
        const snippet = snippets[index];
        if (!snippet.title.includes(tag)) {
            snippet.title = snippet.title + ' ' + tag;
        }
    });
    
    const storageObj = {};
    storageObj[getStorageKey('snippets')] = snippets;
    
    browser.storage.local.set(storageObj).then(() => {
        const hashKey = getStorageKey('indexhash');
        browser.storage.local.set({ [hashKey]: '' });
        
        renderSnippetList();
        tagInput.value = '';
        
        checkboxes.forEach(cb => cb.checked = false);
        updateDeleteSelectedButton();
        updateCompareButton();
        
        showNotification(`Added ${tag} to ${indicesToTag.length} snippet${indicesToTag.length !== 1 ? 's' : ''}`);
    });
}

function copyCode() {
    const code = document.getElementById('snippetCode').value;
    
    if (!code) {
        showNotification('No code to copy', 'error');
        return;
    }
    
    navigator.clipboard.writeText(code).then(() => {
        showNotification('Code copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showNotification('Failed to copy code', 'error');
    });
}

function handleCodePaste(e) {
    setTimeout(() => {
        handleCodeInput();
    }, 10);
}

function copyNotes() {
    const notes = document.getElementById('snippetNotes').value;
    
    if (!notes) {
        showNotification('No notes to copy', 'error');
        return;
    }
    
    navigator.clipboard.writeText(notes).then(() => {
        showNotification('Notes copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showNotification('Failed to copy notes', 'error');
    });
}

function titleCase() {
    const titleInput = document.getElementById('snippetTitle');
    const codeInput = document.getElementById('snippetCode');
    const notesInput = document.getElementById('snippetNotes');
    
    let targetElement = lastFocusedElement || codeInput;
    
    if (targetElement !== titleInput && targetElement !== codeInput && targetElement !== notesInput) {
        targetElement = codeInput;
    }
    
    const start = targetElement.selectionStart;
    const end = targetElement.selectionEnd;
    const fullText = targetElement.value;
    
    if (start === end) {
        showNotification('Please select text first', 'error');
        return;
    }
    
    const currentText = fullText.substring(start, end);
    
    if (titleCaseHistory.element === targetElement && 
        titleCaseHistory.start === start && 
        titleCaseHistory.end === end) {
        
        const before = fullText.substring(0, start);
        const after = fullText.substring(end);
        targetElement.value = before + titleCaseHistory.text + after;
        targetElement.setSelectionRange(start, start + titleCaseHistory.text.length);
        
        titleCaseHistory = { text: '', element: null, start: 0, end: 0 };
        
        if (targetElement === codeInput) updatePreview();
        showNotification('Title case undone!');
        return;
    }
    
    titleCaseHistory = {
        text: currentText,
        element: targetElement,
        start: start,
        end: end
    };
    
    const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|up|v\.?|vs\.?|via|with)$/i;
    
    const lines = currentText.split('\n');
    const titleCased = lines.map(line => {
        if (!line.trim()) return line;
        
        const words = line.split(/(\s+)/);
        return words.map((word, index, arr) => {
            if (/^\s+$/.test(word)) return word;
            
            const nonWhitespaceWords = arr.filter(w => !/^\s+$/.test(w));
            const isFirstWord = word === nonWhitespaceWords[0];
            const isLastWord = word === nonWhitespaceWords[nonWhitespaceWords.length - 1];
            
            if (isFirstWord || isLastWord) {
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }
            
            if (smallWords.test(word)) {
                return word.toLowerCase();
            }
            
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join('');
    }).join('\n');
    
    const before = fullText.substring(0, start);
    const after = fullText.substring(end);
    targetElement.value = before + titleCased + after;
    targetElement.setSelectionRange(start, start + titleCased.length);
    targetElement.focus();
    
    if (targetElement === codeInput) updatePreview();
    
    showNotification('Title case applied! (Click again to undo)');
}

let syncScrollEnabled = true;

document.getElementById('toggleSyncScroll').addEventListener('click', () => {
    syncScrollEnabled = !syncScrollEnabled;
    const btn = document.getElementById('toggleSyncScroll');
    btn.textContent = syncScrollEnabled ? 'Sync Scroll' : 'Sync Scroll';
    btn.style.opacity = syncScrollEnabled ? '1' : '0.5';
});

const codeTextarea = document.getElementById('snippetCode');
const preview = document.getElementById('codePreview');

codeTextarea.addEventListener('scroll', () => {
    if (syncScrollEnabled) {
        const scrollPercentage = codeTextarea.scrollTop / (codeTextarea.scrollHeight - codeTextarea.clientHeight);
        preview.scrollTop = scrollPercentage * (preview.scrollHeight - preview.clientHeight);
    }
});

preview.addEventListener('scroll', () => {
    if (syncScrollEnabled) {
        const scrollPercentage = preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
        codeTextarea.scrollTop = scrollPercentage * (codeTextarea.scrollHeight - codeTextarea.clientHeight);
    }
});

const toggleHighlights = document.getElementById('toggleHighlights');
if (toggleHighlights) {
    toggleHighlights.addEventListener('change', function() {
        const preview = document.getElementById('codePreview');
        if (this.checked) {
            preview.classList.remove('hide-highlights');
        } else {
            preview.classList.add('hide-highlights');
        }
    });
}

const toggleMarkdownHighlights = document.getElementById('toggleMarkdownHighlights');
if (toggleMarkdownHighlights) {
    toggleMarkdownHighlights.addEventListener('click', function() {
        const preview = document.getElementById('codePreview');
        preview.classList.toggle('hide-highlights');
        this.style.opacity = preview.classList.contains('hide-highlights') ? '0.3' : '1';
    });
}
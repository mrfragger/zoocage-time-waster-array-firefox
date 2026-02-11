if (window.zoocageMarkdownClipRunning) {
    console.log('Markdown clip already running, skipping...');
    throw new Error('Already running');
}

window.zoocageMarkdownClipRunning = true;

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

async function captureHighlightedTerms() {
    const highlightedTerms = {};
    
    const marks = document.querySelectorAll('mark.zoocage-highlight');
    
    marks.forEach(mark => {
        const actualText = mark.textContent.trim().toLowerCase();
        const computedStyle = window.getComputedStyle(mark);
        const bgColor = computedStyle.backgroundColor;
        
        if (actualText && bgColor && !highlightedTerms[actualText]) {
            highlightedTerms[actualText] = bgColor;
        }
    });
    
    // Get CJK mode state
    const cjkEnabled = window.zoocageCJKMode || false;
    
    return {
        terms: highlightedTerms,
        cjkMode: cjkEnabled
    };
}

(async function() {
    const settings = await browser.storage.local.get({
        markdownParser: 'defuddle',
        markdownIncludeTitle: true,
        markdownIncludeUrl: true,
        markdownIncludeAuthor: true,
        markdownIncludeDate: true,
        markdownPreserveTableLinebreaks: false,
        markdownImageMode: 'none',
        avifColorMode: 'color'
    });

    const highlightData = await captureHighlightedTerms();
    
    let article;
    
    if (typeof Defuddle === 'undefined') {
        alert('Defuddle library not loaded. Please try again.');
        return;
    }
    
    const defuddle = new Defuddle(document, { 
        url: document.URL,
        removeImages: settings.markdownImageMode === 'none'
    });
    article = defuddle.parse();
    
    if (typeof TurndownService === 'undefined') {
        alert('Turndown library not loaded. Please try again.');
        return;
    }
    
    if (!article || !article.content) {
        alert('Could not extract content from this page');
        return;
    }

    
    if (article && article.content) {
        const originalImages = new Map();
                
        document.querySelectorAll('img, source').forEach(elem => {
            if (elem.srcset) {
                
                const srcsetEntries = elem.srcset.split(',').map(entry => {
                    const parts = entry.trim().split(/\s+/);
                    let width;
                    
                    if (parts.length > 1) {
                        if (parts[1].endsWith('w')) {
                            width = parseInt(parts[1]);
                        } else if (parts[1].endsWith('x')) {
                            const match = parts[0].match(/\/(\d+)\/\d+\//);
                            width = match ? parseInt(match[1]) * parseFloat(parts[1]) : parseFloat(parts[1]) * 1000;
                        } else {
                            width = 1;
                        }
                    } else {
                        const match = parts[0].match(/\/(\d+)\/\d+\//);
                        width = match ? parseInt(match[1]) : 1;
                    }
                    
                    return {
                        url: parts[0],
                        width: width
                    };
                });
                
                srcsetEntries.sort((a, b) => b.width - a.width);
                const target = srcsetEntries[0];
                
                if (target && target.url) {
                    const fullUrl = target.url.startsWith('http') ? target.url : 
                                  new URL(target.url, window.location.href).href;
                    
                    let imgElement = elem;
                    if (elem.tagName === 'SOURCE') {
                        const picture = elem.closest('picture');
                        if (picture) {
                            imgElement = picture.querySelector('img');
                        }
                    }
                    
                    if (imgElement && imgElement.src) {
                        originalImages.set(imgElement.src, fullUrl);
                        originalImages.set(imgElement.src.split('?')[0], fullUrl);
                        
                        const srcFilename = imgElement.src.split('?')[0].split('/').pop();
                        originalImages.set(srcFilename, fullUrl);
                    }
                    
                    srcsetEntries.forEach(entry => {
                        const entryUrl = entry.url.startsWith('http') ? entry.url : 
                                       new URL(entry.url, window.location.href).href;
                        originalImages.set(entryUrl, fullUrl);
                        originalImages.set(entryUrl.split('?')[0], fullUrl);
                        
                        const entryFilename = entryUrl.split('?')[0].split('/').pop();
                        originalImages.set(entryFilename, fullUrl);
                    });
                }
            }
        });
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = article.content;
        const images = tempDiv.querySelectorAll('img');
        
        images.forEach(img => {
            if (!img.src) return;
            
            
            const imgSrc = img.src.split('?')[0];
            const imgFilename = imgSrc.split('/').pop();
            
            const betterUrl = originalImages.get(img.src) || 
                             originalImages.get(imgSrc) || 
                             originalImages.get(imgFilename);
            
            if (betterUrl && betterUrl !== img.src) {
                img.src = betterUrl;
            } else {
            }
        });
        
        article.content = tempDiv.innerHTML;
    }

    const imageWorkerQueue = {
        workers: [],
        initialized: false,
        currentWorker: 0,
        
        async init() {
            if (!this.initialized) {
                const workerUrl = browser.runtime.getURL('avif-encoder.js');
                const workerCount = 4;
                
                for (let i = 0; i < workerCount; i++) {
                    this.workers.push(new Worker(workerUrl, { type: 'module' }));
                }
                
                this.initialized = true;
            }
        },
        
        async encode(imageData, quality, effort) {
            await this.init();
            
            const worker = this.workers[this.currentWorker];
            this.currentWorker = (this.currentWorker + 1) % this.workers.length;
            
            return new Promise((resolve, reject) => {
                const handleMessage = (e) => {
                    worker.removeEventListener('message', handleMessage);
                    worker.removeEventListener('error', handleError);
                    
                    if (e.data.error) {
                        reject(new Error(e.data.error));
                    } else {
                        resolve(e.data.blob);
                    }
                };
                
                const handleError = (error) => {
                    worker.removeEventListener('message', handleMessage);
                    worker.removeEventListener('error', handleError);
                    reject(error);
                };
                
                worker.addEventListener('message', handleMessage);
                worker.addEventListener('error', handleError);
                
                worker.postMessage({
                    imageData: imageData,
                    quality: quality,
                    effort: effort
                }, [imageData.data.buffer]);
            });
        },
        
        terminate() {
            this.workers.forEach(worker => {
                if (worker) {
                    worker.terminate();
                }
            });
            this.workers = [];
            this.initialized = false;
        }
    };
        
    if (settings.markdownImageMode === 'avif') {
        const parser = new DOMParser();
        const doc = parser.parseFromString(article.content, 'text/html');
        const images = Array.from(doc.querySelectorAll('img'));
        
        if (images.length > 0) {
            const notification = document.createElement('div');
            notification.textContent = `Processing ${images.length} image${images.length !== 1 ? 's' : ''}... Please wait 5-60 seconds.`;
            notification.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #0e639c;
                color: #fff;
                padding: 1.5rem 2rem;
                border-radius: 8px;
                z-index: 10000;
                font-weight: 600;
                font-size: 1.1rem;
                box-shadow: 0 8px 24px rgba(0,0,0,0.5);
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 15000);
        }
        
        let cachedCount = 0;
        let processedCount = 0;
        
        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            
            if (!img.src || (!img.src.startsWith('http') && !img.src.startsWith('data:'))) {
                continue;
            }
            
            try {
                const cacheHash = await hashUrl(img.src);
                
                const cachedExists = await browser.runtime.sendMessage({
                    type: 'checkAVIFCache',
                    hash: cacheHash
                });
                
                if (cachedExists) {
                    const avifCache = new AVIFCache();
                    await avifCache.init();
                    const cachedData = await avifCache.getWithSize(cacheHash);
                    
                    img.src = `avif-cache://${cacheHash}#${cachedData.size}`;
                    cachedCount++;
                    continue;
                }
                
                
                const response = await fetch(img.src);
                
                const blob = await response.blob();
                
                const bitmap = await createImageBitmap(blob);
                
                const canvas = new OffscreenCanvas(1, 1);
                let ctx = canvas.getContext('2d');
                
                const scale = Math.min(500 / bitmap.width, 375 / bitmap.height, 1);
                canvas.width = Math.round(bitmap.width * scale);
                canvas.height = Math.round(bitmap.height * scale);
                
                ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
                bitmap.close();
                
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                
                if (settings.avifColorMode === 'grayscale') {
                    const data = imageData.data;
                    for (let i = 0; i < data.length; i += 4) {
                        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                        data[i] = gray;
                        data[i + 1] = gray;
                        data[i + 2] = gray;
                    }
                }
                
                const avifBlob = await imageWorkerQueue.encode(imageData, 50, 8);
                
                const avifArrayBuffer = await avifBlob.arrayBuffer();
                const avifArray = Array.from(new Uint8Array(avifArrayBuffer));
                
                await browser.runtime.sendMessage({
                    type: 'storeAVIFCache',
                    hash: cacheHash,
                    data: avifArray
                });
                
               img.src = `avif-cache://${cacheHash}#${avifBlob.size}`;
                
                canvas.width = 0;
                canvas.height = 0;
                ctx = null;
                
                processedCount++;
                
                await new Promise(resolve => setTimeout(resolve, 500));
                
            } catch (error) {
                console.error(`✗ Failed ${i + 1} (${img.src.substring(0, 80)}):`, error);
            }
        }
        
        article.content = doc.body.innerHTML;
    }
    
    async function hashUrl(url) {
        const encoder = new TextEncoder();
        const data = encoder.encode(url);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
    }
    
    const turndownService = new TurndownService({
        headingStyle: 'atx',
        hr: '---',
        bulletListMarker: '-',
        codeBlockStyle: 'fenced',
        fence: '```',
        emDelimiter: '_',
        strongDelimiter: '**',
        linkStyle: 'inlined'
    });
    
    turndownService.addRule('removeImageLinks', {
        filter: function(node) {
            if (settings.markdownImageMode === 'none' && node.nodeName === 'A' && node.getAttribute('href')) {
                const href = node.getAttribute('href');
                return /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|avif)(\?.*)?$/i.test(href);
            }
            return false;
        },
        replacement: function(content) {
            return '';
        }
    });

    turndownService.addRule('imageNewline', {
        filter: 'img',
        replacement: function(content, node) {
            const alt = node.alt || '';
            const src = node.getAttribute('src') || '';
            const title = node.title || '';
            
            const escapedAlt = alt.replace(/"/g, '\\"');
            
            if (title) {
                return `\n\n![${escapedAlt}](${src})\n_${title}_\n\n`;
            } else {
                return `\n\n![${escapedAlt}](${src})\n\n`;
            }
        }
    });
    
    turndownService.addRule('strikethrough', {
        filter: ['del', 's', 'strike'],
        replacement: function(content) {
            return '~~' + content + '~~';
        }
    });
    
    turndownService.addRule('tables', {
        filter: 'table',
        replacement: function(content, node) {
            const rows = Array.from(node.querySelectorAll('tr'));
            if (rows.length === 0) return content;
            
            const tableData = rows.map(row => {
                return Array.from(row.querySelectorAll('th, td')).map(cell => {
                    let cellText = cell.textContent.trim();
                    
                    if (settings.markdownPreserveTableLinebreaks) {
                        cellText = cellText.replace(/\n/g, '<br>');
                    } else {
                        cellText = cellText.replace(/\n/g, ' ');
                    }
                    
                    return cellText;
                });
            });
            
            if (tableData.length === 0) return content;
            
            const hasHeader = node.querySelector('thead') || 
                            (rows[0] && rows[0].querySelector('th'));
            
            let markdown = '\n';
            
            tableData.forEach((rowData, index) => {
                const escapedCells = rowData.map(cell => cell.replace(/\|/g, '\\|'));
                markdown += '| ' + escapedCells.join(' | ') + ' |\n';
                
                if (index === 0 && hasHeader) {
                    markdown += '| ' + rowData.map(() => '---').join(' | ') + ' |\n';
                }
            });
            
            return markdown + '\n';
        }
    });
    
    turndownService.addRule('taskListItems', {
        filter: function(node) {
            return node.type === 'checkbox' && node.parentNode.nodeName === 'LI';
        },
        replacement: function(content, node) {
            return (node.checked ? '[x] ' : '[ ] ');
        }
    });
    
    turndownService.addRule('codeBlocks', {
        filter: function(node) {
            return node.nodeName === 'PRE' && node.firstChild && node.firstChild.nodeName === 'CODE';
        },
        replacement: function(content, node) {
            const codeNode = node.firstChild;
            const language = codeNode.className.match(/language-(\w+)/);
            const lang = language ? language[1] : '';
            return '\n```' + lang + '\n' + codeNode.textContent + '\n```\n';
        }
    });
    
    if (settings.markdownImageMode === 'none') {
        turndownService.remove(['script', 'style', 'noscript', 'iframe', 'img']);
    } else {
        turndownService.remove(['script', 'style', 'noscript', 'iframe']);
    }
    
    let markdown = turndownService.turndown(article.content);

    markdown = markdown.replace(/(\w+)\s+([a-z])\b/gi, function(match, word, letter) {
        if (['s', 't', 'd'].includes(letter.toLowerCase())) {
            return word + letter;
        }
        return match;
    });
    
    markdown = markdown.replace(/(\w+)\s+'s\b/gi, "$1's");
    
    const fixedHighlightedTerms = {};
    Object.entries(highlightData.terms).forEach(([term, color]) => {
        fixedHighlightedTerms[term] = color;
        
        if (term.match(/[std]$/i)) {
            const base = term.slice(0, -1);
            fixedHighlightedTerms[base] = color;
        }
    });
    
    const avifRefCount = (markdown.match(/avif-cache:\/\//g) || []).length;
    
    const title = article.title || document.title || 'Untitled';
    const url = window.location.href;
    const author = article.byline || article.author || '';
    
    let frontmatter = '---\n';
    if (settings.markdownIncludeTitle && title) {
        frontmatter += `title: "${title.replace(/"/g, '\\"')}"\n`;
    }
    if (settings.markdownIncludeUrl && url) {
        frontmatter += `url: "${url}"\n`;
    }
    if (settings.markdownIncludeAuthor && author) {
        frontmatter += `author: "${author.replace(/"/g, '\\"')}"\n`;
    }
    if (settings.markdownIncludeDate) {
        frontmatter += `date: "${new Date().toISOString()}"\n`;
    }
    frontmatter += '---\n\n';
    
    const fullMarkdown = frontmatter + markdown;
    
    browser.runtime.sendMessage({
        type: 'markdownClipResult',
        markdown: fullMarkdown,
        title: title,
        url: url,
        autoRender: settings.markdownImageMode === 'avif' && fullMarkdown.includes('avif-cache://'),
        highlightedTerms: fixedHighlightedTerms,
        cjkMode: highlightData.cjkMode
    });
    
    setTimeout(() => {
        imageWorkerQueue.terminate();
        window.zoocageMarkdownClipRunning = false;
    }, 1000);
    
})();
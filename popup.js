const periodSelect = document.getElementById('periodSelect');
const browsingList = document.getElementById('browsingList');
const mediaList = document.getElementById('mediaList');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const paletteBtn = document.getElementById('paletteBtn');
const whitelistInput = document.getElementById('whitelistInput');
const addWhitelistBtn = document.getElementById('addWhitelist');
const whitelistList = document.getElementById('whitelistList');
const blockSiteSelect = document.getElementById('blockSiteSelect');
const siteBlockToggle = document.getElementById('siteBlockToggle');
const siteBlockToggleIcon = document.getElementById('siteBlockToggleIcon');
const siteDarkEnable = document.getElementById('siteDarkEnable');
const siteDarkToggle = document.getElementById('siteDarkToggle');
const siteDarkToggleIcon = document.getElementById('siteDarkToggleIcon');
const rightClickToggle = document.getElementById('rightClickToggle');
const rightClickToggleIcon = document.getElementById('rightClickToggleIcon');


const blockCheckboxes = {
    blockImages: document.getElementById('blockImages'),
    blockSVG: document.getElementById('blockSVG'),
};

const darkModeCheckboxes = {
    preserveImages: document.getElementById('preserveImages'),
    invertMaybe: document.getElementById('invertMaybe'),
    spaFix: document.getElementById('spaFix'),
};

const globalToggleBtn = document.getElementById('globalToggle');
const globalToggleText = document.getElementById('globalToggleText');
const darkModeToggle = document.getElementById('darkModeToggle');
const darkModeToggleText = document.getElementById('darkModeToggleText');
const maxTabsToggle = document.getElementById('maxTabsToggle');
const maxTabsToggleText = document.getElementById('maxTabsToggleText');
const currentTabCount = document.getElementById('currentTabCount');
const hoverZoomToggle = document.getElementById('hoverZoomToggle');
const imageBlurSlider = document.getElementById('imageBlurSlider');
const videoBlurSlider = document.getElementById('videoBlurSlider');
const imageBlurValue = document.getElementById('imageBlurValue');
const videoBlurValue = document.getElementById('videoBlurValue');
const blurControlSection = document.getElementById('blurControlSection');
const toggleBlurSite = document.getElementById('toggleBlurSite');

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

const monochromeListPalettes = [
    ['#FFD67A','#FFD163','#FFCC4D','#FFC636','#FFC11F','#FFBC09','#FFB700','#FFAC00','#FFA000','#FF9400','#FF8800','#FF7C00'],
    ['#B2593A','#A14C30','#8F3E26','#7E311C','#6C2412','#C47257','#D3947D','#E1B7A2','#EBCBB7','#DEAE9B','#CA886F','#B56747',],
    ['#CBA98A','#BF9D7D','#B39070','#A78363','#9B7656','#8F6949','#835C3C','#774F2F','#6B4222','#5F3515','#532808','#471B00'],
    ['#47624E','#517058','#5B7E62','#658C6C','#6F9A76','#79A880','#83B68A','#8DC494','#7EB582','#6D9F77','#5C896C','#4B7361'],
    ['#FF8B7F','#FF9C8D','#FFAD9B','#FFBFAA','#FFD0B8','#FFC3AE','#FFB49F','#FFA48B','#FF9477','#FF8361','#FF7250','#FF6344'],
    ['#7F2C2C','#A43B3B','#BF4A4A','#DB5959','#9C3E1D','#CE5A25','#E8733F','#E3853F','#CA6C33','#B15A2B','#995124','#81461D'],
    ['#A2D4B3','#AEE0BF','#BAECCC','#C6F8D8','#D2FFE4','#DEFFEF','#EAFBF9','#F6FFFF','#CFE8D3','#B7D7BC','#9FC6A5','#87B58E'],
    ['#FFCA7F','#FFBF6A','#FFB456','#FFA842','#FF9C2F','#FF9020','#FF8413','#F47809','#E36D00','#D16200','#BF5800','#AE4E00'],
    ['#3A6BD9','#2E5EBF','#234EA3','#1B428C','#143776','#527FE0','#6C93E6','#8CAAF0','#A9BFF5','#C5D3FA','#DCE2FC','#EAF0FF'],
    ['#FF6EC4','#FFA3D7','#FFC9E3','#FFEBF5','#FFF5FF','#F5E6FF','#E6CCFF','#D1B3FF','#B399FF','#997FFF','#805FFF','#663FFF'],
    ['#E5D9C3','#DCCDB1','#D2C2A1','#C9B691','#BFAA81','#B79F73','#AE9463','#E0D1B9','#EBE0CC','#F5EBDC','#E5D9C3'],
    ['#4D89D9','#FFEB7C','#F2656E','#506FC0','#FFA64D','#4B699D','#EF625F','#FFE066','#4D7BC1','#FF4D4D','#FFB84D','#4D4D99'],
    ['#DBEB7F','#D0E464','#C5DC48','#BAD42B','#B0CC0E','#A6C400','#9CBD00','#92B700','#89B100','#80AC00','#77A700','#6EA300'],
    ['#7B7E6A','#8A8D78','#999C86','#A8AB94','#B7BAA2','#C6C9B0','#D5D8BE','#E4E7CC','#D0D2BA','#BEBFA9','#ACAC98','#9A9987'],
    ['#FFB7A8','#FF9C8C','#FF8271','#FF6B57','#FA5C44','#F24D31','#E53D1E','#D52A0A','#C41F00','#B31B00','#A31900','#931B00'],
    ['#6F4E73','#7D5A81','#8B6690','#996E9F','#A675AE','#B47DBD','#C285CC','#D08DDB','#B17CC0','#A06EAF','#8F609E','#7E528D'],
    ['#F4D8A3','#F1CF8E','#EEC679','#EBBD64','#E8B34F','#E5AA3A','#E2A125','#DF9810','#DC8E00','#D98500','#D67C00','#D37300'],
    ['#D9E3E7','#C9D6DB','#B9C9CF','#A9BDC3','#99B0B7','#89A3AB','#79969F','#698993','#597C87','#496F7B','#395C66','#294953'],
    ['#4E708C','#476681','#405C76','#39526B','#324861','#2B3E56','#24344B','#1D2A40','#162035','#0F162A','#080C1F','#010214'],
    ['#A93F55','#B3505F','#BD6169','#C77273','#D1837D','#DB9487','#E5A591','#EFB69B','#D28D85','#BE7A76','#AA6767','#965458'],
    ['#B8E2D2','#A9DAC8','#9AD2BE','#8BCAB4','#7CC2AA','#6DBAA0','#5EB296','#4FAA8C','#40A282','#319A78','#22926E','#138A64'],
    ['#8B4513','#9C4D16','#AD5619','#BE5E1C','#CF6720','#E07023','#F17926','#FF8333','#A25518','#B35E1B','#C4671E','#D57021'],
    ['#C4B6A5','#B4A692','#A89682','#9B8773','#BFB19B','#D2C4B4','#E4D9CF','#EEE4DD','#D3C8B9','#BFAB93','#AA947F','#9B836E'],
    ['#8B0000','#990011','#A60022','#B30033','#C00044','#CD0055','#DA0066','#E70077','#F40088','#FF0099','#FF1AAA','#FF33BB'],
    ['#9FB7C7','#8EAAC0','#7E9DB8','#6E90B0','#5F83A8','#5076A0','#436A98','#376091','#2C558A','#234B83','#1B417D','#133876'],
    ['#F6B2A1','#F49C87','#F2866D','#F07053','#EE5A39','#EC441F','#EA2E05','#E81800','#E60200','#E40000','#E20000','#E00000'],
    ['#A8795E','#996A51','#8A5C45','#7C4E3B','#8F6750','#B18A72','#C0A28E','#B5947F','#9C715B','#845742'],

];

let currentPaletteIndex = 0;
let currentHighlightPaletteIndex = 0;
let tabsLimit = 3;
let showZeroBrowsing = false;
let showZeroMedia = false;
let highlightEnabled = false;
let diacriticsEnabled = true;
let currentListPaletteIndex = 0;
let currentListCategory = null;
let currentListCategoryPaletteIndex = 0;
let currentListKey = null;
let imageBlurDebounce = null;
let lastImageBlurValue = null;
let videoBlurDebounce = null;
let lastVideoBlurValue = null;
let settingsCollapsed = false;
let currentSincePaletteIndex = 0;
let cjkEnabled = false;

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateHighlightPosition') {
        updateHighlightPosition(message.term, message.current, message.total);
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

function updateHighlightPosition(term, current, total) {
    const container = document.getElementById('highlightTermsList');
    const allWrappers = container.querySelectorAll('span[style*="inline-flex"]');
    
    allWrappers.forEach(wrapper => {
        const tag = wrapper.querySelector('span[style*="cursor: pointer"]');
        if (tag && tag.textContent === term) {
            let countSpan = wrapper.querySelector('.list-item-count');
            if (countSpan) {
                countSpan.textContent = `${current}/${total}`;
            }
        }
    });
}

function getContrastColor(hexColor) {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance > 0.5 ? '#000000' : '#EBEAE4';
}

function getDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getDatesInRange(days) {
    const dates = [];
    const today = new Date();
    
    if (days === 'today') {
        dates.push(getDateString(today));
    } else if (days === 'yesterday') {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        dates.push(getDateString(yesterday));
    } else {
        for (let i = 0; i < parseInt(days); i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            dates.push(getDateString(date));
        }
    }
    
    return dates;
}

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    const parts = [];
    
    if (h > 0) {
        parts.push(`<span class="time-hours">${h}</span><span class="time-unit">h</span>`);
    }
    
    if (h > 0 || m > 0) {
        parts.push(`<span class="time-minutes">${m}</span><span class="time-unit">m</span>`);
    }
    
    parts.push(`<span class="time-seconds">${s}</span><span class="time-unit">s</span>`);
    
    return parts.join('');
}

function formatTimeAligned(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    const parts = [];
    
    if (h > 0) {
        const hourStr = h < 10 ? `\u2007${h}` : `${h}`;
        parts.push(`<span class="time-hours">${hourStr}</span><span class="time-unit">h</span>`);
    } else {
        parts.push(`<span>\u2007\u2007</span>`);
    }
    
    if (h > 0 || m > 0) {
        const minStr = m < 10 ? `\u2007${m}` : `${m}`;
        parts.push(`<span class="time-minutes">${minStr}</span><span class="time-unit">m</span>`);
    } else {
        parts.push(`<span>\u2007\u2007</span>`);
    }
    
    const secStr = s < 10 ? `\u2007${s}` : `${s}`;
    parts.push(`<span class="time-seconds">${secStr}</span><span class="time-unit">s</span>`);
    
    return parts.join('');
}

function calculatePercentage(value, total) {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
}

function calculateAverages(timeData, period) {
    const dates = Object.keys(timeData);
    const daysWithData = new Set();
    
    let totalMedia = 0;
    let totalBrowsing = 0;
    
    dates.forEach(date => {
        const dayData = timeData[date];
        let dayMediaSeconds = 0;
        let dayBrowsingSeconds = 0;
        
        if (dayData.media) {
            dayMediaSeconds = Object.values(dayData.media).reduce((sum, val) => sum + val, 0);
        }
        
        if (dayData.browsing) {
            dayBrowsingSeconds = Object.values(dayData.browsing).reduce((sum, val) => sum + val, 0);
        }
        
        const dayTotalSeconds = dayMediaSeconds + dayBrowsingSeconds;
        
        if (dayTotalSeconds >= 600) {
            totalMedia += dayMediaSeconds;
            totalBrowsing += dayBrowsingSeconds;
            daysWithData.add(date);
        }
    });
    
    const activeDays = daysWithData.size;
    
    const totalAllMedia = dates.reduce((sum, date) => {
        const dayData = timeData[date];
        if (dayData.media) {
            return sum + Object.values(dayData.media).reduce((s, v) => s + v, 0);
        }
        return sum;
    }, 0);
    
    const totalAllBrowsing = dates.reduce((sum, date) => {
        const dayData = timeData[date];
        if (dayData.browsing) {
            return sum + Object.values(dayData.browsing).reduce((s, v) => s + v, 0);
        }
        return sum;
    }, 0);
    
    if (period === 'today' || period === 'yesterday') {
        return {
            totalMedia: totalAllMedia,
            totalBrowsing: totalAllBrowsing,
            total: totalAllMedia + totalAllBrowsing,
            showAverage: false
        };
    }
    
    if (activeDays === 0) {
        return {
            totalMedia: 0,
            totalBrowsing: 0,
            total: 0,
            media: 0,
            browsing: 0,
            avgTotal: 0,
            days: 0,
            showAverage: true
        };
    }
    
    return {
        totalMedia: totalAllMedia,
        totalBrowsing: totalAllBrowsing,
        total: totalAllMedia + totalAllBrowsing,
        media: Math.floor(totalMedia / activeDays),
        browsing: Math.floor(totalBrowsing / activeDays),
        avgTotal: Math.floor((totalMedia + totalBrowsing) / activeDays),
        days: activeDays,
        showAverage: true
    };
}

async function displayData() {
    const period = periodSelect.value;
    const dates = getDatesInRange(period);
    
    const { timeData = {} } = await browser.storage.local.get('timeData');
    
    const mediaTotals = {};
    const browsingTotals = {};
    
    dates.forEach(dateStr => {
        const dayData = timeData[dateStr];
        if (!dayData) return;
        
        if (dayData.media) {
            Object.entries(dayData.media).forEach(([host, seconds]) => {
                mediaTotals[host] = (mediaTotals[host] || 0) + seconds;
            });
        }
        
        if (dayData.browsing) {
            Object.entries(dayData.browsing).forEach(([host, seconds]) => {
                browsingTotals[host] = (browsingTotals[host] || 0) + seconds;
            });
        }
    });
    
    const filteredTimeData = {};
    dates.forEach(dateStr => {
        if (timeData[dateStr]) {
            filteredTimeData[dateStr] = timeData[dateStr];
        }
    });
    
    const averages = calculateAverages(filteredTimeData, period);
    
    if (averages.showAverage) {
        document.getElementById('periodAverage').innerHTML = 
            `Σ ${formatTime(averages.total)} \u2007 avg/day ${formatTime(averages.avgTotal)}`;
        document.getElementById('mediaAverage').innerHTML = 
            `Σ ${formatTime(averages.totalMedia)} \u2007 avg/day ${formatTime(averages.media)}`;
        document.getElementById('browsingAverage').innerHTML = 
            `Σ ${formatTime(averages.totalBrowsing)} \u2007 avg/day ${formatTime(averages.browsing)}`;
    } else {
        document.getElementById('periodAverage').innerHTML = 
            `Σ ${formatTime(averages.total)}`;
        document.getElementById('mediaAverage').innerHTML = 
            `Σ ${formatTime(averages.totalMedia)}`;
        document.getElementById('browsingAverage').innerHTML = 
            `Σ ${formatTime(averages.totalBrowsing)}`;
    }
    
    displayList(mediaList, mediaTotals, 'media');
    displayList(browsingList, browsingTotals, 'browsing');
}

function displayList(container, totals, type) {
    container.innerHTML = '';
    
    const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    const totalTime = entries.reduce((sum, [, seconds]) => sum + seconds, 0);
    
    if (entries.length === 0) {
        container.innerHTML = '<div class="empty-message">No data for this period</div>';
        return;
    }
    
    const colors = colorPalettes[currentPaletteIndex];
    const displayColors = type === 'browsing' ? [...colors].reverse() : colors;
    const maxDuration = entries.length > 0 ? entries[0][1] : 0;
    const maxBarWidth = 100;
    
    const showZero = type === 'browsing' ? showZeroBrowsing : showZeroMedia;
    
    entries.forEach(([host, seconds], index) => {
        const percentage = calculatePercentage(seconds, totalTime);
        const barWidth = maxDuration > 0 ? (seconds / maxDuration) * maxBarWidth : 0;
        const colorIndex = index % displayColors.length;
        
        const item = document.createElement('div');
        item.className = 'site-item';
        
        if (percentage === 0 && !showZero) {
            item.classList.add('zero-percent');
        } else if (percentage === 0 && showZero) {
            item.classList.add('zero-percent', 'show');
        }
        
        item.innerHTML = `
            <div class="site-info-stacked">
                <div class="site-stacked-left">
                    <div class="site-row-top">
                        <span class="site-name-stacked">${host}</span>
                    </div>
                    <div class="site-row-bottom">
                        <div class="site-bar-stacked" style="width: ${barWidth}%; background-color: ${displayColors[colorIndex]};"></div>
                    </div>
                </div>
                <span class="site-time">${formatTimeAligned(seconds)}</span>
                <span class="site-percentage"><span style="color: var(--accent-color);">${percentage}</span><span style="color: var(--text-color);">%</span></span>
                <button class="delete-btn" data-host="${host}" data-type="${type}">×</button>
            </div>
        `;
        
        container.appendChild(item);
    });
}

async function deleteHostData(host, type) {
    const { timeData = {} } = await browser.storage.local.get('timeData');
    
    Object.keys(timeData).forEach(dateStr => {
        const dayData = timeData[dateStr];
        if (dayData[type] && dayData[type][host]) {
            delete dayData[type][host];
        }
    });
    
    await browser.storage.local.set({ timeData });
    
    if (type === 'media') {
        const port = browser.runtime.connect({ name: 'reset-host' });
        port.postMessage({ host });
    }
    
    await displayData();
}

async function deleteAllData() {
    if (!confirm('Delete ALL data for all time periods and all settings?\n\nThis cannot be undone!')) {
        return;
    }
    
    if (!confirm('Are you absolutely sure? This will delete EVERYTHING!')) {
        return;
    }
    
    await browser.storage.local.remove([
        'timeData',
        'lists',
        'listPaletteIndex',
        'listCategoryPaletteIndex',
        'sinceItems', 
        'sincePaletteIndex',
    ]);
    
    await displayData();
    
    await browser.storage.local.set({ lists: { category1: {}, category2: {} } });
    sinceItems: [] 
    displayListCategories({ category1: {}, category2: {} });
    closeListItemsSection();
    displaySinceItems([]);
}

async function savePaletteIndex(index) {
    await browser.storage.local.set({ paletteIndex: index });
}

async function loadPaletteIndex() {
    const { paletteIndex = 0 } = await browser.storage.local.get('paletteIndex');
    currentPaletteIndex = paletteIndex;
}

async function savePeriod(period) {
    await browser.storage.local.set({ selectedPeriod: period });
}

async function loadPeriod() {
    const { selectedPeriod = 'today' } = await browser.storage.local.get('selectedPeriod');
    periodSelect.value = selectedPeriod;
}

async function loadWhitelist() {
    const { whitelist = [] } = await browser.storage.local.get('whitelist');
    whitelistList.innerHTML = '';
    
    if (whitelist.length === 0) {
        whitelistList.innerHTML = '<div class="empty-message">No whitelisted sites</div>';
        return;
    }
    
    whitelist.forEach(pattern => {
        const item = document.createElement('div');
        item.className = 'whitelist-item';
        item.innerHTML = `
            <span>${pattern}</span>
            <button class="whitelist-remove" data-pattern="${pattern}">×</button>
        `;
        whitelistList.appendChild(item);
    });
}

async function addWhitelist() {
    let pattern = whitelistInput.value.trim();
    if (!pattern) return;
    
    if (!pattern.includes('*') && !pattern.startsWith('=')) {
        const parts = pattern.split('.');
        if (parts.length >= 2 && !pattern.includes('://')) {
            pattern = `*.${pattern}`;
        }
    }
    
    const exactMatch = pattern.startsWith('=');
    if (exactMatch) {
        pattern = pattern.substring(1);
    }
    
    const { whitelist = [] } = await browser.storage.local.get('whitelist');
    
    if (!whitelist.includes(pattern)) {
        whitelist.push(pattern);
        await browser.storage.local.set({ whitelist });
        await loadWhitelist();
    }
    
    whitelistInput.value = '';
}

async function removeWhitelist(pattern) {
    const { whitelist = [] } = await browser.storage.local.get('whitelist');
    const updated = whitelist.filter(p => p !== pattern);
    await browser.storage.local.set({ whitelist: updated });
    await loadWhitelist();
}

async function exportData() {
    const data = await browser.storage.local.get([
        'lists', 
        'listCategoryPaletteIndex',
        'listPaletteIndex' ,
        'sinceItems',
        'sincePaletteIndex',
        'blockSettings', 
        'blurSettings',
        'blurSiteList',
        'darkModeEnabled',      
        'darkModeSettings', 
        'diacriticsEnabled',
        'globalBlockingEnabled',
        'highlightEnabled',
        'highlightPaletteIndex',
        'highlightTerms',
        'hoverZoomEnabled',     
        'maxTabsEnabled',       
        'rightClickAllowed',
        'siteBlockTimestamps',
        'tabsLimit',            
        'whitelist', 
        'youtubeSettings',
        'zapSettings',
        'timeData', 
    ]);

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `yt-time-waster-tracker-${getDateString(new Date())}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
}

async function updateBlockToggle() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    
    if (!tabs || !tabs[0] || !tabs[0].url || tabs[0].url.startsWith('about:')) {
        siteBlockToggle.style.display = 'none';
        return;
    }
    
    const isLocalFile = tabs[0].url.startsWith('file://');
    
    let currentHost;
    if (isLocalFile) {
        currentHost = 'local-files';
    } else {
        currentHost = extractHost(tabs[0].url);
    }
    
    if (!currentHost) {
        siteBlockToggle.style.display = 'none';
        return;
    }
    
    siteBlockToggle.style.display = 'inline-block';
    
    const { blockSettings = {} } = await browser.storage.local.get('blockSettings');
    
    if (blockSettings[currentHost]) {
        siteBlockToggle.classList.add('active');
        document.getElementById('siteBlockToggleIcon').textContent = '🌡'; 
        siteBlockToggle.title = `Content Blocking:  Remove ${currentHost}`;
    } else {
        siteBlockToggle.classList.remove('active');
        document.getElementById('siteBlockToggleIcon').textContent = '🧪'; 
        siteBlockToggle.title = `Content Blocking: Add ${currentHost}`;
    }
}

async function updateDarkToggle() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    
    if (!tabs || !tabs[0] || !tabs[0].url || tabs[0].url.startsWith('about:')) {
        siteDarkToggle.style.display = 'none';
        siteDarkEnable.style.display = 'none';
        return;
    }
    
    const isLocalFile = tabs[0].url.startsWith('file://');
    
    let currentHost;
    if (isLocalFile) {
        currentHost = 'local-files';
    } else {
        currentHost = extractHost(tabs[0].url);
    }
    
    if (!currentHost) {
        siteDarkToggle.style.display = 'none';
        siteDarkEnable.style.display = 'none';
        return;
    }
    
    siteDarkToggle.style.display = 'inline-block';
    
    const { darkModeSettings = {} } = await browser.storage.local.get('darkModeSettings');
    
    if (darkModeSettings[currentHost]) {
        siteDarkToggle.classList.add('active');
        document.getElementById('siteDarkToggleIcon').textContent = '☀️'; 
        siteDarkToggle.title = `Dark Mode Remove ${currentHost}`;
        
        siteDarkEnable.style.display = 'inline-block';
        if (darkModeSettings[currentHost].enabled) {
            siteDarkEnable.classList.add('active');
            siteDarkEnableText.textContent = 'ON';
        } else {
            siteDarkEnable.classList.remove('active');
            siteDarkEnableText.textContent = 'OFF';
        }
    } else {
        siteDarkToggle.classList.remove('active');
        document.getElementById('siteDarkToggleIcon').textContent = '🌙'; 
        siteDarkToggle.title = `Dark Mode Add ${currentHost}`;
        siteDarkEnable.style.display = 'none';
    }
}

async function updateRightClickToggle() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    
    if (!tabs || !tabs[0] || !tabs[0].url || tabs[0].url.startsWith('about:')) {
        rightClickToggle.style.display = 'none';
        return;
    }
    
    const isLocalFile = tabs[0].url.startsWith('file://');
    
    let currentHost;
    if (isLocalFile) {
        currentHost = 'local-files';
    } else {
        currentHost = extractHost(tabs[0].url);
    }
    
    if (!currentHost) {
        rightClickToggle.style.display = 'none';
        return;
    }
    
    rightClickToggle.style.display = 'inline-block';
    
    const { rightClickAllowed = [] } = await browser.storage.local.get('rightClickAllowed');
    
    if (rightClickAllowed.includes(currentHost)) {
        rightClickToggle.classList.add('active');
        document.getElementById('rightClickToggleIcon').textContent = '👆'; 
        rightClickToggle.title = `Allow Right-click Remove ${currentHost}`;
    } else {
        rightClickToggle.classList.remove('active');
        document.getElementById('rightClickToggleIcon').textContent = '🖱️'; 
        rightClickToggle.title = `Allow Right-click Add ${currentHost}`;
    }
}

async function loadBlockSettings() {
    const site = blockSiteSelect.value;
    const { blockSettings = {} } = await browser.storage.local.get('blockSettings');
    
    const settings = blockSettings[site] || blockSettings.global || {
        blockImages: false,
        blockSVG: false
    };
    
    Object.keys(blockCheckboxes).forEach(key => {
        blockCheckboxes[key].checked = settings[key] || false;
    });
}

async function loadDarkSettings() {
    const site = blockSiteSelect.value;
    const { darkModeSettings = {} } = await browser.storage.local.get('darkModeSettings');
    
    let settings;
    if (darkModeSettings[site]) {
        settings = darkModeSettings[site];
    } else {
        settings = darkModeSettings.global || {
            preserveImages: true,
            invertMaybe: false,
            spaFix: false
        };
    }
    
    Object.keys(darkModeCheckboxes).forEach(key => {
        darkModeCheckboxes[key].checked = settings[key] === true;
    });
}

async function loadBlockSites() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const { blockSettings = {}, darkModeSettings = {}, rightClickAllowed = [] } = 
        await browser.storage.local.get(['blockSettings', 'darkModeSettings', 'rightClickAllowed']);
    
    blockSiteSelect.innerHTML = '';
    
    let currentHost = null;
    const isLocalFile = tabs && tabs[0] && tabs[0].url && tabs[0].url.startsWith('file://');
    
    if (isLocalFile) {
        const localOption = document.createElement('option');
        localOption.value = 'local-files';
        localOption.textContent = 'Local Files (file:///)';
        blockSiteSelect.appendChild(localOption);
        
        const allConfiguredSites = new Set([
            ...Object.keys(blockSettings).filter(s => s !== 'global' && s !== 'local-files'),
            ...Object.keys(darkModeSettings).filter(s => s !== 'global' && s !== 'local-files'),
            ...rightClickAllowed.filter(s => s !== 'local-files')
        ]);
        
        Array.from(allConfiguredSites)
            .sort()
            .forEach(site => {
                const option = document.createElement('option');
                option.value = site;
                option.textContent = site;
                blockSiteSelect.appendChild(option);
            });
        
        blockSiteSelect.value = 'local-files';
        return;
    }
    
    if (tabs && tabs[0] && tabs[0].url && !tabs[0].url.startsWith('about:')) {
        currentHost = extractHost(tabs[0].url);
    }
    
    if (!currentHost) {
        const globalOption = document.createElement('option');
        globalOption.value = 'global';
        globalOption.textContent = 'Global Settings';
        blockSiteSelect.appendChild(globalOption);
        blockSiteSelect.value = 'global';
        return;
    }
    
    const currentOption = document.createElement('option');
    currentOption.value = currentHost;
    currentOption.textContent = currentHost;
    blockSiteSelect.appendChild(currentOption);
    
    const allConfiguredSites = new Set([
        ...Object.keys(blockSettings).filter(s => s !== 'global' && s !== currentHost),
        ...Object.keys(darkModeSettings).filter(s => s !== 'global' && s !== currentHost),
        ...rightClickAllowed.filter(s => s !== currentHost)
    ]);
    
    Array.from(allConfiguredSites)
        .sort((a, b) => {
            if (a === 'local-files') return -1;
            if (b === 'local-files') return 1;
            return a.localeCompare(b);
        })
        .forEach(site => {
            const option = document.createElement('option');
            option.value = site;
            option.textContent = site === 'local-files' ? 'Local Files (file:///)' : site;
            blockSiteSelect.appendChild(option);
        });
    
    blockSiteSelect.value = currentHost;
}

async function saveBlockSettings() {
    const selectedSite = blockSiteSelect.value;
    const { blockSettings = {} } = await browser.storage.local.get('blockSettings');
    
    const targetSite = blockSettings[selectedSite] ? selectedSite : 'global';
    
    if (!blockSettings[targetSite]) {
        blockSettings[targetSite] = {
            blockImages: false,
            blockSVG: false
        };
    }
    
    Object.keys(blockCheckboxes).forEach(key => {
        blockSettings[targetSite][key] = blockCheckboxes[key].checked;
    });
    
    await browser.storage.local.set({ blockSettings });
}

async function saveDarkSettings() {
    const selectedSite = blockSiteSelect.value;
    const { darkModeSettings = {} } = await browser.storage.local.get('darkModeSettings');

    const targetSite = darkModeSettings[selectedSite] ? selectedSite : 'global';
    
    if (!darkModeSettings[targetSite]) {
        darkModeSettings[targetSite] = {};
    }
    
    Object.keys(darkModeCheckboxes).forEach(key => {
        darkModeSettings[targetSite][key] = darkModeCheckboxes[key].checked;
    });
    
    await browser.storage.local.set({ darkModeSettings });
}

async function loadMaxTabsSettings() {
    const { maxTabsEnabled = false, tabsLimit: savedLimit = 3 } = 
        await browser.storage.local.get(['maxTabsEnabled', 'tabsLimit']);
    
    tabsLimit = savedLimit;
    
    if (maxTabsEnabled) {
        maxTabsToggle.classList.add('active');
        maxTabsToggleText.textContent = 'ON';
    } else {
        maxTabsToggle.classList.remove('active');
        maxTabsToggleText.textContent = 'OFF';
    }
    
    document.querySelectorAll('.tab-limit-btn').forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.dataset.limit) === tabsLimit) {
            btn.classList.add('active');
        }
    });
    
    updateTabCount();
}

async function updateTabCount() {
    const tabs = await browser.tabs.query({ currentWindow: true });
    const loadedTabs = tabs.filter(tab => !tab.discarded);
    const count = loadedTabs.length;
    
    currentTabCount.textContent = count;
    
    if (count > tabsLimit) {
        currentTabCount.classList.add('over-limit');
    } else {
        currentTabCount.classList.remove('over-limit');
    }
}

async function updateHoverZoomToggleUI() {
    const { hoverZoomEnabled = false } = await browser.storage.local.get('hoverZoomEnabled');
    
    if (hoverZoomEnabled) {
        hoverZoomToggle.textContent = '🔍';
        hoverZoomToggle.style.background = '#7a7a7a';
        hoverZoomToggle.title = 'Hover Image Zoom: Turn OFF';
    } else {
        hoverZoomToggle.textContent = '🔎';
        hoverZoomToggle.style.background = '#2e2e2e';
        hoverZoomToggle.title = 'Hover Image Zoom: Turn ON';
    }
}

function updateImportJsonSection() {
    const importJsonSection = document.getElementById('importJsonSection');
    const helpSectionTab = document.getElementById('helpSectionTab');
    const actualWidth = window.innerWidth || document.documentElement.clientWidth;
    
    if (actualWidth > 620) {
        importJsonSection.style.display = 'block';
        if (helpSectionTab) {
            helpSectionTab.style.display = 'block';
        }
    } else {
        importJsonSection.style.display = 'none';
        if (helpSectionTab) {
            helpSectionTab.style.display = 'none';
        }
    }
}

async function updateClearButtonStates() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (!tabs || !tabs[0]) return;
    
    const url = tabs[0].url;
    if (!url || url.startsWith('about:') || url.startsWith('moz-extension:')) {
        return;
    }
    
    const host = extractHost(url);
    if (!host) return;
    
    const { blurSettings = {}, zapSettings = {}, invertSettings = {}, invertParentSettings = {} } = 
        await browser.storage.local.get(['blurSettings', 'zapSettings', 'invertSettings', 'invertParentSettings']);
    
    const clearBlurBtn = document.getElementById('clearBlurBtn');
    const clearZapBtn = document.getElementById('clearZapBtn');
    const clearInvertBtn = document.getElementById('clearInvertBtn');
    const clearInvertParentBtn = document.getElementById('clearInvertParentBtn');
    
    if (blurSettings[host] && Object.keys(blurSettings[host]).length > 0) {
        clearBlurBtn.textContent = '♻️';
        clearBlurBtn.title = `Clear all Blur Elements for ${host}`;
    } else {
        clearBlurBtn.textContent = '🗑';
        clearBlurBtn.title = 'No Blur Elements';
    }
    
    if (zapSettings[host] && Object.keys(zapSettings[host]).length > 0) {
        clearZapBtn.textContent = '♻️';
        clearZapBtn.title = `Clear all Zapped Elements for ${host}`;
    } else {
        clearZapBtn.textContent = '🗑';
        clearZapBtn.title = 'No Zap Elements';
    }
    
    if (invertSettings[host] && Object.keys(invertSettings[host]).length > 0) {
        clearInvertBtn.textContent = '♻️';
        clearInvertBtn.title = `Clear all Inverted Elements for ${host}`;
    } else {
        clearInvertBtn.textContent = '🗑';
        clearInvertBtn.title = 'No Inverts';
    }
    
    if (clearInvertParentBtn) {
        if (invertParentSettings[host] && Object.keys(invertParentSettings[host]).length > 0) {
            clearInvertParentBtn.textContent = '♻️';
            clearInvertParentBtn.title = `Clear all Invert CSS Parent Elements for ${host}`;
        } else {
            clearInvertParentBtn.textContent = '🗑';
            clearInvertParentBtn.title = 'No Invert CSS Parent Elements';
        }
    }
}

async function cleanupUnusedSites() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    let currentHost = null;
    
    if (tabs && tabs[0] && tabs[0].url && !tabs[0].url.startsWith('about:')) {
        const isLocalFile = tabs[0].url.startsWith('file://');
        if (isLocalFile) {
            currentHost = 'local-files';
        } else {
            currentHost = extractHost(tabs[0].url);
        }
    }
    
    const { blockSettings = {}, darkModeSettings = {}, rightClickAllowed = [] } = 
        await browser.storage.local.get(['blockSettings', 'darkModeSettings', 'rightClickAllowed']);
    
    const allSites = new Set([
        ...Object.keys(blockSettings).filter(s => s !== 'global'),
        ...Object.keys(darkModeSettings).filter(s => s !== 'global'),
        ...rightClickAllowed
    ]);
    
    let needsUpdate = false;
    
    for (const site of allSites) {
        if (site === currentHost) continue;
        
        const hasBlockSettings = blockSettings[site] !== undefined;
        const hasDarkSettings = darkModeSettings[site] !== undefined;
        const hasRightClick = rightClickAllowed.includes(site);
        
        if (!hasBlockSettings && !hasDarkSettings && !hasRightClick) {
            delete blockSettings[site];
            delete darkModeSettings[site];
            needsUpdate = true;
        }
    }
    
    if (needsUpdate) {
        await browser.storage.local.set({ blockSettings, darkModeSettings });
        
        const currentSelection = blockSiteSelect.value;
        await loadBlockSites();
        
        const options = Array.from(blockSiteSelect.options).map(opt => opt.value);
        if (options.includes(currentSelection)) {
            blockSiteSelect.value = currentSelection;
            blockSiteSelect.dispatchEvent(new Event('change'));
        }
    }
}

function updateHighlightPaletteNumber() {
    const paletteNumberSpan = document.getElementById('highlightPaletteNumber');
    if (paletteNumberSpan) {
        paletteNumberSpan.textContent = currentHighlightPaletteIndex + 1;
    }
}

async function loadHighlightPalette() {
    const { highlightPaletteIndex = 0 } = await browser.storage.local.get('highlightPaletteIndex');
    currentHighlightPaletteIndex = highlightPaletteIndex;
    updateHighlightPaletteNumber();
}

async function saveHighlightPalette(index) {
    await browser.storage.local.set({ highlightPaletteIndex: index });
}

async function loadHighlightTerms() {
    const { highlightTerms = [] } = await browser.storage.local.get('highlightTerms');
    displayHighlightTerms(highlightTerms);
}

async function loadHighlightEnabled() {
    const { highlightEnabled: enabled = false } = await browser.storage.local.get('highlightEnabled');
    highlightEnabled = enabled;
    
    const toggle = document.getElementById('highlightToggle');
    const toggleText = document.getElementById('highlightToggleText');
    
    if (highlightEnabled) {
        toggle.classList.add('active');
        toggleText.textContent = 'ON';
    } else {
        toggle.classList.remove('active');
        toggleText.textContent = 'OFF';
    }
}

async function saveHighlightEnabled(enabled) {
    await browser.storage.local.set({ highlightEnabled: enabled });
}

async function displayHighlightTerms(terms) {
    const container = document.getElementById('highlightTermsList');
    container.innerHTML = '';
    
    if (terms.length === 0) {
        container.innerHTML = '<span style="color: #858585; font-size: 0.85rem;">No search terms</span>';
        return;
    }
    
    const colors = colorPalettes[currentHighlightPaletteIndex];
    
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    let occurrenceCounts = {};
    
    if (tabs[0]) {
        try {
            const response = await browser.tabs.sendMessage(tabs[0].id, {
                action: 'getHighlightCounts'
            });
            occurrenceCounts = response?.counts || {};
        } catch (e) {
            
        }
    }
    
    terms.forEach((term, index) => {
        const colorIndex = index % colors.length;
        const bgColor = colors[colorIndex];
        const textColor = getContrastColor(bgColor);
        
        const wrapper = document.createElement('span');
        wrapper.style.cssText = 'display: inline-flex; align-items: center; gap: 0; margin-right: 0.1rem; margin-bottom: 0.25rem;';
        
        const tag = document.createElement('span');
        tag.style.cssText = `
            background: ${bgColor};
            color: ${textColor};
            padding: 0.15rem 0.3rem;
            border-radius: 3px;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
        `;
        tag.textContent = term;
        tag.title = '';
        
        tag.addEventListener('click', async () => {
            const tabs = await browser.tabs.query({ active: true, currentWindow: true });
            if (tabs[0]) {
                browser.tabs.sendMessage(tabs[0].id, {
                    action: 'jumpToNextHighlight',
                    term: term
                });
            }
        });
        
        wrapper.appendChild(tag);
        
        const count = occurrenceCounts[term] || 0;
        if (count > 0) {
            const countSpan = document.createElement('span');
            countSpan.className = 'list-item-count';
            countSpan.textContent = count;
            countSpan.dataset.term = term;
            countSpan.style.cssText = 'padding: 0; margin: 0; margin-left: 0rem;';
            wrapper.appendChild(countSpan);
        }
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'whitelist-remove';
        removeBtn.style.cssText = 'min-width: auto; padding: 0; margin: 0; margin-left: 0rem; border: none; background: none; color: #ff3f3f; font-size: 16px; cursor: pointer; line-height: 1;';
        removeBtn.textContent = '×';
        removeBtn.title = 'Remove term';
        
        removeBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const { highlightTerms = [] } = await browser.storage.local.get('highlightTerms');
            const updatedTerms = highlightTerms.filter(t => t !== term);
            await browser.storage.local.set({ highlightTerms: updatedTerms });
            displayHighlightTerms(updatedTerms);
            
            const tabs = await browser.tabs.query({ active: true, currentWindow: true });
            if (tabs[0]) {
                if (updatedTerms.length > 0) {
                    const colors = colorPalettes[currentHighlightPaletteIndex];
                    browser.tabs.sendMessage(tabs[0].id, {
                        action: 'highlightMultipleTerms',
                        terms: updatedTerms,
                        colors: colors,
                        diacriticsEnabled: diacriticsEnabled
                    });
                } else {
                    browser.tabs.sendMessage(tabs[0].id, {
                        action: 'clearHighlights'
                    });
                }
            }
        });
        
        wrapper.appendChild(removeBtn);
        container.appendChild(wrapper);
    });
}

async function addHighlightTerms(termsText) {
    if (!termsText) return;
    
    const quotedPhrases = termsText.match(/"([^"]+)"/g) || [];
    const phrases = quotedPhrases;
    
    const termsWithoutQuotes = termsText.replace(/"[^"]+"/g, '').trim();
    const individualTerms = termsWithoutQuotes ? termsWithoutQuotes.split(/\s+/).filter(t => t.length >= 1) : [];
    
    const newTerms = [...phrases, ...individualTerms];
    
    if (newTerms.length === 0) return;
    
    const { highlightTerms = [] } = await browser.storage.local.get('highlightTerms');
    
    const allTerms = [...highlightTerms, ...newTerms];
    const conflicts = [];
    
    for (const term of allTerms) {
        const isQuoted = term.startsWith('"') && term.endsWith('"');
        const baseText = isQuoted ? term.slice(1, -1) : term;
        
        const quotedVersion = `"${baseText}"`;
        const unquotedVersion = baseText;
        
        if (allTerms.includes(quotedVersion) && allTerms.includes(unquotedVersion)) {
            if (!conflicts.includes(baseText)) {
                conflicts.push(baseText);
            }
        }
    }
    
    if (conflicts.length > 0) {
        alert(`Cannot add both exact and partial matches for the same term(s): ${conflicts.join(', ')}\n\nPlease use either "${conflicts[0]}" (exact) OR ${conflicts[0]} (partial), but not both.`);
        return;
    }
    
    if (!highlightEnabled) {
        highlightEnabled = true;
        await saveHighlightEnabled(true);
        const toggle = document.getElementById('highlightToggle');
        const toggleText = document.getElementById('highlightToggleText');
        toggle.classList.add('active');
        toggleText.textContent = 'ON';
    }
    
    const allTermsToAdd = [...highlightTerms, ...newTerms.filter(t => !highlightTerms.includes(t))];
    
    await browser.storage.local.set({ highlightTerms: allTermsToAdd });

    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
        const colors = colorPalettes[currentHighlightPaletteIndex];
        await browser.tabs.sendMessage(tabs[0].id, {
            action: 'highlightMultipleTerms',
            terms: allTermsToAdd,
            colors: colors,
            diacriticsEnabled: diacriticsEnabled,
            cjkMode: cjkEnabled
        });
        
        await new Promise(resolve => setTimeout(resolve, 300));
        displayHighlightTerms(allTermsToAdd);
    }
}

async function applyHighlights(terms, paletteIndex) {
    const { diacriticsEnabled = true } = await browser.storage.local.get('diacriticsEnabled');
    const colors = colorPalettes[paletteIndex] || colorPalettes[0];
    
    setTimeout(() => {
        highlightMultipleTerms(terms, colors, diacriticsEnabled);
    }, 100);
}

async function loadDiacriticsEnabled() {
    const { diacriticsEnabled: enabled = true } = await browser.storage.local.get('diacriticsEnabled');
    diacriticsEnabled = enabled;
    
    const toggle = document.getElementById('diacriticsToggle');
    const toggleText = document.getElementById('diacriticsToggleText');
    
    if (diacriticsEnabled) {
        toggle.classList.add('active');
        toggleText.textContent = 'üb';
        toggle.title = 'Diacritics: ON (strict matching)';
    } else {
        toggle.classList.remove('active');
        toggleText.textContent = 'ub';
        toggle.title = 'Diacritics: OFF (loose matching)';
    }
}

async function refreshHighlightCounts() {
    const { highlightTerms = [] } = await browser.storage.local.get('highlightTerms');
    if (highlightTerms.length === 0) return;
    
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
        try {
            const response = await browser.tabs.sendMessage(tabs[0].id, {
                action: 'getHighlightCounts'
            });
            const occurrenceCounts = response?.counts || {};
            
            const container = document.getElementById('highlightTermsList');
            if (!container) return;
            
            // Find all wrapper spans
            const allWrappers = container.querySelectorAll('span[style*="inline-flex"]');
            
            allWrappers.forEach(wrapper => {
                const tag = wrapper.querySelector('span[style*="cursor: pointer"]');
                if (tag) {
                    const term = tag.textContent;
                    const countSpan = wrapper.querySelector('.list-item-count');
                    if (countSpan && occurrenceCounts[term] !== undefined) {
                        const count = occurrenceCounts[term] || 0;
                        countSpan.textContent = count;
                    }
                }
            });
        } catch (e) {
            console.log('Could not get highlight counts:', e);
        }
    }
}

async function updateSiteBlockButton() {
    const btn = document.getElementById('toggleSiteInBlockList');
    if (!btn) return;
    
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    
    if (!tabs || !tabs[0] || !tabs[0].url || tabs[0].url.startsWith('about:') || tabs[0].url.startsWith('moz-extension:')) {
        btn.style.opacity = '0.3';
        btn.disabled = true;
        btn.textContent = '🚫';
        btn.title = 'Not available on this page';
        return;
    }
    
    const host = extractHost(tabs[0].url);
    if (!host) {
        btn.style.opacity = '0.3';
        btn.disabled = true;
        btn.textContent = '🚫';
        btn.title = 'Not available on this page';
        return;
    }
    
    btn.style.opacity = '1';
    btn.disabled = false;
    
    const { siteBlockTimestamps = {} } = await browser.storage.local.get('siteBlockTimestamps');
    
    if (siteBlockTimestamps[host]) {
        btn.textContent = '🚫';
        btn.title = `Unblock ${host}`;
    } else {
        btn.textContent = '🚫';
        btn.title = `Block ${host}`;
    }
}

async function updateBlurSiteButton() {
    const btn = document.getElementById('toggleBlurSite');
    if (!btn) return;
    
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    
    if (!tabs || !tabs[0] || !tabs[0].url || tabs[0].url.startsWith('about:') || tabs[0].url.startsWith('moz-extension:')) {
        btn.style.opacity = '0.3';
        btn.disabled = true;
        btn.textContent = '💦';
        btn.title = 'Not available on this page';
        return;
    }
    
    const host = extractHost(tabs[0].url);
    if (!host) {
        btn.style.opacity = '0.3';
        btn.disabled = true;
        btn.textContent = '💦';
        btn.title = 'Not available on this page';
        return;
    }
    
    btn.style.opacity = '1';
    btn.disabled = false;
    
    const { blurSiteList = [] } = await browser.storage.local.get('blurSiteList');
    
    if (blurSiteList.includes(host)) {
        btn.textContent = '☁️';
        btn.title = `Unblur images/videos on ${host}`;
    } else {
        btn.textContent = '💦';
        btn.title = `Blur images/videos on ${host}`;
    }
}

async function loadBlurSettingsForCurrentSite() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (!tabs[0]) return;
    
    const host = extractHost(tabs[0].url);
    if (!host) return;
    
    const { blurSettings = {}, blurSiteList = [] } = 
        await browser.storage.local.get(['blurSettings', 'blurSiteList']);
    
    const siteSettings = blurSettings[host] || { imageBlur: 8, videoBlur: 8, invertImages: false };
    
    if (imageBlurSlider) imageBlurSlider.value = siteSettings.imageBlur;
    if (videoBlurSlider) videoBlurSlider.value = siteSettings.videoBlur;
    if (imageBlurValue) imageBlurValue.textContent = siteSettings.imageBlur;
    if (videoBlurValue) videoBlurValue.textContent = siteSettings.videoBlur;
    
    const invertBtn = document.getElementById('toggleInvertBlur');
    const invertText = document.getElementById('invertBlurText');
    
    if (invertBtn) {
        if (siteSettings.invertImages) {
            invertBtn.classList.add('active');
        } else {
            invertBtn.classList.remove('active');
        }
    }
    
    if (invertText) {
        invertText.textContent = '🩻';
    }
    
    if (blurSiteList.includes(host)) {
        if (blurControlSection) blurControlSection.style.display = 'block';
    } else {
        if (blurControlSection) blurControlSection.style.display = 'none';
    }
}

imageBlurSlider.addEventListener('input', async () => {
    const newValue = parseInt(imageBlurSlider.value);
    
    imageBlurValue.textContent = newValue;
    
    if (newValue === lastImageBlurValue) return;
    lastImageBlurValue = newValue;
    
    if (imageBlurDebounce) {
        clearTimeout(imageBlurDebounce);
    }
    
    imageBlurDebounce = setTimeout(async () => {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        if (!tabs[0]) return;
        
        const host = extractHost(tabs[0].url);
        if (!host) return;
        
        const { blurSettings = {} } = await browser.storage.local.get('blurSettings');
        
        if (!blurSettings[host]) {
            blurSettings[host] = { imageBlur: 8, videoBlur: 20, invertImages: false };
        }
        
        blurSettings[host].imageBlur = newValue;
        await browser.storage.local.set({ blurSettings });
        
        browser.tabs.sendMessage(tabs[0].id, {
            action: 'updateBlurAmount',
            imageBlur: blurSettings[host].imageBlur,
            videoBlur: blurSettings[host].videoBlur,
            invertImages: blurSettings[host].invertImages
        });
    }, 50);
});

const toggleInvertBlur = document.getElementById('toggleInvertBlur');

toggleInvertBlur?.addEventListener('click', async () => {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (!tabs[0]) return;
    
    const host = extractHost(tabs[0].url);
    if (!host) return;
    
    const { blurSettings = {} } = await browser.storage.local.get('blurSettings');
    
    if (!blurSettings[host]) {
        blurSettings[host] = { imageBlur: 8, videoBlur: 8, invertImages: false };
    }
    
    blurSettings[host].invertImages = !blurSettings[host].invertImages;
    await browser.storage.local.set({ blurSettings });
    
    const invertText = document.getElementById('invertBlurText');
    
    if (blurSettings[host].invertImages) {
        toggleInvertBlur.classList.add('active');
        if (invertText) invertText.textContent = '🩻';
    } else {
        toggleInvertBlur.classList.remove('active');
        if (invertText) invertText.textContent = '🩻';
    }
    
    browser.tabs.sendMessage(tabs[0].id, {
        action: 'updateBlurAmount',
        imageBlur: blurSettings[host].imageBlur,
        videoBlur: blurSettings[host].videoBlur,
        invertImages: blurSettings[host].invertImages
    });
});

videoBlurSlider.addEventListener('input', async () => {
    const newValue = parseInt(videoBlurSlider.value);
    
    videoBlurValue.textContent = newValue;
    
    if (newValue === lastVideoBlurValue) return;
    lastVideoBlurValue = newValue;
    
    if (videoBlurDebounce) {
        clearTimeout(videoBlurDebounce);
    }
    
    videoBlurDebounce = setTimeout(async () => {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        if (!tabs[0]) return;
        
        const host = extractHost(tabs[0].url);
        if (!host) return;
        
        const { blurSettings = {} } = await browser.storage.local.get('blurSettings');
        
        if (!blurSettings[host]) {
            blurSettings[host] = { imageBlur: 8, videoBlur: 20, invertImages: false };
        }
        
        blurSettings[host].videoBlur = newValue;
        await browser.storage.local.set({ blurSettings });
        
        browser.tabs.sendMessage(tabs[0].id, {
            action: 'updateBlurAmount',
            imageBlur: blurSettings[host].imageBlur,
            videoBlur: blurSettings[host].videoBlur,
            invertImages: blurSettings[host].invertImages
        });
    }, 50);
});

toggleBlurSite.addEventListener('click', async () => {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (!tabs[0] || !tabs[0].url || tabs[0].url.startsWith('about:') || tabs[0].url.startsWith('moz-extension:')) {
        return;
    }

    const url = new URL(tabs[0].url);
    const host = url.hostname;

    if (!host) return;

    const { blurSiteList = [], blurSettings = {} } = 
        await browser.storage.local.get(['blurSiteList', 'blurSettings']);

    if (blurSiteList.includes(host)) {
        const updated = blurSiteList.filter(s => s !== host);
        await browser.storage.local.set({ blurSiteList: updated });

        await browser.tabs.sendMessage(tabs[0].id, {
            action: 'toggleBlur',
            enabled: false
        }).catch(err => console.log('Could not send unblur message:', err));

        toggleBlurSite.style.opacity = '0.5';
        blurControlSection.style.display = 'none';
    } else {
        blurSiteList.push(host);
        
        if (!blurSettings[host]) {
            blurSettings[host] = { imageBlur: 8, videoBlur: 20, invertImages: false };
        }
        
        await browser.storage.local.set({ blurSiteList, blurSettings });
        
        await new Promise(resolve => setTimeout(resolve, 50));

        await browser.tabs.sendMessage(tabs[0].id, {
            action: 'toggleBlur',
            enabled: true,
            imageBlur: blurSettings[host].imageBlur,
            videoBlur: blurSettings[host].videoBlur,
            invertImages: blurSettings[host].invertImages
        }).catch(err => console.log('Could not send blur message:', err));

        toggleBlurSite.style.opacity = '1';
        blurControlSection.style.display = 'block';
        
        imageBlurSlider.value = blurSettings[host].imageBlur;
        videoBlurSlider.value = blurSettings[host].videoBlur;
        imageBlurValue.textContent = blurSettings[host].imageBlur;
        videoBlurValue.textContent = blurSettings[host].videoBlur;
        
        const invertBtn = document.getElementById('toggleInvertBlur');
        const invertText = document.getElementById('invertBlurText');
        
        if (blurSettings[host].invertImages) {
            invertBtn.classList.add('active');
            invertText.textContent = '🩻';
        } else {
            invertBtn.classList.remove('active');
            invertText.textContent = '🩻';
        }
    }

    await updateBlurSiteButton();
});

document.getElementById('toggleSiteInBlockList')?.addEventListener('click', async () => {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (!tabs[0]) return;
    
    const host = extractHost(tabs[0].url);
    if (!host) return;
    
    const { siteBlockTimestamps = {} } = await browser.storage.local.get('siteBlockTimestamps');
    
    if (siteBlockTimestamps[host]) {
        delete siteBlockTimestamps[host];
    } else {
        siteBlockTimestamps[host] = Date.now();
    }
    
    await browser.storage.local.set({ siteBlockTimestamps });
    await updateSiteBlockButton();

    browser.tabs.reload(tabs[0].id);
});

siteBlockToggle.addEventListener('click', async () => {
    const selectedSite = blockSiteSelect.value;
    
    const { blockSettings = {}, darkModeSettings = {}, rightClickAllowed = [] } = 
        await browser.storage.local.get(['blockSettings', 'darkModeSettings', 'rightClickAllowed']);
    
    if (blockSettings[selectedSite]) {
        delete blockSettings[selectedSite];
        await browser.storage.local.set({ blockSettings });
        
        const stillHasSettings = darkModeSettings[selectedSite] || rightClickAllowed.includes(selectedSite);
        
        if (!stillHasSettings) {
            await cleanupUnusedSites();
            
            const tabs = await browser.tabs.query({ active: true, currentWindow: true });
            let currentHost = null;
            if (tabs && tabs[0] && tabs[0].url && !tabs[0].url.startsWith('about:')) {
                const isLocalFile = tabs[0].url.startsWith('file://');
                if (isLocalFile) {
                    currentHost = 'local-files';
                } else {
                    currentHost = extractHost(tabs[0].url);
                }
            }
            
            await loadBlockSites();
            
            if (currentHost) {
                blockSiteSelect.value = currentHost;
                blockSiteSelect.dispatchEvent(new Event('change'));
            }
        } else {
            await loadBlockSites();
            blockSiteSelect.value = selectedSite;
            blockSiteSelect.dispatchEvent(new Event('change'));
        }
        
        siteBlockToggle.classList.remove('active');
        document.getElementById('siteBlockToggleIcon').textContent = '🧪';
        siteBlockToggle.title = `Content Blocking: Add ${selectedSite}`;
    } else {
        blockSettings[selectedSite] = {
            blockImages: false,
            blockSVG: false
        };
        await browser.storage.local.set({ blockSettings });
        
        await loadBlockSites();
        blockSiteSelect.value = selectedSite;
        await loadBlockSettings();
        
        siteBlockToggle.classList.add('active');
        document.getElementById('siteBlockToggleIcon').textContent = '🌡';
        siteBlockToggle.title = `Content Blocking: Remove ${selectedSite}`;
    }
});

siteDarkToggle.addEventListener('click', async () => {
    const selectedSite = blockSiteSelect.value;
    
    const { darkModeSettings = {}, blockSettings = {}, rightClickAllowed = [] } = 
        await browser.storage.local.get(['darkModeSettings', 'blockSettings', 'rightClickAllowed']);
    
    if (darkModeSettings[selectedSite]) {
        delete darkModeSettings[selectedSite];
        await browser.storage.local.set({ darkModeSettings });
        
        const stillHasSettings = blockSettings[selectedSite] || rightClickAllowed.includes(selectedSite);
        
        if (!stillHasSettings) {
            await cleanupUnusedSites();
            
            const tabs = await browser.tabs.query({ active: true, currentWindow: true });
            let currentHost = null;
            if (tabs && tabs[0] && tabs[0].url && !tabs[0].url.startsWith('about:')) {
                const isLocalFile = tabs[0].url.startsWith('file://');
                if (isLocalFile) {
                    currentHost = 'local-files';
                } else {
                    currentHost = extractHost(tabs[0].url);
                }
            }
            
            await loadBlockSites();
            
            if (currentHost) {
                blockSiteSelect.value = currentHost;
                blockSiteSelect.dispatchEvent(new Event('change'));
            }
        } else {
            await loadBlockSites();
            blockSiteSelect.value = selectedSite;
            blockSiteSelect.dispatchEvent(new Event('change'));
        }
        
        siteDarkToggle.classList.remove('active');
        document.getElementById('siteDarkToggleIcon').textContent = '🌙';
        siteDarkEnable.style.display = 'none';
    } else {
        const globalSettings = darkModeSettings.global || {
            preserveImages: true,
            invertMaybe: false,
            spaFix: false
        };
        
        // Create new site settings based on global defaults
        const currentSettings = {
            preserveImages: globalSettings.preserveImages,
            invertMaybe: globalSettings.invertMaybe,
            spaFix: globalSettings.spaFix,
            enabled: true
        };
        
        darkModeSettings[selectedSite] = currentSettings;
        await browser.storage.local.set({ darkModeSettings });
        
        // Now load these settings into the UI checkboxes
        await loadDarkSettings();
        
        siteDarkToggle.classList.add('active');
        document.getElementById('siteDarkToggleIcon').textContent = '☀️';
        siteDarkEnable.style.display = 'inline-block';
        siteDarkEnable.classList.add('active');
        siteDarkEnableText.textContent = 'ON';
    }
    
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (tabs && tabs[0]) {
        browser.tabs.reload(tabs[0].id);
    }
});

siteDarkEnable.addEventListener('click', async () => {
    const selectedSite = blockSiteSelect.value;
    
    const { darkModeSettings = {} } = await browser.storage.local.get('darkModeSettings');
    if (!darkModeSettings[selectedSite]) return;
    
    darkModeSettings[selectedSite].enabled = !darkModeSettings[selectedSite].enabled;
    await browser.storage.local.set({ darkModeSettings });
    
    if (darkModeSettings[selectedSite].enabled) {
        siteDarkEnable.classList.add('active');
        siteDarkEnableText.textContent = 'ON';
    } else {
        siteDarkEnable.classList.remove('active');
        siteDarkEnableText.textContent = 'OFF';
    }
    
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (tabs && tabs[0]) {
        browser.tabs.reload(tabs[0].id);
    }
});

function toggleSettingsCollapse() {
    settingsCollapsed = !settingsCollapsed;
    const collapsibleSettings = document.getElementById('collapsibleSettings');
    const collapsibleHeader = document.getElementById('collapsibleHighlightHeader');
    const formGroup = collapsibleSettings?.previousElementSibling;
    const headerLeft = document.querySelector('.header-left');
    const container = document.querySelector('.container');
    const body = document.body;
    
    if (settingsCollapsed) {
        collapsibleSettings.classList.add('settings-collapsed');
        collapsibleHeader?.classList.add('settings-collapsed');
        formGroup?.classList.add('settings-collapsed-parent');
        if (headerLeft) {
            headerLeft.style.visibility = 'hidden';
            headerLeft.style.height = '0';
            headerLeft.style.overflow = 'hidden';
        }
        if (container) {
            container.style.width = '90vw';
            container.style.maxWidth = '90vw';
            container.style.margin = '0 5vw';
        }
        if (body) {
            body.style.width = '100vw';
            body.style.minWidth = '100vw';
        }
    } else {
        collapsibleSettings.classList.remove('settings-collapsed');
        collapsibleHeader?.classList.remove('settings-collapsed');
        formGroup?.classList.remove('settings-collapsed-parent');
        if (headerLeft) {
            headerLeft.style.visibility = '';
            headerLeft.style.height = '';
            headerLeft.style.overflow = '';
        }
        if (container) {
            container.style.width = '';
            container.style.maxWidth = '';
            container.style.margin = '';
        }
        if (body) {
            body.style.width = '';
            body.style.minWidth = '';
        }
    }
    
    browser.storage.local.set({ settingsCollapsed });
    
    const highlightInput = document.getElementById('highlightTermsInput');
    if (highlightInput) {
        setTimeout(() => {
            highlightInput.focus();
        }, 50);
    }
}

rightClickToggle.addEventListener('click', async () => {
    const selectedSite = blockSiteSelect.value;
    
    const { rightClickAllowed = [], blockSettings = {}, darkModeSettings = {} } = 
        await browser.storage.local.get(['rightClickAllowed', 'blockSettings', 'darkModeSettings']);
    
    if (rightClickAllowed.includes(selectedSite)) {
        const updated = rightClickAllowed.filter(s => s !== selectedSite);
        await browser.storage.local.set({ rightClickAllowed: updated });
        
        const stillHasSettings = blockSettings[selectedSite] || darkModeSettings[selectedSite];
        
        if (!stillHasSettings) {
            await cleanupUnusedSites();
            
            const tabs = await browser.tabs.query({ active: true, currentWindow: true });
            let currentHost = null;
            if (tabs && tabs[0] && tabs[0].url && !tabs[0].url.startsWith('about:')) {
                const isLocalFile = tabs[0].url.startsWith('file://');
                if (isLocalFile) {
                    currentHost = 'local-files';
                } else {
                    currentHost = extractHost(tabs[0].url);
                }
            }
            
            await loadBlockSites();
            
            if (currentHost) {
                blockSiteSelect.value = currentHost;
                blockSiteSelect.dispatchEvent(new Event('change'));
            }
        } else {
            await loadBlockSites();
            blockSiteSelect.value = selectedSite;
            blockSiteSelect.dispatchEvent(new Event('change'));
        }
        
        rightClickToggle.classList.remove('active');
        document.getElementById('rightClickToggleIcon').textContent = '🖱️';
    } else {
        rightClickAllowed.push(selectedSite);
        await browser.storage.local.set({ rightClickAllowed });
        
        await loadBlockSites();
        blockSiteSelect.value = selectedSite;
        
        rightClickToggle.classList.add('active');
        document.getElementById('rightClickToggleIcon').textContent = '👆';
    }

    await updateRightClickToggle();
    
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (tabs && tabs[0]) {
        browser.tabs.reload(tabs[0].id);
    }
});

blockSiteSelect.addEventListener('change', async () => {
    const selectedSite = blockSiteSelect.value;
    
    await loadBlockSettings();
    await loadDarkSettings();
    
    const { blockSettings = {}, darkModeSettings = {}, rightClickAllowed = [] } = 
        await browser.storage.local.get(['blockSettings', 'darkModeSettings', 'rightClickAllowed']);
    
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    let currentHost = null;
    
    if (tabs && tabs[0] && tabs[0].url && !tabs[0].url.startsWith('about:')) {
        const isLocalFile = tabs[0].url.startsWith('file://');
        if (isLocalFile) {
            currentHost = 'local-files';
        } else {
            currentHost = extractHost(tabs[0].url);
        }
    }
    
    const isCurrentSite = selectedSite === currentHost;
    const siteExists = blockSettings[selectedSite] || darkModeSettings[selectedSite] || rightClickAllowed.includes(selectedSite);
    
    if (!isCurrentSite && !siteExists) {
        siteBlockToggle.disabled = true;
        siteBlockToggle.style.opacity = '0.5';
        siteBlockToggle.style.cursor = 'not-allowed';
        
        siteDarkToggle.disabled = true;
        siteDarkToggle.style.opacity = '0.5';
        siteDarkToggle.style.cursor = 'not-allowed';
        
        rightClickToggle.disabled = true;
        rightClickToggle.style.opacity = '0.5';
        rightClickToggle.style.cursor = 'not-allowed';
        
        return;
    }
    
    siteBlockToggle.disabled = false;
    siteBlockToggle.style.opacity = '1';
    siteBlockToggle.style.cursor = 'pointer';
    
    siteDarkToggle.disabled = false;
    siteDarkToggle.style.opacity = '1';
    siteDarkToggle.style.cursor = 'pointer';
    
    rightClickToggle.disabled = false;
    rightClickToggle.style.opacity = '1';
    rightClickToggle.style.cursor = 'pointer';
    
    if (blockSettings[selectedSite]) {
        siteBlockToggle.classList.add('active');
        document.getElementById('siteBlockToggleIcon').textContent = '🌡';
        siteBlockToggle.style.display = 'inline-block';
    } else {
        siteBlockToggle.classList.remove('active');
        document.getElementById('siteBlockToggleIcon').textContent = '🧪';
        siteBlockToggle.style.display = selectedSite === 'global' || selectedSite === 'local-files' ? 'none' : 'inline-block';
    }
    
    if (darkModeSettings[selectedSite]) {
        siteDarkToggle.classList.add('active');
        document.getElementById('siteDarkToggleIcon').textContent = '☀️';
        siteDarkToggle.style.display = 'inline-block';
        
        siteDarkEnable.style.display = 'inline-block';
        if (darkModeSettings[selectedSite].enabled) {
            siteDarkEnable.classList.add('active');
            siteDarkEnableText.textContent = 'ON';
        } else {
            siteDarkEnable.classList.remove('active');
            siteDarkEnableText.textContent = 'OFF';
        }
        
        await loadDarkSettings();
    } else {
        siteDarkToggle.classList.remove('active');
        document.getElementById('siteDarkToggleIcon').textContent = '🌙';
        siteDarkToggle.style.display = selectedSite === 'global' || selectedSite === 'local-files' ? 'none' : 'inline-block';
        siteDarkEnable.style.display = 'none';
    }
    
    if (rightClickAllowed.includes(selectedSite)) {
        rightClickToggle.classList.add('active');
        document.getElementById('rightClickToggleIcon').textContent = '👆';
        rightClickToggle.style.display = 'inline-block';
    } else {
        rightClickToggle.classList.remove('active');
        document.getElementById('rightClickToggleIcon').textContent = '🖱️';
        rightClickToggle.style.display = selectedSite === 'global' || selectedSite === 'local-files' ? 'none' : 'inline-block';
    }
});

globalToggleBtn.addEventListener('click', async () => {
    const { globalBlockingEnabled = false } = await browser.storage.local.get('globalBlockingEnabled');
    const newValue = !globalBlockingEnabled;
    await browser.storage.local.set({ globalBlockingEnabled: newValue });
    
    if (newValue) {
        globalToggleBtn.classList.add('active');
        globalToggleText.textContent = 'ON';
    } else {
        globalToggleBtn.classList.remove('active');
        globalToggleText.textContent = 'OFF';
    }
});

darkModeToggle.addEventListener('click', async () => {
    const { darkModeEnabled = false } = await browser.storage.local.get('darkModeEnabled');
    const newValue = !darkModeEnabled;
    await browser.storage.local.set({ darkModeEnabled: newValue });
    
    if (newValue) {
        darkModeToggle.classList.add('active');
        darkModeToggleText.textContent = 'ON';
    } else {
        darkModeToggle.classList.remove('active');
        darkModeToggleText.textContent = 'OFF';
    }
});

Object.values(blockCheckboxes).forEach(checkbox => {
    checkbox.addEventListener('change', saveBlockSettings);
});

Object.values(darkModeCheckboxes).forEach(checkbox => {
    checkbox.addEventListener('change', saveDarkSettings);
});

maxTabsToggle.addEventListener('click', async () => {
    const { maxTabsEnabled = false } = await browser.storage.local.get('maxTabsEnabled');
    const newState = !maxTabsEnabled;
    
    await browser.storage.local.set({ maxTabsEnabled: newState });
    
    if (newState) {
        maxTabsToggle.classList.add('active');
        maxTabsToggleText.textContent = 'ON';
    } else {
        maxTabsToggle.classList.remove('active');
        maxTabsToggleText.textContent = 'OFF';
    }

    browser.runtime.sendMessage({action: 'maxTabsSettingsChanged'});
});

document.querySelectorAll('.tab-limit-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        const limit = parseInt(btn.dataset.limit);
        tabsLimit = limit;
        
        document.querySelectorAll('.tab-limit-btn').forEach(b => {
            b.classList.remove('active');
        });
        btn.classList.add('active');
        
        await browser.storage.local.set({ tabsLimit: limit });
        browser.runtime.sendMessage({action: 'maxTabsSettingsChanged'});
        updateTabCount();
    });
});

browser.tabs.onCreated.addListener(() => {
    setTimeout(updateTabCount, 100);
});

browser.tabs.onRemoved.addListener(() => {
    setTimeout(updateTabCount, 100);
});

browser.tabs.onActivated.addListener(async () => {
    await updateSiteBlockButton();
    await updateBlurSiteButton();
    await loadBlurSettingsForCurrentSite();  
});

browser.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
    if (changeInfo.discarded !== undefined || changeInfo.status === 'complete') {
        setTimeout(updateTabCount, 100);
        await updateSiteBlockButton();
        await updateBlurSiteButton();
    }
});

hoverZoomToggle.addEventListener('click', async () => {
    const { hoverZoomEnabled = false } = await browser.storage.local.get('hoverZoomEnabled');
    await browser.storage.local.set({ hoverZoomEnabled: !hoverZoomEnabled });
    await updateHoverZoomToggleUI();
});

exportBtn.addEventListener('click', exportData);

addWhitelistBtn.addEventListener('click', addWhitelist);

whitelistInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addWhitelist();
    }
});

document.getElementById('manualBlockBtn')?.addEventListener('click', async () => {
    const input = document.getElementById('manualBlockInput');
    let site = input.value.trim().toLowerCase();
    
    if (!site) {
        alert('Please enter a site');
        return;
    }
    
    site = site.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    
    if (!site.includes('.')) {
        alert('Please enter a valid domain (e.g., example.com)');
        return;
    }
    
    const { siteBlockTimestamps = {} } = await browser.storage.local.get('siteBlockTimestamps');
    
    if (siteBlockTimestamps[site]) {
        alert(`${site} is already blocked`);
        return;
    }
    
    siteBlockTimestamps[site] = Date.now();
    await browser.storage.local.set({ siteBlockTimestamps });
    
    input.value = '';
    await displayBlockedSites();
    await updateSiteBlockButton();
    
    alert(`🚫 Blocked ${site}`);
});

document.getElementById('manualBlockInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('manualBlockBtn').click();
    }
});

document.getElementById('deleteAllBtn').addEventListener('click', deleteAllData);

document.getElementById('barColorsBtn').addEventListener('click', async () => {
    currentPaletteIndex = (currentPaletteIndex + 1) % colorPalettes.length;
    await savePaletteIndex(currentPaletteIndex);
    await displayData();
});

document.getElementById('joinphotosBtn').addEventListener('click', () => {
    browser.tabs.create({ url: browser.runtime.getURL('joinphotos.html') });
    window.close();
});

document.getElementById('paletteBtn').addEventListener('click', () => {
    browser.tabs.create({ url: browser.runtime.getURL('palettegenerator.html') });
    window.close();
});

document.getElementById('codeSnippetsBtn')?.addEventListener('click', () => {
    browser.tabs.create({ url: browser.runtime.getURL('zoocage.html') });
    window.close();
});

importBtn.addEventListener('click', () => {
    browser.tabs.create({ url: browser.runtime.getURL('popup.html') });
    window.close();
});

document.getElementById('avifGalleryBtn').addEventListener('click', () => {
    browser.tabs.create({ url: browser.runtime.getURL('masonryavif.html') });
    window.close();
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (!targetElement) return;
        
        if (settingsCollapsed) {
            settingsCollapsed = false;
            const collapsibleSettings = document.getElementById('collapsibleSettings');
            const formGroup = collapsibleSettings?.previousElementSibling;
            
            collapsibleSettings?.classList.remove('settings-collapsed');
            formGroup?.classList.remove('settings-collapsed-parent');
            
            browser.storage.local.set({ settingsCollapsed: false });
            
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                focusInputForSection(targetId);
            }, 300);
        } else {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            focusInputForSection(targetId);
        }
    });
});

function focusInputForSection(targetId) {
    if (targetId === 'listsSection') {
        const categoryInput = document.querySelector('#listsSection input[type="text"]');
        if (categoryInput) {
            setTimeout(() => categoryInput.focus(), 300);
        }
    }
    
    if (targetId === 'sinceSection') {
        const sinceInput = document.getElementById('sinceInput');
        if (sinceInput) {
            setTimeout(() => sinceInput.focus(), 300);
        }
    }
    
    if (targetId === 'whitelistSection') {
        const whitelistInput = document.getElementById('whitelistInput');
        if (whitelistInput) {
            setTimeout(() => whitelistInput.focus(), 300);
        }
    }
    
    if (targetId === 'blocklistaddSection') {
        const manualBlockInput = document.getElementById('manualBlockInput');
        if (manualBlockInput) {
            setTimeout(() => manualBlockInput.focus(), 300);
        }
    }
    
    if (targetId === 'calcSection') {
        const valueInput = document.getElementById('value');
        if (valueInput) {
            setTimeout(() => valueInput.focus(), 300);
        }
    }
}

async function loadSincePalette() {
    const { sincePaletteIndex = 0 } = await browser.storage.local.get('sincePaletteIndex');
    currentSincePaletteIndex = sincePaletteIndex;
}

async function saveSincePalette(index) {
    await browser.storage.local.set({ sincePaletteIndex: index });
}

async function loadSinceItems() {
    const { sinceItems = [] } = await browser.storage.local.get('sinceItems');
    displaySinceItems(sinceItems);
}

async function saveSinceItems(items) {
    await browser.storage.local.set({ sinceItems: items });
}

function formatSinceDuration(timestamp) {
    const now = Date.now();
    const elapsed = now - timestamp;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
        return `${days}`;
    } else if (hours > 0) {
        return `${hours}h${minutes % 60}m`;
    } else {
        return `${minutes}m`;
    }
}

function calculateDurationString(startTimestamp, endTimestamp) {
    const elapsed = endTimestamp - startTimestamp;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
        return `${days}`;
    } else if (hours > 0) {
        return `${hours}h${minutes % 60}m`;
    } else {
        return `${minutes}m`;
    }
}

function displaySinceItems(items) {
    const container = document.getElementById('sinceItemsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (items.length === 0) {
        container.innerHTML = '<span style="color: #858585; font-size: 0.85rem;">No activities tracked</span>';
        return;
    }
    
    const colors = monochromeListPalettes[currentSincePaletteIndex];
    
    const sortedItems = [...items].sort((a, b) => {
        const aDuration = Date.now() - a.lastTimestamp;
        const bDuration = Date.now() - b.lastTimestamp;
        return bDuration - aDuration;
    });
    
    sortedItems.forEach((item, index) => {
        const colorIndex = index % colors.length;
        const bgColor = colors[colorIndex];
        const textColor = getContrastColor(bgColor);
        
        const wrapper = document.createElement('span');
        wrapper.className = 'since-item';
        
        const currentDuration = formatSinceDuration(item.lastTimestamp);
        const previousDuration = item.previousDuration || '--';
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'since-item-name';
        nameSpan.style.backgroundColor = bgColor;
        nameSpan.style.color = textColor;
        nameSpan.style.cursor = 'pointer';
        nameSpan.textContent = item.name;
        nameSpan.addEventListener('click', async () => {
            await repeatSinceItem(item.name);
        });
        wrapper.appendChild(nameSpan);
        
        const currentSpan = document.createElement('span');
        currentSpan.className = 'since-current-duration';
        currentSpan.textContent = currentDuration;
        wrapper.appendChild(currentSpan);
        
        const previousSpan = document.createElement('span');
        previousSpan.className = 'since-previous-duration';
        previousSpan.textContent = previousDuration;
        wrapper.appendChild(previousSpan);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'whitelist-remove';
        deleteBtn.style.cssText = 'min-width: auto; padding: 0.25rem 0.35rem;';
        deleteBtn.innerHTML = `<span style="color: #8B1E3F;">×</span>`;
        deleteBtn.addEventListener('click', async () => {
            await deleteSinceItem(item.name);
        });
        wrapper.appendChild(deleteBtn);
        
        container.appendChild(wrapper);
    });
}

async function addSinceItem(name) {
    if (!name.trim()) return;
    
    const { sinceItems = [] } = await browser.storage.local.get('sinceItems');
    
    const existing = sinceItems.find(item => item.name === name);
    if (existing) return;
    
    const newItem = {
        name: name,
        lastTimestamp: Date.now(),
        previousDuration: null
    };
    
    sinceItems.push(newItem);
    await saveSinceItems(sinceItems);
    displaySinceItems(sinceItems);
}

async function repeatSinceItem(name) {
    const { sinceItems = [] } = await browser.storage.local.get('sinceItems');
    
    const item = sinceItems.find(i => i.name === name);
    if (!item) return;
    
    const now = Date.now();
    item.previousDuration = calculateDurationString(item.lastTimestamp, now);
    
    item.lastTimestamp = now;
    
    await saveSinceItems(sinceItems);
    displaySinceItems(sinceItems);
}

async function deleteSinceItem(name) {
    const { sinceItems = [] } = await browser.storage.local.get('sinceItems');
    
    const updated = sinceItems.filter(item => item.name !== name);
    await saveSinceItems(updated);
    displaySinceItems(updated);
}

async function clearAllSinceItems() {
    if (!confirm('Delete all tracked activities?')) return;
    
    await browser.storage.local.set({ sinceItems: [] });
    displaySinceItems([]);
}

document.getElementById('sinceInput')?.addEventListener('keypress', async (e) => {
    if (e.key !== 'Enter') return;
    
    const input = document.getElementById('sinceInput');
    await addSinceItem(input.value.trim());
    input.value = '';
});

document.getElementById('addSinceBtn')?.addEventListener('click', async () => {
    const input = document.getElementById('sinceInput');
    await addSinceItem(input.value.trim());
    input.value = '';
});

document.getElementById('clearAllSinceBtn')?.addEventListener('click', clearAllSinceItems);

document.getElementById('sinceColorsBtn')?.addEventListener('click', async () => {
    currentSincePaletteIndex = (currentSincePaletteIndex + 1) % monochromeListPalettes.length;
    await saveSincePalette(currentSincePaletteIndex);
    
    const { sinceItems = [] } = await browser.storage.local.get('sinceItems');
    displaySinceItems(sinceItems);
    
    const sinceInput = document.getElementById('sinceInput');
    if (sinceInput) {
        setTimeout(() => {
            sinceInput.focus();
        }, 50);
    }
});

document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const host = e.target.dataset.host;
        const type = e.target.dataset.type;
        
        if (type === 'blocked') {
            const { siteBlockTimestamps = {} } = await browser.storage.local.get('siteBlockTimestamps');
            delete siteBlockTimestamps[host];
            await browser.storage.local.set({ siteBlockTimestamps });
            await displayBlockedSites();
        } else {
            deleteHostData(host, type);
        }
    }
    
    if (e.target.classList.contains('whitelist-remove')) {
        const pattern = e.target.dataset.pattern;
        removeWhitelist(pattern);
    }
});

const selectJsonFile = document.getElementById('selectJsonFile');
const jsonFileInput = document.getElementById('jsonFileInput');
const jsonFileName = document.getElementById('jsonFileName');
const importJsonBtn = document.getElementById('importJsonBtn');
const importJsonStatus = document.getElementById('importJsonStatus');

selectJsonFile?.addEventListener('click', () => {
    jsonFileInput.click();
});

jsonFileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        jsonFileName.textContent = file.name;
    } else {
        jsonFileName.textContent = 'No file selected.';
    }
});

importJsonBtn?.addEventListener('click', async () => {
    const file = jsonFileInput.files[0];
    if (!file) {
        importJsonStatus.textContent = 'Please select a file first.';
        importJsonStatus.style.color = 'var(--danger-color)';
        return;
    }

    try {
        const text = await file.text();
        const importedData = JSON.parse(text);
        
        const existingData = await browser.storage.local.get(null);
        
        const mergedData = { ...existingData };
        
        for (const [key, value] of Object.entries(importedData)) {
            if (key === 'lists' && value && typeof value === 'object') {
                const existingLists = existingData.lists || { category1: {}, category2: {} };
                const importedLists = value;
                
                mergedData.lists = {
                    category1: {
                        ...(existingLists.category1 || {}),
                        ...(importedLists.category1 || {})
                    },
                    category2: {
                        ...(existingLists.category2 || {}),
                        ...(importedLists.category2 || {})
                    }
                };
                
                for (const categoryName in importedLists.category1) {
                    if (existingLists.category1?.[categoryName] && Array.isArray(existingLists.category1[categoryName])) {
                        mergedData.lists.category1[categoryName] = [
                            ...new Set([
                                ...(existingLists.category1[categoryName] || []),
                                ...(importedLists.category1[categoryName] || [])
                            ])
                        ];
                    }
                }
                
                for (const categoryName in importedLists.category2) {
                    if (existingLists.category2?.[categoryName] && Array.isArray(existingLists.category2[categoryName])) {
                        mergedData.lists.category2[categoryName] = [
                            ...new Set([
                                ...(existingLists.category2[categoryName] || []),
                                ...(importedLists.category2[categoryName] || [])
                            ])
                        ];
                    }
                }
            }
            else if (key === 'sinceItems' && Array.isArray(value)) {
                const existingSinceItems = existingData.sinceItems || [];
                const importedSinceItems = value;
                
                const existingNames = new Set(existingSinceItems.map(item => item.name));
                
                const newItems = importedSinceItems.filter(item => !existingNames.has(item.name));
                
                mergedData.sinceItems = [...existingSinceItems, ...newItems];
            }
            else if (value && typeof value === 'object' && !Array.isArray(value)) {
                mergedData[key] = {
                    ...(existingData[key] || {}),
                    ...value
                };
            } else if (Array.isArray(value) && Array.isArray(existingData[key])) {
                mergedData[key] = [...new Set([...(existingData[key] || []), ...value])];
            } else {
                mergedData[key] = value;
            }
        }
        
        await browser.storage.local.set(mergedData);
        
        importJsonStatus.textContent = 'Data merged successfully!';
        importJsonStatus.style.color = 'var(--accent-color)';
        
        setTimeout(() => {
            location.reload();
        }, 2000);
    } catch (error) {
        importJsonStatus.textContent = 'Error: ' + error.message;
        importJsonStatus.style.color = 'var(--danger-color)';
    }
});

const markdownImageModeSelect = document.getElementById('markdownImageMode');
const avifColorModeSelect = document.getElementById('avifColorMode');

if (markdownImageModeSelect && avifColorModeSelect) {
    markdownImageModeSelect.addEventListener('change', async () => {
        const showColorMode = markdownImageModeSelect.value === 'avif';
        avifColorModeSelect.style.display = showColorMode ? 'inline-block' : 'none';
        
        await browser.storage.local.set({ 
            markdownImageMode: markdownImageModeSelect.value 
        });
    });

    avifColorModeSelect.addEventListener('change', async () => {
        await browser.storage.local.set({
            avifColorMode: avifColorModeSelect.value
        });
    });

    browser.storage.local.get({
        markdownImageMode: 'avif',
        avifColorMode: 'color'
    }).then((settings) => {
        markdownImageModeSelect.value = settings.markdownImageMode;
        avifColorModeSelect.value = settings.avifColorMode;
        
        if (settings.markdownImageMode === 'avif') {
            avifColorModeSelect.style.display = 'inline-block';
        }
    });
}

document.getElementById('blurBtn')?.addEventListener('click', async () => {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
        browser.tabs.sendMessage(tabs[0].id, { action: 'startBlurPicker' });
        window.close();
    }
});

document.getElementById('clearBlurBtn')?.addEventListener('click', async () => {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (!tabs[0]) return;
    
    const url = tabs[0].url;
    if (!url || url.startsWith('about:') || url.startsWith('moz-extension:')) {
        return;
    }
    
    const host = extractHost(url);
    if (!host) return;
    
    if (!confirm(`Clear all blur overlays for ${host}?`)) {
        return;
    }
    
    const { blurSettings = {} } = await browser.storage.local.get('blurSettings');
    delete blurSettings[host];
    await browser.storage.local.set({ blurSettings });
    
    browser.tabs.sendMessage(tabs[0].id, { action: 'clearAllBlurs' });
    await updateClearButtonStates();
});

document.getElementById('clearZapBtn')?.addEventListener('click', async () => {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (!tabs[0]) return;
    
    const url = tabs[0].url;
    if (!url || url.startsWith('about:') || url.startsWith('moz-extension:')) {
        return;
    }
    
    const host = extractHost(url);
    if (!host) return;
    
    if (!confirm(`Clear all zapped elements for ${host}?`)) {
        return;
    }
    
    const { zapSettings = {} } = await browser.storage.local.get('zapSettings');
    delete zapSettings[host];
    await browser.storage.local.set({ zapSettings });
    
    await updateClearButtonStates();
    location.reload();
});

document.getElementById('editTextBtn')?.addEventListener('click', async () => {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
        browser.tabs.sendMessage(tabs[0].id, { action: 'startEditMode' });
        window.close();
    }
});

document.getElementById('zapBtn')?.addEventListener('click', async () => {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
        browser.tabs.sendMessage(tabs[0].id, { action: 'startZapper' });
        window.close();
    }
});

document.getElementById('invertBtn')?.addEventListener('click', async () => {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
        browser.tabs.sendMessage(tabs[0].id, { action: 'startInvert' });
        window.close();
    }
});

document.getElementById('clearInvertBtn')?.addEventListener('click', async () => {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (!tabs[0]) return;
    
    const url = tabs[0].url;
    if (!url || url.startsWith('about:') || url.startsWith('moz-extension:')) {
        return;
    }
    
    const host = extractHost(url);
    if (!host) return;
    
    if (!confirm(`Clear all inverted elements for ${host}?`)) {
        return;
    }
    
    const { invertSettings = {} } = await browser.storage.local.get('invertSettings');
    delete invertSettings[host];
    await browser.storage.local.set({ invertSettings });
    
    await updateClearButtonStates();
    browser.tabs.reload(tabs[0].id);
});

document.getElementById('invertParentBtn')?.addEventListener('click', async () => {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
        browser.tabs.sendMessage(tabs[0].id, { action: 'startInvertParent' });
        window.close();
    }
});

document.getElementById('clearInvertParentBtn')?.addEventListener('click', async () => {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (!tabs[0]) return;
    
    const url = tabs[0].url;
    if (!url || url.startsWith('about:') || url.startsWith('moz-extension:')) {
        return;
    }
    
    const host = extractHost(url);
    if (!host) return;
    
    if (!confirm(`Clear all parent-inverted elements for ${host}?`)) {
        return;
    }
    
    const { invertParentSettings = {} } = await browser.storage.local.get('invertParentSettings');
    delete invertParentSettings[host];
    await browser.storage.local.set({ invertParentSettings });
    
    browser.tabs.sendMessage(tabs[0].id, { action: 'clearAllInvertParents' });
    browser.tabs.reload(tabs[0].id);

    await updateClearButtonStates();
});

document.getElementById('toggleZeroBrowsing')?.addEventListener('click', async () => {
    showZeroBrowsing = !showZeroBrowsing;
    const btn = document.getElementById('toggleZeroBrowsing');
    
    if (showZeroBrowsing) {
        btn.classList.add('active');
        btn.textContent = '0%';
        btn.title = 'Hide 0%';
    } else {
        btn.classList.remove('active');
        btn.textContent = '0%';
        btn.title = 'Show 0%';
    }
    
    await displayData();
});

document.getElementById('toggleZeroMedia')?.addEventListener('click', async () => {
    showZeroMedia = !showZeroMedia;
    const btn = document.getElementById('toggleZeroMedia');
    
    if (showZeroMedia) {
        btn.classList.add('active');
        btn.textContent = '0%';
        btn.title = 'Hide 0%';
    } else {
        btn.classList.remove('active');
        btn.textContent = '0%';
        btn.title = 'Show 0%';
    }
    
    await displayData();
});

periodSelect.addEventListener('change', async () => {
    await savePeriod(periodSelect.value);
    await displayData();
});

document.getElementById('highlightTermsInput')?.addEventListener('keypress', async (e) => {
    if (e.key !== 'Enter') return;
    
    const input = document.getElementById('highlightTermsInput');
    await addHighlightTerms(input.value.trim());
    input.value = '';
});

document.getElementById('addHighlightBtn')?.addEventListener('click', async () => {
    const input = document.getElementById('highlightTermsInput');
    await addHighlightTerms(input.value.trim());
    input.value = '';
});

document.getElementById('clearHighlightsBtn')?.addEventListener('click', async () => {
    await browser.storage.local.set({ highlightTerms: [] });
    displayHighlightTerms([]);
    
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
        browser.tabs.sendMessage(tabs[0].id, {
            action: 'clearHighlights'
        });
    }
});

document.getElementById('highlightColorsBtn')?.addEventListener('click', async () => {
    currentHighlightPaletteIndex = (currentHighlightPaletteIndex + 1) % colorPalettes.length;
    await saveHighlightPalette(currentHighlightPaletteIndex);
    updateHighlightPaletteNumber();
    
    const { highlightTerms = [], diacriticsEnabled = true } = 
        await browser.storage.local.get(['highlightTerms', 'diacriticsEnabled']);
    
    displayHighlightTerms(highlightTerms);
    
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (tabs[0] && highlightTerms.length > 0) {
        const colors = colorPalettes[currentHighlightPaletteIndex];
        browser.tabs.sendMessage(tabs[0].id, {
            action: 'highlightMultipleTerms',
            terms: highlightTerms,
            colors: colors,
            diacriticsEnabled: diacriticsEnabled,
            cjkMode: cjkEnabled
        });
    }
});

document.getElementById('highlightToggle')?.addEventListener('click', async () => {
    highlightEnabled = !highlightEnabled;
    await saveHighlightEnabled(highlightEnabled);
    
    const toggle = document.getElementById('highlightToggle');
    const toggleText = document.getElementById('highlightToggleText');
    
    if (highlightEnabled) {
        toggle.classList.add('active');
        toggleText.textContent = 'ON';
        
        const { highlightTerms = [] } = await browser.storage.local.get('highlightTerms');
        if (highlightTerms.length > 0) {
            const tabs = await browser.tabs.query({ active: true, currentWindow: true });
            if (tabs[0]) {
                const colors = colorPalettes[currentHighlightPaletteIndex];
                await browser.tabs.sendMessage(tabs[0].id, {
                    action: 'highlightMultipleTerms',
                    terms: highlightTerms,
                    colors: colors
                });
                
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        displayHighlightTerms(highlightTerms);
    } else {
        toggle.classList.remove('active');
        toggleText.textContent = 'OFF';
        
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        if (tabs[0]) {
            browser.tabs.sendMessage(tabs[0].id, {
                action: 'clearHighlights'
            });
        }
        
        const { highlightTerms = [] } = await browser.storage.local.get('highlightTerms');
        displayHighlightTerms(highlightTerms);
    }
});

document.getElementById('diacriticsToggle')?.addEventListener('click', async () => {
    diacriticsEnabled = !diacriticsEnabled;
    await browser.storage.local.set({ diacriticsEnabled: diacriticsEnabled });
    
    const toggle = document.getElementById('diacriticsToggle');
    const toggleText = document.getElementById('diacriticsToggleText');
    
    if (diacriticsEnabled) {
        toggle.classList.add('active');
        toggleText.textContent = 'üb';
        toggle.title = 'Diacritics: ON (strict matching)';
    } else {
        toggle.classList.remove('active');
        toggleText.textContent = 'ub';
        toggle.title = 'Diacritics: OFF (loose matching)';
    }
    
    const { highlightEnabled = false, highlightTerms = [] } = 
        await browser.storage.local.get(['highlightEnabled', 'highlightTerms']);
    
    if (highlightEnabled && highlightTerms.length > 0) {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        if (tabs[0]) {
            const colors = colorPalettes[currentHighlightPaletteIndex];
            await browser.tabs.sendMessage(tabs[0].id, {
                action: 'highlightMultipleTerms',
                terms: highlightTerms,
                colors: colors,
                diacriticsEnabled: diacriticsEnabled,
                cjkMode: cjkEnabled
            });
        }
    }
});

setTimeout(updateImportJsonSection, 200);
window.addEventListener('resize', updateImportJsonSection);

browser.storage.onChanged.addListener((changes) => {
    if (changes.globalBlockingEnabled) {
        const { globalBlockingEnabled } = changes.globalBlockingEnabled;
        if (globalBlockingEnabled.newValue) {
            globalToggleBtn.classList.add('active');
            globalToggleText.textContent = 'ON';
        } else {
            globalToggleBtn.classList.remove('active');
            globalToggleText.textContent = 'OFF';
        }
    }
    if (changes.darkModeEnabled) {
        const { darkModeEnabled } = changes.darkModeEnabled;
        if (darkModeEnabled.newValue) {
            darkModeToggle.classList.add('active');
            darkModeToggleText.textContent = 'ON';
        } else {
            darkModeToggle.classList.remove('active');
            darkModeToggleText.textContent = 'OFF';
        }
    }
    if (changes.hoverZoomEnabled) {
        updateHoverZoomToggleUI();
    }
});

document.querySelectorAll('.pin-calc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        browser.tabs.create({ 
            url: browser.runtime.getURL('popup.html')
        });
        window.close();
    });
});

const youtubeCheckboxes = {
    hideRecommended: document.getElementById('hideRecommended'),
    hideShorts: document.getElementById('hideShorts'),
    hideComments: document.getElementById('hideComments'),
    hideExplore: document.getElementById('hideExplore'),
    hideMoreFromYoutube: document.getElementById('hideMoreFromYoutube'),
    disableAutoplay: document.getElementById('disableAutoplay'),
    hideEndCards: document.getElementById('hideEndCards'),
};

const defaultQualitySelect = document.getElementById('defaultQuality');

async function loadYouTubeSettings() {
    const { youtubeSettings = {} } = await browser.storage.local.get('youtubeSettings');
    
    const defaults = {
        defaultQuality: '360p',
        hideRecommended: false,
        hideShorts: false,
        hideComments: false,
        hideExplore: false,
        hideMoreFromYoutube: false,
        disableAutoplay: false,
        hideEndCards: false,
    };
    
    const settings = { ...defaults, ...youtubeSettings };
    
    Object.keys(youtubeCheckboxes).forEach(key => {
        if (youtubeCheckboxes[key]) {
            youtubeCheckboxes[key].checked = settings[key] || false;
        }
    });
    
    if (defaultQualitySelect) {
        defaultQualitySelect.value = settings.defaultQuality || '360p';
    }
}

async function saveYouTubeSettings() {
    const newSettings = {
        defaultQuality: defaultQualitySelect.value,
        hideRecommended: youtubeCheckboxes.hideRecommended.checked,
        hideShorts: youtubeCheckboxes.hideShorts.checked,
        hideComments: youtubeCheckboxes.hideComments.checked,
        hideExplore: youtubeCheckboxes.hideExplore.checked,
        hideMoreFromYoutube: youtubeCheckboxes.hideMoreFromYoutube.checked,
        disableAutoplay: youtubeCheckboxes.disableAutoplay.checked,
        hideEndCards: youtubeCheckboxes.hideEndCards.checked,
    };
    
    await browser.storage.local.set({ youtubeSettings: newSettings });
}

Object.values(youtubeCheckboxes).forEach(checkbox => {
    if (checkbox) {
        checkbox.addEventListener('change', saveYouTubeSettings);
    }
});

if (defaultQualitySelect) {
    defaultQualitySelect.addEventListener('change', saveYouTubeSettings);
}

async function displayBlockedSites() {
    const container = document.getElementById('blockedSitesList');
    if (!container) return;
    
    const { siteBlockTimestamps = {} } = await browser.storage.local.get('siteBlockTimestamps');
    
    const sites = Object.keys(siteBlockTimestamps);
    
    if (sites.length === 0) {
        container.innerHTML = '<div class="empty-message">No blocked sites</div>';
        return;
    }
    
    const now = Date.now();
    container.innerHTML = '';
    
    sites.forEach(site => {
        const timestamp = siteBlockTimestamps[site];
        const blockedMs = now - timestamp;
        const blockedHours = Math.floor(blockedMs / (1000 * 60 * 60));
        const blockedMinutes = Math.floor((blockedMs % (1000 * 60 * 60)) / (1000 * 60));
        const blockedDays = Math.floor(blockedHours / 24);
        const remainingHours = blockedHours % 24;
        
        let timeBlocked;
        if (blockedDays > 0) {
            timeBlocked = `${blockedDays}d ${remainingHours}h`;
        } else if (blockedHours > 0) {
            timeBlocked = `${blockedHours}h ${blockedMinutes}m`;
        } else {
            timeBlocked = `${blockedMinutes}m`;
        }
        
        const item = document.createElement('div');
        item.className = 'site-item';
        item.innerHTML = `
            <div class="site-info-stacked">
                <div class="site-stacked-left">
                    <div class="site-row-top">
                        <span class="site-name-stacked">${site}</span>
                    </div>
                    <div class="site-row-bottom">
                        <span style="color: var(--accent-color); font-size: 0.9rem;">${timeBlocked}</span>
                    </div>
                </div>
                <button class="delete-btn" data-host="${site}" data-type="blocked">×</button>
            </div>
        `;
        container.appendChild(item);
    });
}

async function loadListPalette() {
    const { listPaletteIndex = 0 } = await browser.storage.local.get('listPaletteIndex');
    currentListPaletteIndex = listPaletteIndex;
}

async function saveListPalette(index) {
    await browser.storage.local.set({ listPaletteIndex: index });
}

async function loadLists() {
    const { lists = { category1: {}, category2: {} } } = await browser.storage.local.get('lists');
    displayListCategories(lists);
}

async function saveLists(lists) {
    await browser.storage.local.set({ lists });
}

function updateListThemeLabels() {
    const topLabel = document.querySelector('#listCategory1 h4');
    const bottomLabel = document.querySelector('#listCategory2 h4');
    
    if (topLabel) {
        topLabel.innerHTML = `<span style="color: var(--accent-color);">Top</span> <span style="color: var(--text-secondary); font-size: 0.65rem;">palette ${currentListCategoryPaletteIndex + 1}</span>`;
    }
}

function updateListItemThemeLabel() {
    const itemsLabel = document.getElementById('currentListName');
    if (itemsLabel && currentListCategory) {
        itemsLabel.innerHTML = `<span style="color: var(--accent-color); font-size: 1.2rem; font-weight: 600;">${currentListCategory}</span> <span style="color: var(--text-secondary); font-size: 0.65rem;">palette ${currentListPaletteIndex + 1}</span>`;
    }
}

function displayListCategories(lists) {
    const container1 = document.getElementById('listCategory1Container');
    const container2 = document.getElementById('listCategory2Container');
    
    container1.innerHTML = '';
    container2.innerHTML = '';
    
    const colors = colorPalettes[currentListCategoryPaletteIndex];
    const reversedColors = [...colors].reverse();
    
    const sortedCat1 = Object.keys(lists.category1 || {}).sort(naturalSort);
    const sortedCat2 = Object.keys(lists.category2 || {}).sort(naturalSort);
    
    sortedCat1.forEach((categoryName, index) => {
        const colorIndex = index % colors.length;
        createCategoryTag(container1, categoryName, 'category1', colors[colorIndex], lists);
    });
    
    sortedCat2.forEach((categoryName, index) => {
        const colorIndex = index % reversedColors.length;
        createCategoryTag(container2, categoryName, 'category2', reversedColors[colorIndex], lists);
    });
    
    if (sortedCat1.length === 0) {
        container1.innerHTML = '<span style="color: #858585; font-size: 0.85rem;">No categories</span>';
    }
    
    if (sortedCat2.length === 0) {
        container2.innerHTML = '<span style="color: #858585; font-size: 0.85rem;">No categories</span>';
    }
    
    updateListThemeLabels();
}

function createCategoryTag(container, categoryName, categoryKey, color, lists) {
    const wrapper = document.createElement('span');
    wrapper.className = 'list-category-tag';
    
    const tag = document.createElement('span');
    tag.className = 'list-category-name';
    tag.style.backgroundColor = color;
    tag.style.color = getContrastColor(color);
    tag.textContent = categoryName;
    
    tag.addEventListener('click', () => {
        openListItems(categoryName, categoryKey, lists);
    });
    
    wrapper.appendChild(tag);
    
    const itemCount = lists[categoryKey][categoryName]?.length || 0;
    
    if (itemCount > 0) {
        const countSpan = document.createElement('span');
        countSpan.className = 'list-item-count';
        countSpan.textContent = itemCount;
        wrapper.appendChild(countSpan);
    }
    
    if (categoryKey === 'category1') {
        const moveBtn = document.createElement('button');
        moveBtn.className = 'whitelist-remove';
        moveBtn.style.cssText = 'min-width: auto; padding: 0.25rem 0.35rem;';
        moveBtn.innerHTML = `<span style="color: #A67F5A;">↓</span>`;
        moveBtn.title = 'Move to Bottom';
        
        moveBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            await moveCategory(categoryName, 'category1', 'category2');
        });
        
        wrapper.appendChild(moveBtn);
    } else {
        const moveUpBtn = document.createElement('button');
        moveUpBtn.className = 'whitelist-remove';
        moveUpBtn.style.cssText = 'min-width: auto; padding: 0.25rem 0.35rem;';
        moveUpBtn.innerHTML = `<span style="color: #4D94FF;">↑</span>`;
        moveUpBtn.title = 'Move to Top';
        
        moveUpBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            await moveCategory(categoryName, 'category2', 'category1');
        });
        
        wrapper.appendChild(moveUpBtn);
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'whitelist-remove';
        removeBtn.style.cssText = 'min-width: auto; padding: 0.25rem 0.25rem; color: #ff3f3f;';
        removeBtn.textContent = '×';
        removeBtn.title = 'Remove term';
        
        removeBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            await deleteCategory(categoryName, categoryKey);
        });
        
        wrapper.appendChild(removeBtn);
    }
    
    container.appendChild(wrapper);
}

async function moveCategory(categoryName, fromKey, toKey) {
    const { lists = { category1: {}, category2: {} } } = await browser.storage.local.get('lists');
    
    if (!lists[fromKey] || !lists[fromKey][categoryName]) return;
    
    lists[toKey][categoryName] = lists[fromKey][categoryName];
    delete lists[fromKey][categoryName];
    
    await saveLists(lists);
    displayListCategories(lists);
    
    if (currentListKey === fromKey && currentListCategory === categoryName) {
        closeListItemsSection();
    }
}

async function deleteCategory(categoryName, categoryKey) {    
    const { lists = { category1: {}, category2: {} } } = await browser.storage.local.get('lists');
    
    if (lists[categoryKey] && lists[categoryKey][categoryName]) {
        delete lists[categoryKey][categoryName];
    }
    
    await saveLists(lists);
    displayListCategories(lists);
    
    if (currentListKey === categoryKey && currentListCategory === categoryName) {
        closeListItemsSection();
    }
}

async function addListCategory(categoryName) {
    if (!categoryName.trim()) return;
    
    const { lists = { category1: {}, category2: {} } } = await browser.storage.local.get('lists');
    
    if (!lists.category1[categoryName]) {
        lists.category1[categoryName] = [];
    }
    
    await saveLists(lists);
    
    const updatedLists = (await browser.storage.local.get('lists')).lists;
    displayListCategories(updatedLists);
}

function openListItems(categoryName, categoryKey, lists) {
    currentListCategory = categoryName;
    currentListKey = categoryKey;
    
    const section = document.getElementById('listItemsSection');
    section.style.display = 'block';
    
    const items = lists[categoryKey][categoryName] || [];
    displayListItems(items);
    updateListItemThemeLabel();
    
    document.getElementById('listItemInput').focus();
}

function closeListItemsSection() {
    const section = document.getElementById('listItemsSection');
    section.style.display = 'none';
    currentListCategory = null;
    currentListKey = null;
    document.getElementById('listItemInput').value = '';
}

function displayListItems(items) {
    const container = document.getElementById('listItemsContainer');
    container.innerHTML = '';
    
    if (items.length === 0) {
        container.innerHTML = '<span style="color: #858585; font-size: 0.85rem;">No items</span>';
        return;
    }
    
    const colors = monochromeListPalettes[currentListPaletteIndex];
    const sortedItems = [...items].sort(naturalSort);
    
    sortedItems.forEach((item, index) => {
        const colorIndex = index % colors.length;
        const bgColor = colors[colorIndex];
        
        const wrapper = document.createElement('span');
        wrapper.className = 'list-item-tag';
        
        const tag = document.createElement('span');
        tag.className = 'list-item-name';
        tag.style.backgroundColor = bgColor;
        tag.style.color = getContrastColor(bgColor);
        tag.textContent = item;
        
        wrapper.appendChild(tag);
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'whitelist-remove';
        removeBtn.style.cssText = 'min-width: auto; padding: 0.25rem 0.35rem;';
        removeBtn.innerHTML = `<span style="color: #8B1E3F;">×</span>`;
        removeBtn.title = 'Remove item';
        
        removeBtn.addEventListener('click', async () => {
            await removeListItem(item);
        });
        
        wrapper.appendChild(removeBtn);
        container.appendChild(wrapper);
    });
}

async function addListItem(itemName) {
    if (!itemName.trim() || !currentListCategory || !currentListKey) return;
    
    const { lists = { category1: {}, category2: {} } } = await browser.storage.local.get('lists');
    
    if (!lists[currentListKey][currentListCategory]) {
        lists[currentListKey][currentListCategory] = [];
    }
    
    if (!lists[currentListKey][currentListCategory].includes(itemName)) {
        lists[currentListKey][currentListCategory].push(itemName);
    }
    
    await saveLists(lists);
    
    const updatedLists = (await browser.storage.local.get('lists')).lists;
    displayListItems(updatedLists[currentListKey][currentListCategory]);
    
    displayListCategories(updatedLists);
}

async function removeListItem(itemName) {
    if (!currentListCategory || !currentListKey) return;
    
    const { lists = { category1: {}, category2: {} } } = await browser.storage.local.get('lists');
    
    if (lists[currentListKey][currentListCategory]) {
        lists[currentListKey][currentListCategory] = lists[currentListKey][currentListCategory].filter(item => item !== itemName);
    }
    
    await saveLists(lists);
    
    const updatedLists = (await browser.storage.local.get('lists')).lists;
    displayListItems(updatedLists[currentListKey][currentListCategory]);
    
    displayListCategories(updatedLists);
}

async function clearAllLists() {
    if (!confirm('Delete all categories and items?')) return;
    
    await browser.storage.local.set({ lists: { category1: {}, category2: {} } });
    displayListCategories({ category1: {}, category2: {} });
    closeListItemsSection();
}

function naturalSort(a, b) {
    const ax = [];
    const bx = [];
    
    a.replace(/(\d+)|(\D+)/g, (_, num, str) => {
        ax.push([num || 0, str || '']);
    });
    b.replace(/(\d+)|(\D+)/g, (_, num, str) => {
        bx.push([num || 0, str || '']);
    });
    
    while (ax.length && bx.length) {
        const an = ax.shift();
        const bn = bx.shift();
        const nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
        if (nn) return nn;
    }
    
    return ax.length - bx.length;
}

async function loadListCategoryPalette() {
    const { listCategoryPaletteIndex = 0 } = await browser.storage.local.get('listCategoryPaletteIndex');
    currentListCategoryPaletteIndex = listCategoryPaletteIndex;
}

async function saveListCategoryPalette(index) {
    await browser.storage.local.set({ listCategoryPaletteIndex: index });
}

const grayscaleToggle = document.getElementById('grayscaleToggle');

browser.storage.local.get('grayscaleEnabled').then(result => {
    if (result.grayscaleEnabled) {
        grayscaleToggle.textContent = '🧬';
        grayscaleToggle.style.background = '#7a7a7a';
        grayscaleToggle.title = 'Grayscale: Turn OFF';
    } else {
        grayscaleToggle.textContent = '👓';
        grayscaleToggle.style.background = '#2e2e2e';
        grayscaleToggle.title = 'Grayscale: Turn ON';
    }
});

grayscaleToggle.addEventListener('click', async () => {
    const { grayscaleEnabled = false } = 
        await browser.storage.local.get('grayscaleEnabled');
    
    const newState = !grayscaleEnabled;
    await browser.storage.local.set({ grayscaleEnabled: newState });
    
    if (newState) {
        grayscaleToggle.textContent = '🧬';
        grayscaleToggle.style.background = '#7a7a7a';
        grayscaleToggle.title = 'Grayscale: Turn OFF';
    } else {
        grayscaleToggle.textContent = '👓';
        grayscaleToggle.style.background = '#2e2e2e';
        grayscaleToggle.title = 'Grayscale: Turn ON';
    }
});

const refreshBtn = document.getElementById('refreshBtn');

refreshBtn.addEventListener('click', async () => {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
        browser.tabs.reload(tabs[0].id);
    }
});

browser.storage.local.get(['cjkEnabled']).then(result => {
    cjkEnabled = result.cjkEnabled || false;
    updateCJKButton();
});

document.getElementById('toggleCJK').addEventListener('click', async () => {
    cjkEnabled = !cjkEnabled;
    
    if (cjkEnabled && !diacriticsEnabled) {
        diacriticsEnabled = true;
        await browser.storage.local.set({ diacriticsEnabled: true });
        
        const diacriticsToggle = document.getElementById('diacriticsToggle');
        const diacriticsToggleText = document.getElementById('diacriticsToggleText');
        diacriticsToggle.classList.add('active');
        diacriticsToggleText.textContent = 'üb';
        diacriticsToggle.title = 'Diacritics: ON (strict matching)';
    }
    
    await browser.storage.local.set({ cjkEnabled });
    updateCJKButton();
    
    const { highlightEnabled = false, highlightTerms = [] } = 
        await browser.storage.local.get(['highlightEnabled', 'highlightTerms']);
    
    if (highlightEnabled && highlightTerms.length > 0) {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        if (tabs[0]) {
            const colors = colorPalettes[currentHighlightPaletteIndex];
            await browser.tabs.sendMessage(tabs[0].id, {
                action: 'highlightMultipleTerms',
                terms: highlightTerms,
                colors: colors,
                diacriticsEnabled: diacriticsEnabled,
                cjkMode: cjkEnabled
            });
        }
    }
});

function updateCJKButton() {
    const btn = document.getElementById('toggleCJK');
    const btnText = document.getElementById('toggleCJKText');
    if (cjkEnabled) {
        btn.classList.add('active');
        btn.style.background = '#4F1B91';
        btn.style.color = 'white';
        btn.title = 'CJK Mode: ON';
        btnText.textContent = '\u4E2D\u65E5\u97D3'; // 中日韓
    } else {
        btn.classList.remove('active');
        btn.style.background = '';
        btn.style.color = '';
        btn.title = 'CJK Mode: OFF (Chinese/Japanese/Korean/Arabic) or show partial term only)';
        btnText.textContent = '\u4E2D\u65E5\u97D3'; // 中日韓
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const port = browser.runtime.connect({ name: 'popup' });
    
    await new Promise(resolve => {
        port.onMessage.addListener((msg) => {
            if (msg.updated) resolve();
        });
        setTimeout(resolve, 100);
    });
    
    const { globalBlockingEnabled = false, darkModeEnabled = false } = 
        await browser.storage.local.get(['globalBlockingEnabled', 'darkModeEnabled']);
    
    if (globalBlockingEnabled) {
        globalToggleBtn.classList.add('active');
        globalToggleText.textContent = 'ON';
    } else {
        globalToggleBtn.classList.remove('active');
        globalToggleText.textContent = 'OFF';
    }
    
    if (darkModeEnabled) {
        darkModeToggle.classList.add('active');
        darkModeToggleText.textContent = 'ON';
    } else {
        darkModeToggle.classList.remove('active');
        darkModeToggleText.textContent = 'OFF';
    }
    
    await loadPeriod();
    await displayData();
    await loadWhitelist();
    await loadBlockSites();
    await loadBlockSettings();
    await loadDarkSettings(); 
    await updateBlockToggle();
    await updateDarkToggle();
    await updateRightClickToggle();
    await loadMaxTabsSettings();
    await updateHoverZoomToggleUI();
    await updateClearButtonStates();
    await loadHighlightPalette();
    await loadHighlightTerms();
    await loadHighlightEnabled();
    await loadDiacriticsEnabled();
    await refreshHighlightCounts();
    await updateSiteBlockButton();
    await updateBlurSiteButton();
    await loadYouTubeSettings();
    await displayBlockedSites();
    await loadPaletteIndex();
    await loadListPalette();
    await loadListCategoryPalette();
    await loadBlurSettingsForCurrentSite();
    await loadLists();
    await loadSincePalette();
    await loadSinceItems();
    
    const highlightInput = document.getElementById('highlightTermsInput');
    if (highlightInput) {
        highlightInput.focus();
    }
});

document.getElementById('listCategoryInput')?.addEventListener('keypress', async (e) => {
    if (e.key !== 'Enter') return;
    
    const input = document.getElementById('listCategoryInput');
    await addListCategory(input.value.trim());
    input.value = '';
});

document.getElementById('addListCategoryBtn')?.addEventListener('click', async () => {
    const input = document.getElementById('listCategoryInput');
    await addListCategory(input.value.trim());
    input.value = '';
});

document.getElementById('clearAllListsBtn')?.addEventListener('click', clearAllLists);

document.getElementById('listCategoryColorsBtn')?.addEventListener('click', async () => {
    currentListCategoryPaletteIndex = (currentListCategoryPaletteIndex + 1) % colorPalettes.length;
    await saveListCategoryPalette(currentListCategoryPaletteIndex);
    
    const { lists = { category1: {}, category2: {} } } = await browser.storage.local.get('lists');
    displayListCategories(lists);
    
    const categoryInput = document.querySelector('#listsSection input[type="text"]');
    if (categoryInput) {
        setTimeout(() => {
            categoryInput.focus();
        }, 50);
    }
});

document.getElementById('listItemColorsBtn')?.addEventListener('click', async () => {
    currentListPaletteIndex = (currentListPaletteIndex + 1) % monochromeListPalettes.length;
    await saveListPalette(currentListPaletteIndex);
    
    if (currentListCategory && currentListKey) {
        const { lists = { category1: {}, category2: {} } } = await browser.storage.local.get('lists');
        displayListItems(lists[currentListKey][currentListCategory] || []);
        updateListItemThemeLabel();
    }
    
    const listItemInput = document.getElementById('listItemInput');
    if (listItemInput) {
        setTimeout(() => {
            listItemInput.focus();
        }, 50);
    }
});

    setInterval(async () => {
        const { sinceItems = [] } = await browser.storage.local.get('sinceItems');
        if (sinceItems.length > 0) {
            displaySinceItems(sinceItems);
        }
    }, 60000); 

document.getElementById('listItemInput')?.addEventListener('keypress', async (e) => {
    if (e.key !== 'Enter') return;
    
    const input = document.getElementById('listItemInput');
    await addListItem(input.value.trim());
    input.value = '';
});

function applyCollapsedStyles() {
    const headerLeft = document.querySelector('.header-left');
    const container = document.querySelector('.container');
    const body = document.body;
    const highlightHeader = document.getElementById('collapsibleHighlightHeader');
    
    if (headerLeft) {
        headerLeft.style.visibility = 'hidden';
        headerLeft.style.height = '0';
        headerLeft.style.overflow = 'hidden';
    }
    
    if (highlightHeader) {
        highlightHeader.style.display = 'none';
    }
    
    if (container) {
        container.style.width = '100vw';
        container.style.maxWidth = '100vw';
        container.style.margin = '0 0';
    }
    if (body) {
        body.style.width = '100vw';
        body.style.minWidth = '100vw';
    }
}

function removeCollapsedStyles() {
    const headerLeft = document.querySelector('.header-left');
    const container = document.querySelector('.container');
    const body = document.body;
    const highlightHeader = document.getElementById('collapsibleHighlightHeader');
    
    if (headerLeft) {
        headerLeft.style.visibility = '';
        headerLeft.style.height = '';
        headerLeft.style.overflow = '';
    }
    
    if (highlightHeader) {
        highlightHeader.style.display = '';
    }
    
    if (container) {
        container.style.width = '';
        container.style.maxWidth = '';
        container.style.margin = '';
    }
    if (body) {
        body.style.width = '';
        body.style.minWidth = '';
    }
}

function toggleSettingsCollapse() {
    settingsCollapsed = !settingsCollapsed;
    
    if (settingsCollapsed) {
        document.getElementById('collapsibleSettings')?.classList.add('settings-collapsed');
        applyCollapsedStyles();
    } else {
        document.getElementById('collapsibleSettings')?.classList.remove('settings-collapsed');
        removeCollapsedStyles();
    }
    
    browser.storage.local.set({ settingsCollapsed });
}

document.getElementById('collapseToggle')?.addEventListener('click', toggleSettingsCollapse);

browser.storage.local.get('settingsCollapsed').then(result => {
    if (result.settingsCollapsed) {
        settingsCollapsed = true;
        document.getElementById('collapsibleSettings')?.classList.add('settings-collapsed');
        applyCollapsedStyles(); 
    }
});

document.getElementById('closeListItems')?.addEventListener('click', closeListItemsSection);
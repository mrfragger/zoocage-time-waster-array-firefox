(function() {
    'use strict';

    let blurEnabled = false;
    let currentHost = null;
    let styleElement = null;
    let imageBlur = 8;
    let videoBlur = 20;
    let invertImages = false;

    function extractHost(url) {
        try {
            return new URL(url).hostname;
        } catch (e) {
            return null;
        }
    }

    function applyBlur() {
        if (styleElement) {
            styleElement.remove();
        }
    
        styleElement = document.createElement('style');
        styleElement.id = 'zoocage-blur-images-videos';
        
        const invertFilter = invertImages ? ' invert(1) hue-rotate(180deg)' : '';
        
        styleElement.textContent = `
            img:not(.zoocage-no-blur),
            img[src]:not(.zoocage-no-blur),
            canvas:not(.zoocage-no-blur),
            picture:not(.zoocage-no-blur),
            picture img:not(.zoocage-no-blur) {
                filter: blur(${imageBlur}px)${invertFilter} !important;
                -webkit-filter: blur(${imageBlur}px)${invertFilter} !important;
            }
            
            video:not(.zoocage-no-blur),
            video[src]:not(.zoocage-no-blur) {
                filter: blur(${videoBlur}px)${invertFilter} !important;
                -webkit-filter: blur(${videoBlur}px)${invertFilter} !important;
            }
            
            /* Handle background images on divs that might contain images */
            [style*="background-image"]:not(.zoocage-no-blur) {
                filter: blur(${imageBlur}px)${invertFilter} !important;
                -webkit-filter: blur(${imageBlur}px)${invertFilter} !important;
            }
            
            /* GitHub specific - avatar images */
            .avatar:not(.zoocage-no-blur),
            .avatar-user:not(.zoocage-no-blur) {
                filter: blur(${imageBlur}px)${invertFilter} !important;
                -webkit-filter: blur(${imageBlur}px)${invertFilter} !important;
            }
        `;
        
        if (document.head) {
            document.head.appendChild(styleElement);
        } else {
            const observer = new MutationObserver(() => {
                if (document.head) {
                    observer.disconnect();
                    document.head.appendChild(styleElement);
                }
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
        }
    }

    function removeBlur() {
        if (styleElement && styleElement.parentNode) {
            styleElement.parentNode.removeChild(styleElement);
            styleElement = null;
        }
        
        document.querySelectorAll('#zoocage-blur-images-videos').forEach(el => el.remove());
        
        document.querySelectorAll('video, img, canvas, picture, [style*="background-image"], .avatar, .avatar-user').forEach(el => {
            el.style.filter = '';
            el.style.webkitFilter = '';
        });
    }

    async function checkIfBlurEnabled() {
        currentHost = extractHost(window.location.href);
        if (!currentHost) return;

        const { blurSiteList = [], blurSettings = {} } = 
            await browser.storage.local.get(['blurSiteList', 'blurSettings']);
        
        blurEnabled = blurSiteList.includes(currentHost);

        if (blurEnabled) {
            const hostSettings = blurSettings[currentHost] || { imageBlur: 8, videoBlur: 20, invertImages: false };
            imageBlur = hostSettings.imageBlur;
            videoBlur = hostSettings.videoBlur;
            invertImages = hostSettings.invertImages || false;
            applyBlur();
        } else {
            removeBlur();
            imageBlur = 8;
            videoBlur = 20;
            invertImages = false;
        }
    }

    browser.runtime.onMessage.addListener((message) => {
        if (message.action === 'toggleBlur') {
            blurEnabled = message.enabled;
            
            if (blurEnabled) {
                if (message.imageBlur !== undefined) {
                    imageBlur = message.imageBlur;
                    videoBlur = message.videoBlur;
                    invertImages = message.invertImages || false;
                }
                applyBlur();
            } else {
                blurEnabled = false;
                removeBlur();
                imageBlur = 8;
                videoBlur = 20;
                invertImages = false;
            }
            return Promise.resolve({ success: true });
        }
        
        if (message.action === 'updateBlurAmount') {
            imageBlur = message.imageBlur;
            videoBlur = message.videoBlur;
            invertImages = message.invertImages || false;
            if (blurEnabled) {
                applyBlur();
            }
            return Promise.resolve({ success: true });
        }
    });

    browser.storage.onChanged.addListener((changes) => {
        if (changes.blurSiteList) {
            checkIfBlurEnabled();
        }
        if (changes.blurSettings && blurEnabled) {
            const hostSettings = changes.blurSettings.newValue[currentHost];
            if (hostSettings) {
                imageBlur = hostSettings.imageBlur;
                videoBlur = hostSettings.videoBlur;
                invertImages = hostSettings.invertImages || false;
                applyBlur();
            }
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkIfBlurEnabled);
    } else {
        checkIfBlurEnabled();
    }
})();
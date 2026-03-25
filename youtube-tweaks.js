(function () {
  "use strict";

  let settings = {
    defaultQuality: "auto",
    hideRecommended: false,
    hideShorts: false,
    hideComments: false,
    hideExplore: false,
    hideMoreFromYoutube: false,
    disableAutoplay: false,
    hideEndCards: false,
  };

  let styleElements = {};
  let lastUrl = null;
  let autoplayObserver = null;

  const qualityMap = {
    auto: "Auto",
    "144p": "tiny",
    "240p": "small",
    "360p": "medium",
    "480p": "large",
    "720p": "hd720",
    "1080p": "hd1080",
    "1440p": "hd1440",
    "2160p": "hd2160",
  };

  function appendScriptToDOM(scriptText) {
    const script = document.createElement("script");
    script.textContent = scriptText;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
  }

  function initQualityScript(quality) {
    const scriptText = `
          class YTQuality {
              constructor(defaultQuality) {
                  this.defaultQuality = defaultQuality || 'medium';
                  this.player = null;
              }

              init() {
                  this.waitForPlayer();
                  this.observeNavigation();
              }

              waitForPlayer() {
                  const checkPlayer = setInterval(() => {
                      this.player = document.querySelector('.html5-video-player');
                      if (this.player && typeof this.player.getAvailableQualityLevels === 'function') {
                          const levels = this.player.getAvailableQualityLevels();
                          if (levels && levels.length > 0) {
                              clearInterval(checkPlayer);
                              this.updatePlayerQuality();
                          }
                      }
                  }, 500);
                  setTimeout(() => clearInterval(checkPlayer), 30000);
              }

              observeNavigation() {
                  document.addEventListener('yt-navigate-finish', () => {
                      setTimeout(() => this.waitForPlayer(), 500);
                  });
              }

              setQuality(quality) {
                  this.defaultQuality = quality;
                  this.updatePlayerQuality();
              }

              updatePlayerQuality() {
                  if (!this.player) {
                      this.player = document.querySelector('.html5-video-player');
                  }
                  if (this.player) {
                      try {
                          if (typeof this.player.setPlaybackQualityRange === 'function') {
                              this.player.setPlaybackQualityRange(this.defaultQuality, this.defaultQuality);
                          }
                          if (typeof this.player.setPlaybackQuality === 'function') {
                              this.player.setPlaybackQuality(this.defaultQuality);
                          }
                      } catch (ex) {}
                  }
              }
          }

          if (!window.ytQuality) {
              window.ytQuality = new YTQuality('${quality}');
              window.ytQuality.init();
          }
      `;
    appendScriptToDOM(scriptText);
  }

  function applyDarkSearchFilters() {
    if (!styleElements.darkFilters) {
      const style = document.createElement("style");
      style.id = "zoocage-dark-filters";
      style.textContent = `
              /* Search filter dialog */
              ytd-search-filter-options-dialog-renderer,
              tp-yt-paper-dialog,
              tp-yt-paper-dialog .dialog-container,
              ytd-search-filter-group-renderer,
              ytd-search-filter-renderer {
                  background-color: #1a1a1a !important;
                  color: #e0e0e0 !important;
              }

              ytd-search-filter-options-dialog-renderer .title,
              ytd-search-filter-group-renderer .filter-group-name,
              ytd-search-filter-group-renderer .title {
                  color: #e0e0e0 !important;
              }

              ytd-search-filter-renderer a,
              ytd-search-filter-renderer .filter-label,
              ytd-search-filter-renderer .simpleText,
              ytd-search-filter-renderer yt-formatted-string {
                  color: #b0b0b0 !important;
              }

              ytd-search-filter-renderer a:hover,
              ytd-search-filter-renderer a:hover yt-formatted-string {
                  color: #ffffff !important;
              }

              /* Selected/active filter */
              ytd-search-filter-renderer[is-selected] yt-formatted-string,
              ytd-search-filter-renderer[aria-selected="true"] yt-formatted-string {
                  color: #3ea6ff !important;
              }

              /* Dialog backdrop */
              tp-yt-paper-dialog-scrollable {
                  background-color: #1a1a1a !important;
              }

              /* Dividers */
              ytd-search-filter-group-renderer #separator,
              ytd-search-filter-options-dialog-renderer .separator {
                  border-color: #333 !important;
              }
          `;
      (document.head || document.documentElement).appendChild(style);
      styleElements.darkFilters = style;
    }
  }

  function updatePlayerQuality() {
    appendScriptToDOM(
      "if (window.ytQuality) { window.ytQuality.updatePlayerQuality(); }",
    );
  }

  function setQuality(quality) {
    appendScriptToDOM(
      `if (window.ytQuality) { window.ytQuality.setQuality('${quality}'); }`,
    );
  }

  async function loadSettings() {
    const result = await browser.storage.local.get("youtubeSettings");
    if (result.youtubeSettings) {
      settings = { ...settings, ...result.youtubeSettings };
    }
    applySettings();
  }

  function applySettings() {
    applyHideRecommended();
    applyHideShorts();
    applyHideComments();
    applyHideExplore();
    applyHideMoreFromYoutube();
    applyDisableAutoplay();
    applyHideEndCards();
    applyDarkSearchFilters();

    const quality = qualityMap[settings.defaultQuality] || "medium";
    initQualityScript(quality);

    const anyOptionChecked =
      settings.hideRecommended ||
      settings.hideShorts ||
      settings.hideComments ||
      settings.hideExplore ||
      settings.hideMoreFromYoutube ||
      settings.disableAutoplay ||
      settings.hideEndCards;

    if (!anyOptionChecked) {
      setTimeout(() => updatePlayerQuality(), 2000);
    }
  }

  function applyHideRecommended() {
    if (settings.hideRecommended) {
      if (!styleElements.recommended) {
        const style = document.createElement("style");
        style.id = "zoocage-hide-recommended";
        style.textContent = `
                    ytd-watch-next-secondary-results-renderer,
                    #related,
                    #secondary,
                    ytd-compact-video-renderer,
                    ytd-shelf-renderer {
                        display: none !important;
                    }
                `;
        (document.head || document.documentElement).appendChild(style);
        styleElements.recommended = style;
      }
    } else {
      if (styleElements.recommended) {
        styleElements.recommended.remove();
        delete styleElements.recommended;
      }
    }
  }

  function applyHideShorts() {
    if (settings.hideShorts) {
      if (!styleElements.shorts) {
        const style = document.createElement("style");
        style.id = "zoocage-hide-shorts";
        style.textContent = `
                    ytd-reel-shelf-renderer,
                    ytd-guide-entry-renderer a[title="Shorts"],
                    ytd-mini-guide-entry-renderer[aria-label="Shorts"],
                    [is-shorts],
                    a[href*="/shorts/"],
                    ytd-rich-shelf-renderer[is-shorts],
                    tp-yt-paper-tab a[href="/shorts"],
                    yt-tab-shape[tab-title="Shorts"] {
                        display: none !important;
                    }
                `;
        (document.head || document.documentElement).appendChild(style);
        styleElements.shorts = style;
      }
    } else {
      if (styleElements.shorts) {
        styleElements.shorts.remove();
        delete styleElements.shorts;
      }
    }
  }

  function applyHideComments() {
    if (settings.hideComments) {
      if (!styleElements.comments) {
        const style = document.createElement("style");
        style.id = "zoocage-hide-comments";
        style.textContent = `
                    ytd-comments,
                    #comments,
                    ytd-item-section-renderer#sections:has(#comments) {
                        display: none !important;
                    }
                `;
        (document.head || document.documentElement).appendChild(style);
        styleElements.comments = style;
      }
    } else {
      if (styleElements.comments) {
        styleElements.comments.remove();
        delete styleElements.comments;
      }
    }
  }

  function applyHideExplore() {
    if (settings.hideExplore) {
      if (!styleElements.explore) {
        const style = document.createElement("style");
        style.id = "zoocage-hide-explore";
        style.textContent = `
                    ytd-guide-section-renderer:has(ytd-guide-entry-renderer a[title="Trending"]),
                    ytd-guide-section-renderer:has(ytd-guide-entry-renderer a[title="Shopping"]),
                    ytd-guide-entry-renderer:has(a[title="Trending"]),
                    ytd-guide-entry-renderer:has(a[title="Shopping"]),
                    ytd-guide-entry-renderer:has(a[title="Music"]),
                    ytd-guide-entry-renderer:has(a[title="Movies & TV"]),
                    ytd-guide-entry-renderer:has(a[title="Movies"]) {
                        display: none !important;
                    }
                `;
        (document.head || document.documentElement).appendChild(style);
        styleElements.explore = style;
      }
    } else {
      if (styleElements.explore) {
        styleElements.explore.remove();
        delete styleElements.explore;
      }
    }
  }

  function applyHideMoreFromYoutube() {
    if (settings.hideMoreFromYoutube) {
      if (!styleElements.more) {
        const style = document.createElement("style");
        style.id = "zoocage-hide-more";
        style.textContent = `
                    ytd-guide-section-renderer:has(ytd-guide-entry-renderer a[title="YouTube Premium"]),
                    ytd-guide-section-renderer:has(ytd-guide-entry-renderer a[title="YouTube TV"]),
                    ytd-guide-section-renderer:has(ytd-guide-entry-renderer a[title="YouTube Music"]),
                    ytd-guide-section-renderer:has(ytd-guide-entry-renderer a[title="YouTube Kids"]),
                    ytd-guide-collapsible-section-entry-renderer,
                    ytd-guide-entry-renderer:has(a[title="YouTube Premium"]),
                    ytd-guide-entry-renderer:has(a[title="YouTube TV"]),
                    ytd-guide-entry-renderer:has(a[title="YouTube Music"]),
                    ytd-guide-entry-renderer:has(a[title="YouTube Kids"]),
                    ytd-guide-entry-renderer:has(a[title="YouTube Studio"]),
                    ytd-guide-entry-renderer:has(a[title="YouTube Creator Academy"]) {
                        display: none !important;
                    }
                `;
        (document.head || document.documentElement).appendChild(style);
        styleElements.more = style;
      }
    } else {
      if (styleElements.more) {
        styleElements.more.remove();
        delete styleElements.more;
      }
    }
  }

  function applyHideEndCards() {
    if (settings.hideEndCards) {
      if (!styleElements.endcards) {
        const style = document.createElement("style");
        style.id = "zoocage-hide-endcards";
        style.textContent = `
                    .ytp-ce-element,
                    .ytp-cards-teaser,
                    .ytp-ce-covering-overlay,
                    .ytp-ce-element-show,
                    .ytp-ce-covering-image,
                    .ytp-ce-expanding-image,
                    .ytp-ce-element.ytp-ce-video-image-element,
                    .ytp-ce-element.ytp-ce-channel-this-video-element,
                    .ytp-pause-overlay,
                    .ytp-endscreen-content,
                    .ytp-ce-video,
                    .ytp-ce-playlist,
                    .ytp-ce-website,
                    .ytp-ce-channel,
                    .html5-endscreen,
                    .ytp-ce-shadow,
                    .ytp-ce-size-1280,
                    .ytp-ce-top-left-quad,
                    .ytp-ce-top-right-quad,
                    .ytp-ce-bottom-left-quad,
                    .ytp-ce-bottom-right-quad,
                    .ytp-cards-button,
                    .ytp-cards-teaser-box,
                    .ytp-suggestion-set {
                        display: none !important;
                        visibility: hidden !important;
                        opacity: 0 !important;
                        pointer-events: none !important;
                    }
                `;
        (document.head || document.documentElement).appendChild(style);
        styleElements.endcards = style;
      }

      if (!window.endcardsObserver) {
        const removeEndCards = () => {
          const endCardSelectors = [
            ".ytp-ce-element",
            ".ytp-endscreen-content",
            ".html5-endscreen",
            ".ytp-ce-covering-overlay",
            ".ytp-pause-overlay",
            ".ytp-cards-teaser",
            ".ytp-suggestion-set",
          ];

          endCardSelectors.forEach((selector) => {
            document.querySelectorAll(selector).forEach((el) => {
              el.remove();
            });
          });
        };

        removeEndCards();

        window.endcardsObserver = new MutationObserver(() => {
          removeEndCards();
        });

        const checkPlayer = setInterval(() => {
          const player = document.querySelector(".html5-video-player");
          if (player) {
            clearInterval(checkPlayer);
            window.endcardsObserver.observe(player, {
              childList: true,
              subtree: true,
            });
            setInterval(removeEndCards, 1000);
          }
        }, 500);

        setTimeout(() => clearInterval(checkPlayer), 10000);
      }
    } else {
      if (styleElements.endcards) {
        styleElements.endcards.remove();
        delete styleElements.endcards;
      }

      if (window.endcardsObserver) {
        window.endcardsObserver.disconnect();
        window.endcardsObserver = null;
      }
    }
  }

  function applyDisableAutoplay() {
    if (autoplayObserver) {
      autoplayObserver.disconnect();
      autoplayObserver = null;
    }

    if (!settings.disableAutoplay) {
      return;
    }

    const checkAutoplay = () => {
      const autoplayButton = document.querySelector(
        ".ytp-autonav-toggle-button",
      );
      if (autoplayButton) {
        const isEnabled =
          autoplayButton.getAttribute("aria-checked") === "true";
        if (isEnabled) {
          autoplayButton.click();
        }
      }
    };

    setTimeout(checkAutoplay, 2000);

    const attachObserver = () => {
      const player =
        document.querySelector("#movie_player") ||
        document.querySelector(".html5-video-player");
      if (player) {
        autoplayObserver = new MutationObserver(() => {
          setTimeout(checkAutoplay, 500);
        });
        autoplayObserver.observe(player, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["aria-checked"],
        });
      } else {
        setTimeout(attachObserver, 1000);
      }
    };

    attachObserver();
  }

  function areSameVideo(previousUrl, newUrl) {
    try {
      const getSearchWithoutT = (url) => {
        const { search } = new URL(url);
        const params = new URLSearchParams(search);
        params.delete("t");
        return params.toString();
      };
      return getSearchWithoutT(previousUrl) === getSearchWithoutT(newUrl);
    } catch (e) {
      return false;
    }
  }

  const urlObserver = new MutationObserver(() => {
    const currentUrl = window.location.href;
    if (lastUrl !== currentUrl) {
      if (lastUrl && areSameVideo(lastUrl, currentUrl)) {
        lastUrl = currentUrl;
        return;
      }
      lastUrl = currentUrl;
      setTimeout(() => {
        updatePlayerQuality();
        if (settings.disableAutoplay) {
          applyDisableAutoplay();
        }
      }, 1000);
    }
  });

  if (document.body) {
    urlObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  } else {
    const bodyObserver = new MutationObserver(() => {
      if (document.body) {
        bodyObserver.disconnect();
        urlObserver.observe(document.body, {
          childList: true,
          subtree: true,
        });
      }
    });
    bodyObserver.observe(document.documentElement, { childList: true });
  }

  browser.storage.onChanged.addListener((changes) => {
    if (changes.youtubeSettings) {
      const newSettings = changes.youtubeSettings.newValue;
      const oldSettings = settings;
      settings = { ...settings, ...newSettings };

      if (oldSettings.hideRecommended !== settings.hideRecommended) {
        applyHideRecommended();
      }
      if (oldSettings.hideShorts !== settings.hideShorts) {
        applyHideShorts();
      }
      if (oldSettings.hideComments !== settings.hideComments) {
        applyHideComments();
      }
      if (oldSettings.hideExplore !== settings.hideExplore) {
        applyHideExplore();
      }
      if (oldSettings.hideMoreFromYoutube !== settings.hideMoreFromYoutube) {
        applyHideMoreFromYoutube();
      }
      if (oldSettings.disableAutoplay !== settings.disableAutoplay) {
        applyDisableAutoplay();
      }
      if (oldSettings.hideEndCards !== settings.hideEndCards) {
        applyHideEndCards();
      }
      if (oldSettings.defaultQuality !== settings.defaultQuality) {
        const quality = qualityMap[settings.defaultQuality] || "medium";
        setQuality(quality);
      }
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadSettings);
  } else {
    loadSettings();
  }
})();

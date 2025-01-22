function applySettings(tabId) {
    chrome.storage.local.get([`disableComments_${tabId}`, `disableSecondary_${tabId}`], (settings) => {
        chrome.scripting.executeScript({
            target: { tabId },
            func: (settings, tabId) => {
                const disableComments = settings[`disableComments_${tabId}`];
                const disableSecondary = settings[`disableSecondary_${tabId}`];

                const openTheatreMode = (isDisabled) => {
                    if (isDisabled) {
                        const theatreButton = document.querySelector(".ytp-size-button");

                        console.log(theatreButton);

                        if (theatreButton) {
                            theatreButton.click();
                        }
                    }
                }

                const handleComments = () => {
                    const comments = document.querySelector("ytd-comments#comments.ytd-watch-flexy");

                    if (comments) {
                        console.log("Comment section found");
                        comments.style.display = disableComments ? "none" : "block";
                        openTheatreMode(disableComments);
                        commentsObserver.disconnect();
                    } else {
                        console.log("Comment section not found");
                    }
                };

                const handleSecondary = () => {
                    const secondary = document.querySelector("div#items.ytd-watch-next-secondary-results-renderer");

                    if (secondary) {
                        console.log("Secondary section found");
                        secondary.style.display = disableSecondary ? "none" : "block";
                        openTheatreMode(disableSecondary);
                        secondaryObserver.disconnect();
                    } else {
                        console.log("Secondary section not found");
                    }
                };

                const commentsObserver = new MutationObserver(handleComments);
                const secondaryObserver = new MutationObserver(handleSecondary);

                handleComments();
                handleSecondary();

                if (!document.querySelector("ytd-comments#comments.ytd-watch-flexy")) {
                    const commentsContainer = document.querySelector("ytd-page-manager");

                    if (commentsContainer) {
                        commentsObserver.observe(commentsContainer, {
                            childList: true,
                            subtree: true
                        });
                    }
                }

                if (!document.querySelector("div#items.ytd-watch-next-secondary-results-renderer")) {
                    const secondaryContainer = document.querySelector("ytd-page-manager");

                    if (secondaryContainer) {
                        secondaryObserver.observe(secondaryContainer, {
                            childList: true,
                            subtree: true
                        });
                    }
                }

                window.addEventListener('unload', () => {
                    commentsObserver.disconnect();
                    secondaryObserver.disconnect();
                });
            },
            args: [settings, tabId]
        });
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "applySettings") {
        applySettings(message.tabId);
    }
});

chrome.webNavigation.onCompleted.addListener((details) => {
    if (details.url
        && details.frameType === "outermost_frame"
        && details.url.startsWith("https://www.youtube.com/watch")) {
        applySettings(details.tabId);
    }
}, { url: [{ hostContains: "youtube.com" }] });

chrome.tabs.onRemoved.addListener((tabId) => {
    chrome.storage.local.remove([`disableComments_${tabId}`, `disableSecondary_${tabId}`]);
});
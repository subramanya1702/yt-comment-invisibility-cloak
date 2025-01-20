const disableCommentsCheckbox = document.getElementById("disable-comments");
const disableSecondaryCheckbox = document.getElementById("disable-secondary");

document.addEventListener("DOMContentLoaded", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0].id;

        chrome.storage.local.get([`disableComments_${tabId}`, `disableSecondary_${tabId}`], (data) => {
            disableCommentsCheckbox.checked = data[`disableComments_${tabId}`] || false;
            disableSecondaryCheckbox.checked = data[`disableSecondary_${tabId}`] || false;
        });
    });
});

disableCommentsCheckbox.addEventListener("change", () => {
    const disableComments = disableCommentsCheckbox.checked;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0].id;

        chrome.storage.local.set({ [`disableComments_${tabId}`]: disableComments });
        chrome.runtime.sendMessage({ action: "applySettings", tabId });
    });
});

disableSecondaryCheckbox.addEventListener("change", () => {
    const disableSecondary = disableSecondaryCheckbox.checked;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0].id;

        chrome.storage.local.set({ [`disableSecondary_${tabId}`]: disableSecondary });
        chrome.runtime.sendMessage({ action: "applySettings", tabId });
    });
});

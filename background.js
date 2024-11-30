chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "OFF",
    });
});

function disableCommentSection(nextState) {
    const youtubeCommentSection = document.querySelector('ytd-item-section-renderer#sections.ytd-comments');

    console.log(youtubeCommentSection);

    if (youtubeCommentSection !== undefined || youtubeCommentSection !== null) {
        if (nextState === 'ON') {
            youtubeCommentSection.style.display = 'none';
            console.log('Comment section hidden');
        } else {
            youtubeCommentSection.style.display = 'block';
            console.log('Comment section visible');
        }
    } else {
        console.log('Unable to hide comment section. Tag not found!');
    }
}

chrome.action.onClicked.addListener(async (tab) => {
    console.log(tab);

    if (tab.url.startsWith('https://www.youtube.com/watch')) {
        const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
        const nextState = prevState === 'ON' ? 'OFF' : 'ON';

        await chrome.action.setBadgeText({
            tabId: tab.id,
            text: nextState,
        });

        console.log(`Changed badge text. Next state: ${nextState}`);

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: disableCommentSection,
            args: [nextState]
        });
    }
});
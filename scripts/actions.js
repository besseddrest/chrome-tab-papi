export function deleteTabs(tabs, name, window) {
    chrome.tabs
        .remove(tabs)
        .then(() => console.log(`Papi closed all ${name} tabs in ${window}`));
}

export function openInNewWindow(tabId) {
    chrome.windows.create(
        createData: tabId
    )
}

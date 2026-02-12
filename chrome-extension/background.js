// Background service worker for the Chrome extension

chrome.runtime.onInstalled.addListener(() => {
  console.log('Resume Tailor extension installed');
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getJobUrl') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      sendResponse({ url: tabs[0].url });
    });
    return true; // Keep the message channel open for async response
  }
});

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  chrome.tabs.sendMessage(details.tabId, {
    type: "navigation",
  }, () => {
    if (chrome.runtime.lastError) {
      // We need to handle 
      console.warn("Error sending message:", chrome.runtime.lastError.message);
    } else {
      console.log("Message successfully received by content script.");
    }
  });

}, { url: [{ hostSuffix: "github.com" }] })

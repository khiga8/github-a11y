chrome.webNavigation.onHistoryStateUpdated.addListener(
  function (details) {
    console.log("onHistoryStateUpdated", details);
    chrome.tabs.sendMessage(details.tabId, {
      type: "navigation",
    });
  },
  { url: [{ hostSuffix: "github.com" }] }
);

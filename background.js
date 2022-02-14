chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
  chrome.tabs.executeScript(details.tabId,{file:"contentScript.js"});
}, {url: [{hostEquals: 'github.com'}]});

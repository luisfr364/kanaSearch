chrome.runtime.onStartup.addListener(() => {
  console.log(`onStartup()`);
});

chrome.commands.onCommand.addListener(function (commands) {
  if (commands === "capture-screen") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, function (dataUrl) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "capture-screen",
          dataUrl,
        });
      });
    });
  }
});

chrome.runtime.onMessage.addListener(async function (
  message,
  sender,
  sendResponse
) {
  if (message.type === "recognized-text") {
    sendResponse({ status: "ok" });

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "side-panel-open",
        url: `https://jisho.org/search/${message.text}`,
      });
    });
  }
});

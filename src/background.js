chrome.runtime.onStartup.addListener(() => {
  console.log(`onStartup()`);
});

chrome.commands.onCommand.addListener(function (commands) {
  if (commands === "capture-screen") {
    chrome.tabs.captureVisibleTab(
      null,
      { format: "png", quality: 99 },
      function (dataUrl) {
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
              type: "captured-screen",
              dataUrl,
            });
          }
        );
      }
    );
  }
});

chrome.runtime.onMessage.addListener(async function (
  message,
  sender,
  sendResponse
) {
  if (message.type === "recognized-text") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "side-panel-open",
        text: message.text,
      });
    });
  }
});

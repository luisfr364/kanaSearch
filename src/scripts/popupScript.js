const configBtn = document.getElementById("configBtn");
const closeBtn = document.getElementById("closeBtn");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

searchBtn.addEventListener("click", openSidePanelOnActivetab);

configBtn.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

closeBtn.addEventListener("click", () => {
  window.close();
});

function openSidePanelOnActivetab() {
  if (searchInput.value) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "side-panel-open",
        text: searchInput.value,
      });
    });
  }

  window.close();
}

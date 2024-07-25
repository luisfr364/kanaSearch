const configBtn = document.getElementById("configBtn");
const closeBtn = document.getElementById("closeBtn");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

if (searchBtn) {
  searchBtn.addEventListener("click", openSidePanelOnActivetab);
}

if (configBtn) {
  configBtn.addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });
}

function openSidePanelOnActivetab() {
  if (searchInput.value) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "side-panel-open",
        url: `https://jisho.org/search/${searchInput.value}`,
      });
    });
  }

  window.close();
}

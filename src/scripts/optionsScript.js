const optionsForm = document.getElementById("options-form");
const dictUrlInput = document.getElementById("item__input--dictUrl");

const dictionaryUrlObj = await chrome.storage.local.get("dictionaryUrl");

if (dictionaryUrlObj.dictionaryUrl) {
  dictUrlInput.setAttribute("placeholder", dictionaryUrlObj.dictionaryUrl);
}

dictUrlInput.addEventListener("change", (e) => {
  chrome.storage.local.set({
    dictionaryUrl: e.target.value,
  });
});

optionsForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (dictUrlInput.value.length > 10) {
    const dictionaryUrlInputValue = dictUrlInput.value;
    chrome.storage.local.set({
      dictionaryUrl: dictionaryUrlInputValue,
    });
    alert("Settings applied");
  }
});

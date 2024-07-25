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

  const dictionaryUrlInputValue = dictUrlInput.value;
  console.log(dictionaryUrlInputValue, "sent");

  chrome.storage.local.set({
    dictionaryUrl: dictionaryUrlInputValue,
  });
});

const setNewPrice = document.getElementById("setNewPrice");
const saveRemainingPAX = document.getElementById("saveRemainingPAX");
const ecoRemainingPAX = document.getElementById("ecoRemainingPAX");
const businessRemainingPAX = document.getElementById("businessRemainingPAX");
const firstRemainingPAX = document.getElementById("firstRemainingPAX");
const cargoRemainingPAX = document.getElementById("cargoRemainingPAX");
const lineSaved = document.getElementById("lineSaved");
const goToPlanning = document.getElementById("goToPlanning");
const goToPricing = document.getElementById("goToPricing");
const goToBurdigala = document.getElementById("goToBurdigala");
const goToNectar = document.getElementById("goToNectar");

function refreshUI(data) {
  if (!data) return;

  ecoRemainingPAX.value = data.ecoPAX || 0;
  businessRemainingPAX.value = data.businessPAX || 0;
  firstRemainingPAX.value = data.firstPAX || 0;
  cargoRemainingPAX.value = data.cargoPAX || 0;
  lineSaved.innerHTML = `(Last line saved : <strong>${data.line})</strong>`;
}

chrome.storage.sync.get(["priceFinder"], function(data) {
  const priceFinder = data.priceFinder;
  refreshUI(priceFinder);
});

chrome.storage.onChanged.addListener(function(changes) {
  if (changes && changes.priceFinder && changes.priceFinder.newValue) {
    refreshUI(changes.priceFinder.newValue);
  }
});

saveRemainingPAX.onclick = function(element) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: "getRemainingPAX" });
  });
};

setNewPrice.onclick = function(element) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: "setNewPrice" });
  });
};

function goTo(newUrl) {
  chrome.tabs.query({ currentWindow: true, active: true }, function(tab) {
    chrome.tabs.update(tab.id, { url: newUrl });
  });
}

goToPlanning.onclick = function() {
  goTo("https://www.airlines-manager.com/network/planning");
};

goToPricing.onclick = function() {
  chrome.storage.sync.set({ goToSelectedLine: true });
  goTo("https://www.airlines-manager.com/marketing/pricing/?airport=0");
};

goToBurdigala.onclick = function() {
  goTo("https://www.airlines-manager.com/company/profile/airline/77516");
};

goToNectar.onclick = function() {
  goTo("https://www.airlines-manager.com/alliance/profile/9046");
};

function onChangeInput(key, newValue) {
  chrome.storage.sync.get(["priceFinder"], function(data) {
    const priceFinder = data.priceFinder;
    chrome.storage.sync.set(
      {
        priceFinder: {
          ...priceFinder,
          [key]: newValue
        }
      },
      function() {}
    );
  });
}

ecoRemainingPAX.onchange = function(element) {
  onChangeInput("ecoPAX", element.target.valueAsNumber);
};

businessRemainingPAX.onchange = function(element) {
  onChangeInput("businessPAX", element.target.valueAsNumber);
};

firstRemainingPAX.onchange = function(element) {
  onChangeInput("firstPAX", element.target.valueAsNumber);
};

cargoRemainingPAX.onchange = function(element) {
  onChangeInput("cargoPAX", element.target.valueAsNumber);
};

const ECO = 0;
const BUSINESS = 1;
const FIRST = 2;
const CARGO = 3;

const AUDIT = "box1";
const NOW = "box2";
const INFO = 0;
const INPUT = 1;

function getNumberOnString(string) {
  return parseInt(string.replace(/[^\d]/g, ""));
}

function getAuditPrice(index) {
  return getNumberOnString(
    document
      .getElementsByClassName(AUDIT)
      [INFO].getElementsByClassName("price")[index].innerText
  );
}

function getAuditDemands(index) {
  return getNumberOnString(
    document
      .getElementsByClassName(AUDIT)
      [INFO].getElementsByClassName("demand")[index].innerText
  );
}

function getNowDemands(index) {
  return getNumberOnString(
    document.getElementsByClassName(NOW)[INFO].getElementsByClassName("demand")[
      index
    ].innerText
  );
}

function setInput(index, value) {
  document.getElementsByClassName(NOW)[INPUT].getElementsByTagName("input")[
    index
  ].value = value;
}

function calculNewPrice(index, remainingDemands) {
  const auditPrice = getAuditPrice(index);
  const auditDemands = getAuditDemands(index);
  const nowDemands = getNowDemands(index);

  if (auditDemands <= 0) return null;

  const calcul =
    ((auditDemands - nowDemands + remainingDemands) / auditDemands / 3) *
      auditPrice +
    auditPrice;

  return Math.floor(calcul);
}

function setNewPrice() {
  chrome.storage.sync.get(["priceFinder"], function(data) {
    const remainingDemands = data.priceFinder;
    const newEcoPrice = calculNewPrice(ECO, remainingDemands.ecoPAX);
    const newBusinessPrice = calculNewPrice(
      BUSINESS,
      remainingDemands.businessPAX
    );
    const newFirstPrice = calculNewPrice(FIRST, remainingDemands.firstPAX);
    const newCargoPrice = calculNewPrice(CARGO, remainingDemands.cargoPAX);

    if (newEcoPrice) setInput(ECO, newEcoPrice);
    if (newBusinessPrice) setInput(BUSINESS, newBusinessPrice);
    if (newFirstPrice) setInput(FIRST, newFirstPrice);
    if (newCargoPrice) setInput(CARGO, newCargoPrice);
  });
}

chrome.runtime.onMessage.addListener(function(message, sender, callback) {
  switch (message.type) {
    case "setNewPrice":
      setNewPrice();
      break;
  }
});

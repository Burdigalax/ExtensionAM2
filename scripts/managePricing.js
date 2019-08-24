const ECO = 0;
const BUSINESS = 1;
const FIRST = 2;
const CARGO = 3;

const AUDIT = "box1";
const NOW = "box2";
const INFO = 0;
const INPUT = 1;

// function parseInt(x) {
//   x = Number(x);
//   return x >= 0 ? Math.floor(x) : Math.ceil(x);
// }
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

  const calcul =
    ((auditDemands - nowDemands + remainingDemands) / auditDemands / 3) *
      auditPrice +
    auditPrice;

  return Math.round(calcul);
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

    setInput(ECO, newEcoPrice);
    setInput(BUSINESS, newBusinessPrice);
    setInput(FIRST, newFirstPrice);
    setInput(CARGO, newCargoPrice);
  });
}

chrome.runtime.onMessage.addListener(function(message, sender, callback) {
  switch (message.type) {
    case "setNewPrice":
      setNewPrice();
      break;
  }
});

function getPAX(index) {
  return parseInt(
    document.getElementById("demandDay0").children[index].innerHTML
  );
}

function getLine() {
  const lineSelected =
    document.getElementsByClassName("lineListSelected")[0].innerText || "";
  return lineSelected.substring(0, lineSelected.indexOf("-") - 1);
}

chrome.runtime.onMessage.addListener(function(message, sender, callback) {
  switch (message.type) {
    case "getRemainingPAX":
      chrome.storage.sync.set(
        {
          priceFinder: {
            ecoPAX: getPAX(1),
            businessPAX: getPAX(2),
            firstPAX: getPAX(3),
            cargoPAX: getPAX(4),
            line: getLine()
          }
        },
        function() {}
      );
      break;
  }
});

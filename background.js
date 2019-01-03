function getOcModeFromResult(result) {
  return Object.keys(result).length ? result['ocMode'] : true;
}

function boolToOnOff(arg) {
  return arg ? "ON" : "OFF";
}

function setText(ocMode) {
  chrome.browserAction.setBadgeText({'text': boolToOnOff(ocMode)});
}

chrome.storage.local.get(['ocMode'], function(result) {
  ocMode = getOcModeFromResult(result);
  setText(ocMode);
});

chrome.browserAction.onClicked.addListener(function() {
  chrome.storage.local.get(['ocMode'], function(result) {
    newOcMode = !getOcModeFromResult(result);
    chrome.storage.local.set({'ocMode': newOcMode},function() {
      setText(newOcMode);
    });
  });
});



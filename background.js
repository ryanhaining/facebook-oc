function colorForMode(ocMode) {
  return ocMode ? "green" : "darkred";
}

function setColor(ocMode) {
  chrome.browserAction.setBadgeBackgroundColor({color: colorForMode(ocMode)});
}

function boolToOnOff(arg) {
  return arg ? " ON" : "OFF";
}

function setText(ocMode) {
  chrome.browserAction.setBadgeText({'text': boolToOnOff(ocMode)});
}

function updateBadge(ocMode) {
  setText(ocMode);
  setColor(ocMode);
}


function getOcModeFromResult(result) {
  return Object.keys(result).length ? result['ocMode'] : true;
}

chrome.storage.local.get(['ocMode'], function(result) {
  ocMode = getOcModeFromResult(result);
  updateBadge(ocMode);
});

chrome.browserAction.onClicked.addListener(function() {
  chrome.storage.local.get(['ocMode'], function(result) {
    newOcMode = !getOcModeFromResult(result);
    chrome.storage.local.set({'ocMode': newOcMode},function() {
      updateBadge(newOcMode);
    });
  });
});



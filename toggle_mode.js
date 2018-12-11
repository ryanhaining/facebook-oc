let toggleModeButton = document.getElementById("toggleOcMode");


chrome.storage.local.get(['ocMode'], function(result) {
  toggleModeButton.innerHTML = (
    !Object.keys(result).length || result['ocMode'] ?  "ON" : "OFF");
});

toggleModeButton.onclick = function() {
  chrome.storage.local.get(['ocMode'], function(result) {
    newValue = !result['ocMode'];
    chrome.storage.local.set({'ocMode': newValue}, function() { });
    toggleModeButton.innerHTML = newValue ? "ON" : "OFF";
  });
}


let toggleModeCheckbox = document.getElementById("toggle_oc_mode_checkbox_id");

chrome.storage.local.get(['ocMode'], function(result) {
  toggleModeCheckbox.checked = Object.keys(result).length ? result['ocMode'] : true;
});

toggleModeCheckbox.onclick = function() {
  chrome.storage.local.set({'ocMode': toggleModeCheckbox.checked});
};

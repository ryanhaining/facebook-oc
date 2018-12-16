"use strict";

function getStoryHeader(story) {
  let headers = story.getElementsByTagName("h5");
  if (headers.length == 0) {
    // I believe this can happen for the "comment on this" stories
    //console.log("WARNING: no headers found for story " + story);
    return null;
  }
  if (headers.length > 1) {
    console.log("WARNING: more than one header for story, taking first one. story: ");
    console.log(story);
  }
  return headers[0];
}

function getStoryHeaderText(story) {
  let header = getStoryHeader(story);
  return header ? header.textContent : "";
}

function headerHasGroupArrow(story) {
  // the arrow is inside an <i>
  let header = getStoryHeader(story)
  if (header == null) {
    return false;
  }
  let is  = header.getElementsByTagName("i");
  if (is.length == 0) {
    return false;
  }
  if (is.length != 1) {
    console.log("ERROR: Bad assumption about <i> tag");
  }
  return true;
}

function headerTextHasToGroup(story) {
  let headerText = getStoryHeaderText(story);
  return headerText.includes(" to the group: ") || headerText .includes(" created a poll in ");
}

function isGroupPost(story) {
  return headerHasGroupArrow(story) || headerTextHasToGroup(story);
}

// NOTE if someone's name contained " shared a " this would report oc from that
// person as a share
function isSharedPost(story) {
  return getStoryHeaderText(story).includes(" shared a ");
}

function isOriginalContentPost(story) {
  return !isGroupPost(story) && (
    !isSharedPost(story) || isSharedPostWithText(story));
}

function getStories() {
  let divs = document.getElementsByTagName("div");
  let stories = [];
  for (let d of divs) {
    if (d.id.startsWith("hyperfeed_story_id_")) {
      stories.push(d);
    }
  }
  return stories;
}

//TODO still need to handle
// ads
// "added X comments on this." / "commented on this." / "replied to a comment" / "was tagged in this"
// page shares
// ${A} and ${B} shared a link


function getStoryText(story) {
    if  (getStoryText.multiUserContentStories == undefined) {
      getStoryText.multiUserContentStories = new Set();
    }
    let text = "";
    let userContent = story.getElementsByClassName('userContent');
    if (userContent.length == 0) {
      return "";
    }
    if (userContent.length > 1) {
      if (!getStoryText.multiUserContentStories.has(story.id)) {
        console.log("WARNING Multiple userContent entities, using the first one.");
        console.log(story);
        getStoryText.multiUserContentStories.add(story.id);
      }
    }
    for (let p of userContent[0].getElementsByTagName("p")) {
        text += p.innerText + " ";
    }
    return text;
}

function getStoryWordCount(story) {
  return getStoryText(story).trim().split(/\s+/).length;
}

function isLowWordCount(story) {
  return getStoryWordCount(story) < 2;
}

function isSharedPostWithText(story) {
  return isSharedPost(story) && !isLowWordCount(story);
}

// debugging purposes
function colorStories() {
  for (let s of getStories()) {
    s.style.borderWidth = "10px";
    s.style.borderStyle = "dotted";
    try {
      if (isGroupPost(s)) {
          s.style.borderColor = "yellow";
      } else if (isSharedPostWithText(s)) {
          s.style.borderColor = "green";
      } else if (isSharedPost(s)) {
          s.style.borderColor = "red";
      } else if (isOriginalContentPost(s)) {
          s.style.borderColor = "blue";
      } else {
          console.log("error determining story type");
      }
    } catch(err) {
      console.log("exception trying to traverse story");
      console.log(story);
      console.log(err);
    }
  }
}

function onlyShowOriginalContent() {
  for (let s of getStories()) {
    try {
      if (!isOriginalContentPost(s)) {
        s.style.display = "none";
      }
    } catch(err) {
      console.log("exception trying to traverse");
    }
  }
}

function onlyShowSharesWithText() {
  for (let s of getStories()) {
    try {
      if (!isSharedPostWithText(s)) {
        s.style.display = "none";
      }
    } catch(err) {
      console.log("exception trying to traverse");
    }
  }
}

function hideGroupsColorStories() {
  colorStories();
  for (let s of getStories()) {
    try {
      if (isGroupPost(s)) {
        s.style.display = "none";
      }
    } catch(err) {
      console.log("exception trying to traverse");
    }
  }
}

function showAllStories() {
  for (let s of getStories()) {
    s.style.display = "";
  }
}


function getNewsFeed() {
  for (let d of document.getElementsByTagName("div")) {
    if (d.id && d.id.startsWith("feed_stream_")) {
      return d;
    }
  }
}

var gOcMode = true;

function setGlobalOcMode() {
  chrome.storage.local.get(['ocMode'], function(result) {
    if (Object.keys(result).length) {
      gOcMode = result["ocMode"];
    } else {
      gOcMode = true;
    }
  });
}

function processStories() {
  if (gOcMode) {
    onlyShowOriginalContent();
  }
}

function main() {
  setGlobalOcMode();
  processStories();

  var observer = new MutationObserver(processStories);
  observer.observe(getNewsFeed(), { attributes: false, childList: true, subtree: true });

  chrome.storage.onChanged.addListener(
    function(changes, namespace) {
      let ocMode = changes.ocMode;
      if (ocMode) {
        gOcMode = ocMode.newValue;
        processStories();
        if (!gOcMode) {
          showAllStories();
        }
      }
    }
  );
}

main();

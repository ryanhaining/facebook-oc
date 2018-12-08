/*
// NOPE
let stream = document.getElementById("stream_pagelet");
// can't loop over children with for each, need to use index

// NOPE
function getChildByIdPrefix(element, prefix) {
  for (let i = 0; i < element.children.length; ++i) {
    if (element.children[i].id.startsWith(prefix)) {
      return element.children[i];
    }
  }
  console.log("could not find child with prefix " + prefix); 
}

// NOPE
let firstStory = document.getElementById("substream_0")

// NOPE
let newsFeed = getChildByIdPrefix(getChildByIdPrefix(getChildByIdPrefix(document.getElementById("stream_pagelet"), "topnews_main_stream_"), "feed_stream_").children[1], "more_pager_pagelet_").children[0].children[0].children[0].children[0].children[0]


// hm, they all seem to have an id of "hyperfeed_story_id_", maybe I can just search for those instead


// within each story the content is children [0][0][2]
// 0, 1, 0, 0, 1, 1, 0, 0, 1 (lowest div before h5)
// group -> 1 aria-label "Members of" = group
// share/oc -> aria-label "Shared With:"
//
function descendChildren(element, indexes) {
  for (let i of indexes) {
    element = element.children[i];
  }
  return element;
}

function getStoryContent(story) {
  // only  a two differs                       v             
  //return descendChildren(story, [0, 0, 2, 0, 2, 0, 0, 1, 1, 0, 0, 1]);
  return descendChildren(story, [0, 0, 2, 0, 1, 0, 0, 1, 1, 0, 0, 1]);
}

function getTypeAriaLabel(story) {
  return descendChildren(getStoryContent(story), [1, 4]).getAttribute("aria-label");

}

*/


// ***************************************************************

function getStoryHeaderText(story) {
  let headers = story.getElementsByTagName("h5");
  if (headers.length == 0) {
    console.log("WARNING: no headers found for story " + story);
    return "";
  }
  if (headers.length > 1) {
    console.log("WARNING: more than one header for story, taking first one. " +
      "story: " + story);
  }
  return headers[0].textContent;
}

function getTypeAriaLabel(story) {
  for (let e of story.getElementsByTagName("div")) {
    let ariaLabel = e.getAttribute("aria-label");
    if (ariaLabel && !ariaLabel.startsWith("Comment")) {
      return ariaLabel;
    }
  }
}

function isGroupPost(story) {
  // TODO I don't think this will get posts in groups that have
  // public content
  let ariaLabel = getTypeAriaLabel(story);
  return ariaLabel ? ariaLabel.startsWith("Members of") : false;
}

// NOTE if someone's name contained " shared a " this would report oc from that
// person as a share
function isSharedPost(story) {
  return getStoryHeaderText(story).includes(" shared a ");
}

function isOriginalContentPost(story) {
  return !isGroupPost(story) && !isSharedPost(story);
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
// "added 2 comments on this." / "commented on this." / "replied to a comment"
// page shares

function colorStories() {
  for (let s of getStories()) {
    s.style.borderWidth = "10px";
    s.style.borderStyle = "dotted";
    try {
      if (isGroupPost(s)) {
          s.style.borderColor = "yellow";
      } else if (isSharedPost(s)) {
          s.style.borderColor = "red";
      } else if (isOriginalContentPost(s)) {
          s.style.borderColor = "blue";
      } else {
          console.log("error determining story type");
      }
    } catch(err) {
      console.log("exception trying to traverse story " + s);
      console.log(err);
    }
  }
}

function hideNonOriginalStories() {
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

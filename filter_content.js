function getStoryHeaderText(story) {
  let headers = story.getElementsByTagName("h5");
  if (headers.length == 0) {
    // I believe this can happen for the "comment on this" stories
    //console.log("WARNING: no headers found for story " + story);
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
// "added X comments on this." / "commented on this." / "replied to a comment" / "was tagged in this"
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

function getNewsFeed() {
  for (let d of document.getElementsByTagName("div")) {
    if (d.id && d.id.startsWith("feed_stream_")) {
      return d;
    }
  }
}

var observer = new MutationObserver(hideNonOriginalStories);
observer.observe(getNewsFeed(), { attributes: false, childList: true, subtree: true });

hideNonOriginalStories()

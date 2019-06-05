var currentData;

var elems = document.body.getElementsByTagName("*");
var counter = 0;
for (var i = 0; i < elems.length; i++) {
  if (!elems[i].id) {
    elems[i].id = "_custom_" + counter++;
  }
}

chrome.runtime.sendMessage({ subject: "attached", data: {} });

function highlightAndClickHandlers() {
  var prev;

  document.body.onmouseover = mouseHoverHighlight;
  document.body.onmousedown = clickSendData;

  function mouseHoverHighlight(event) {
    if (event.target === document.body || (prev && prev === event.target)) {
      return;
    }
    if (prev) {
      // prev.className = prev.className.toString().replace(/\bhighlight\b/, "");
      // prev.style.backgroundColor = null;
      prev = undefined;
    }
    if (event.target) {
      prev = event.target;
      // prev.style.backgroundColor = "Yellow";
      // prev.className += "highlight";
    }

    var temp = document.createElement("div");
    temp.appendChild(prev.cloneNode(true));
    var event = new CustomEvent("hovered", {
      detail: { data: prev.cloneNode(true) }
    });

    document.dispatchEvent(event);
  }

  function clickSendData(event) {
    var comment = prompt("Enter the comment for the selected element.");
    prev.style.backgroundColor = null;
    var temp = document.createElement("div");
    temp.appendChild(prev.cloneNode(true));
    var event = new CustomEvent("clicked", {
      detail: { data: temp.innerHTML, comment: comment === null ? "" : comment }
    });
    console.log(prev);
    console.log(event);
    prev = undefined;
    document.body.onmouseover = null;
    document.body.onmousedown = null;
    document.dispatchEvent(event);
  }
}

function clearHandlers() {
  document.body.onmousedown = null;
  document.body.onmouseover = null;
}

document.addEventListener("clicked", function(data) {
  chrome.runtime.sendMessage({
    subject: "clicked",
    data: { data: data.detail.data, comment: data.detail.comment }
  });

  chrome.runtime.sendMessage({
    subject: "state changed"
  });
});

document.addEventListener("hovered", function(data) {
  console.log(document.getElementById(data.detail.data.id).id);
  chrome.runtime.sendMessage({
    subject: "hovered",
    data: { data: data.detail.data.id }
  });
});

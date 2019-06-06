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

function rectangularSelectHandlers() {
  var canvas = document.createElement("div");
  canvas.style.width = "100&";
  canvas.style.height = "100%";
  canvas.style.zIndex = 50;
  canvas.id = "myCanvas";
  canvas.style.position = "fixed";
  canvas.style.left = 0;
  canvas.style.top = 0;
  canvas.style.bottom = 0;
  canvas.style.right = 0;

  function setMousePosition(e) {
    var ev = e || window.event; //Moz || IE
    if (ev.pageX) {
      //Moz
      mouse.x = ev.pageX + window.pageXOffset;
      mouse.y = ev.pageY + window.pageYOffset;
    } else if (ev.clientX) {
      //IE
      mouse.x = ev.clientX + document.body.scrollLeft;
      mouse.y = ev.clientY + document.body.scrollTop;
    }
  }

  var mouse = {
    x: 0,
    y: 0,
    startX: 0,
    startY: 0
  };

  var element = null;

  canvas.onmousemove = function(e) {
    console.log("HERE");
    setMousePosition(e);
    if (element != null) {
      element.style.width = Math.abs(mouse.x - mouse.startX) + "px";
      element.style.height = Math.abs(mouse.y - mouse.startY) + "px";
      element.style.left =
        mouse.x - mouse.startX < 0 ? mouse.x + "px" : mouse.startX + "px";
      element.style.top =
        mouse.y - mouse.startY < 0 ? mouse.y + "px" : mouse.startY + "px";
    }
  };

  canvas.onclick = function(e) {
    if (element != null) {
      // second click
      var topLeft = {
        x: parseInt(element.style.left, 10),
        y: parseInt(element.style.top, 10)
      };
      var topRight = {
        x: parseInt(element.style.left, 10) + parseInt(element.style.width, 10),
        y: parseInt(element.style.top, 10)
      };
      var bottomLeft = {
        x: parseInt(element.style.left, 10),
        y: parseInt(element.style.top, 10) + parseInt(element.style.height, 10)
      };
      var bottomRight = {
        x: parseInt(element.style.left, 10) + parseInt(element.style.width, 10),
        y: parseInt(element.style.top, 10) + parseInt(element.style.height, 10)
      };

      var coordinates = { topLeft, topRight, bottomLeft, bottomRight };

      console.log(topLeft);
      console.log(topRight);
      console.log(bottomLeft);
      console.log(bottomRight);

      element = null;
      canvas.style.cursor = "default";
    } else {
      // first click
      mouse.startX = mouse.x;
      mouse.startY = mouse.y;
      element = document.createElement("div");
      element.style.position = "absolute";
      element.style.border = "1px solid #FF0000";
      element.style.left = mouse.x + "px";
      element.style.right = mouse.y + "px";
      element.style.zIndex = 51;
      canvas.appendChild(element);
      canvas.style.cursor = "crosshair";
    }
  };

  document.body.appendChild(canvas);
}

function clearRectangleSelection() {
  var canvas = document.getElementById("myCanvas");
  canvas.parentNode.removeChild(canvas);
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

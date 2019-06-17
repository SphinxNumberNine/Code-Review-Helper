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
      prev = undefined;
    }
    if (event.target) {
      prev = event.target;
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
    if (prev.id.includes("_custom_")) {
      prev.id = null;
    }
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
  var body = document.body,
    html = document.documentElement;

  var height = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );

  var canvas = document.createElement("div");
  canvas.style.width = "100%";
  canvas.style.height = height + "px";
  canvas.style.zIndex = 1000000000;
  canvas.id = "myCanvas";
  canvas.style.position = "absolute";
  canvas.style.left = 0;
  canvas.style.top = 0;
  // canvas.style.bottom = 0;
  // canvas.style.right = 0;

  var scroll = {
    x: window.pageXOffset || document.body.scrollLeft,
    y: window.pageYOffset || document.body.scrollTop
  };

  var mouse = {
    x: 0,
    y: 0,
    startX: 0,
    startY: 0
  };

  function setMousePosition(e) {
    var ev = e || window.event; //Moz || IE
    if (ev.pageX) {
      //Moz
      // mouse.x = ev.pageX + window.pageXOffset;
      // mouse.y = ev.pageY + window.pageYOffset;
      mouse.x = ev.pageX;
      mouse.y = ev.pageY;
    } else if (ev.clientX) {
      //IE
      // mouse.x = ev.clientX + document.body.scrollLeft;
      // mouse.y = ev.clientY + document.body.scrollTop;
      mouse.x = ev.clientX;
      mouse.y = ev.clientY;
    }
  }

  var element = null;

  canvas.onmousemove = function(e) {
    console.log("HERE");
    setMousePosition(e);
    if (element !== null) {
      element.style.width = Math.abs(mouse.x - mouse.startX) + "px";
      element.style.height = Math.abs(mouse.y - mouse.startY) + "px";
      element.style.left =
        mouse.x - mouse.startX < 0 ? mouse.x + "px" : mouse.startX + "px";
      element.style.top =
        mouse.y - mouse.startY < 0 ? mouse.y + "px" : mouse.startY + "px";
    }
  };

  canvas.onclick = function(e) {
    if (element !== null) {
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

      var comment = prompt("Please enter a comment for the selected region.");

      var data = {
        newWidth: element.style.width,
        newHeight: element.style.height,
        startX: element.style.left,
        startY: element.style.top,
        comment: comment,
        scroll: scroll
      };

      console.log(topLeft);
      console.log(topRight);
      console.log(bottomLeft);
      console.log(bottomRight);

      var event = new CustomEvent("rectangle created", { detail: data });
      document.dispatchEvent(event);

      element = null;
      canvas.style.cursor = "default";

      canvas.parentElement.removeChild(canvas);
    } else {
      // first click
      mouse.startX = mouse.x;
      mouse.startY = mouse.y;
      element = document.createElement("div");
      element.style.position = "absolute";
      element.style.border = "1px solid #FF0000";
      element.style.left = mouse.x + "px";
      element.style.top = mouse.y + "px";
      element.style.zIndex = 10000000001;
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

  chrome.storage.local.set({ inCommentScreen: true });
  chrome.storage.local.set({
    commentData: {
      commentType: "Element",
      element: data.detail.data,
      comment: data.detail.comment
    }
  });
});

document.addEventListener("hovered", function(data) {
  console.log(document.getElementById(data.detail.data.id).id);
  chrome.runtime.sendMessage({
    subject: "hovered",
    data: { data: data.detail.data.id }
  });
});

document.addEventListener("rectangle created", function(data) {
  chrome.runtime.sendMessage({
    subject: "rectangle created",
    data: { data: data.detail }
  });
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.subject) {
    case "page screenshotted":
      var loadTimer;
      var imageObject = new Image();
      imageObject.src = message.url;
      imageObject.onload = onImgLoaded();

      function onImgLoaded() {
        if (loadTimer != null) {
          clearTimeout(loadTimer);
        }

        if (!imageObject.complete) {
          loadTimer = setTimeout(function() {
            onImgLoaded();
          }, 3);
        } else {
          onPreloadComplete();
        }
      }

      async function onPreloadComplete() {
        console.log(message);
        var newImage = cropImage(
          imageObject,
          message.newWidth,
          message.newHeight,
          message.startX - message.scroll.x,
          message.startY - message.scroll.y
        );

        await chrome.storage.local.set({
          commentData: {
            commentType: "Rectangle",
            imageUrl: newImage,
            comment: message.comment
          }
        });

        await chrome.runtime.sendMessage({
          subject: "rectangle cropped",
          data: { newUrl: newImage, comment: message.comment }
        });

        await chrome.storage.local.set({ inCommentScreen: true });
      }

      function cropImage(imageObject, newWidth, newHeight, startX, startY) {
        var newCanvas = document.createElement("canvas");
        var newCanvasContext = newCanvas.getContext("2d");
        newCanvas.width = newWidth;
        newCanvas.height = newHeight;

        var bufferCanvas = document.createElement("canvas");
        var bufferCanvasContext = bufferCanvas.getContext("2d");
        bufferCanvas.width = imageObject.width;
        bufferCanvas.height = imageObject.height;
        bufferCanvasContext.drawImage(imageObject, 0, 0);

        console.log(startX);
        console.log(startY);
        console.log(newWidth);

        newCanvasContext.drawImage(
          bufferCanvas,
          startX,
          startY,
          newWidth,
          newHeight,
          0,
          0,
          newWidth,
          newHeight
        );
        console.log(newCanvas.toDataURL());
        return newCanvas.toDataURL();
      }
      break;
  }
});

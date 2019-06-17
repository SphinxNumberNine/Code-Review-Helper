"use strict";

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({ color: "#3aa757" }, function() {
    //console.log("The color is green.");
  });

  chrome.storage.sync.set({ elementSelectionEnabled: false });
  chrome.storage.sync.set({ rectangularSelectionEnabled: false });
  chrome.storage.sync.set({ enabled: false });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    /* chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: "developer.chrome.com" }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]); */
  });
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.subject) {
    case "clicked": // sent when an element is selected
      chrome.debugger.sendCommand({ tabId: sender.tab.id }, "Overlay.disable");
      console.log(message.data.data);
      alert(message.data.comment);
      chrome.storage.sync.set({ elementSelectionEnabled: false });
      break;
    case "attached": // sent when the content script is injected into webpages
      break;
    case "hovered": // sent when the content script requests a node to be highlighted
      console.log(message.data.data);
      var objectId;
      var expression = 'document.getElementById("' + message.data.data + '")';
      console.log(expression);
      chrome.debugger.sendCommand({ tabId: sender.tab.id }, "Overlay.enable");
      chrome.debugger.sendCommand(
        { tabId: sender.tab.id },
        "Runtime.evaluate",
        { expression },
        function(remoteObject) {
          console.log(remoteObject);
          objectId = remoteObject.result.objectId;
          chrome.debugger.sendCommand(
            { tabId: sender.tab.id },
            "Overlay.highlightNode",
            {
              highlightConfig: {
                showInfo: true,
                showStyles: true,
                contentColor: { r: 102, g: 194, b: 255, a: 0.5 }
              },
              objectId: objectId
            }
          );
        }
      );
      break;
    case "state changed":
      chrome.storage.sync.get("elementSelectionEnabled", function(data) {
        if (data.elementSelectionEnabled) {
          chrome.tabs.query({ active: true, currentWindow: true }, function(
            tabs
          ) {
            chrome.debugger.attach({ tabId: tabs[0].id }, "1.3");
          });
        } else {
          chrome.tabs.query({ active: true, currentWindow: true }, function(
            tabs
          ) {
            chrome.debugger.detach({ tabId: tabs[0].id });
          });
        }
      });
      break;
    case "rectangle created":
      console.log(message.data);
      // alert(message.data);
      chrome.tabs.captureVisibleTab(function(url) {
        //chrome.tabs.create({ url });
        chrome.tabs.query({ active: true, currentWindow: true }, function(
          tabs
        ) {
          chrome.tabs.sendMessage(
            tabs[0].id,
            {
              subject: "page screenshotted",
              url: url,
              newWidth: parseInt(message.data.data.newWidth, 10),
              newHeight: parseInt(message.data.data.newHeight, 10),
              startX: parseInt(message.data.data.startX, 10),
              startY: parseInt(message.data.data.startY, 10),
              comment: message.data.data.comment,
              scroll: message.data.data.scroll
            },
            function(response) {}
          );
        });
      });
      break;
    case "rectangle cropped":
      chrome.storage.sync.set({ rectangularSelectionEnabled: false });
      // console.log(message.data.newUrl);
      // chrome.tabs.create({ url: message.data.newUrl });
      // alert(message.data.comment);
      break;
  }
});

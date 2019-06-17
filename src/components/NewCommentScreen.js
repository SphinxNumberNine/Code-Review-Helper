/* global chrome */

import React, { Component } from "react";
import "./Styles.css";

class NewCommentScreen extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    return (
      <div className="Container">
        <button id="selectElement" onClick={this.handleClick}>
          Select HTML Element
        </button>
        <button id="selectRegion" onClick={this.handleClick}>
          Select Rectangular Region
        </button>
      </div>
    );
  }

  handleClick(args) {
    switch (args.target.id) {
      case "selectElement":
        this.htmlElementSelection();
        break;
      case "selectRegion":
        this.rectangleSelection();
    }
  }

  htmlElementSelection() {
    var enabled;
    chrome.storage.sync.get("elementSelectionEnabled", data => {
      console.log(data);
      enabled = data.elementSelectionEnabled;

      if (!enabled) {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          chrome.tabs.executeScript(tabs[0].id, {
            // code: "(" + highlightAndClickHandlers + ")();"
            code: "highlightAndClickHandlers();"
          });
        });
        chrome.storage.sync.set({ elementSelectionEnabled: true }, function() {
          chrome.runtime.sendMessage({ subject: "state changed" });
        });
      } else {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          chrome.tabs.executeScript(tabs[0].id, {
            // code: "(" + clearHandlers + ")();"
            code: "clearHandlers();"
          });
        });
        chrome.storage.sync.set({ elementSelectionEnabled: false }, function() {
          chrome.runtime.sendMessage({ subject: "state changed" });
        });
      }
    });
  }

  rectangleSelection() {
    var enabled;
    chrome.storage.sync.get("rectangularSelectionEnabled", data => {
      console.log(data);
      enabled = data.rectangularSelectionEnabled;

      if (!enabled) {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          chrome.tabs.executeScript(tabs[0].id, {
            // code: "(" + highlightAndClickHandlers + ")();"
            code: "rectangularSelectHandlers();"
          });
        });
        chrome.storage.sync.set(
          { rectangularSelectionEnabled: true },
          function() {
            // chrome.runtime.sendMessage({ subject: "state changed" });
          }
        );
      } else {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          chrome.tabs.executeScript(tabs[0].id, {
            // code: "(" + clearHandlers + ")();"
            code: "clearRectangleSelection();"
          });
        });
        chrome.storage.sync.set(
          { rectangularSelectionEnabled: false },
          function() {
            // chrome.runtime.sendMessage({ subject: "state changed" });
          }
        );
      }
    });
  }
}

export default NewCommentScreen;

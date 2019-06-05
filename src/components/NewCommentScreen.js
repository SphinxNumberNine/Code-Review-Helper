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
        break;
    }
  }

  htmlElementSelection() {
    var enabled;
    chrome.storage.sync.get("enabled", data => {
      console.log(data);
      enabled = data.enabled;

      if (!enabled) {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          chrome.tabs.executeScript(tabs[0].id, {
            // code: "(" + highlightAndClickHandlers + ")();"
            code: "highlightAndClickHandlers();"
          });
        });
        chrome.storage.sync.set({ enabled: true }, function() {
          chrome.runtime.sendMessage({ subject: "state changed" });
        });
      } else {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          chrome.tabs.executeScript(tabs[0].id, {
            // code: "(" + clearHandlers + ")();"
            code: "clearHandlers();"
          });
        });
        chrome.storage.sync.set({ enabled: false }, function() {
          chrome.runtime.sendMessage({ subject: "state changed" });
        });
      }
    });
  }
}

export default NewCommentScreen;

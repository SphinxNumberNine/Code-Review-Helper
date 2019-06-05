/* global chrome */

import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.buttonClicked = this.buttonClicked.bind(this);
  }

  render() {
    return (
      <div className="App">
        {/*<header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
    </header>*/}
        <button id="selectElement" onClick={this.buttonClicked}>
          Select HTML Element
        </button>
      </div>
    );
  }

  buttonClicked() {
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

export default App;

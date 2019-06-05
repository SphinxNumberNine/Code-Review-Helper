/* global chrome */

import React, { Component } from "react";
import Router from "route-lite";
import "./App.css";

// Components

import Header from "./components/Header";
import HomeScreen from "./components/HomeScreen";
import NewCommentScreen from "./components/NewCommentScreen";

class App extends Component {
  constructor(props) {
    super(props);
    // this.buttonClicked = this.buttonClicked.bind(this);
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Router>
          <HomeScreen />
        </Router>
      </div>
    );
  }
}

export default App;

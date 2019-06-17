/* global chrome */

import React, { Component } from "react";
import Router from "route-lite";
import "./App.css";

// Components
import Header from "./components/Header";
import HomeScreen from "./components/HomeScreen";
import NewCommentScreen from "./components/NewCommentScreen";
import ViewCommentScreen from "./components/ViewCommentScreen";

class App extends Component {
  constructor(props) {
    super(props);
    let currentComponent = this;
    chrome.storage.local.get("inCommentScreen", data => {
      currentComponent.setState({ inCommentScreen: data.inCommentScreen });
    });
    // this.setState({ inCommentScreen: false });
    // this.buttonClicked = this.buttonClicked.bind(this);
    /* setInterval(() => {
      chrome.storage.sync.get("inCommentScreen", data => {
        currentComponent.setState({ inCommentScreen: data.inCommentScreen });
      });
    }, 1000);*/
  }

  render() {
    var inCommentScreen = this.state ? this.state.inCommentScreen : false;
    if (inCommentScreen === undefined) {
      inCommentScreen = false;
    }
    console.log(inCommentScreen);
    return (
      <div className="App">
        <Header />
        <Router>
          {inCommentScreen ? <ViewCommentScreen /> : <HomeScreen />}
          {/*<HomeScreen />*/}
        </Router>
      </div>
    );
  }
}

export default App;

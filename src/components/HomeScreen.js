import React, { Component } from "react";
import { Link, goBack } from "route-lite";
import "./Styles.css";

import NewCommentScreen from "./NewCommentScreen";
import NewReviewScreen from "./NewReviewScreen";

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    return (
      <div className="Container">
        <button id="startReviewButton" onClick={this.handleClick}>
          <Link component={NewReviewScreen}>Start New Review</Link>
        </button>
        <button id="editOldReviewButton" onClick={this.handleClick}>
          Edit Old Review
        </button>
      </div>
    );
  }

  handleClick(args) {
    switch (args.target.id) {
      case "startReviewButton":
        break;
      case "editOldReviewButton":
        break;
    }
  }
}

export default HomeScreen;

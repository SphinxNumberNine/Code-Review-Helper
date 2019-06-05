import React, { Component } from "react";

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    return (
      <div className="container">
        <button id="startReviewButton" onClick={handleClick}>
          Start New Review
        </button>
        <button id="editOldReviewButton" onClick={handleClick}>
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

/* global chrome */

import React, { Component } from "react";
import { Link, goBack } from "route-lite";
import HomeScreen from "./HomeScreen";
import "./Styles.css";
import ReviewScreen from "./ReviewScreen";

class ViewCommentScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    let currentComponent = this;
    currentComponent.cachedData = {};
    this.setState({
      commentData: { type: "", imageUrl: "", element: "", comment: "" }
    });
    chrome.storage.local.get("commentData", data => {
      currentComponent.cachedData = data;
      currentComponent.commentType = data.commentData.commentType;
      if (this.commentType === "Rectangle") {
        currentComponent.imageUrl = data.commentData.imageUrl;
      } else {
        currentComponent.element = data.commentData.element;
      }
      currentComponent.comment = data.commentData.comment;

      currentComponent.setState({
        commentData: {
          type: this.commentType,
          imageUrl: this.imageUrl,
          element: this.element,
          comment: this.comment
        }
      });
    });

    this.updateStorage = this.updateStorage.bind(this);
    this.imageClick = this.imageClick.bind(this);

    setInterval(() => {
      chrome.storage.local.get("commentData", data => {
        if (data === currentComponent.cachedData) {
          // do nothing
        } else {
          currentComponent.setState({
            commentData: {
              type: data.commentData.commentType,
              imageUrl: data.commentData.imageUrl,
              element: data.commentData.element,
              comment: data.commentData.comment
            }
          });

          currentComponent.commentType = data.commentData.commentType;
          currentComponent.element = data.commentData.element;
          currentComponent.imageUrl = data.commentData.imageUrl;
          currentComponent.comment = data.commentData.comment;
        }
      });
    }, 500);
  }

  render() {
    if (this.state.commentData) {
      console.log(this.state.commentData);
      return (
        <div className="Container">
          {this.state.commentData.type === "Rectangle"
            ? this.renderRectangularSelectionGUI()
            : this.renderElementSelectionGUI()}
          <Link onClick={this.updateStorage} component={ReviewScreen}>
            Submit
          </Link>
        </div>
      );
    } else {
      return <div className="Container" />;
    }
  }

  renderRectangularSelectionGUI() {
    return (
      <div className="row">
        <div className="ImageContainer" id="imageContainer">
          <div style={{ margin: "auto" }}>
            <img onClick={this.imageClick} src={this.imageUrl} />
          </div>
        </div>
        <textarea autoFocus={true} rows={8} cols={40}>
          {this.comment}
        </textarea>
      </div>
    );
  }

  imageClick() {
    chrome.tabs.create({ url: this.imageUrl });
  }

  renderElementSelectionGUI() {
    return (
      <div className="row">
        <textarea rows={8} cols={40}>
          {this.element.toString()}
        </textarea>
        <textarea autoFocus={true} rows={8} cols={40}>
          {this.comment}
        </textarea>
      </div>
    );
  }

  updateStorage() {
    chrome.storage.local.set({ inCommentScreen: false });
    // submit comment data to drive
  }
}

export default ViewCommentScreen;

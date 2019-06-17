import React, { Component } from "react";
import { Link, goBack } from "route-lite";
import "./Styles.css";

import NewCommentScreen from "./NewCommentScreen";

class ReviewScreen extends Component {
  constructor(props) {
    super(props);
    this.comments = [];
  }

  loadComments() {
    // API calls to load comments for this specific review, storing into this.comments
  }

  render() {
    return (
      <div className="Container">
        <h1>Comments</h1>
        {
          <ul>
            {this.comments.map(comment => (
              <li key={comment.id}>{comment.text}</li>
            ))}
          </ul>
        }
        <Link component={NewCommentScreen}>New Comment</Link>
        <br />
        <a onClick={() => goBack()}>Back</a>
      </div>
    );
  }
}

export default ReviewScreen;

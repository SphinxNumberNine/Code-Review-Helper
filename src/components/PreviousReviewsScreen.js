import React, { Component } from "react";
import { Link, goBack } from "route-lite";
import "./Styles.css";

class PreviousReviewScreen extends Component {
  constructor(props) {
    super(props);
    this.reviewList = [];
  }

  loadPreviousReviews() {
    // TODO: make API calls to retrieve list of previous reviews, saving list into this.reviewList
  }

  render() {
    return (
      <div className="Container">
        <h1>Previous Reviews</h1>
        <ul>
          {this.reviewList.map(review => (
            <li key={review.id}>{review.title}</li>
          ))}
        </ul>
        <div onClick={() => goBack()}>Back</div>
      </div>
    );
  }
}

export default PreviousReviewScreen;

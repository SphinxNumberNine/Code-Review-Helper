import React, { Component } from "react";
import { Link, goBack } from "route-lite";
import "./Styles.css";

import ReviewScreen from "./ReviewScreen";

class NewReviewScreen extends Component {
  constructor(props) {
    super(props);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  render() {
    return (
      <div className="Container">
        <h1>New Review</h1>
        <form>
          <input id="review_title_input" type="text" />
          <br />
          <input id="reviewer_input" type="text" />
          <br />
          <input id="review_description" type="text" />
          <br />
        </form>
        <Link onClick={this.handleFormSubmit} component={ReviewScreen}>
          Create Review
        </Link>
      </div>
    );
  }

  handleFormSubmit() {
    // api calls to handle creating a new review
  }
}

export default NewReviewScreen;

import React, { Component } from "react";
import "./Styles.css";

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <nav className="Header">
        <div className="nav-wrapper">
          <text className="left">Test</text>
        </div>
      </nav>
    );
  }
}

export default Header;

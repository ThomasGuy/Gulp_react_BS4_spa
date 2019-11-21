import React from "react";
import { render } from "react-dom";
import MyCarousel from "./components/MyCarousel";
import Navigation from "./components/Navigation";
import App from "./components/App";

function Gallery() {
  return (
    <div className="container-fluid mysite-section bg-mysite-light">
      <div className="container">
        <div className="row">
          <h3>Gallery</h3>
        </div>
        <div className="row">
          <MyCarousel />
        </div>
      </div>
    </div>
  );
}

render(<Navigation />, document.querySelector("#topnav"));
render(<Gallery />, document.querySelector("#gallery"));
render(<App />, document.querySelector("#test"));

/* eslint-disable import/no-named-as-default */
import React from "react";
import { render } from "react-dom";
import MyModel from "./components/MyModel";
import ProfileModel from "./components/ProfileModel";
import App from "./components/App";

function Models() {
  return (
    <>
      <li className="nav-item">
        <a href="#welcome" className="nav-link">
          James
        </a>
      </li>
      <li className="nav-item">
        <div className="nav-link">
          <MyModel />
        </div>
      </li>
      <li className="nav-item">
        <div className="nav-link">
          <ProfileModel />
        </div>
      </li>
    </>
  );
}

function Section() {
  return (
    <div>
      <App />
    </div>
  );
}

const sectionElement = document.querySelector("#test");
render(<Section />, sectionElement);

const tomModel = document.querySelector("#tom");
render(<Models />, tomModel);

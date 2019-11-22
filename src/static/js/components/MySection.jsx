/* eslint-disable react/prop-types */
import React from "react";

const MySection = ({ name, age }) => (
  <div className="container-fluid mysite-section bg-mysite-dark" id="mySection">
    <div className="container">
      <div className="row justify-content-center">
        <h4>
          Hello, {name}! at {age}{" "}
          <span>
            <i className="fa fa-home" />
          </span>{" "}
          miles an hour...
        </h4>
      </div>
    </div>
  </div>
);

export default MySection;

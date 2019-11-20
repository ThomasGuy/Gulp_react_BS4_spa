/* eslint-disable react/prop-types */
import React from "react";

const MySection = ({ name, age }) => (
  <div className="container-fluid mysite-section bg-mysite-dark" id="mySection">
    <p>
      Hello, {name}! your only {age} years old
    </p>
  </div>
);

export default MySection;

import React from "react";
import "./Loader.css";

const Loader = ({ text = "Crafting art..." }) => {
  return (
    <div className="loader-container">
      <div className="spinner">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p className="loader-text">{text}</p>
    </div>
  );
};

export default Loader;

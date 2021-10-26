import React from "react";
import "./Counter.css";
import FullCounter from "./FullCounter";

const Counter = () => {
  

  return (
    <div className="counterContainer">
      <div className="counterSection">
        <div className="counterCotent">
          <div className="counterHead">
            <h1>Cronos Launches in</h1>
          </div>
          <FullCounter />
        </div>
      </div>
    </div>
  );
};

export default Counter;

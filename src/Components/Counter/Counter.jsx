import React from "react";
import "./Counter.css";
import FullCounter from "./FullCounter";
import Typography from '@mui/material/Typography';

const Counter = () => {
  

  return (
    <div className="counterContainer">
      <div className="counterSection">
        <div className="counterCotent">
          <div className="counterHead">
            <Typography variant="h2" component="div" gutterBottom color="var(--primary)">
            Cronos Launches in
            </Typography>

          </div>
          <FullCounter />
        </div>
      </div>
    </div>
  );
};

export default Counter;

import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

const FullCounter = ({ hideImg}) => {
  const [timeLeft, setTimeLeft] = useState({});
  const times = ["Days", "Hours", "Minutes", "Seconds"];
  let time = '08 nov 2021  12:00:00'
  useEffect(() => {
    const updateTime = () => {
      const timer = new Date(time || Date.now()).getTime();
      const now = Date.now();
      const remainingTime = timer - now;
      const prevSeconds = Math.floor(remainingTime / 1000);
      const prevMinutes = Math.floor(prevSeconds / 60);
      const Seconds = prevSeconds % 60;
      const prevHours = Math.floor(prevMinutes / 60);
      const Minutes = prevMinutes % 60;
      const Days = Math.floor(prevHours / 24);
      const Hours = prevHours % 24;
      if (Days >= 0 && Hours >= 0 && Minutes >= 0 && Seconds >= 0)
        setTimeLeft({ Seconds, Minutes, Hours, Days });
    };
    const myInterval = setInterval(updateTime, 1000);
    return () => clearInterval(myInterval);
  }, [time]);
  return (
    <div className="counter">

      {times.map((el,i) => (
        <Counter key={i}
          time={el}
          timeLog={
            timeLeft[el] > 9
              ? timeLeft[el]
              : timeLeft[el]
              ? "0" + timeLeft[el]
              : "00"
          }
        />
      ))}
    </div>
  );
};


const Counter = ({ time, timeLog = 0 }) => {
  return (
    <div className="counter-item">
      <span className="counter--value">
        <div className="count-down" style={{ display: "inline" }}>
          <div className="hand hand-m time">
            <span className="digital digital-1">{timeLog}</span>
          </div>
        </div>
      </span>
      
      <Typography variant='h6' color='primary'>
        {time}
      </Typography>

    </div>
  );
};

export default FullCounter;

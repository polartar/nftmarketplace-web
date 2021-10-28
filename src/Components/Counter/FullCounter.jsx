import React, { useEffect, useState } from "react";

const FullCounter = ({ hideImg}) => {
  const [timeLeft, setTimeLeft] = useState({});
  const times = ["days", "hours", "minutes", "seconds"];
  let time = '08 nov 2021  00:00:00'
  useEffect(() => {
    const updateTime = () => {
      const timer = new Date(time || Date.now()).getTime();
      const now = Date.now();
      const remainingTime = timer - now;
      const prevSeconds = Math.floor(remainingTime / 1000);
      const prevMinutes = Math.floor(prevSeconds / 60);
      const seconds = prevSeconds % 60;
      const prevHours = Math.floor(prevMinutes / 60);
      const minutes = prevMinutes % 60;
      const days = Math.floor(prevHours / 24);
      const hours = prevHours % 24;
      if (days >= 0 && hours >= 0 && minutes >= 0 && seconds >= 0)
        setTimeLeft({ seconds, minutes, hours, days });
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
            <span className="digital digital-1 ">{timeLog}</span>
          </div>
        </div>
      </span>
      <strong className="counter--label">
        {time}
        {/* {times.map((val=>(
        <p key={val}>{val}</p>
      )))} */}
      </strong>
    </div>
  );
};

export default FullCounter;

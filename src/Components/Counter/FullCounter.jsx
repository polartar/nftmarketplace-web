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
      {/* {hideImg ? null :
      <span className="counter-icon">
        <svg className="icon">
          <path
            fill="#282b2b"
            d="M19.994 8.612l1.841-1.841c0.624-0.624 1.638-0.622 2.261-0l1.134 1.134c0.624 0.624 0.629 1.632-0 2.26l-1.841 1.841c1.396 2.050 2.212 4.527 2.212 7.194 0 7.069-5.731 12.8-12.8 12.8s-12.8-5.731-12.8-12.8c0-6.527 4.886-11.914 11.2-12.701v-1.699h-1.593c-0.887 0-1.607-0.719-1.607-1.598v-1.603c0-0.883 0.722-1.598 1.607-1.598h6.386c0.887 0 1.607 0.719 1.607 1.598v1.603c0 0.883-0.722 1.598-1.607 1.598h-1.593v1.699c2.056 0.256 3.961 1 5.594 2.113zM12.8 28.8c5.302 0 9.6-4.298 9.6-9.6s-4.298-9.6-9.6-9.6c-5.302 0-9.6 4.298-9.6 9.6s4.298 9.6 9.6 9.6z"
          />
          <path
            style={{ fill: "var(--color-primary)" }}
            d="M12 12.807c0-0.887 0.71-1.607 1.6-1.607 0.884 0 1.6 0.722 1.6 1.607v6.386c0 0.887-0.71 1.607-1.6 1.607-0.884 0-1.6-0.722-1.6-1.607v-6.386z"
          />
        </svg>
      </span>} */}
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

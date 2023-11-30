import React, { useState, useEffect } from "react";
import styles from "./countDown.module.css";
import { FaRegClock } from "react-icons/fa6";

const Countdown = ({ eventStartTime }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(eventStartTime) - +new Date();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clear timeout if the component is unmounted
    return () => clearTimeout(timer);
  });

  return (
    <div className={styles.countdown_section}>
      <FaRegClock className={styles.clock_icon} />
      <div className={styles.countdown_timer}>
        <h1>Starts in:</h1>
        <p>
          {timeLeft.days}d {timeLeft.hours}hr {timeLeft.minutes}Min{" "}
          {timeLeft.seconds}Sec
        </p>
      </div>
    </div>
  );
};

export default Countdown;

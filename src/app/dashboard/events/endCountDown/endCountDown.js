import React, { useState, useEffect } from "react";
import styles from "./endCountDown.module.css";
import { FaRegClock } from "react-icons/fa6";

const EndCountdown = ({ eventStartTime, eventDuration }) => {
  const calculateTimeLeft = () => {
    const eventEndTime =
      new Date(eventStartTime).getTime() + eventDuration * 60 * 1000;
    const currentTimeIST = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    let difference = eventEndTime - currentTimeIST.getTime();
    difference -= 5.5 * 60 * 60 * 1000;
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
        <h1>Ends in:</h1>
        <p>
          {timeLeft.days}d {timeLeft.hours}hr {timeLeft.minutes}Min{" "}
          {timeLeft.seconds}Sec
        </p>
      </div>
    </div>
  );
};

export default EndCountdown;

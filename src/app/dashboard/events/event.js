"use client";

import React, { useState } from "react";
import styles from "./event.module.css";
import Image from "next/image";
import Event_bg from "../../../../public/assets/svg/new_event_bg.svg";
import { FaPlus } from "react-icons/fa6";
import NewEvent from "./newEvent/newEvent";

const Event = () => {
  const [isNewEvent, setIsNewEvent] = useState(false);

  const handleNewEvent = () => {
    setIsNewEvent(true);
  };

  return (
    <div className={styles.container}>
      {isNewEvent ? (
        <NewEvent />
      ) : (
        <>
          <div className={styles.section}>
            <Image src={Event_bg} alt="event bg" className={styles.event_bg} />
            <p className={styles.no_event_txt}>No events Live right now.</p>
            <p className={styles.click_here_event_txt}>
              Click here to create a new event
            </p>
          </div>
          <div className={styles.new_event_btn_container}>
            <button className={styles.new_event_btn} onClick={handleNewEvent}>
              New Event <FaPlus />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Event;

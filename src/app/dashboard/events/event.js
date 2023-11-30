"use client";

import React, { useEffect, useState } from "react";
import styles from "./event.module.css";
import Image from "next/image";
import Event_bg from "../../../../public/assets/svg/new_event_bg.svg";
import { FaPlus } from "react-icons/fa6";
import NewEvent from "./newEvent/newEvent";
import { useSelector } from "react-redux";
import { selectUserData } from "@/store/user/user.selector";
import { GiPlainCircle } from "react-icons/gi";
import { getEvents } from "@/utils/api/event";

const Event = () => {
  const userData = useSelector(selectUserData);
  const [isNewEvent, setIsNewEvent] = useState(false);
  const [eventData, setEventData] = useState([]);
  const [status, setStatus] = useState("LIVE");

  const handleNewEvent = () => {
    setIsNewEvent(true);
  };

  const handleStatusChange = async (status) => {
    setStatus(status);
    const data = await getEvents(userData.userId, status);
    if (data?.data) {
      setEventData(data.data.events);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getEvents(userData.userId, status);
      if (data?.data) {
        setEventData(data.data.events);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      {isNewEvent ? (
        <NewEvent />
      ) : (
        <>
          <div className={styles.event_section}>
            <div className={styles.event_headers_section}>
              <div
                className={`${styles.live_btn} ${
                  status === "LIVE" && styles.live_active
                }`}
                onClick={() => handleStatusChange("LIVE")}
              >
                Live
                {status === "LIVE" && (
                  <GiPlainCircle className={styles.circle_icon} />
                )}
              </div>
              <div
                className={`${styles.upcoming_btn} ${
                  status === "UPCOMING" && styles.upcoming_active
                }`}
                onClick={() => handleStatusChange("UPCOMING")}
              >
                Upcoming
                {status === "UPCOMING" && (
                  <GiPlainCircle className={styles.circle_icon} />
                )}
              </div>
            </div>
            <button className={styles.new_event_btn} onClick={handleNewEvent}>
              New Event <FaPlus />
            </button>
          </div>
          <div>
            {eventData.length > 0 ? (
              <>
                {eventData.map((event) => (
                  <div key={event.eventid}>Event name: {event.eventname}</div>
                ))}
              </>
            ) : (
              <>
                <div className={styles.section}>
                  <Image
                    src={Event_bg}
                    alt="event bg"
                    className={styles.event_bg}
                  />
                  <p className={styles.no_event_txt}>
                    No events Live right now.
                  </p>
                  <p className={styles.click_here_event_txt}>
                    Click here to create a new event
                  </p>
                </div>
                <div className={styles.new_event_btn_container}>
                  <button
                    className={styles.new_event_btn}
                    onClick={handleNewEvent}
                  >
                    New Event <FaPlus />
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Event;

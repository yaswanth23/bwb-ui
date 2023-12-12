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
import Countdown from "./countDown/countDown";
import EndCountdown from "./endCountDown/endCountDown";
import View from "./view/view";

const Event = () => {
  const userData = useSelector(selectUserData);
  const [isNewEvent, setIsNewEvent] = useState(false);
  const [eventData, setEventData] = useState([]);
  const [status, setStatus] = useState("LIVE");
  const [isView, setIsView] = useState(false);
  const [viewEventData, setViewEventData] = useState({});

  const handleNewEvent = () => {
    setIsNewEvent(true);
  };

  const handleStatusChange = async (status) => {
    if (isView) {
      setIsView(false);
    }
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
  }, [status]);

  const handleEventView = (event) => {
    setViewEventData(event);
    setIsView(true);
  };

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
            {!isView ? (
              <>
                {eventData.length > 0 ? (
                  <>
                    <div className={styles.event_card_section}>
                      {eventData.map((event) => (
                        <div
                          key={event.eventid}
                          className={styles.event_card}
                          onClick={() => handleEventView(event)}
                        >
                          <h1 className={styles.event_heading}>
                            {event.eventname}
                          </h1>
                          <div className={styles.event_rfq_section}>
                            <h1>RFQ</h1>
                            <p>
                              {
                                JSON.parse(event.eventAttributesStore[0].value)
                                  .length
                              }
                              {JSON.parse(event.eventAttributesStore[0].value)
                                .length > 1
                                ? " Products"
                                : " Product"}
                            </p>
                          </div>
                          {status === "LIVE" ? (
                            <div className={styles.live_counter_section}>
                              <EndCountdown
                                eventStartTime={event.eventstarttime}
                                eventDuration={event.eventduration}
                              />
                            </div>
                          ) : (
                            <div className={styles.upcoming_counter_section}>
                              <Countdown
                                eventStartTime={event.eventstarttime}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
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
              </>
            ) : (
              <View data={viewEventData} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Event;

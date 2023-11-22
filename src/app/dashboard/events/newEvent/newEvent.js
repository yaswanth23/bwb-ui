"use client";

import React, { useState, useReducer } from "react";
import styles from "./newEvent.module.css";
import { Steps } from "antd";
import Image from "next/image";
import { TbEdit } from "react-icons/tb";
import { FaRegCircleCheck, FaRegCircleXmark } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";
import TaskImage from "../../../../../public/assets/images/tasks.png";

const NewEvent = () => {
  const [stepCount, setStepCount] = useState(0);
  const [isEventTitleEditFlag, setIsEventTitleEditFlag] = useState(true);
  const EVENT_TYPE_DESCRIPTION = "Request for Quotation";

  const [data, updateData] = useReducer(
    (prev, next) => {
      const updateData = { ...prev, ...next };
      return updateData;
    },
    { eventTitle: "" }
  );

  return (
    <>
      <div className={styles.step_container}>
        <Steps
          progressDot
          current={stepCount}
          items={[
            {
              title: "Event Details",
            },
            {
              title: "Product Details",
            },
            {
              title: "Terms & Conditions",
            },
            {
              title: "Publish",
            },
          ]}
        />
      </div>
      <div className={styles.event_title_section}>
        <h1>Event Title:</h1>
        {isEventTitleEditFlag ? (
          <div className={styles.event_input_section_one}>
            <input
              type="text"
              className={styles.event_type_input}
              onChange={(e) => updateData({ eventTitle: e.target.value })}
              placeholder="Enter Event Title"
            />
            <FaRegCircleCheck
              className={styles.check_icon}
              onClick={() => {
                if (data.eventTitle) {
                  setIsEventTitleEditFlag(false);
                }
              }}
            />
            <FaRegCircleXmark
              className={styles.cancel_icon}
              onClick={() => {
                if (data.eventTitle) {
                  setIsEventTitleEditFlag(false);
                }
              }}
            />
          </div>
        ) : (
          <div className={styles.event_input_section_two}>
            <input
              type="text"
              defaultValue={data.eventTitle}
              className={styles.event_type_input}
              readOnly
            />
            <TbEdit
              className={styles.edit_icon}
              onClick={() => {
                setIsEventTitleEditFlag(true);
              }}
            />
          </div>
        )}
      </div>
      <div className={styles.mid_container}>
        <div className={styles.event_details_section}>
          <div className={styles.event_type_section}>
            <h1>Event Type:</h1>
            <p
              data-tooltip-id="my-tooltip"
              data-tooltip-content={EVENT_TYPE_DESCRIPTION}
            >
              RFQ
            </p>
            <Tooltip id="my-tooltip" className="custom-tooltip" />
          </div>
        </div>
        <div className={styles.award_section}>
          <div className={styles.award_main}>
            <div className={styles.award_radio_section}>
              <h2>How will you award the event</h2>
              <div className={styles.input_radio}>
                <input
                  type="radio"
                  name="options"
                  value="option1"
                  checked={data.awardType === 1}
                  onChange={() => updateData({ awardType: 1 })}
                  id="1"
                />
                <label htmlFor="1">
                  I'll award the entire lot to single vendor
                </label>
              </div>
              <div className={styles.input_radio}>
                <input
                  type="radio"
                  name="options"
                  value="option1"
                  checked={data.awardType === 2}
                  onChange={() => updateData({ awardType: 2 })}
                  id="2"
                />
                <label htmlFor="2">
                  I may partially award the event to multiple vendors
                </label>
              </div>
            </div>
          </div>
          <Image src={TaskImage} alt="task" className={styles.task_side_img} />
        </div>
      </div>
    </>
  );
};

export default NewEvent;

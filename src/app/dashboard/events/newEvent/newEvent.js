"use client";

import React, { useState, useReducer } from "react";
import styles from "./newEvent.module.css";
import { Steps } from "antd";
import Image from "next/image";
import { Tooltip } from "react-tooltip";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TaskImage from "../../../../../public/assets/images/tasks.png";

const NewEvent = () => {
  const [stepCount, setStepCount] = useState(0);
  const EVENT_TYPE_DESCRIPTION = "Request for Quotation";

  const [data, updateData] = useReducer(
    (prev, next) => {
      const updateData = { ...prev, ...next };
      return updateData;
    },
    { eventTitle: "", awardType: 1, deliveryDate: null }
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
        <div className={styles.event_input_section}>
          <input
            type="text"
            className={styles.event_type_input}
            onChange={(e) => updateData({ eventTitle: e.target.value })}
            placeholder="Enter Event Title"
          />
        </div>
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
            <div className={styles.delivery_date_section}>
              <h2>Delivery Date</h2>
              <DatePicker
                showIcon
                selected={data.deliveryDate}
                onChange={(date) => updateData({ deliveryDate: date })}
                minDate={new Date()}
                placeholderText="Select Delivery Date"
              />
            </div>
          </div>
          <Image src={TaskImage} alt="task" className={styles.task_side_img} />
        </div>
      </div>
    </>
  );
};

export default NewEvent;

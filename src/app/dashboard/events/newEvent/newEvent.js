"use client";

import React, { useState } from "react";
import styles from "./newEvent.module.css";
import { Steps } from "antd";

const NewEvent = () => {
  const [stepCount, setStepCount] = useState(0);
  const handleAddStepper = () => {
    setStepCount(stepCount + 1);
  };

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
    </>
  );
};

export default NewEvent;

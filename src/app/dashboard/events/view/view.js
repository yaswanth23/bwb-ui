"use client";

import React, { useEffect, useState, useReducer } from "react";
import styles from "./view.module.css";
import { useSelector } from "react-redux";
import { selectUserData } from "@/store/user/user.selector";
import { getUserEventDetails } from "@/utils/api/event";

const View = ({ data }) => {
  const userData = useSelector(selectUserData);
  const [eventDetails, setEventDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getUserEventDetails(userData.userId, data.eventid);
      if (response?.data?.statusCode === 200) {
        setEventDetails(response.data.eventDetails);
      }
    };

    fetchData();
  }, [data]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.first_section}>
          <h1>{data.eventname}</h1>
        </div>
      </div>
    </>
  );
};

export default View;

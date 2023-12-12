"use client";

import React, { useEffect, useState, useReducer } from "react";
import styles from "./view.module.css";
import { useSelector } from "react-redux";
import { selectUserData } from "@/store/user/user.selector";
import { getUserEventDetails } from "@/utils/api/event";

const View = ({ data }) => {
  const userData = useSelector(selectUserData);
  const [eventDetails, setEventDetails] = useState(null);
  console.log(eventDetails);
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
        <div className={styles.product_section}>
          {eventDetails &&
            eventDetails.productDetails.map((item) => (
              <div key={item.productid} className={styles.product_card_section}>
                <table className={styles.table_container}>
                  <tbody>
                    <tr>
                      <th className={styles.product_headers}>
                        <h2>{item.product}</h2>
                        <p>Requested at {item.deliverylocation}</p>
                      </th>
                    </tr>
                    <tr>
                      <th className={styles.product_sub_headers}>
                        Quantity req: {item.quantity}
                      </th>
                    </tr>
                    <tr>
                      <th className={styles.product_sub_headers}>
                        Price per unit
                      </th>
                    </tr>
                    <tr>
                      <th className={styles.product_sub_headers}>
                        Total Amount
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default View;

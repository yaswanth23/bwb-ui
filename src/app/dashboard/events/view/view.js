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
                        <p>Variant: {item.productvariant}</p>
                        <p>Delivery: {item.deliverylocation}</p>
                        <p>Quantity req: {item.quantity}</p>
                      </th>
                      {item.productComparisions.length > 0 ? (
                        item.productComparisions.map((item, index) => (
                          <td key={index} className={styles.available_text}>
                            <p className={styles.vendor_name}>
                              {item.vendorDetails.organisationname}
                            </p>
                            <p>Vendor {index + 1}</p>
                          </td>
                        ))
                      ) : (
                        <td className={styles.no_available_text}>
                          No Quotes available
                        </td>
                      )}
                    </tr>
                    <tr>
                      <th className={styles.product_sub_headers}>
                        Price per unit
                      </th>
                      {item.productComparisions.length > 0 &&
                        item.productComparisions.map((item, index) => (
                          <td key={index} className={styles.vendor_price}>
                            &#8377; {item.vendorprice}
                          </td>
                        ))}
                    </tr>
                    <tr>
                      <th className={styles.product_sub_headers}>
                        Total Amount
                      </th>
                      {item.productComparisions.length > 0 &&
                        item.productComparisions.map((item, index) => (
                          <td key={index} className={styles.total_price}>
                            &#8377; {item.totalPrice}
                          </td>
                        ))}
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

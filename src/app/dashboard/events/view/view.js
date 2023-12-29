"use client";

import React, { useEffect, useState, useReducer } from "react";
import styles from "./view.module.css";
import { useSelector } from "react-redux";
import { selectUserData } from "@/store/user/user.selector";
import {
  getUserEventDetails,
  changeUserProductStatus,
} from "@/utils/api/event";

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

  const handleProductStausChange = async (vendorUserId, status) => {
    const request = {
      userId: userData.userId,
      vendorUserId: vendorUserId,
      eventId: data.eventid,
      status: status,
    };

    await changeUserProductStatus(request);

    const response = await getUserEventDetails(userData.userId, data.eventid);
    if (response?.data?.statusCode === 200) {
      setEventDetails(response.data.eventDetails);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.first_section}>
          {/* <h1>{data.eventname}</h1> */}
          {eventDetails?.purchaseOrderUrl && (
            <a
              href={eventDetails.purchaseOrderUrl}
              download
              className={styles.download_po_btn}
            >
              Download PO
            </a>
          )}
        </div>
        <div className={styles.product_section}>
          {eventDetails && (
            <>
              <table className={styles.table_container}>
                <tbody>
                  <tr>
                    <th className={styles.product_headers}>
                      <h1>{data.eventname}</h1>
                    </th>
                    {eventDetails.vendorComparisons.length > 0 ? (
                      eventDetails.vendorComparisons.map((vc, index) => (
                        <td key={index} className={styles.available_text}>
                          <p className={styles.vendor_name}>
                            {vc.organisationname}
                          </p>
                          <p>Vendor {index + 1}</p>
                          <div className={styles.header_buttons}>
                            {vc.status === "OPEN" ? (
                              <>
                                <button
                                  className={styles.accept_btn}
                                  onClick={() =>
                                    handleProductStausChange(
                                      vc.vendoruserid,
                                      "ACCEPTED"
                                    )
                                  }
                                >
                                  Accept
                                </button>
                                <button
                                  className={styles.counter_btn}
                                  // onClick={() =>
                                  //   handleProductStausChange(
                                  //     vc.vendoruserid,
                                  //     "ACCEPTED"
                                  //   )
                                  // }
                                >
                                  Counter
                                </button>
                              </>
                            ) : (
                              <p
                                className={`${
                                  vc.status === "ACCEPTED"
                                    ? styles.accepted_status_text
                                    : styles.rejected_status_text
                                }`}
                              >
                                {vc.status}
                              </p>
                            )}
                          </div>
                        </td>
                      ))
                    ) : (
                      <td className={styles.no_available_text}>
                        No Quotes available
                      </td>
                    )}
                  </tr>
                  <tr>
                    <th className={styles.product_sub_headers}>Sum Total</th>
                    {eventDetails.vendorComparisons.length > 0 &&
                      eventDetails.vendorComparisons.map((item, index) => (
                        <td key={index} className={styles.sum_total}>
                          &#8377; {item.sumTotal}
                        </td>
                      ))}
                  </tr>
                  {eventDetails.productDetails.map((item) => (
                    <>
                      <tr>
                        <td
                          colSpan={
                            eventDetails.vendorComparisons.length > 0
                              ? eventDetails.vendorComparisons.length + 1
                              : 2
                          }
                          className={styles.product_td_sec}
                        >
                          {item.product}
                        </td>
                      </tr>
                      <tr>
                        <th className={styles.product_sub_text_headers}>
                          Quantity Available
                        </th>
                        {eventDetails.vendorComparisons.map((vendor) => {
                          const quote = vendor.productQuotes.find(
                            (quote) => quote.productid === item.productid
                          );
                          return (
                            <td
                              key={vendor.vendoruserid}
                              className={styles.vendor_context}
                            >
                              {quote.quantity}
                            </td>
                          );
                        })}
                      </tr>
                      <tr>
                        <th className={styles.product_sub_text_headers}>
                          Price
                        </th>
                        {eventDetails.vendorComparisons.map((vendor) => {
                          const quote = vendor.productQuotes.find(
                            (quote) => quote.productid === item.productid
                          );
                          return (
                            <td
                              key={vendor.vendoruserid}
                              className={styles.vendor_context}
                            >
                              &#8377; {quote.price}
                            </td>
                          );
                        })}
                      </tr>
                      <tr>
                        <th className={styles.product_sub_text_headers}>
                          Total Amount
                        </th>
                        {eventDetails.vendorComparisons.map((vendor) => {
                          const quote = vendor.productQuotes.find(
                            (quote) => quote.productid === item.productid
                          );
                          return (
                            <td
                              key={vendor.vendoruserid}
                              className={styles.total_price}
                            >
                              &#8377; {quote.totalPrice}
                            </td>
                          );
                        })}
                      </tr>
                    </>
                  ))}
                  <tr>
                    <th className={styles.product_sub_headers}>Sum Total</th>
                    {eventDetails.vendorComparisons.length > 0 &&
                      eventDetails.vendorComparisons.map((vc, index) => (
                        <td key={index} className={styles.sum_total}>
                          &#8377; {vc.sumTotal}
                          {vc.status === "OPEN" && (
                            <button
                              className={styles.reject_btn}
                              onClick={() =>
                                handleProductStausChange(
                                  vc.vendoruserid,
                                  "REJECTED"
                                )
                              }
                            >
                              Reject
                            </button>
                          )}
                        </td>
                      ))}
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default View;

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
          <h1>{data.eventname}</h1>
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
        {/* <div className={styles.product_section}>
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
                        Total Amount
                      </th>
                      {item.productComparisions.length > 0 ? (
                        item.productComparisions.map((item, index) => (
                          <td key={index} className={styles.total_price}>
                            &#8377; {item.totalPrice}
                          </td>
                        ))
                      ) : (
                        <td className={styles.total_price}>-</td>
                      )}
                    </tr>
                    <tr>
                      <td
                        colSpan={
                          item.productComparisions.length > 0
                            ? item.productComparisions.length + 1
                            : 2
                        }
                        className={styles.product_td_sec}
                      >
                        {item.product}
                      </td>
                    </tr>
                    <tr>
                      <th className={styles.product_sub_headers}>
                        Quantity Available
                      </th>
                      {item.productComparisions.length > 0 ? (
                        <td className={styles.vendor_price}>{item.quantity}</td>
                      ) : (
                        <td className={styles.vendor_price}>-</td>
                      )}
                    </tr>
                    <tr>
                      <th className={styles.product_sub_headers}>Price</th>
                      {item.productComparisions.length > 0 ? (
                        item.productComparisions.map((item, index) => (
                          <td key={index} className={styles.vendor_price}>
                            &#8377; {item.vendorprice}
                          </td>
                        ))
                      ) : (
                        <td className={styles.vendor_price}>-</td>
                      )}
                    </tr>
                    <tr>
                      <th className={styles.product_sub_headers}>Sum Total</th>
                      {item.productComparisions.length > 0 ? (
                        item.productComparisions.map((item, index) => (
                          <td key={index} className={styles.total_price}>
                            &#8377; {item.totalPrice}
                          </td>
                        ))
                      ) : (
                        <td className={styles.total_price}>-</td>
                      )}
                    </tr>
                    {item.productComparisions.length > 0 && (
                      <tr>
                        <th></th>
                        {item.productComparisions.length > 0 &&
                          item.productComparisions.map((item, index) =>
                            item.status === "OPEN" ? (
                              <td key={index}>
                                <div className={styles.a_r_btn_section}>
                                  <button
                                    className={styles.accept_btn}
                                    onClick={() =>
                                      handleProductStausChange(
                                        item.productid,
                                        item.vendorDetails.userid,
                                        "ACCEPTED"
                                      )
                                    }
                                  >
                                    Accept
                                  </button>
                                  <button
                                    className={styles.reject_btn}
                                    onClick={() =>
                                      handleProductStausChange(
                                        item.productid,
                                        item.vendorDetails.userid,
                                        "REJECTED"
                                      )
                                    }
                                  >
                                    Reject
                                  </button>
                                </div>
                              </td>
                            ) : (
                              <td key={index}>
                                <h1 className={styles.status_text}>
                                  {item.status}
                                </h1>
                              </td>
                            )
                          )}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ))}
        </div> */}
        <div className={styles.product_section}>
          {eventDetails && (
            <>
              <table className={styles.table_container}>
                <tbody>
                  <tr>
                    <th className={styles.product_headers}></th>
                    {eventDetails.vendorComparisons.length > 0 ? (
                      eventDetails.vendorComparisons.map((item, index) => (
                        <td key={index} className={styles.available_text}>
                          <p className={styles.vendor_name}>
                            {item.organisationname}
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

"use client";

import React, { useEffect, useState, useReducer } from "react";
import styles from "./view.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import { useSelector } from "react-redux";
import { selectUserData } from "@/store/user/user.selector";
import {
  getUserEventDetails,
  changeUserProductStatus,
  submitCounterPrice,
} from "@/utils/api/event";

const View = ({ data }) => {
  const userData = useSelector(selectUserData);
  const [eventDetails, setEventDetails] = useState(null);
  const [modalOneIsOpen, setModalOneIsOpen] = useState(false);
  const [counterData, setCounterData] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [counterPrice, setCounterPrice] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await getUserEventDetails(userData.userId, data.eventid);
      if (response?.data?.statusCode === 200) {
        setEventDetails(response.data.eventDetails);
      }
    };

    fetchData();
  }, [data]);

  const openModalOne = (vendoruserid) => {
    const vendor = eventDetails.vendorComparisons.find(
      (vendor) => vendor.vendoruserid === vendoruserid
    );
    setCounterData(vendor);
    setModalOneIsOpen(true);
  };

  const closeModalOne = () => {
    setModalOneIsOpen(false);
  };

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

  const handleCounterPriceSubmit = async (vendorUserId, productId) => {
    if (!counterPrice) {
      setErrorMessage("Please Enter counter price");
    }

    if (counterPrice) {
      setErrorMessage("");
      let request = {
        userId: userData.userId,
        vendorUserId: vendorUserId,
        productId: productId,
        counterPrice: Number(counterPrice),
      };
      await submitCounterPrice(request);
      closeModalOne();
      toast.success("Counter price submitted Successfully", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
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
                                  onClick={() => {
                                    openModalOne(vc.vendoruserid);
                                  }}
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
      <Modal
        isOpen={modalOneIsOpen}
        onRequestClose={closeModalOne}
        preventScroll={true}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          },
          content: {
            padding: 0,
            border: "none",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
        ariaHideApp={false}
      >
        <div className={styles.modal_one_container}>
          {counterData && (
            <>
              <h1 className={styles.modal_header}>
                {counterData.organisationname}
              </h1>
              <p className={styles.modal_sub_text}>
                Please select the product you wish to provide a counter price
                for:
              </p>
              <select onChange={(e) => setSelectedProduct(e.target.value)}>
                <option value="">Select a product</option>
                {counterData.productQuotes.map((product, index) => (
                  <option key={index} value={index}>
                    {product.product}
                  </option>
                ))}
              </select>
              {selectedProduct && (
                <>
                  <div className={styles.product_data_container}>
                    <p className={styles.product_content}>
                      <h1>Product:</h1>
                      {counterData.productQuotes[selectedProduct].product}
                    </p>
                    <p className={styles.product_content}>
                      <h1>Price:</h1>
                      &#8377; {counterData.productQuotes[selectedProduct].price}
                    </p>
                    <p className={styles.product_content}>
                      <h1>Quantity:</h1>
                      {counterData.productQuotes[selectedProduct].quantity}
                    </p>
                  </div>
                  <div className={styles.product_counter_container}>
                    <label htmlFor="counterPrice">Counter Price:</label>
                    <input
                      type="text"
                      id="counterPrice"
                      placeholder="Enter counter price"
                      onChange={(e) => setCounterPrice(e.target.value)}
                    />
                  </div>
                  <span className={styles.error_message_txt}>
                    {errorMessage}
                  </span>
                  <button
                    className={styles.submit_button}
                    onClick={() =>
                      handleCounterPriceSubmit(
                        counterData.productQuotes[selectedProduct].vendorUserId,
                        counterData.productQuotes[selectedProduct].productid
                      )
                    }
                  >
                    Submit
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </Modal>
      <ToastContainer
        toastStyle={{
          borderRadius: "0.5rem",
          fontFamily: "Montserrat",
          color: "#000000",
          fontSize: "1rem",
        }}
      />
    </>
  );
};

export default View;

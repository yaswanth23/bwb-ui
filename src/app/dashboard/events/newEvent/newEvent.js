"use client";

import React, { useState, useReducer } from "react";
import styles from "./newEvent.module.css";
import { Steps } from "antd";
import Image from "next/image";
import Modal from "react-modal";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { Tooltip } from "react-tooltip";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TaskImage from "../../../../../public/assets/images/tasks.png";
import { BiEditAlt } from "react-icons/bi";
import { MdOutlineDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { useSelector } from "react-redux";
import {
  getTermsAndConditions,
  addTermsAndConditions,
  scheduleEvent,
} from "@/utils/api/event";
import { selectUserData } from "@/store/user/user.selector";

const NewEvent = () => {
  const userData = useSelector(selectUserData);
  const [stepCount, setStepCount] = useState(0);
  const [modalOneIsOpen, setModalOneIsOpen] = useState(false);
  const [modalTwoIsOpen, setModalTwoIsOpen] = useState(false);
  const [modalThreeIsOpen, setModalThreeIsOpen] = useState(false);
  const [productErrorMessage, setProductErrorMessage] = useState("");
  const [itemIdx, setItemIdx] = useState(null);
  const EVENT_TYPE_DESCRIPTION = "Request for Quotation";
  const [termsAndConditions, setTermsAndConditions] = useState("");
  const [termsAndConditionText, setTermsAndConditionText] = useState("");
  const [checkedItems, setCheckedItems] = useState({});
  const [eventStartTime, setEventStartTime] = useState(new Date());
  const [startTimeOption, setStartTimeOption] = useState("now");
  const [eventDuration, setEventDuration] = useState("30 mins");
  const [durationOption, setDurationOption] = useState("30 mins");
  const [finalErrorMessage, setFinalErrorMessage] = useState("");

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const minTime = isToday(eventStartTime)
    ? new Date()
    : new Date().setHours(0, 0, 0, 0);
  const maxTime = new Date().setHours(23, 59, 59, 999);

  const [data, updateData] = useReducer(
    (prev, next) => {
      const updateData = { ...prev, ...next };
      return updateData;
    },
    {
      eventTitle: "",
      awardType: 1,
      fromDeliveryDate: null,
      toDeliveryDate: null,
      productDetails: [],
    }
  );

  const [productData, updateProductData] = useReducer(
    (prev, next) => {
      const updateProductData = { ...prev, ...next };
      return updateProductData;
    },
    { product: "", productVariant: "", quantity: null, deliveryLocation: "" }
  );

  const openModalOne = () => {
    setModalOneIsOpen(true);
  };

  const closeModalOne = () => {
    setModalOneIsOpen(false);
  };

  const openModalTwo = () => {
    setModalTwoIsOpen(true);
  };

  const closeModalTwo = () => {
    setProductErrorMessage("");
    setModalTwoIsOpen(false);
  };

  const openModalThree = (itemId) => {
    setItemIdx(itemId);
    setModalThreeIsOpen(true);
  };

  const closeModalThree = () => {
    setItemIdx(null);
    setModalThreeIsOpen(false);
  };

  const handleCheckChange = (event) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked,
    });
  };

  const handleTermsAndConditionTextChange = (event) => {
    setTermsAndConditionText(event.target.value);
  };

  const handleAddTermsAndConditions = async () => {
    if (termsAndConditionText) {
      const data = await addTermsAndConditions(
        userData.userId,
        termsAndConditionText
      );
      if (data?.data.statusCode === 200) {
        setTermsAndConditions(data.data.termsAndConditions);
        setTermsAndConditionText("");
      }
    }
  };

  const handleOptionChange = (e) => {
    setStartTimeOption(e.target.value);
    if (e.target.value === "now") {
      setEventStartTime(new Date());
    }
  };

  const handleDurationOptionChange = (e) => {
    setDurationOption(e.target.value);
    if (e.target.value !== "custom") {
      setEventDuration(e.target.value);
    }
  };

  const handleDurationChange = (e) => {
    setEventDuration(e.target.value);
  };

  const handleAddProduct = () => {
    if (!productData.deliveryLocation) {
      setProductErrorMessage("Please Enter Delivery Location");
    }
    if (!productData.quantity) {
      setProductErrorMessage("Please Enter Quantity");
    }
    if (!productData.productVariant) {
      setProductErrorMessage("Please Enter Product Variant");
    }
    if (!productData.product) {
      setProductErrorMessage("Please Enter Product Name");
    }

    if (
      productData.product &&
      productData.productVariant &&
      productData.quantity &&
      productData.deliveryLocation
    ) {
      updateData({
        productDetails: [
          ...data.productDetails,
          {
            product: productData.product,
            productVariant: productData.productVariant,
            quantity: productData.quantity,
            deliveryLocation: productData.deliveryLocation,
          },
        ],
      });
      updateProductData({
        product: "",
        productVariant: "",
        quantity: null,
        deliveryLocation: "",
      });
      setProductErrorMessage("");
      closeModalTwo();
    }
  };

  const handleEditProduct = () => {
    if (!productData.deliveryLocation) {
      setProductErrorMessage("Please Enter Delivery Location");
    }
    if (!productData.quantity) {
      setProductErrorMessage("Please Enter Quantity");
    }
    if (!productData.productVariant) {
      setProductErrorMessage("Please Enter Product Variant");
    }
    if (!productData.product) {
      setProductErrorMessage("Please Enter Product Name");
    }

    if (
      productData.product &&
      productData.productVariant &&
      productData.quantity &&
      productData.deliveryLocation
    ) {
      const newProductDetails = data.productDetails.map((item, index) => {
        if (index === itemIdx) {
          return {
            product: productData.product,
            productVariant: productData.productVariant,
            quantity: productData.quantity,
            deliveryLocation: productData.deliveryLocation,
          };
        } else {
          return item;
        }
      });
      updateData({ productDetails: newProductDetails });
      updateProductData({
        product: "",
        productVariant: "",
        quantity: null,
        deliveryLocation: "",
      });
      setProductErrorMessage("");
      closeModalThree();
    }
  };

  const handleTermsStep = async () => {
    setStepCount(2);
    const data = await getTermsAndConditions(userData.userId);
    if (data?.data.statusCode === 200) {
      setTermsAndConditions(data.data.termsAndConditions);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".xlsx, .csv",
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const finalData = XLSX.utils.sheet_to_json(ws, { header: 1 });

        let productDetails = [];
        if (finalData.length > 1) {
          finalData.map((item, index) => {
            if (index !== 0) {
              if (item.length === 4) {
                let obj = {
                  product: item[0],
                  productVariant: item[1],
                  quantity: item[2],
                  deliveryLocation: item[3],
                };
                productDetails.push(obj);
              }
            }
          });
        }
        updateData({
          productDetails: [...data.productDetails, ...productDetails],
        });
        setModalOneIsOpen(false);
      };
      reader.readAsBinaryString(file);
    },
  });

  const handleFinalEventSubmit = async () => {
    let termsAndConditionsIds = [];
    let errorFlag = false;

    if (checkedItems) {
      for (let [key, value] of Object.entries(checkedItems)) {
        if (value) {
          termsAndConditionsIds.push(Number(key));
        }
      }
      if (termsAndConditionsIds.length < 1) {
        setFinalErrorMessage("Please Select Terms & Conditions");
        errorFlag = true;
      }
    }
    if (termsAndConditions.length < 1) {
      setFinalErrorMessage("Please Add Terms & Conditions");
      errorFlag = true;
    }
    if (data.productDetails.length < 1) {
      setFinalErrorMessage("Please Add Product Details");
      errorFlag = true;
    }
    if (!data.toDeliveryDate) {
      setFinalErrorMessage("Please select to Delivery Date");
      errorFlag = true;
    }
    if (!data.fromDeliveryDate) {
      setFinalErrorMessage("Please select from Delivery Date");
      errorFlag = true;
    }
    if (!data.eventTitle) {
      setFinalErrorMessage("Please Enter Event Title");
      errorFlag = true;
    }

    if (!errorFlag) {
      setFinalErrorMessage("");

      let finalObject = {
        userId: userData.userId,
        eventTitle: data.eventTitle,
        awardType: data.awardType,
        fromDeliveryDate: data.fromDeliveryDate,
        toDeliveryDate: data.toDeliveryDate,
        productDetails: data.productDetails,
        termsAndConditionsIds: termsAndConditionsIds,
        eventScheduleOption: startTimeOption,
        eventStartTime: eventStartTime,
        eventDurationOption: durationOption,
        eventDuration: eventDuration,
      };

      const result = await scheduleEvent(finalObject);
      setStepCount(3);
      window.location.href = "/dashboard/events";
    }
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
                  I&apos;ll award the entire lot to single vendor
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
              <h2>Select Delivery Date range</h2>
              <div className={styles.sub_delivery_date_section}>
                <label>From:</label>
                <DatePicker
                  selected={data.fromDeliveryDate}
                  onChange={(date) => updateData({ fromDeliveryDate: date })}
                  minDate={new Date()}
                  placeholderText="From Date"
                />
              </div>
              <div className={styles.sub_delivery_date_section}>
                <label>To:</label>
                <DatePicker
                  selected={data.toDeliveryDate}
                  onChange={(date) => updateData({ toDeliveryDate: date })}
                  minDate={new Date()}
                  placeholderText="To Date"
                />
              </div>
            </div>
            {stepCount === 0 && (
              <div className={styles.buttons_container}>
                <button className={styles.cancel_button}>Cancel</button>
                <button
                  className={styles.next_button}
                  onClick={() => setStepCount(1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
          {stepCount === 0 && (
            <Image
              src={TaskImage}
              alt="task"
              className={styles.task_side_img}
            />
          )}
        </div>
        {stepCount > 0 && (
          <div className={styles.product_details_container}>
            <div className={styles.product_details_header}>
              <h1>Product Details:</h1>
              <button
                className={styles.upload_sheet}
                onClick={() => {
                  openModalOne();
                }}
              >
                Upload Sheet
              </button>
            </div>
            <div className={styles.table_container}>
              <table className={styles.table_main}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Product Variant</th>
                    <th>Quantity</th>
                    <th>Delivery Location</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.productDetails.map((item, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0 ? styles.even_row : styles.odd_row
                      }
                    >
                      <td>{item.product}</td>
                      <td>{item.productVariant}</td>
                      <td>{item.quantity}</td>
                      <td>{item.deliveryLocation}</td>
                      <td>
                        <BiEditAlt
                          className={styles.edit_icon}
                          onClick={() => {
                            openModalThree(index);
                            updateProductData({
                              product: item.product,
                              productVariant: item.productVariant,
                              quantity: item.quantity,
                              deliveryLocation: item.deliveryLocation,
                            });
                          }}
                        />
                        <MdOutlineDelete
                          className={styles.delete_icon}
                          onClick={() => {
                            const newProductDetails =
                              data.productDetails.filter(
                                (item, i) => i !== index
                              );
                            updateData({ productDetails: newProductDetails });
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={styles.add_new_btn_container}>
                <button
                  className={styles.add_new_btn}
                  onClick={() => {
                    openModalTwo();
                  }}
                >
                  Add New
                </button>
              </div>
              {data.productDetails.length > 0 && stepCount === 1 && (
                <div className={styles.second_next_btn_section}>
                  <button
                    className={styles.next_button}
                    onClick={handleTermsStep}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        {stepCount > 1 && (
          <div className={styles.third_container}>
            <div className={styles.tc_container}>
              <h1>Terms & Conditions:</h1>
              <div className={styles.tc_section}>
                <div className={styles.tc_add_data_section}>
                  <h1>Please Select the Terms & Conditions You Agree With</h1>
                  {termsAndConditions &&
                    termsAndConditions.map((item) => (
                      <div
                        key={item.termsconditionsid}
                        className={styles.tc_data_list_section}
                      >
                        <input
                          type="checkbox"
                          id={item.termsconditionsid}
                          name={item.termsconditionsid}
                          checked={
                            checkedItems[item.termsconditionsid] || false
                          }
                          onChange={handleCheckChange}
                          className={styles.tc_checkbox}
                        />
                        <label htmlFor={item.termsconditionsid}>
                          {item.termsandconditionstext}
                        </label>
                      </div>
                    ))}
                  <div className={styles.add_tc_section}>
                    <input
                      type="text"
                      placeholder="Add your own terms & conditions"
                      name="termsAndConditionText"
                      onChange={handleTermsAndConditionTextChange}
                      className={styles.tc_input}
                      value={termsAndConditionText}
                    />
                    <button
                      className={styles.plus_button}
                      onClick={handleAddTermsAndConditions}
                    >
                      <IoMdAdd className={styles.plus_icon} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.event_schedule_container}>
              <h1>Event Schedule Date/Time:</h1>
              <div className={styles.event_schedule_options_section}>
                <label>
                  <input
                    type="radio"
                    value="now"
                    checked={startTimeOption === "now"}
                    onChange={handleOptionChange}
                    className={styles.radio_input}
                  />
                  Now
                </label>
                <label>
                  <input
                    type="radio"
                    value="custom"
                    checked={startTimeOption === "custom"}
                    onChange={handleOptionChange}
                    className={styles.radio_input}
                  />
                  Custom
                </label>
                {startTimeOption === "custom" && (
                  <div className={styles.custom_selection}>
                    <h1>Select custom Date and Time:</h1>
                    <DatePicker
                      selected={eventStartTime}
                      onChange={(date) => setEventStartTime(date)}
                      showTimeSelect
                      timeIntervals={10}
                      minDate={new Date()}
                      maxDate={new Date().setDate(new Date().getDate() + 30)}
                      minTime={minTime}
                      maxTime={maxTime}
                      dateFormat="MMMM d, yyyy h:mm aa"
                      placeholderText="Select Date & Time"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className={styles.event_duration_container}>
              <h1>Event Duration:</h1>
              <div className={styles.event_duration_options_section}>
                <label>
                  <input
                    type="radio"
                    value="30 mins"
                    checked={durationOption === "30 mins"}
                    onChange={handleDurationOptionChange}
                    className={styles.radio_input}
                  />
                  30 mins
                </label>
                <label>
                  <input
                    type="radio"
                    value="1hr"
                    checked={durationOption === "1hr"}
                    onChange={handleDurationOptionChange}
                    className={styles.radio_input}
                  />
                  1hr
                </label>
                <label>
                  <input
                    type="radio"
                    value="4hr"
                    checked={durationOption === "4hr"}
                    onChange={handleDurationOptionChange}
                    className={styles.radio_input}
                  />
                  4hr
                </label>
                <label>
                  <input
                    type="radio"
                    value="custom"
                    checked={durationOption === "custom"}
                    onChange={handleDurationOptionChange}
                    className={styles.radio_input}
                  />
                  Custom
                </label>
                {durationOption === "custom" && (
                  <select
                    value={eventDuration}
                    onChange={handleDurationChange}
                    className={styles.custom_duration_select}
                  >
                    {Array.from({ length: 24 }, (_, i) => i + 1).map((hour) => (
                      <option key={hour} value={`${hour} hr`}>
                        {hour} hr
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            <div className={styles.publish_button_section}>
              <span className={styles.error_message_txt}>
                {finalErrorMessage}
              </span>
              <button
                className={styles.publish_btn}
                onClick={handleFinalEventSubmit}
              >
                Publish
              </button>
            </div>
          </div>
        )}
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
        <div className={styles.modal_container}>
          <div {...getRootProps()} className={styles.file_uploader}>
            <input {...getInputProps()} />
            <p>Add or Drop your sheet here</p>
          </div>
          <div className={styles.template_section}>
            <p>OR</p>
            <p>You can download sample excel template here</p>
            <div className={styles.download_template_btn}>
              <a
                href="https://bwb-assets.s3.ap-south-1.amazonaws.com/Sample+Product+Details+Template.xlsx"
                download
              >
                Download Template
              </a>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={modalTwoIsOpen}
        onRequestClose={closeModalTwo}
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
        <div className={styles.modal_two_container}>
          <h1>Add Product Details</h1>
          <div className={styles.product_form_section}>
            <label htmlFor="product">Product:</label>
            <input
              type="text"
              className={styles.product_type_input}
              onChange={(e) => updateProductData({ product: e.target.value })}
              placeholder="Enter Product Name"
              id="product"
            />
            <label htmlFor="productVariant">Product Variant:</label>
            <input
              type="text"
              className={styles.product_type_input}
              onChange={(e) =>
                updateProductData({ productVariant: e.target.value })
              }
              placeholder="Enter Product Variant"
              id="productVariant"
            />
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="text"
              className={styles.product_type_input}
              onChange={(e) => updateProductData({ quantity: e.target.value })}
              placeholder="Enter Quantity"
              id="quantity"
            />
            <label htmlFor="deliveryLocation">Delivery Location:</label>
            <input
              type="text"
              className={styles.product_type_input}
              onChange={(e) =>
                updateProductData({ deliveryLocation: e.target.value })
              }
              placeholder="Enter Delivery Location"
              id="deliveryLocation"
            />
          </div>
          {productErrorMessage && (
            <span className={styles.error_message_txt}>
              {productErrorMessage}
            </span>
          )}
          <div className={styles.prd_btn_section}>
            <button
              className={styles.prd_cancel_button}
              onClick={() => {
                closeModalTwo();
                updateProductData({
                  product: "",
                  productVariant: "",
                  quantity: null,
                  deliveryLocation: "",
                });
              }}
            >
              Cancel
            </button>
            <button
              className={styles.prd_add_button}
              onClick={handleAddProduct}
            >
              Add
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={modalThreeIsOpen}
        onRequestClose={closeModalThree}
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
        <div className={styles.modal_two_container}>
          <h1>Edit Product Details</h1>
          <div className={styles.product_form_section}>
            <label htmlFor="product">Product:</label>
            <input
              type="text"
              className={styles.product_type_input}
              defaultValue={productData.product}
              onChange={(e) => updateProductData({ product: e.target.value })}
              placeholder="Enter Product Name"
              id="product"
            />
            <label htmlFor="productVariant">Product Variant:</label>
            <input
              type="text"
              className={styles.product_type_input}
              defaultValue={productData.productVariant}
              onChange={(e) =>
                updateProductData({ productVariant: e.target.value })
              }
              placeholder="Enter Product Variant"
              id="productVariant"
            />
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="text"
              className={styles.product_type_input}
              defaultValue={productData.quantity}
              onChange={(e) => updateProductData({ quantity: e.target.value })}
              placeholder="Enter Quantity"
              id="quantity"
            />
            <label htmlFor="deliveryLocation">Delivery Location:</label>
            <input
              type="text"
              className={styles.product_type_input}
              defaultValue={productData.deliveryLocation}
              onChange={(e) =>
                updateProductData({ deliveryLocation: e.target.value })
              }
              placeholder="Enter Delivery Location"
              id="deliveryLocation"
            />
          </div>
          {productErrorMessage && (
            <span className={styles.error_message_txt}>
              {productErrorMessage}
            </span>
          )}
          <div className={styles.prd_btn_section}>
            <button
              className={styles.prd_cancel_button}
              onClick={() => {
                closeModalThree();
                updateProductData({
                  product: "",
                  productVariant: "",
                  quantity: null,
                  deliveryLocation: "",
                });
              }}
            >
              Cancel
            </button>
            <button
              className={styles.prd_add_button}
              onClick={handleEditProduct}
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default NewEvent;

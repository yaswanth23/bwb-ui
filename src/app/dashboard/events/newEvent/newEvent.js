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

const NewEvent = () => {
  const [stepCount, setStepCount] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const EVENT_TYPE_DESCRIPTION = "Request for Quotation";

  const [data, updateData] = useReducer(
    (prev, next) => {
      const updateData = { ...prev, ...next };
      return updateData;
    },
    { eventTitle: "", awardType: 1, deliveryDate: null, productDetails: [] }
  );

  console.log(data);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
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
        setModalIsOpen(false);
      };
      reader.readAsBinaryString(file);
    },
  });

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
                  openModal();
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
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={styles.add_new_btn_container}>
                <button>Add New</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
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
    </>
  );
};

export default NewEvent;

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
import { useSelector } from "react-redux";
import { getTermsAndConditions } from "@/utils/api/event";
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
  console.log("----> tc", termsAndConditions);
  const [data, updateData] = useReducer(
    (prev, next) => {
      const updateData = { ...prev, ...next };
      return updateData;
    },
    { eventTitle: "", awardType: 1, deliveryDate: null, productDetails: [] }
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
              <div></div>
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

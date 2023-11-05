"use client";
import React, { useReducer, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import styles from "./contact.module.css";
import ContactUsSideImage from "../../../public/assets/images/tablets.png";

const hasNumberCheck = (text) => {
  const regex = /\d$/;
  return regex.test(text);
};

const hasCharacterCheck = (text) => {
  const regex = /^[0-9]+$/;
  return regex.test(text);
};

const ContactPage = () => {
  const apiUrl =
    "https://qar5m2k5ra.execute-api.ap-south-1.amazonaws.com/dev/v2";
  const [errorMessage, setErrorMessage] = useState("");

  const [data, updateData] = useReducer(
    (prev, next) => {
      const updateData = { ...prev, ...next };

      if (hasNumberCheck(updateData.fullName)) {
        updateData.fullName = prev.fullName;
      }

      if (hasNumberCheck(updateData.organisationName)) {
        updateData.organisationName = prev.organisationName;
      }

      if (!hasCharacterCheck(updateData.mobileNumber)) {
        updateData.mobileNumber = "";
      }

      return updateData;
    },
    { fullName: "", organisationName: "", emailId: "", mobileNumber: "" }
  );

  const validateEmail = (email) => {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return regex.test(email);
  };

  const handleFormSubmit = () => {
    const endpoint = apiUrl + "/misc/contact-us";
    if (!data.mobileNumber || data.mobileNumber.length > 10) {
      setErrorMessage("Please Enter a valid Mobile Number");
    }

    if (!validateEmail(data.emailId)) {
      setErrorMessage("Please Enter a valid Email");
    }

    if (!data.organisationName) {
      setErrorMessage("Please Enter your Organisation Name");
    }

    if (!data.fullName) {
      setErrorMessage("Please Enter your Full Name");
    }

    if (
      data.fullName &&
      data.organisationName &&
      data.emailId &&
      data.mobileNumber.length == 10
    ) {
      toast.success("Message sent Successfully", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
      const reqData = {
        fullname: data.fullName,
        organisationName: data.organisationName,
        emailId: data.emailId,
        mobileNumber: Number(data.mobileNumber),
      };
      fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqData),
      })
        .then((response) => response.json())
        .then((data) => {})
        .catch((error) => {
          console.error("Error:", error);
        });
      updateData({
        fullName: "",
        organisationName: "",
        emailId: "",
        mobileNumber: "",
      });
      setErrorMessage("");
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.section}>
          <div className={styles.left_section}>
            <Image
              src={ContactUsSideImage}
              alt="tablets"
              className={styles.contact_us_side_img}
            />
          </div>
          <div className={styles.right_section}>
            <div className={styles.contact_us_heading}>Contact us</div>
            <div className={styles.form_container}>
              <input
                type="text"
                placeholder="Full Name"
                value={data.fullName}
                onChange={(e) => updateData({ fullName: e.target.value })}
                className={styles.form_input}
              />
              <input
                type="text"
                placeholder="Organisation Name"
                value={data.organisationName}
                onChange={(e) =>
                  updateData({ organisationName: e.target.value })
                }
                className={styles.form_input}
              />
              <input
                type="email"
                placeholder="Email"
                value={data.emailId}
                onChange={(e) => updateData({ emailId: e.target.value })}
                className={styles.form_input}
              />
              <input
                type="text"
                placeholder="Mobile Number"
                value={data.mobileNumber}
                onChange={(e) => updateData({ mobileNumber: e.target.value })}
                className={styles.form_input}
              />
              <div className={styles.button_container}>
                <button
                  className={styles.submit_button}
                  onClick={handleFormSubmit}
                >
                  Submit
                </button>
              </div>
              <div className={styles.error_message_container}>
                <span className={styles.error_message}>{errorMessage}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
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

export default ContactPage;

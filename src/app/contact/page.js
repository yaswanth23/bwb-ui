"use client";
import React, { useReducer } from "react";
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
                <button className={styles.submit_button}>Submit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;

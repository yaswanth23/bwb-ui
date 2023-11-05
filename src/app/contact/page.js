"use client";
import React, { useReducer } from "react";
import Image from "next/image";
import styles from "./contact.module.css";
import ContactUsSideImage from "../../../public/assets/images/tablets.png";

const ContactPage = () => {
  const [data, updateData] = useReducer(
    (prev, next) => {
      const updateData = { ...prev, ...next };
      return updateData;
    },
    { fullName: "", organizationName: "", emailId: "", mobileNumber: null }
  );

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
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;

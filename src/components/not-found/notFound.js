import React from "react";
import styles from "./notFound.module.css";

const NotFoundPage = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.section}>
          <div className={styles.section_text}>This page is not available.</div>
          <div className={styles.section_button}>
            <a className={styles.home_button} href="/">
              Back To Home
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;

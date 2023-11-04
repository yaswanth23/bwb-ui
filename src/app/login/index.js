"use client";
import React, { useState } from "react";
import styles from "./login.module.css";

const LoginPage = () => {
  const [userIdentifier, setUserIdentifier] = useState("");

  const handleInputEmailId = (event) => {
    setUserIdentifier(event.target.value);
  };

  return (
    <>
      <div className={styles.main_container}>
        <div className={styles.login_container}>
          <div className={styles.login_header}>Login</div>
          <div className={styles.login_section}>
            <div className={styles.login_section_form}>
              <input
                type="text"
                value={userIdentifier}
                onChange={handleInputEmailId}
                placeholder="Email/Mobile Number"
                className={styles.login_sec_input}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;

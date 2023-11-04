"use client";
import React, { useState } from "react";
import styles from "./login.module.css";

const LoginPage = () => {
  return (
    <>
      <div className={styles.main_container}>
        <div className={styles.login_container}>
          <div className={styles.login_header}>Login</div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;

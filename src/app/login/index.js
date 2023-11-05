"use client";
import React, { useState } from "react";
import styles from "./login.module.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Link from "next/link";

const LoginPage = () => {
  const [userIdentifier, setUserIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleInputUserIdentifier = (event) => {
    setUserIdentifier(event.target.value);
  };

  const handleInputPassword = (event) => {
    setPassword(event.target.value);
  };

  return (
    <>
      <div className={styles.main_container}>
        <div className={styles.container}>
          <div className={styles.header}>Login</div>
          <div className={styles.section}>
            <div className={styles.section_form}>
              <div className={styles.input_section}>
                <input
                  type="text"
                  value={userIdentifier}
                  onChange={handleInputUserIdentifier}
                  placeholder="Email/Mobile Number"
                  className={styles.sec_input}
                />
              </div>
              <div className={styles.input_section}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handleInputPassword}
                  placeholder="Password"
                  className={styles.sec_input}
                />
                <div
                  className={styles.eye_icon_section}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                </div>
              </div>
              <div className={styles.button_container}>
                <button className={styles.login_button}>Login</button>
              </div>
              <div className={styles.contact_us_container}>
                <p>
                  Don’t have an account?{" "}
                  <Link className={styles.contact_us_link} href="/contact">
                    Contact Us
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
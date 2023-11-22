"use client";

import React, { useState } from "react";
import styles from "./login.module.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useDispatch } from "react-redux";
import { storeUserData, changeIsLoggedInUser } from "@/store/user/user.action";
import { loginUser } from "@/utils/api/auth";
import Loader from "@/components/loader/loader";

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [userIdentifier, setUserIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputUserIdentifier = (event) => {
    setUserIdentifier(event.target.value);
  };

  const handleInputPassword = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    if (!password) {
      setErrorMessage("Please Enter Password");
    }

    if (!userIdentifier) {
      setErrorMessage("Please Enter Email/Mobile Number");
    }

    if (userIdentifier && password) {
      const res = await signIn("credentials", {
        userIdentifier,
        password,
        redirect: false,
      });
      if (!res?.error) {
        const user = await loginUser(userIdentifier, password);
        dispatch(changeIsLoggedInUser());
        dispatch(storeUserData(user.data.userDetails));
        router.push("/dashboard");
        router.refresh();
        setIsLoading(false);
      } else {
        setErrorMessage("Invalid Credentials");
        setIsLoading(false);
      }
    }
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
              <div className={styles.error_message_container}>
                <span className={styles.error_message}>{errorMessage}</span>
              </div>
              <div className={styles.button_container}>
                {isLoading ? (
                  <Loader />
                ) : (
                  <button className={styles.login_button} onClick={handleLogin}>
                    Login
                  </button>
                )}
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

export default Login;

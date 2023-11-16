"use client";

import React, { useState, useEffect, useReducer } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./signup.module.css";

import NotFoundPage from "@/components/not-found/notFound";

const hasNumberCheck = (text) => {
  const regex = /\d$/;
  return regex.test(text);
};

const hasCharacterCheck = (text) => {
  const regex = /^[0-9]+$/;
  return regex.test(text);
};

const SignUpPage = () => {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const searchParams = useSearchParams();
  const key = searchParams.get("key");
  const [notFoundFlag, setNotFoundFlag] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (key) {
      setNotFoundFlag(false);
      verifyUniqueKey();
    } else {
      setNotFoundFlag(true);
    }
  }, []);

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
    {
      fullName: "",
      organisationName: "",
      emailId: "",
      mobileNumber: "",
      password: "",
    }
  );

  const validateEmail = (email) => {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return regex.test(email);
  };

  const verifyUniqueKey = async () => {
    const endpoint = apiUrl + "/misc/verify-key/" + key;

    fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data?.data?.statusCode === 200) {
          setNotFoundFlag(false);
        } else {
          setNotFoundFlag(true);
        }
        if (data?.error) {
          setErrorMessage(data?.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleFormSubmit = () => {
    const endpoint = apiUrl + "/auth/signup";
    if (data.password.length < 8) {
      setErrorMessage(
        "Please provide a valid password with a minimum length of 8 characters"
      );
    }

    if (
      !data.mobileNumber ||
      (data.mobileNumber.length > 10 && data.mobileNumber.length < 10)
    ) {
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
      key &&
      data.fullName &&
      data.organisationName &&
      data.emailId &&
      data.mobileNumber.length == 10 &&
      data.password.length > 8
    ) {
      const reqData = {
        key: key,
        fullName: data.fullName,
        organisationName: data.organisationName,
        emailId: data.emailId,
        mobileNumber: data.mobileNumber,
        roleId: 1001,
        password: data.password,
      };

      fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data?.error) {
            setErrorMessage(data?.message);
          }
          if (data?.data?.statusCode === 200) {
            toast.success("Signup request sent successfully", {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 3000,
            });
            router.push("/");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      updateData({
        fullName: "",
        organisationName: "",
        emailId: "",
        mobileNumber: "",
        password: "",
      });
    }
  };

  return (
    <>
      {notFoundFlag ? (
        <NotFoundPage />
      ) : (
        <>
          <div className={styles.container}>
            <div className={styles.section_one}>
              <div className={styles.section_main}>
                <h1 className={styles.header_text}>
                  Sign up in to the world of <span>ease living</span>
                </h1>
                <p className={styles.sub_heading}>Our Advantages</p>
                <ul>
                  <li>
                    <div className={styles.rect_icon}></div>Partnering for
                    Healthier Tomorrows
                  </li>
                  <li>
                    <div className={styles.rect_icon}></div>Supplying Wellness,
                    Enhancing Lives
                  </li>
                  <li>
                    <div className={styles.rect_icon}></div>A Vital Link in
                    Healthcare
                  </li>
                  <li>
                    <div className={styles.rect_icon}></div>Beyond Supplies, We
                    Deliver Care
                  </li>
                </ul>
              </div>
            </div>
            <div className={styles.section_two}>
              <div className={styles.section_inputs}>
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
                <div className={styles.input_section}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={data.password}
                    onChange={(e) => updateData({ password: e.target.value })}
                    className={styles.sec_input}
                  />
                  <div
                    className={styles.eye_icon_section}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <AiOutlineEye />
                    ) : (
                      <AiOutlineEyeInvisible />
                    )}
                  </div>
                </div>
                <div className={styles.error_message_container}>
                  <span className={styles.error_message}>{errorMessage}</span>
                </div>
              </div>
              <div className={styles.button_container}>
                <button
                  className={styles.submit_button}
                  onClick={handleFormSubmit}
                >
                  Sign Up
                </button>
              </div>
              <div className={styles.login_container}>
                <p>
                  Already have an account?{" "}
                  <Link className={styles.login_link} href="/">
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
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

export default SignUpPage;

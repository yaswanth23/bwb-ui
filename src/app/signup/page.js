"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./signup.module.css";

import NotFoundPage from "@/components/not-found/notFound";

const SignUpPage = () => {
  const apiUrl =
    "https://qar5m2k5ra.execute-api.ap-south-1.amazonaws.com/dev/v2";
  const searchParams = useSearchParams();
  const key = searchParams.get("key");
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  useEffect(() => {
    if (key) {
      setNotFoundFlag(false);
      verifyUniqueKey();
    } else {
      setNotFoundFlag(true);
    }
  }, []);

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
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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
            <div className={styles.section_two}>2</div>
          </div>
        </>
      )}
    </>
  );
};

export default SignUpPage;

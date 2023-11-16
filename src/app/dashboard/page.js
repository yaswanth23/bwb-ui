"use client";

import React from "react";
import Image from "next/image";
import SignalIcon from "../../../public/assets/svg/signal.svg";
import NoteIcon from "../../../public/assets/svg/note.svg";
import CancelIcon from "../../../public/assets/svg/cancel.svg";
import BidIcon from "../../../public/assets/svg/bid.svg";
import MoneyIcon from "../../../public/assets/svg/money.svg";
import styles from "./dashboard.module.css";

const dashboardItems = [
  {
    title: "Live Events",
    color: "#0048FF",
    icon: <Image src={SignalIcon} alt="Signal Icon" />,
    value: "0",
  },
  {
    title: "Total Events",
    color: "#008CFF",
    icon: <Image src={NoteIcon} alt="Note Icon" />,
    value: "0",
  },
  {
    title: "Closed Events",
    color: "#FF0909",
    icon: <Image src={CancelIcon} alt="Cancel Icon" />,
    value: "0",
  },
  {
    title: "Bid Received",
    color: "#FF7C03",
    icon: <Image src={BidIcon} alt="Bid Icon" />,
    value: "0",
  },
  {
    title: "Total Value",
    color: "#08A65C",
    icon: <Image src={MoneyIcon} alt="Money Icon" />,
    value: "0",
  },
];

const Dashboard = () => {
  return (
    <div className={styles.dashboard_container}>
      <div className={styles.dashboard_metrics_section}>
        {dashboardItems.map((item, index) => (
          <div className={styles.dashboard_section} key={index}>
            <div
              className={styles.dashboard_bg}
              style={{ backgroundColor: item.color }}
            ></div>
            <div className={styles.dashboard_content_section}>
              <div className={styles.dashboard_section_content}>
                <div className={styles.circle_bg}>{item.icon}</div>
                <p className={styles.title}>{item.title}</p>
              </div>
              <div className={styles.value_section}>
                <h2>{item.value}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

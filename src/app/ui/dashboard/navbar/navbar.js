"use client";

import { MdSearch, MdNotifications } from "react-icons/md";
import { PiUserFill } from "react-icons/pi";
import { useSelector } from "react-redux";
import { selectUserData } from "@/store/user/user.selector";
import styles from "./navbar.module.css";

const Navbar = () => {
  const userData = useSelector(selectUserData);

  return (
    <div className={styles.container}>
      <div className={styles.greeting}>Welcome Back, {userData.fullName}</div>
      <div className={styles.menu}>
        <div className={styles.search}>
          <MdSearch className={styles.search_icon} />
          <input type="text" placeholder="Search" className={styles.input} />
        </div>
        <div className={styles.icons}>
          <div className={styles.circle}>
            <MdNotifications className={styles.notifications_icon} />
          </div>
          <div className={styles.circle}>
            <PiUserFill className={styles.user_icon} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

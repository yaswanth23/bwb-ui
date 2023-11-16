"use client";

import {
  MdHome,
  MdEvent,
  MdOutlineQueryStats,
  MdExitToApp,
} from "react-icons/md";
import Link from "next/link";
import styles from "./sidebar.module.css";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { signOut } from "next-auth/react";
import { changeIsLoggedOutUser } from "@/store/user/user.action";

const menuItems = [
  {
    title: "Home",
    path: "/dashboard",
    icon: <MdHome className={styles.home_icon} />,
  },
  {
    title: "Events",
    path: "/dashboard/events",
    icon: <MdEvent className={styles.event_icon} />,
  },
  {
    title: "Analytics",
    path: "/dashboard/analytics",
    icon: <MdOutlineQueryStats className={styles.stats_icon} />,
  },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();

  const handleLogout = () => {
    dispatch(changeIsLoggedOutUser());
    signOut();
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo_container}>
        <Link href="/dashboard" className={styles.logo_content}>
          <span className={styles.logo_sub_content}>bharat</span>wellbeing
        </Link>
      </div>
      <ul className={styles.list}>
        {menuItems.map((item) => (
          <li key={item.title}>
            <Link
              href={item.path}
              className={`${styles.item_name} ${
                pathname === item.path && styles.active
              }`}
            >
              {item.icon}
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
      <div className={styles.logout_button_container}>
        <button className={styles.logout_button} onClick={handleLogout}>
          <MdExitToApp className={styles.exit_icon} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

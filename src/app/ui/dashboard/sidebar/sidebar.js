"use client";

import { MdHome, MdEvent, MdOutlineQueryStats } from "react-icons/md";
import Link from "next/link";
import styles from "./sidebar.module.css";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "Home",
    path: "/dashboard",
    icon: <MdHome />,
  },
  {
    title: "Events",
    path: "/dashboard/events",
    icon: <MdEvent />,
  },
  {
    title: "Analytics",
    path: "/dashboard/analytics",
    icon: <MdOutlineQueryStats />,
  },
];

const Sidebar = () => {
  const pathname = usePathname();
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
    </div>
  );
};

export default Sidebar;

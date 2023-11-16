import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Sidebar from "../ui/dashboard/sidebar/sidebar";
import Navbar from "../ui/dashboard/navbar/navbar";
import styles from "./dashboard.module.css";

const Layout = async ({ children }) => {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.menu}>
          <Sidebar />
        </div>
        <div className={styles.content}>
          <Navbar />
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;

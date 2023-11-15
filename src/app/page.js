"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectIsUserLoggedIn } from "@/store/user/user.selector";
import { useRouter, usePathname, redirect } from "next/navigation";
import LoginPage from "./login/page";
import Layout from "./dashboard/layout";

const Home = () => {
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isUserLoggedIn) {
      router.push("/login");
    }

    if (isUserLoggedIn && pathname === "/") {
      redirect("/dashboard");
    }
  }, [isUserLoggedIn, router, pathname]);

  return <main>{isUserLoggedIn ? <Layout /> : <LoginPage />}</main>;
};

export default Home;

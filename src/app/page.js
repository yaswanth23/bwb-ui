"use client";
import React from "react";
import { useSelector } from "react-redux";
import { selectIsUserLoggedIn } from "@/store/user/user.selector";
import LoginPage from "./login";
import HomePage from "./home/page";

const Home = () => {
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);

  return <main>{isUserLoggedIn ? <HomePage /> : <LoginPage />}</main>;
};

export default Home;

import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const Home = async () => {
  const session = await getServerSession();
  if (session) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }

  return <main>Not found</main>;
};

export default Home;

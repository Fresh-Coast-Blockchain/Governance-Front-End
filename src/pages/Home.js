import React from "react";
import Header from "../components/Header/Header";
import Hero from "../components/Hero/Hero";
import MyLoader from "../components/Modal/MyLoader";
import SecondFrame from "../components/SecondFrame/SecondFrame";
import HomeBase from "../components/HomeBase/HomeBase";
import { AuthProvider } from "../contexts/AuthProvider";

function Results() {
  return (
    <div className="font-headFont relative ">
      <AuthProvider>
        <Header bg={"bg-bgBlue"} />
        <Hero />
        <SecondFrame />

        <MyLoader />
      </AuthProvider>
    </div>
  );
}

export default Results;

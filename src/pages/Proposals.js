import React from "react";
import Header from "../components/Header/Header";
import Hero from "../components/Hero/Hero";
import SecondFrame from "../components/SecondFrame/SecondFrame";
import HomeBase from "../components/HomeBase/HomeBase";
import { AuthProvider } from "../contexts/AuthProvider";
import HolderHero from "../components/Hero/HolderHero";
import HolderSecond from "../components/HolderSecond/HolderSecond";
import MyLoader from "../components/Modal/MyLoader";


function Proposals() {
  return (
    <div className="font-headFont relative ">
      <AuthProvider>
        <Header bg={"bg-bgGray"} />
        <HolderHero />
        <HolderSecond />
        <MyLoader />
      </AuthProvider>
    </div>
  );
}

export default Proposals;

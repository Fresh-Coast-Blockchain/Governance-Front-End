import React, { useState } from "react";
import CreatorSecond from "../components/CreatorSecond/CreatorSecond";
import Header from "../components/Header/Header";
import CreatorHero from "../components/Hero/CreatorHero";
import Modal from "../components/Modal/Modal";
import MyLoader from "../components/Modal/MyLoader";
import { AuthProvider } from "../contexts/AuthProvider";

function CoinCreator() {
  return (
    <div className="font-headFont relative ">
      <AuthProvider>
        <Header bg={"bg-bgBlue"} />
        <CreatorHero />
        <CreatorSecond />
        <MyLoader />
      </AuthProvider>
    </div>
  );
}

export default CoinCreator;

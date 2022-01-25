import React from "react";
import Header from "../components/Header/Header";
import ResultHero from "../components/Hero/ResultHero";
import MyLoader from "../components/Modal/MyLoader";
import ResultSecond from "../components/ResultSecond/ResultSecond";
import HomeBase from "../components/HomeBase/HomeBase";
import { AuthProvider } from "../contexts/AuthProvider";

function Home() {
  return (
    <div className="font-headFont relative ">
      <AuthProvider>
        <Header bg={"bg-bgBlue"} />
        <ResultHero />
        <ResultSecond />

        <MyLoader />
      </AuthProvider>
    </div>
  );
}

export default Home;

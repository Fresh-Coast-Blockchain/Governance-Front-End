import React from "react";
import coin from "../../images/coin.png";
import Card from "../Card/Card";
import CoinHolderSecond from "../CoinHolderSecond/CoinHolderSecond";

function HomeBase() {
  return (
    <div>
      {/**get coinholder contract listing section */}
      <CoinHolderSecond page={"home"} />
    </div>
  );
}

export default HomeBase;

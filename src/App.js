import "./index.css";
import Results from "./pages/Results";
import CoinHolder from "./pages/CoinHolder";
import CoinCreator from "./pages/CoinCreator";
import PageNotFound from "./pages/PageNotFound";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Proposals from "./pages/Proposals";
import { useMoralis } from "react-moralis";
import { useEffect } from "react";

function App() {
  const {
    isWeb3Enabled,
    enableWeb3,
    isAuthenticated,
    isWeb3EnableLoading,
    Moralis,
    account,
  } = useMoralis();

  useEffect(() => {
    //enable web3
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/results" exact element={<Results />} />
          <Route path="/holder" exact element={<CoinHolder />} />
          <Route path="/creator/:section" exact element={<CoinCreator />} />
          <Route
            path="/proposals/:address/:section"
            exact
            element={<Proposals />}
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

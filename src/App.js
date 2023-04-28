import "./App.css";
import { useEffect, useState, useRef } from "react";
import Navigation from "./Navigation/Navigation";
import Info from "./Views/Info";
import Main from "./Views/Main";
import Management from "./Views/Management";
import getWeb3 from "./Web3/InitWeb3";

import shipment_sc_data from "./Contract_JSONs/shipment_sc.json";

//HOSTING AWS AMPLIFYs

const App = () => {
  const web3 = useRef(0);
  const accounts = useRef(0);
  const contractInstance = useRef(0);

  const [nav, setNav] = useState("Main");

  useEffect(() => {
    const getWeb3async = () => {
      return getWeb3();
    };

    const getAccounts = async () => {
      await window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((value) => {
          accounts.current = value;
        })
        .catch((err) => {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            console.log("Please connect to MetaMask.");
          } else {
            console.error(err);
          }
        });
    };
    web3.current = getWeb3async();
    getAccounts();
    contractInstance.current = new web3.current.eth.Contract(
      shipment_sc_data.abi,
      shipment_sc_data.address
    );
  });

  return (
    <div className="App">
      <Navigation nav={nav} setNav={setNav} />
      <br />
      {nav === "Main" ? (
        <Main contract={contractInstance.current} accounts={accounts.current} />
      ) : (
        ""
      )}
      {nav === "Management" ? (
        <Management
          contract={contractInstance.current}
          accounts={accounts.current}
        />
      ) : (
        ""
      )}
      {nav === "Info" ? (
        <Info contract={contractInstance.current} accounts={accounts.current} />
      ) : (
        ""
      )}
    </div>
  );
};

export default App;

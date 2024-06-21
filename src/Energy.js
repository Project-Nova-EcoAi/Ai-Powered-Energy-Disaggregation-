import React, { useState, useEffect } from "react";
import Web3 from "web3";
import EnergyNFTContract from "./contracts/EnergyNFT.json";
import './EnergyNFT.css';

const EnergyNFT = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [uri, setUri] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [recipient, setRecipient] = useState("");
  const [threshold, setThreshold] = useState("");
  const [consumption, setConsumption] = useState("");

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        setWeb3(web3);
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = EnergyNFTContract.networks[networkId];
        const instance = new web3.eth.Contract(
          EnergyNFTContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        setContract(instance);
      }
    };
    init();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
    } else {
      alert("Please install MetaMask to use this feature.");
    }
  };

  const handleMint = async () => {
    if (contract) {
      await contract.methods.safeMint(recipient, tokenId, uri, threshold).send({ from: account });
    }
  };

  const handleUpdateConsumption = async () => {
    if (contract) {
      await contract.methods.updateConsumption(tokenId, consumption).send({ from: account });
    }
  };

  return (
    <div className="container">
      <h1>EnergyNFT DApp</h1>
      <div className="account-info">
        <p>Connected account: {account ? account : "Not connected"}</p>
        <button onClick={connectWallet}>Connect Wallet</button>
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input
          type="text"
          placeholder="Token ID"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Token URI"
          value={uri}
          onChange={(e) => setUri(e.target.value)}
        />
        <input
          type="text"
          placeholder="Threshold"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
        />
        <button onClick={handleMint}>Mint Energy Token</button>
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="Token ID"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Current Consumption"
          value={consumption}
          onChange={(e) => setConsumption(e.target.value)}
        />
        <button onClick={handleUpdateConsumption}>Update Consumption</button>
      </div>
    </div>
  );
};

export default EnergyNFT;

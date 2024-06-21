import React, { useState, useEffect } from "react";
import Web3 from "web3";
import MyNFTContract from "./contracts/MyNFT.json"; // The ABI JSON file
import './myNFT.css'; // Import the CSS file for styling

const MyNFT = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [uri, setUri] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [recipient, setRecipient] = useState("");

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        setWeb3(web3);
        const accounts = await web3.eth.requestAccounts();
        setAccount(accounts[0]);

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = MyNFTContract.networks[networkId];
        const instance = new web3.eth.Contract(
          MyNFTContract.abi,
          deployedNetwork && deployedNetwork.address
        );

        setContract(instance);
      }
    };
    init();
  }, []);

  const handleMint = async () => {
    if (contract) {
      await contract.methods.safeMint(recipient, tokenId, uri).send({ from: account });
    }
  };

  const handlePause = async () => {
    if (contract) {
      await contract.methods.pause().send({ from: account });
    }
  };

  const handleUnpause = async () => {
    if (contract) {
      await contract.methods.unpause().send({ from: account });
    }
  };

  return (
    <div className="container">
      <h1>MyNFT DApp</h1>
      <div className="account-info">
        <p>Connected account: {account}</p>
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
        <button onClick={handleMint}>Mint NFT</button>
      </div>
      <div className="control-group">
        <button className="pause" onClick={handlePause}>Pause Contract</button>
        <button className="unpause" onClick={handleUnpause}>Unpause Contract</button>
      </div>
    </div>
  );
};

export default MyNFT;

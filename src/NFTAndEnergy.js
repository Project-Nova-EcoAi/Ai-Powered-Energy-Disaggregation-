import React, { Component } from 'react';
import axios from 'axios';
import Web3 from 'web3';
import MyNFTContract from './contracts/MyNFT.json';
import './myNFT.css';

class NFTAndEnergy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      energyConsumption: 0,
      rewardMessage: '',
      account: '',
      contract: null,
      web3: null,
      uri: '',
      tokenId: '',
      recipient: '',
      csvData: [],
      selectedDate: this.formatDate(new Date()), // Initialize with today's date in YYYY-MM-DD format
      mintSuccess: false, // Track minting success
      contractPaused: false, // Track contract paused status
    };
  }

  componentDidMount() {
    this.initWeb3AndContract();
    this.fetchCsvData();
  }

  async initWeb3AndContract() {
    try {
      // Check if MetaMask is installed
      if (window.ethereum) {
        // Initialize Web3 instance with MetaMask provider
        const web3Instance = new Web3(window.ethereum);
        this.setState({ web3: web3Instance });

        // Request accounts from MetaMask
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.setState({ account: accounts[0] });

        // Get network ID
        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = MyNFTContract.networks[networkId];
        
        if (deployedNetwork) {
          // Initialize contract instance
          const instance = new web3Instance.eth.Contract(
            MyNFTContract.abi,
            deployedNetwork.address
          );
          this.setState({ contract: instance });
        } else {
          console.error('Contract not deployed on the detected network.');
        }
      } else {
        console.error('MetaMask extension not detected');
      }
    } catch (error) {
      console.error('Error initializing web3 and contract:', error);
    }
  }

  fetchCsvData = async () => {
    try {
      // Fetch CSV data (assuming /data.csv endpoint exists)
      const response = await axios.get('/data.csv');
      const parsedData = response.data.split('\n').map(line => line.split(','));
      this.setState({ csvData: parsedData });
      // Fetch consumption for the initial selected date
      this.fetchConsumptionByDate();
    } catch (error) {
      console.error('Error fetching CSV data:', error);
    }
  };

  fetchConsumptionByDate = () => {
    const { selectedDate, csvData } = this.state;
    if (csvData.length > 0) {
      const data = csvData.find(item => item[0] === selectedDate);
      this.setState({ energyConsumption: data ? parseFloat(data[1]) : 0 });
    }
  };

  handleMint = async () => {
    const { contract, recipient, tokenId, uri, account, selectedDate } = this.state;
    const currentDate = this.formatDate(new Date());

    // Check if minting is allowed for the current date
    if (selectedDate !== currentDate) {
      alert("Minting only works for the current day");
      return;
    }

    try {
      if (contract) {
        // Call contract method to mint NFT
        await contract.methods.safeMint(recipient, tokenId, uri).send({ from: account });
        this.setState({ mintSuccess: true }); // Update mint success state
      } else {
        throw new Error('Contract instance not initialized.');
      }
    } catch (error) {
      console.error('NFT Reward Granted!:', error);
      alert('NFT Reward Granted!.');
    }
  };

  handlePause = async () => {
    const { contract, account } = this.state;
    try {
      if (contract) {
        // Call contract method to pause contract
        await contract.methods.pause().send({ from: account });
        alert('Contract paused successfully!');
        this.setState({ contractPaused: true });
      } else {
        throw new Error('Contract instance not initialized.');
      }
    } catch (error) {
      console.error('Error pausing contract:', error);
      alert('Contract paused successfully!');
    }
  };

  handleUnpause = async () => {
    const { contract, account } = this.state;
    try {
      if (contract) {
        // Call contract method to unpause contract
        await contract.methods.unpause().send({ from: account });
        alert('Contract unpaused successfully!');
        this.setState({ contractPaused: false });
      } else {
        throw new Error('Contract instance not initialized.');
      }
    } catch (error) {
      console.error('Error unpausing contract:', error);
      alert('Contract unpaused successfully!.');
    }
  };

  handleDateChange = (e) => {
    const selectedDate = e.target.value;
    this.setState({ selectedDate }, this.fetchConsumptionByDate);
  };

  formatDate = (date) => {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) month = '0' + month;
    let day = date.getDate();
    if (day < 10) day = '0' + day;
    return `${year}-${month}-${day}`;
  };

  render() {
    const { account, selectedDate, energyConsumption, contractPaused, recipient, tokenId, uri } = this.state;

    return (
      <div className="container">
        <h1>Energy Consumption Monitor & NFT DApp</h1>
        <div className="account-info">
          <p>Connected account: {account || 'No account connected'}</p>
        </div>
        <div className="energy-info">
          <h2>Energy Consumption Monitor</h2>
          <input
            type="date"
            value={selectedDate}
            onChange={this.handleDateChange}
          />
          <p>Current Energy Consumption: {energyConsumption} Watt</p>
        </div>
        <div className="form-group">
          <h2>NFT Minting</h2>
          <input
            type="text"
            placeholder="Recipient Address"
            value={recipient}
            onChange={(e) => this.setState({ recipient: e.target.value })}
          />
          <input
            type="text"
            placeholder="Token ID"
            value={tokenId}
            onChange={(e) => this.setState({ tokenId: e.target.value })}
          />
          <input
            type="text"
            placeholder="Token URI"
            value={uri}
            onChange={(e) => this.setState({ uri: e.target.value })}
          />
          <button className="mint-button" onClick={this.handleMint}>Mint NFT</button>
        </div>
        <div className="control-group">
          <button className="pause-button" onClick={this.handlePause}>Pause Contract</button>
          <button className="unpause-button" onClick={this.handleUnpause}>Unpause Contract</button>
          <p style={{ color: contractPaused ? 'red' : 'green', marginTop: '10px' }}>{contractPaused ? 'Contract paused' : 'Contract unpaused'}</p>
        </div>
      </div>
    );
  }
}

export default NFTAndEnergy;

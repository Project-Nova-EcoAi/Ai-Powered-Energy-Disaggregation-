const express = require('express');
const Web3 = require('web3');
const MyNFT = require('./build/contracts/MyNFT.json'); // Path to your compiled contract
const app = express();
const port = 3000;

const web3 = new Web3('http://localhost:7545'); // Replace with your Ethereum node URL
const contractAddress = '0xYourContractAddress'; // Replace with your contract address
const contract = new web3.eth.Contract(MyNFT.abi, contractAddress);
const ownerAddress = '0xOwnerAddress'; // Replace with the owner's address

app.use(express.json());

app.post('/reward', async (req, res) => {
    const { energyConsumption, userAddress, tokenId, tokenURI } = req.body;

    try {
        const receipt = await contract.methods.rewardIfEnergyLow(userAddress, energyConsumption, tokenId, tokenURI).send({ from: ownerAddress });
        res.send(receipt);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

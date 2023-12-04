require('dotenv').config();
const { Alchemy, Network, fromHex } = require("alchemy-sdk");
const express = require('express');
const app = express();
const port = 3000;
const config = {
    apiKey: process.env.ALCHEMY_SEPOLIA,
    network: Network.ETH_SEPOLIA
};
const alchemy = new Alchemy(config);
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

app.post('/history', async (req, res) => {
    console.log(req.body);
    try {
        const address = req.body.address;
        const tokenId = req.body.tokenid.toString(16).toLowerCase();
        if (!address) {
            return res.status(400).json({ error: 'Contract address is required in the request body.' });
        }
        const response = await alchemy.core.getAssetTransfers({
            fromBlock: "0x0",
            contractAddresses: [address],
            category: ["erc721"],
            excludeZeroValue: false,
        })
        console.log("req.body:", req.body);
        console.log("response.transfers:", response.transfers);
        console.log("Formatted tokenId:", tokenId);
        const txns = response.transfers.filter(
            (txn) => txn.erc721TokenId.toLowerCase().startsWith(tokenId)
        );
        console.log("Filtered txns:", txns);
        res.status(200).json(txns);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
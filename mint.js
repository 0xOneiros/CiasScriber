require('dotenv').config();
const { SigningStargateClient, GasPrice, coins } = require("@cosmjs/stargate");
const { DirectSecp256k1Wallet } = require('@cosmjs/proto-signing');
const { readFileSync } = require("fs");
const {base64FromBytes} = require("cosmjs-types/helpers");

async function performTransaction(walletInfo, numberOfTimes) {
    const denom = process.env.TOKEN_DENOM;
    const chain = process.env.CHAIN_SYMBOL;
    const rpcEndpoint = process.env.NODE_URL;
    const gasPrice = GasPrice.fromString(`0.025${denom}`);
    const wallet = await DirectSecp256k1Wallet.fromKey(Buffer.from(walletInfo.privateKey, "hex"), chain);
    const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet, { gasPrice: gasPrice });
    const fee = {
        amount: coins(process.env.GAS_PRICE, denom),
        gas: process.env.GAS_LIMIT,
    };
    console.log(`init`);
    let successCount = 0;
    let attemptCount = 0;

    const tick = process.env.TICK
    const protocol = process.env.PROTOCOL
    const mintAmount = parseInt(process.env.MINT_AMOUNT)

    while (successCount < numberOfTimes) {
        try {
            const [account] = await wallet.getAccounts();
            const amount = coins(1, denom); // Rotation 1
            const memo = `data:,{"op":"mint","amt":${mintAmount},"tick":"${tick}","p":"${protocol}"}`; // It may change here.
            console.log(`memo = ${memo}`);

            const result = await client.sendTokens(account.address, account.address, amount, fee, base64FromBytes(Buffer.from(memo, 'utf8')));
            console.log(`${account.address}, e.g. ${successCount + 1} Successful operation: ${`https://www.mintscan.io/${chain}/tx/` + result.transactionHash}`);
            successCount++;
        } catch (error) {
            console.error(`Number of attempts ${attemptCount + 1} fail: `, error);
            attemptCount++;
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait one second after failure
        }
    }

    console.log(`Total number of attempts: ${attemptCount}, Number of successes: ${successCount}`);
}


async function main() {
    const walletsFile = process.env.WALLET_JSON_FILE;
    const tokenDecimal = parseInt(process.env.TOKEN_DECIMAL);
    const chain = process.env.CHAIN_SYMBOL;
    const denom = process.env.TOKEN_DENOM;
    let walletData = [];
    try {
        walletData = JSON.parse(readFileSync(walletsFile, 'utf-8'));
    } catch (e) {
        console.log(`not found ${walletsFile}, Use only the configured primary wallet`);
    }

    const privateKey = process.env.PRIVATE_KEY;
    const wallet = await DirectSecp256k1Wallet.fromKey(Buffer.from(privateKey, "hex"), chain);
    const [account] = await wallet.getAccounts();
    const walletAddress = account.address;

    const client = await SigningStargateClient.connectWithSigner(process.env.NODE_URL, wallet);
    const balance = await client.getBalance(walletAddress, denom);
    console.log(`wallet: ${walletAddress} balance: ${parseFloat(balance.amount) / tokenDecimal}`);

    walletData.push({
        "address": walletAddress,
        "privateKey": privateKey
    });
    Promise.all(walletData.map(wallet => performTransaction(wallet, parseInt(process.env.MINT_TIMES))))
        .then(() => {
            console.log("All operations are complete.");
        })
        .catch(error => {
            console.error("An error occurred during operation: ", error);
        });
}

main();

# Celestia(tia) public chain inscription cias mint scripts

## code reference [qzz0518/coss](https://github.com/qzz0518/coss)

### Step 1: setting

```
git clone https://github.com/sfter/cias-mint
yarn install
cp .env.example .env
```

### Step 2: Configuring Environment Variables

Modify the .env file in the script source directory

```bash
# rpc configuration, you can find your favorite node server at https://atomscan.com/directory/celestia
NODE_URL=https://public-celestia-rpc.numia.xyz
# NODE_URL=https://celestia-rpc.mesa.newmetric.xyz

# the private key of the main wallet (the money wallet), which is used to transfer money to other wallets that are actually used for Mint
PRIVATE_KEY=

# Generate wallet configurations, on demand
# How many Mint wallets to generate
NUM_OF_WALLETS=5
# Real Mint's wallet file, where all generated wallets are located
WALLET_JSON_FILE=wallets.json

# celestia configuration
CHAIN_SYMBOL=celestia
TOKEN_DENOM=utia
TOKEN_DECIMAL=1000000

# of TIAs transferred from the main wallet (money wallet) to each real Mint wallet
TOKEN_TRANSFER_AMOUNT=2

# gas configuration
GAS_PRICE=10000
GAS_LIMIT=100000

# mint configuration, must be configured according to official parameters
MINT_AMOUNT=10000
# Name of inscription tokens
TICK=cias
# Protocol type
PROTOCOL=cia-20

# of mints per wallet
MINT_TIMES=10

```

### Step 3: Batch Generate Mint Wallet

```bash
node wallet_gen.js
```

### Step 4: Bulk Transfer from Main Wallet (Money Wallet) to Mint Wallet

```bash
node transfer.js
```

### Step 5: Run the Mint program to start Mint

```bash
node mint.js
```

### Special note
If the keplr wallet doesn't export the private key, you can do it as follows
> - Configure the .env file first, leaving PRIVATE_KEY empty.
> - Leave PRIVATE_KEY empty.
> - Use node wallet_gen. 
> - Generate the wallet using node wallet_gen.js.
> 
> > - Open wallet.js in the current directory. 
> - Open wallet.json file in current directory
>
> > - Select any one of the wallets as the main wallet. 
> - Select any of the wallets as the main wallet.
> 
> 
> - Open keplr wallet and transfer some $TIA to the wallet address you chose in step 4 above.
> 
> 
> - Configure the wallet address you chose in step 4 above into the PRIVATE_KEY field in the .env file.
> 
> 
> - Executing node transfer.js will perform a bulk transfer from the wallet selected in step 4 above to other Mint wallets.
> 
> 
> - Execute node mint.js to start bulk Mint, done OK.

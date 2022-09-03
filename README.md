# NFT Marketplace 🛒

[![Hardhat Tests](https://github.com/miguelleonmarti/nft-marketplace-task/actions/workflows/hardhat_tests.yml/badge.svg)](https://github.com/miguelleonmarti/nft-marketplace-task/actions/workflows/hardhat_tests.yml) ![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=nft-marketplace-0x-brown)

Marketplace to sell and buy NFTs (ERC721) with ERC20 tokens through the [0x v4 protocol].

![Website Image](./public/assets/images/website.png)

## Hardhat ⛓

### Setup

- Install dependencies

```sh
cd hardhat && npm install
```

- Create .env file (like .env.example) with your keys

```sh
INFURA_API_KEY=
PRIVATE_KEY= # your account's private key in order to deploy contracts
ETHERSCAN_API_KEY= # to verify the deployed contracts
```

- To compile the contracts and generate typechain typings for compiled contracts:

```sh
npx hardhat clean && npx hardhat compile && npx hardhat typechain
```

- (Optional) You need to copy and paste the Typechain typings generated to the frontend directory so the Dapp works. There is already a script for that:

```sh
npm run typechain
```

- Run tests:

```sh
npx hardhat test
```

## Frontend 💻

### Tools

- [NextJS] : React Framework
- [Prisma] : Node.js and TypeScript ORM
- [PostgreSQL] : Open Source Relational Database
- [RainbowKit] : Connect Wallet Button
- [Web3UIKit] : UI Components
- [wagmi] : React Hooks for Ethereum
- [NFT Swap SDK] : P2P Swap Library powered by the 0x protocol

### Installation

In order to run the project locally follow the next steps:

- Install dependencies

```sh
cd frontend && npm install
```

- Create .env file (like .env.example) with your keys. You can omit setting database variables one by one and copy the database URL directly in `DATABASE_URL`. The `NEXT_PUBLIC_API_TOKEN` helps making the API routes private, only within the client.

```sh
ALCHEMY_API_KEY=
DATABASE_HOST=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DATABASE_HOST}/${POSTGRES_DB}
DATABASE_URL_WITH_SCHEMA=${DATABASE_URL}?schema=public
NEXT_PUBLIC_API_TOKEN=
```

- Create and start the docker container with the PostgreSQL database:

```sh
docker compose up -d
```

- Create migrations from the Prisma schema, apply them to the database and generate artifacts:

```sh
npx prisma migrate dev --preview-feature
```

- Run the app:

```sh
npm run dev
```

Open http://localhost:3000 with your browser to see the website

## Features

- Users can **request new NFT tokens** to be minted, no restrictions here, anyone can request new NFT minting free-of-charge
- Users can **list their NFT token for sale for any price they want using the ERC-20 token**.
- Users can **list and review** all existing and yet not executed sell offers.
- Users can **accept** the existing sell order from some other user and purchase the NFT using ERC-20

## Details

- ERC-20 token standard using the [OpenZeppelin] implementation.
- ERC-721 token standard using the [Azuki] project implementation.

[0x v4 protocol]: https://docs.0x.org/nft-support/docs/introduction
[azuki]: https://github.com/chiru-labs/ERC721A
[openzeppelin]: https://docs.openzeppelin.com/contracts/4.x/erc20
[nextjs]: https://nextjs.org/
[prisma]: https://www.prisma.io/
[postgresql]: https://www.postgresql.org/
[rainbowkit]: https://www.rainbowkit.com/
[web3uikit]: https://github.com/web3ui/web3uikit
[wagmi]: https://wagmi.sh/
[nft swap sdk]: https://github.com/trader-xyz/nft-swap-sdk

# Frontend

This is the frontend of the NFT Marketplace using the 0x v4 protocol.

## Tools

- NextJS
- Prisma & PostgreSQL
- RainbowKit
- Web3UIKit
- WAGMI
- NFT Swap SDK (by traderxyz)

## Getting Started

1. Install dependencies:

```sh
npm install
```

2. Create and run the Docker container with the PostgreSQL database:

```sh
docker compose up -d
```

3. Make a migration of the Prisma ORM schema:

```sh
npm run prisma:migrate
```

3. Run the development server

```sh
npm run dev
```

Open http://localhost:3000 with your browser to see the website

API routes can be accessed on http://localhost:3000/api

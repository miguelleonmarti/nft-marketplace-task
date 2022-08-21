import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { ReactNode, useState, useEffect } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { darkTheme, getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { app } from "../config";
import Navbar from "../components/Navbar";
import Web3ContextProvider from "../contexts/Web3Context";
import { NotificationProvider } from "@web3uikit/core";

const { chains, provider } = configureChains([chain.goerli], [alchemyProvider({ apiKey: process.env.ALCHEMY_API_KEY }), publicProvider()]);

const { connectors } = getDefaultWallets({ appName: app.name, chains });

const wagmiClient = createClient({ autoConnect: true, connectors, provider });

function Web3Wrapper({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} showRecentTransactions theme={darkTheme()}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3Wrapper>
      <Web3ContextProvider>
        <NotificationProvider>
          <Navbar />
          <Component {...pageProps} />
        </NotificationProvider>
      </Web3ContextProvider>
    </Web3Wrapper>
  );
}

export default MyApp;

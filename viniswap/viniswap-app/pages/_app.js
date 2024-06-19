import { useEffect, useState } from "react";
import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import merge from "lodash.merge";

import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  midnightTheme,
} from "@rainbow-me/rainbowkit";

import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";
import Modal from "react-modal";

Modal.setAppElement("#__next");
const OPsepolia = {
  id: 11155420,
  name: "OP Sepolia",
  network: "optimismSepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    public: "https://sepolia.optimism.io",
  },
  blockExplorers: {
    default: {
      name: "OptimisticEtherscan",
      url: "https://sepolia-optimistic.etherscan.io",
    },
  },
};
const sepolia = {
  id: 11155111,
  name: "Sepolia",
  network: "sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    public: "https://sepolia.infura.io/v3/",
  },
  blockExplorers: {
    default: {
      name: "Sepolia etherscan",
      url: "https://sepolia.etherscan.io",
    },
  },
};
const { provider, chains } = configureChains(
  [OPsepolia, sepolia],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
    jsonRpcProvider({
      rpc: (chain) => ({ http: chain.rpcUrls.default })
    })
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Uniswap",
  chains,
});
const wagmiClient = createClient({
  autoConnect: false,
  connectors,
  provider,
});
// console.log("Wagmi Client:", wagmiClient);
const myTheme = merge(midnightTheme(), {
  colors: {
    accentColor: "#1818b",
    accentColorForeground: "#fff",
  },
});

function MyApp({ Component, pageProps }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return null; //loader
  }
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={myTheme}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;

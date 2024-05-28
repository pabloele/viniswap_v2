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

const { provider, chains } = configureChains(
  [OPsepolia],
  [
    // infuraProvider({
    //   apiKey: process.env.NEXT_PUBLIC_API_KEY,
    // }),
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    }),

    jsonRpcProvider({
      rpc: (chain) => ({
        http: `https://sepolia.optimism.io`,
      }),
    }),
  ]
);
// console.log(provider);
// console.log(chains);
const { connectors } = getDefaultWallets({
  appName: "Uniswap",
  chains,
});
// console.log(connectors);
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
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={myTheme}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;

import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import merge from 'lodash.merge';

import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  midnightTheme,
} from '@rainbow-me/rainbowkit';

import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';

const { chains, provider } = configureChains(
  // const configuredChains = configureChains(
  [chain.polygonMumbai],
  [
    infuraProvider({
      apiKey: process.env.NEXT_PUBLIC_API_KEY,
    }),
  ]
);

// console.log(configuredChains);
const { connectors } = getDefaultWallets({
  appName: 'Uniswap',
  chains,
});

const wagmiClient = createClient({
  autoConnect: false,
  connectors,
  provider,
});

const myTheme = merge(midnightTheme(), {
  colors: {
    accentColor: '#1818b',
    accentColorForeground: '#fff',
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

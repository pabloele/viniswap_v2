export const MTB24 = "MTB24";
export const WETH = "ETH";

export const DEFAULT_VALUE = "Select a token";
// export const DEFAULT_VALUE = { name: "Select a token", address: "" };

export const coinAddresses = [
  {
    name: WETH,
    address: process.env.NEXT_PUBLIC_WETH_ADDRESS,
  },
  {
    name: MTB24,
    address: process.env.NEXT_PUBLIC_MTB24_ADDRESS,
  },
];

export const getCoinAddress = (name) => {
  const coin = coinAddresses.find((coin) => coin.name === name);
  return coin?.address || "";
};

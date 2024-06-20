import React, { useEffect, useRef, useState } from "react";
import { DEFAULT_VALUE, WETH, getCoinAddress } from "../utils/SupportedCoins";
import { ENTER_AMOUNT, defaultSlippage } from "../utils/swap-utils";
import { getPrice, getTokenPrice } from "../utils/queries";
import { useNetwork } from "wagmi";
import toast from "react-hot-toast";

const useSwaps = () => {
  const { chain } = useNetwork();
  const [srcToken, setSrcToken] = useState(WETH);
  const [destToken, setDestToken] = useState(DEFAULT_VALUE);
  const [inputValue, setInputValue] = useState();
  const [outputValue, setOutputValue] = useState();
  const [swapOptionsOpen, setSwapOptionsOpen] = useState(false);
  const [slippage, setSlippage] = useState(defaultSlippage);

  const [swapBtnText, setSwapBtnText] = useState(ENTER_AMOUNT);
  const [txPending, setTxPending] = useState(false);
  const [price, setPrice] = useState({});
  const inValue = useState();
  const outValue = useState();

  const isReversed = useState(false);

  const srcTokenObj = {
    id: "srcToken",
    value: inputValue,
    setValue: setInputValue,
    defaultValue: srcToken,
    ignoreValue: destToken,
    setToken: setSrcToken,
  };

  const destTokenObj = {
    id: "destToken",
    value: outputValue,
    setValue: setOutputValue,
    defaultValue: destToken,
    ignoreValue: srcToken,
    setToken: setDestToken,
  };

  useEffect(() => {
    const checkNetwork = async () => {
      if (chain?.id !== 11155420) {
        try {
          await switchNetwork(11155420);
        } catch (error) {
          toast.error("Please switch to the Op Sepolia network");
        }
      }
    };

    checkNetwork();
    const fetchPrice = async (inToken, outToken) => {
      console.log(inToken, outToken);
      const address0 = getCoinAddress(inToken);
      const address1 = getCoinAddress(outToken);
      console.log(address0, address1);
      const relativePrices = await getPrice(address0, address1);
      console.log(relativePrices);
      setPrice(relativePrices);
    };

    if (srcToken && destToken && chain?.id === 11155420)
      fetchPrice(srcToken, destToken);
  }, [srcToken, destToken, chain]);

  return {
    srcToken,
    setSrcToken,
    destToken,
    setDestToken,
    inputValue,
    setInputValue,
    outputValue,
    setOutputValue,
    swapOptionsOpen,
    setSwapOptionsOpen,
    slippage,
    setSlippage,

    swapBtnText,
    setSwapBtnText,
    txPending,
    setTxPending,
    inValue,
    outValue,
    isReversed,
    srcTokenObj,
    destTokenObj,
    price,
    setPrice,
  };
};

export default useSwaps;

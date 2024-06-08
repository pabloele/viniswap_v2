import React, { useEffect, useRef, useState } from "react";
import { DEFAULT_VALUE, WETH, getCoinAddress } from "../utils/SupportedCoins";
import { ENTER_AMOUNT, defaultSlippage } from "../utils/swap-utils";
import { getPrice, getTokenPrice } from "../utils/queries";

const useSwaps = () => {
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
    const fetchPrice = async (inToken, outToken) => {
      console.log(inToken, outToken);
      const address0 = getCoinAddress(inToken);
      const address1 = getCoinAddress(outToken);
      console.log(address0, address1);
      const relativePrices = await getPrice(address0, address1);
      console.log(relativePrices);
      setPrice(relativePrices);
    };

    if (srcToken && destToken) fetchPrice(srcToken, destToken);
  }, [srcToken, destToken]);

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

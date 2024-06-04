import React, { useRef, useState } from "react";
import { DEFAULT_VALUE, WETH } from "../utils/SupportedCoins";
import { ENTER_AMOUNT } from "../utils/swap-utils";

const useSwaps = () => {
  const [srcToken, setSrcToken] = useState(WETH);
  const [destToken, setDestToken] = useState(DEFAULT_VALUE);
  const [inputValue, setInputValue] = useState();
  const [outputValue, setOutputValue] = useState();
  const [swapOptionsOpen, setSwapOptionsOpen] = useState(false);
  const [slippage, setSlippage] = useState(10);
  const [srcTokenComp, setSrcTokenComp] = useState();
  const [destTokenComp, setDestTokenComp] = useState();
  const [swapBtnText, setSwapBtnText] = useState(ENTER_AMOUNT);
  const [txPending, setTxPending] = useState(false);

  const inputValueRef = useRef();
  const outputValueRef = useRef();

  const isReversed = useRef(false);

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
    srcTokenComp,
    setSrcTokenComp,
    destTokenComp,
    setDestTokenComp,
    swapBtnText,
    setSwapBtnText,
    txPending,
    setTxPending,
    inputValueRef,
    outputValueRef,
    isReversed,
    srcTokenObj,
    destTokenObj,
  };
};

export default useSwaps;

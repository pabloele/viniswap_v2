import React, { useEffect, useState, useRef } from "react";
import {
  getTokenPrice,
  increaseTokenAllowance,
  increaseWethAllowance,
  swapTokensToWeth,
  swapWethToTokens,
  tokenAllowance,
  wethAllowance,
} from "../utils/queries";

import { CogIcon, ArrowSmDownIcon } from "@heroicons/react/outline";
import SwapField from "./SwapField";
import TransactionStatus from "./TransactionStatus";
import toast, { Toaster } from "react-hot-toast";
import { DEFAULT_VALUE, WETH, MTB24 } from "../utils/SupportedCoins";
import { toEth, toWei } from "../utils/ether-utils";
import { useAccount } from "wagmi";

const SwapComponent = () => {
  const [srcToken, setSrcToken] = useState(WETH);
  const [destToken, setDestToken] = useState(DEFAULT_VALUE);

  const [inputValue, setInputValue] = useState();
  const [outputValue, setOutputValue] = useState();

  const inputValueRef = useRef();
  const outputValueRef = useRef();

  const isReversed = useRef(false);

  const INCREASE_ALLOWANCE = "Increase allowance";
  const ENTER_AMOUNT = "Enter an amount";
  const CONNECT_WALLET = "Connect wallet";
  const SWAP = "Swap";

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

  const [srcTokenComp, setSrcTokenComp] = useState();
  const [destTokenComp, setDestTokenComp] = useState();

  const [swapBtnText, setSwapBtnText] = useState(ENTER_AMOUNT);
  const [txPending, setTxPending] = useState(false);

  const notifyError = (msg) => toast.error(msg, { duration: 6000 });
  const notifySuccess = () => toast.success("Transaction completed.");
  const { address } = useAccount();

  const performSwap = async () => {
    setTxPending(true);
    let receipt;

    if (srcToken === WETH && destToken !== WETH) {
      console.log("hola", outputValue);
      receipt = await swapWethToTokens(outputValue);
    } else if (srcToken !== WETH && destToken === WETH) {
      receipt = await swapTokensToWeth(inputValue);
    }

    setTxPending(false);
    if (receipt && !receipt.hasOwnProperty("transactionHash")) {
      notifyError(receipt);
    } else {
      notifySuccess();
    }
  };

  const handleSwap = async () => {
    if (srcToken === WETH && destToken !== WETH) {
      setTxPending(true);
      const allowance = await wethAllowance();
      console.log(allowance, inputValue);
      if (allowance < inputValue) {
        const receipt = await increaseWethAllowance(inputValue * 1.2);
        console.log(receipt);
      }

      setTxPending(false);

      performSwap();
    } else if (srcToken !== WETH && destToken === WETH) {
      setTxPending(true);
      const allowance = await tokenAllowance();
      console.log(allowance, inputValue);
      if (allowance < inputValue) {
        const receipt = await increaseTokenAllowance(inputValue);
        console.log(receipt);
      }

      setTxPending(false);

      performSwap();
    }
  };

  const handleIncreaseAllowance = async () => {
    setTxPending(true);
    await increaseAllowance(srcToken, inputValue);
    setTxPending(false);
    setSwapBtnText(SWAP);
  };

  useEffect(() => {
    // Handling the text of the submit button
    if (!address) setSwapBtnText(CONNECT_WALLET);
    else if (!inputValue || !outputValue) setSwapBtnText(ENTER_AMOUNT);
    else setSwapBtnText(SWAP);
  }, [inputValue, outputValue, address]);

  useEffect(() => {
    const fetchPriceAndPopulateOutput = async () => {
      const price = await getTokenPrice();
      console.log(price);
      if (
        document.activeElement !== outputValueRef.current &&
        document.activeElement.ariaLabel !== "srcToken" &&
        !isReversed.current
      )
        populateOutputValue(price);

      setSrcTokenComp(<SwapField obj={srcTokenObj} ref={inputValueRef} />);

      if (inputValue?.length === 0) setOutputValue("");
    };
    fetchPriceAndPopulateOutput();
  }, [inputValue, destToken]);

  useEffect(() => {
    const fetchPriceAndPopulateinput = async () => {
      const price = await getTokenPrice();
      console.log(price);
      if (
        document.activeElement !== inputValueRef.current &&
        document.activeElement.ariaLabel !== "destToken" &&
        !isReversed.current
      )
        populateInputValue(price);

      setDestTokenComp(<SwapField obj={destTokenObj} ref={outputValueRef} />);

      if (outputValue?.length === 0) setInputValue("");

      // Resetting the isReversed value if its set
      if (isReversed.current) isReversed.current = false;
    };

    fetchPriceAndPopulateinput();
  }, [outputValue, srcToken]);

  return (
    <div className="bg-zinc-900 w-[35%] p-4 px-6 rounded-xl">
      <div className="flex items-center justify-between py-4 px-1">
        <p>Swap</p>
        {/* <CogIcon className="h-6" /> */}
      </div>
      <div className="relative bg-[#212429] p-4 py-6 rounded-xl mb-2 border-[2px] border-transparent hover:border-zinc-600">
        {srcTokenComp}

        <ArrowSmDownIcon
          className="absolute left-1/2 -translate-x-1/2 -bottom-6 h-10 p-1 bg-[#212429] border-4 border-zinc-900 text-zinc-300 rounded-xl cursor-pointer hover:scale-110"
          onClick={handleReverseExchange}
        />
      </div>

      <div className="bg-[#212429] p-4 py-6 rounded-xl mt-2 border-[2px] border-transparent hover:border-zinc-600">
        {destTokenComp}
      </div>

      <button
        className={getSwapBtnClassName()}
        onClick={() => {
          if (swapBtnText === INCREASE_ALLOWANCE) handleIncreaseAllowance();
          else if (swapBtnText === SWAP) handleSwap();
          // else if (swapBtnText === CONNECT_WALLET)
          //   alert('llamar a conectar la billetera');
        }}
      >
        {swapBtnText}
      </button>

      {txPending && <TransactionStatus />}

      <Toaster />
    </div>
  );

  // Front end functionality

  function handleReverseExchange(e) {
    // Setting the isReversed value to prevent the input/output values
    // being calculated in their respective side - effects
    isReversed.current = true;

    // 1. Swap tokens (srcToken <-> destToken)
    // 2. Swap values (inputValue <-> outputValue)

    setInputValue(outputValue);
    setOutputValue(inputValue);

    setSrcToken(destToken);
    setDestToken(srcToken);
  }

  function getSwapBtnClassName() {
    let className = "p-4 w-full my-2 rounded-xl";
    className +=
      swapBtnText === ENTER_AMOUNT || swapBtnText === CONNECT_WALLET
        ? " text-zinc-400 bg-zinc-800 pointer-events-none"
        : " bg-blue-700";
    className += swapBtnText === INCREASE_ALLOWANCE ? " bg-yellow-600" : "";
    return className;
  }

  function populateOutputValue(price) {
    if (
      destToken === DEFAULT_VALUE ||
      srcToken === DEFAULT_VALUE ||
      !inputValue
    )
      return;

    try {
      if (srcToken !== WETH && destToken !== WETH) setOutputValue(inputValue);
      else if (srcToken === WETH && destToken !== WETH) {
        const outValue = inputValue / price;
        setOutputValue(outValue);
      } else if (srcToken !== WETH && destToken === WETH) {
        console.log("HOLA", price, inputValue);
        // const outValue = toEth(toWei(inputValue * price, 14));
        const outValue = inputValue * price;
        setOutputValue(outValue);
      }
    } catch (error) {
      setOutputValue("0");
    }
  }

  function populateInputValue(price) {
    if (
      destToken === DEFAULT_VALUE ||
      srcToken === DEFAULT_VALUE ||
      !outputValue
    )
      return;

    try {
      if (srcToken !== WETH && destToken !== WETH) setInputValue(outputValue);
      else if (srcToken === WETH && destToken !== WETH) {
        // const outValue = toEth(toWei(outputValue, 14));
        setInputValue(outputValue * price);
      } else if (srcToken !== ETH && destToken === ETH) {
        // const outValue = toEth(toWei(outputValue), 14);
        setInputValue(outputValue / price);
      }
    } catch (error) {
      setInputValue("0");
    }
  }

  function handleInsufficientAllowance() {
    notifyError(
      "Insufficient allowance. Click 'Increase allowance' to increase it."
    );

    setSwapBtnText(INCREASE_ALLOWANCE);
  }
};

export default SwapComponent;
import React, { useEffect, useState, useRef } from "react";
import {
  getTokenPrice,
  increaseTokenAllowance,
  increaseWethAllowance,
  swapTokensToWeth,
  swapWethToTokens,
  tokenAllowance,
  wethAllowance,
  wrapEth,
} from "../utils/queries";

import {
  CONNECT_WALLET,
  ENTER_AMOUNT,
  INCREASE_ALLOWANCE,
  SELECT_PAIR,
  SWAP,
  getSwapBtnClassName,
  notifyError,
  notifySuccess,
  populateInputValue,
  populateOutputValue,
} from "../utils/swap-utils";
import { CogIcon, ArrowSmDownIcon } from "@heroicons/react/outline";
import { HiOutlineSwitchVertical } from "react-icons/hi";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import SwapField from "./SwapField";
import TransactionStatus from "./TransactionStatus";

import { DEFAULT_VALUE, WETH, MTB24 } from "../utils/SupportedCoins";
import { toEth, toWei } from "../utils/ether-utils";
import { useAccount } from "wagmi";
import { Toaster } from "react-hot-toast";
import NavItems from "./NavItems";
import SwapOptions from "./swapOptions";
import useSwaps from "../hooks/useSwaps";

const Swap = () => {
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const {
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
    isReversed,
    srcTokenObj,
    destTokenObj,
    price,
    setPrice,
  } = useSwaps();

  const [sourceValue, setSourceValue] = useState();
  const [destValue, setDestValue] = useState();

  useEffect(() => {
    if (!address) setSwapBtnText(CONNECT_WALLET);
    else if (srcToken === DEFAULT_VALUE || destToken === DEFAULT_VALUE)
      setSwapBtnText(SELECT_PAIR);
    else if (
      address &&
      srcToken !== DEFAULT_VALUE &&
      destToken !== DEFAULT_VALUE &&
      !inputValue &&
      !outputValue
    )
      setSwapBtnText(ENTER_AMOUNT);
    else setSwapBtnText(SWAP);
    console.log(srcToken, destToken);
  }, [inputValue, outputValue, address]);

  const performSwap = async () => {
    try {
      setTxPending(true);
      let receipt;

      if (srcToken === WETH && destToken !== WETH) {
        receipt = await swapWethToTokens(outputValue);
      } else if (srcToken !== WETH && destToken === WETH) {
        receipt = await swapTokensToWeth(inputValue);
        console.log("swap succesful", receipt);
        withdrawReceipt = await withdrawWeth(inputValue);
        console.log("weth withdrawn succesfully", withdrawReceipt);
      }

      setTxPending(false);
      if (receipt && !receipt.hasOwnProperty("transactionHash")) {
        notifyError(receipt);
      } else {
        notifySuccess();
      }
    } catch (error) {
      setTxPending(false);
      console.log(error);
    }
  };

  const handleSwap = async () => {
    try {
      if (srcToken === WETH && destToken !== WETH) {
        console.log("wrapping " && inputValue && " eth");
        setTxPending(true);

        const wrapReceipt = await wrapEth(inputValue * (1 + slippage / 100));
        console.log("eth wrapped succesfully", wrapReceipt);

        const allowance = await wethAllowance();
        console.log(allowance, inputValue);

        const receipt = await increaseWethAllowance(
          (inputValue * (100 + slippage)) / 100
        );

        await receipt.wait();
        console.log(receipt);

        setTxPending(false);

        performSwap();
      } else if (srcToken !== WETH && destToken === WETH) {
        setTxPending(true);
        const allowance = await tokenAllowance();
        console.log(allowance, inputValue);

        const receipt = await increaseTokenAllowance(inputValue);
        console.log(receipt);

        setTxPending(false);

        performSwap();
      }
    } catch (error) {
      console.log(error);
    }
  };

  function handleReverseExchange(e) {
    isReversed.current = true;

    setInputValue(outputValue);
    setOutputValue(inputValue);

    setSrcToken(destToken);
    setDestToken(srcToken);
  }

  return (
    <div className="p-4 translate-y-20 rounded-3xl w-full max-w-[500px] bg-zinc-900 mt-20">
      <div className="flex md:px-4">
        <NavItems />
      </div>

      <div className="flex items-center justify-between px-1 my-4">
        <p>Swap</p>

        {swapOptionsOpen ? (
          <SwapOptions
            setSlippage={setSlippage}
            setSwapOptionsOpen={setSwapOptionsOpen}
          />
        ) : (
          <CogIcon
            className="h-6 cursor-pointer"
            onClick={() => setSwapOptionsOpen(true)}
          />
        )}
      </div>
      <div className="flex bg-[#212429] p-4 py-6 rounded-xl mb-2 border-[2px] border-transparent hover:border-zinc-600">
        <SwapField
          fieldProps={{
            ...srcTokenObj,
            setCounterPart: setOutputValue,
            price,
            srcToken,
            destToken,
          }}
        />

        <ArrowSmDownIcon
          className="fixed left-1/2 -translate-x-1/2 -translate-y-[-120%]  justify-center  h-10 p-1 bg-[#212429] border-4 border-zinc-900 text-zinc-300 rounded-xl cursor-pointer hover:scale-110"
          onClick={handleReverseExchange}
        />
      </div>

      <div className="bg-[#212429] p-4 py-6 rounded-xl mt-2 border-[2px] border-transparent hover:border-zinc-600">
        <SwapField
          fieldProps={{
            ...destTokenObj,
            setCounterPart: setInputValue,
            price,
            srcToken,
            destToken,
          }}
        />
      </div>

      <button
        className={getSwapBtnClassName()}
        onClick={() => {
          if (swapBtnText === SWAP) handleSwap();
          else if (swapBtnText === CONNECT_WALLET) openConnectModal();
          // else if (swapBtnText === SELECT_PAIR) handleOpenModal();
        }}
      >
        {swapBtnText}
      </button>

      {txPending && <TransactionStatus />}
    </div>
  );
};

export default Swap;

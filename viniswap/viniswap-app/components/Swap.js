import React, { useEffect, useState, useRef } from "react";
import {
  getTokenPrice,
  increaseTokenAllowance,
  increaseWethAllowance,
  swapTokensToWeth,
  swapWethToTokens,
  tokenAllowance,
  unwrapEth,
  wethAllowance,
  wrapEth,
} from "../utils/queries";

import {
  CONNECT_WALLET,
  ENTER_AMOUNT,
  INCREASE_ALLOWANCE,
  SELECT_PAIR,
  SWAP,
  SWITCH_NETWORK,
  getSwapBtnClassName,
  notifyError,
  notifySuccess,
  populateInputValue,
  populateOutputValue,
} from "../utils/swap-utils";
import { CogIcon, ArrowSmDownIcon } from "@heroicons/react/outline";
import { CgArrowsExchangeV } from "react-icons/cg";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import SwapField from "./SwapField";
import TransactionStatus from "./TransactionStatus";

import {
  DEFAULT_VALUE,
  WETH,
  MTB24,
  getCoinAddress,
} from "../utils/SupportedCoins";
import { toEth, toWei } from "../utils/ether-utils";
import { useAccount, useNetwork } from "wagmi";
import toast, { Toaster } from "react-hot-toast";
import NavItems from "./NavItems";
import SwapOptions from "./swapOptions";
import useSwaps from "../hooks/useSwaps";
import { pairIsWhitelisted } from "../utils/pools-utils";
import { switchNetwork } from "../utils/bridge-utils";

const Swap = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
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
  const [transactionMessage, setTransactionMessage] = useState("");

  useEffect(() => {
    const isWhiteListed = pairIsWhitelisted(
      getCoinAddress(srcToken),
      getCoinAddress(destToken)
    );

    if (!address) setSwapBtnText(CONNECT_WALLET);
    else if (chain?.id !== 11155420) setSwapBtnText(SWITCH_NETWORK);
    else if (
      srcToken === DEFAULT_VALUE ||
      destToken === DEFAULT_VALUE ||
      !isWhiteListed
    )
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
  }, [inputValue, outputValue, address, srcToken, destToken, isReversed]);

  useEffect(() => {
    setInputValue("");
    setOutputValue("");
  }, []);
  const performSwap = async () => {
    try {
      setTxPending(true);
      let receipt;

      if (srcToken === WETH && destToken !== WETH) {
        setTransactionMessage(
          (prev) => `${prev}done.<br />Step 4/4: Performing swap...`
        );
        receipt = await swapWethToTokens(outputValue);
        if (!receipt) {
          setTxPending(false);
          notifyError("Transaction failed");
          return;
        }
        setTxPending(false);
        notifySuccess("Swap completed succesfully!");
        return;
      } else if (srcToken !== WETH && destToken === WETH) {
        receipt = await swapTokensToWeth(inputValue);
        if (!receipt) {
          setTxPending(false);
          notifyError("Transaction failed");
          return;
        }
        console.log("swap succesful", receipt);
        setTransactionMessage(
          (prev) => `${prev}done.<br />Step 3/3: Withdrawing eth...`
        );
        const withdrawReceipt = await unwrapEth();
        if (!withdrawReceipt) {
          setTxPending(false);
          notifyError(
            "Swap performed, but weth withdrawal failed. Please withdraw manually"
          );
          return;
        }
        setTransactionMessage((prev) => `${prev}done.`);
        console.log("weth withdrawn succesfully", withdrawReceipt);
        setTxPending(false);
        setInputValue("");
        setOutputValue("");
      }

      setTxPending(false);
      if (receipt && !receipt.hasOwnProperty("transactionHash")) {
        notifyError(receipt);
      } else {
        notifySuccess();
      }
    } catch (error) {
      console.log(error);
      notifyError("Transaction failed");
    }
    setTxPending(false);
  };

  const handleSwap = async () => {
    try {
      if (srcToken === WETH && destToken !== WETH) {
        console.log("wrapping " && inputValue && " eth");
        setTransactionMessage(`Step 1/4: Depositing ETH...`);
        setTxPending(true);

        const slippageMultiplier = (slippage + 100) / 100;
        console.log(slippageMultiplier);
        const wrapReceipt = await wrapEth(inputValue * slippageMultiplier);
        console.log("eth wrapped succesfully", wrapReceipt);

        const allowance = await wethAllowance();
        console.log(allowance, inputValue);
        setTransactionMessage(
          (prev) => `${prev}done.<br />Step 2/4: Granting WETH allowance...`
        );
        const receipt = await increaseWethAllowance(
          inputValue * slippageMultiplier
        );

        await receipt.wait();
        console.log(receipt);

        setTxPending(false);

        performSwap();
      } else if (srcToken !== WETH && destToken === WETH) {
        setTxPending(true);
        setTransactionMessage(`Step 1/3: Granting token allowance...`);
        const allowance = await tokenAllowance();
        console.log(allowance, inputValue);

        const receipt = await increaseTokenAllowance(inputValue);
        if (!receipt) {
          notifyError("Transaction failed");
          setTxPending(false);
          return;
        }
        console.log(receipt);

        setTransactionMessage(
          (prev) => `${prev}done.<br />Step 2/3: Performing swap...`
        );

        performSwap();
      }
    } catch (error) {
      notifyError("Transaction failed");
      setTxPending(false);
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

        <CgArrowsExchangeV
          className="fixed left-1/2 -translate-x-1/2 -translate-y-[-120%] text-[4rem] justify-center  h-10 p-1 bg-[#212429] border-4 border-zinc-900 text-zinc-300 rounded-xl cursor-pointer hover:scale-110"
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
        className={getSwapBtnClassName(swapBtnText)}
        onClick={() => {
          if (swapBtnText === SWAP) handleSwap();
          else if (swapBtnText === CONNECT_WALLET) openConnectModal();
        }}
      >
        {swapBtnText}
      </button>

      {txPending && (
        <TransactionStatus
          transactionMessage={transactionMessage}
          setTransactionMessage={setTransactionMessage}
        />
      )}
    </div>
  );
};

export default Swap;

"use client";
import React, { useEffect, useState } from "react";

import {
  addLiquidity,
  getTokenPrice,
  increaseAllowance,
  increaseTokenAllowance,
  increaseWethAllowance,
  lpTokenAllowance,
  lpTokenBalance,
  removeLiquidity,
  swapTokensToWeth,
  swapWethToTokens,
  tokenAllowance,
  tokenBalance,
  unwrapEth,
  wethAllowance,
  wethBalance,
  wrapEth,
} from "../utils/queries";
import {
  ADD_OR_REMOVE_LIQUIDITY,
  CONNECT_WALLET,
  ENTER_AMOUNT,
  SELECT_PAIR,
  SWAP,
  getSwapBtnClassName,
  notifyError,
  notifySuccess,
} from "../utils/swap-utils";
import { CogIcon } from "@heroicons/react/outline";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { Toaster } from "react-hot-toast";
import { useAccount } from "wagmi";
import { usePools } from "../hooks/usePools";
import { whitelistedPools } from "../utils/whitelistedPools";
import {
  DEFAULT_VALUE,
  WETH,
  MTB24,
  getCoinAddress,
  coinAddresses,
} from "../utils/SupportedCoins";

import LiquidityModal from "./LiquidityModal";
import { toWei } from "../utils/ether-utils";
import { RiRefreshLine } from "react-icons/ri";
import { FiRefreshCcw } from "react-icons/fi";
import NavItems from "./NavItems";
import { getBalances, pairIsWhitelisted } from "../utils/pools-utils";
import PoolField from "./PoolField";
const Pool = () => {
  const whitelisted = whitelistedPools;

  const { address } = useAccount();
  const {
    pools,
    setRefresh,
    refresh,
    refreshAmounts,
    refreshDisabled,
    reserves,
    setReserves,
    srcToken,
    destToken,
    setSrcToken,
    setDestToken,
    srcTokenObj,
    destTokenObj,
    isReversed,
    setIsReversed,
    inputValue,
    setInputValue,
    outputValue,
    setOutputValue,
  } = usePools();

  const { openConnectModal } = useConnectModal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [signerBalances, setSignerBalances] = useState({});

  const handleRefresh = () => {
    refreshAmounts();
  };
  const handleAddLiquidity = async (tokenAAmount, tokenBAmount) => {
    try {
      const { token0, token1, reverse } = reserves;

      const allowanceA = await increaseAllowance(tokenAAmount, srcToken);
      const allowanceB = await increaseAllowance(tokenBAmount, destToken);

      const receipt = await addLiquidity(
        token0,
        token1,
        reverse ? tokenBAmount : tokenAAmount,
        reverse ? tokenAAmount : tokenBAmount,
        0,
        0
      );
    } catch (error) {
      console.log(error);
    }

    setIsModalOpen(false);
    handleRefresh();
  };

  const handleRemoveLiquidity = async (lpAmount) => {
    console.log(reserves);
    const initialWethBalance = await wethBalance();
    console.log(initialWethBalance);
    try {
      const { address, token0, token1 } = reserves;

      const allowance = await lpTokenAllowance({
        liquidityAmount: lpAmount,
        address,
      });

      await allowance.wait();
      console.log("allowance granted to remove", lpAmount, allowance);
      const receipt = await removeLiquidity(token0, token1, lpAmount);

      console.log("liquidity successfully removed ", receipt);

      const afterRemoveWethBalance = await wethBalance();
      console.log(afterRemoveWethBalance);

      const wethWitdrawAmount = afterRemoveWethBalance - initialWethBalance;
      const witdrawReceipt = await unwrapEth(wethWitdrawAmount);
      console.log("successfully unwrapped eth", witdrawReceipt);
    } catch (error) {
      console.log(error);
    }
    setIsModalOpen(false);
    handleRefresh();
  };

  const [swapBtnText, setSwapBtnText] = useState(ENTER_AMOUNT);
  const [txPending, setTxPending] = useState(false);

  const getPoolReserves = ({ srcToken, destToken }) => {
    const isWhitelisted = pairIsWhitelisted(
      srcToken.address,
      destToken.address
    );

    if (isWhitelisted) {
      console.log(
        `Pair (${srcToken.address}, ${destToken.address}) is whitelisted`
      );
      setSwapBtnText(ADD_OR_REMOVE_LIQUIDITY);
    } else {
      console.log(
        `Pair (${srcToken.address}, ${destToken.address}) is not whitelisted`
      );

      if (!address) setSwapBtnText(CONNECT_WALLET);
      else setSwapBtnText(SELECT_PAIR);
      setReserves({});
      return;
    }

    const pool = pools.find(
      (pool) =>
        (pool.token0 === srcToken.address &&
          pool.token1 === destToken.address) ||
        (pool.token0 === destToken.address && pool.token1 === srcToken.address)
    );

    const reverse = pool?.token0 !== srcToken?.address;
    const poolData = { ...pool, reverse: reverse };
    setReserves(poolData);

    return poolData;
  };

  useEffect(() => {
    if (!address) setSwapBtnText(CONNECT_WALLET);
    else if (!inputValue || !outputValue) setSwapBtnText(SELECT_PAIR);
  }, [inputValue, outputValue, address]);

  useEffect(() => {
    const getReserves = async () => {
      const srcTokenAddress = getCoinAddress(srcToken);
      const destTokenAddress = getCoinAddress(destToken);
      const reserves = getPoolReserves({ srcToken, destToken });

      if (inputValue.length === 0) setOutputValue("");
    };

    getReserves();
  }, [
    destToken,
    srcToken,
    setDestToken,
    setSrcToken,
    refresh,
    refreshDisabled,
  ]);

  const handleOpenModal = () => {
    getBalances(srcToken, destToken, reserves)
      .then((balances) => {
        setSignerBalances({ ...balances });
      })
      .catch((error) => {
        console.error(error);
      });
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 translate-y-20 rounded-3xl w-full max-w-[500px] bg-zinc-900 mt-20  ">
      <div className="flex md:px-4">
        <NavItems />
      </div>
      <div className="flex items-center justify-between  px-1 my-4">
        <p>Liquidity Pool</p>
        <div className="flex flex-row ">
          <FiRefreshCcw
            className="h-6 mr-2"
            style={
              refreshDisabled
                ? { cursor: "not-allowed", opacity: 0.2 }
                : { cursor: "pointer" }
            }
            onClick={handleRefresh}
          />
          {/* <CogIcon className="h-6" style={{ cursor: "pointer" }} /> */}
        </div>
      </div>

      <div className="flex bg-[#212429] p-4 py-6 rounded-xl mb-2 border-[2px] border-transparent hover:border-zinc-600">
        <PoolField obj={srcTokenObj} />
      </div>

      <div className="bg-[#212429] p-4 py-6 rounded-xl mt-2 border-[2px] border-transparent hover:border-zinc-600">
        <PoolField obj={destTokenObj} />
      </div>

      <button
        className={getSwapBtnClassName()}
        onClick={() => {
          if (swapBtnText === ADD_OR_REMOVE_LIQUIDITY) handleOpenModal();
          // setIsModalOpen(true);
          else if (swapBtnText === CONNECT_WALLET) openConnectModal();
        }}
      >
        {swapBtnText}
      </button>

      {txPending && <TransactionStatus />}

      <Toaster />

      <LiquidityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddLiquidity={handleAddLiquidity}
        onRemoveLiquidity={handleRemoveLiquidity}
        srcToken={srcToken}
        destToken={destToken}
        signerBalances={signerBalances}
        reserves={reserves}
      />
    </div>
  );
};

export default Pool;

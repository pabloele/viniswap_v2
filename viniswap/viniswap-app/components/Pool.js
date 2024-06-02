"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import {
  addLiquidity,
  getTokenPrice,
  increaseTokenAllowance,
  increaseWethAllowance,
  lpTokenAllowance,
  lpTokenBalance,
  removeLiquidity,
  swapTokensToWeth,
  swapWethToTokens,
  tokenAllowance,
  tokenBalance,
  wethAllowance,
  wethBalance,
} from "../utils/queries";
import {
  ADD_OR_REMOVE_LIQUIDITY,
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
import { Dropdown } from "@nextui-org/react";
import LiquidityModal from "./LiquidityModal";
import { toWei } from "../utils/ether-utils";
import { RiRefreshLine } from "react-icons/ri";
import { FiRefreshCcw } from "react-icons/fi";
import NavItems from "./NavItems";
const Pool = () => {
  const whitelisted = whitelistedPools;

  const { address } = useAccount();
  const { pools, refreshAmounts, refreshDisabled, refresh } = usePools();

  const [reserves, setReserves] = useState({});
  const { openConnectModal } = useConnectModal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [signerBalances, setSignerBalances] = useState({});
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const increaseAllowance = async (amount, token) => {
    try {
      if (token.name === "ETH") {
        const receipt = await increaseWethAllowance(amount);
        console.log(receipt);
        return receipt;
      } else {
        const receipt = await increaseTokenAllowance(amount);
        console.log(receipt);
        return receipt;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRefresh = () => {
    // if (refreshDisabled) return;

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
    try {
      const { address, token0, token1 } = reserves;

      const allowance = await lpTokenAllowance({
        liquidityAmount: lpAmount,
        address,
      });

      const receipt = await removeLiquidity(token0, token1, lpAmount);

      console.log(receipt);
    } catch (error) {
      console.log(error);
    }
    setIsModalOpen(false);
    handleRefresh();
  };

  const [srcToken, setSrcToken] = useState({
    name: "Select a token",
    address: "",
  });

  const [destToken, setDestToken] = useState({
    name: "Select a token",
    address: "",
  });

  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");

  const isReversed = useState(false);

  const srcTokenObj = {
    id: "srcToken",
    // value: inputValue,
    value: reserves.reverse ? reserves.reserves1 : reserves.reserves0,
    setValue: setInputValue,
    defaultValue: srcToken.name,
    ignoreValue: destToken,
    setToken: setSrcToken,
  };

  const destTokenObj = {
    id: "destToken",
    // value: outputValue,
    value: reserves.reverse ? reserves.reserves0 : reserves.reserves1,
    setValue: setOutputValue,
    defaultValue: destToken.name,
    ignoreValue: srcToken,
    setToken: setDestToken,
  };

  const [swapBtnText, setSwapBtnText] = useState(ENTER_AMOUNT);
  const [txPending, setTxPending] = useState(false);

  const pairIsWhitelisted = (address0, address1) => {
    const pair = [address0, address1];

    const isWhitelisted = whitelistedPools.find(
      (pool) =>
        (pool[0] === address0 && pool[1] === address1) ||
        (pool[0] === address1 && pool[1] === address0)
    );

    if (isWhitelisted) {
      console.log(`Pair (${address0}, ${address1}) is whitelisted`);
      setSwapBtnText(ADD_OR_REMOVE_LIQUIDITY);
    } else {
      console.log(`Pair (${address0}, ${address1}) is not whitelisted`);
      setSwapBtnText(SELECT_PAIR);
    }

    return !!isWhitelisted;
  };

  const getPoolReserves = ({ srcToken, destToken }) => {
    if (!pairIsWhitelisted(srcToken.address, destToken.address)) {
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
    // else if (inputValue && outputValue) setSwapBtnText(ADD_OR_REMOVE_LIQUIDITY);
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

  const PoolField = ({ obj }) => {
    const {
      id,
      value = "",
      setValue,
      defaultValue,
      setToken,
      ignoreValue,
    } = obj;

    return (
      <div className="flex items-center rounded-xl">
        <input
          className="w-full outline-none h-8 px-2 appearance-none text-3xl bg-transparent"
          type={"number"}
          value={value}
          placeholder={"0.0"}
          onChange={(e) => setValue(e.target.value)}
        />
        <Selector
          id={id}
          setToken={setToken}
          defaultValue={defaultValue}
          ignoreValue={ignoreValue}
        />
      </div>
    );
  };

  const getBalances = (srcToken, destToken, reserves) => {
    const srcBalancePromise =
      srcToken.name === "ETH" ? wethBalance() : tokenBalance(srcToken.address);
    const destBalancePromise =
      destToken.name === "ETH"
        ? wethBalance()
        : tokenBalance(destToken.address);
    const lpBalancePromise = lpTokenBalance(reserves.address);

    return Promise.all([
      srcBalancePromise,
      destBalancePromise,
      lpBalancePromise,
    ])
      .then(([srcBalance, destBalance, lpBalance]) => {
        console.log("Source Token Balance:", srcBalance);
        console.log("Destination Token Balance:", destBalance);
        console.log("LP Token Balance:", lpBalance);

        return {
          srcBalance,
          destBalance,
          lpBalance,
        };
      })
      .catch((error) => {
        console.error("Failed to get balances:", error);
        throw error;
      });
  };
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

  const Selector = ({ defaultValue, ignoreValue, setToken, id }) => {
    const menu = coinAddresses.map((coin) => ({
      key: coin.name,
      name: coin.name,
    }));

    const [selectedItem, setSelectedItem] = useState();
    const [menuItems, setMenuItems] = useState(getFilteredItems(ignoreValue));

    function getFilteredItems(ignoreValue) {
      return menu.filter((item) => item.key !== ignoreValue);
    }

    useEffect(() => {
      setSelectedItem(defaultValue);
    }, [defaultValue]);

    useEffect(() => {
      setMenuItems(getFilteredItems(ignoreValue));
    }, [ignoreValue]);

    return (
      <Dropdown>
        <Dropdown.Button
          css={{
            backgroundColor: "#2c2f36",
            // selectedItem === DEFAULT_VALUE ? "#2172e5" : "#2c2f36",
          }}
        >
          {selectedItem}
        </Dropdown.Button>
        <Dropdown.Menu
          aria-label="Dynamic Actions"
          items={menuItems}
          onAction={(key) => {
            setSelectedItem(key);
            setToken({ name: key, address: getCoinAddress(key) });
          }}
        >
          {(item) => (
            <Dropdown.Item
              aria-label={id}
              key={item.key}
              color={item.key === "delete" ? "error" : "default"}
            >
              {item.name}
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    );
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
          <CogIcon className="h-6" style={{ cursor: "pointer" }} />
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

export default dynamic(() => Promise.resolve(Pool), { ssr: false });

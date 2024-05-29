import React, { useEffect, useState } from "react";
import {
  getTokenPrice,
  increaseTokenAllowance,
  increaseWethAllowance,
  swapTokensToWeth,
  swapWethToTokens,
  tokenAllowance,
  wethAllowance,
} from "../utils/queries";
import {
  CONNECT_WALLET,
  ENTER_AMOUNT,
  INCREASE_ALLOWANCE,
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

const Pool = () => {
  const whitelisted = whitelistedPools;

  const { address } = useAccount();
  const { pools } = usePools();
  const [reserves, setReserves] = useState({});
  const { openConnectModal } = useConnectModal();

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
    } else {
      console.log(`Pair (${address0}, ${address1}) is not whitelisted`);
    }

    return !!isWhitelisted;
  };

  const getPoolReserves = ({ srcToken, destToken }) => {
    console.log(srcToken.address, destToken.address);

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
    console.log(poolData);
    return poolData;
  };

  useEffect(() => {
    if (!address) setSwapBtnText(CONNECT_WALLET);
    else if (!inputValue || !outputValue) setSwapBtnText(ENTER_AMOUNT);
    else setSwapBtnText(SWAP);
  }, [inputValue, outputValue, address]);

  useEffect(() => {
    const getReserves = async () => {
      const srcTokenAddress = getCoinAddress(srcToken);
      const destTokenAddress = getCoinAddress(destToken);
      const reserves = getPoolReserves({ srcToken, destToken });
      console.log(reserves);

      if (inputValue.length === 0) setOutputValue("");
    };

    getReserves();
  }, [destToken, srcToken, setDestToken, setSrcToken]);

  useEffect(() => {
    const fetchPriceAndPopulateInput = async () => {
      const price = await getTokenPrice();

      if (!isReversed.current) {
        populateInputValue({
          price,
          destToken,
          srcToken,
          outputValue,
          setInputValue,
        });
      }

      if (outputValue.length === 0) setInputValue("");
      if (isReversed.current) isReversed.current = false;
    };

    fetchPriceAndPopulateInput();
  }, [outputValue, srcToken]);

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

  const Selector = ({ defaultValue, ignoreValue, setToken, id }) => {
    let menu = [];

    coinAddresses.map((coin) => {
      menu = [...menu, { key: coin.name, name: coin.name }];
    });

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
            backgroundColor:
              selectedItem === DEFAULT_VALUE ? "#2172e5" : "#2c2f36",
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
    <div className="p-4 translate-y-20 rounded-3xl w-full max-w-[500px] bg-zinc-900 mt-20">
      <div className="flex items-center justify-between  px-1 my-4">
        <p>Pool</p>
        <CogIcon className="h-6" style={{ cursor: "pointer" }} />
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
          if (swapBtnText === INCREASE_ALLOWANCE) handleIncreaseAllowance();
          else if (swapBtnText === SWAP) handleSwap();
          else if (swapBtnText === CONNECT_WALLET) openConnectModal();
        }}
      >
        {swapBtnText}
      </button>

      {txPending && <TransactionStatus />}

      <Toaster />
    </div>
  );
};

export default Pool;

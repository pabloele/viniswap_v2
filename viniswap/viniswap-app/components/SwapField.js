import React from "react";
import Selector from "./Selector";
import { getPrice } from "../utils/queries";
import { getCoinAddress } from "../utils/SupportedCoins";

const SwapField = ({ fieldProps }) => {
  const {
    id,
    value = "",
    setValue,
    defaultValue,
    setToken,
    ignoreValue,
    setCounterPart,
    price,
    srcToken,
    destToken,
  } = fieldProps;

  const populateCounterPart = async ({ inputValue }) => {
    const { priceToken0InToken1, priceToken1InToken0, path } = price;

    const CurrentTokenAddress =
      id === "srcToken" ? getCoinAddress(srcToken) : getCoinAddress(destToken);

    if (!CurrentTokenAddress) return;
    if (CurrentTokenAddress === path[0]) {
      setCounterPart(priceToken1InToken0 * inputValue || "");
    }

    if (CurrentTokenAddress === path[1]) {
      setCounterPart(priceToken0InToken1 * inputValue || "");
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);

    populateCounterPart({ inputValue: e.target.value });
  };

  return (
    <div className="flex items-center rounded-xl">
      <input
        className="w-full outline-none h-8 px-2 appearance-none text-3xl bg-transparent"
        type={"number"}
        value={value}
        placeholder={"0.0"}
        onChange={handleChange}
      />
      <Selector
        id={id}
        setToken={setToken}
        defaultValue={defaultValue}
        ignoreValue={ignoreValue}
      />
    </div>
  );

  function getInputClassname() {
    let className =
      " w-full outline-none h-8 px-2 appearance-none text-3xl bg-transparent";
    return className;
  }
};

export default SwapField;

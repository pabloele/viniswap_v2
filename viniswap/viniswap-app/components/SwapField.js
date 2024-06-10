import React from "react";
import Selector from "./Selector";
import { getPrice, getTokenPrice } from "../utils/queries";
import { getCoinAddress } from "../utils/SupportedCoins";
import { ethers, BigNumber } from "ethers";
import { toEth } from "../utils/ether-utils";

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
    const { path, token0Reserves, token1Reserves } = price;
    if (inputValue === "") {
      setCounterPart("");
      return;
    }
    const CurrentTokenAddress =
      id === "srcToken" ? getCoinAddress(srcToken) : getCoinAddress(destToken);

    if (!CurrentTokenAddress) return;

    const inputAmountBN = ethers.utils.parseUnits(inputValue, 18);
    const token0ReservesBN = ethers.utils.parseUnits(
      token0Reserves.toString(),
      18
    );
    const token1ReservesBN = ethers.utils.parseUnits(
      token1Reserves.toString(),
      18
    );
    console.log(
      toEth(inputAmountBN),
      toEth(token0ReservesBN),
      toEth(token1ReservesBN)
    );

    if (CurrentTokenAddress === path[0]) {
      const outputAmount = token1ReservesBN
        .mul(inputAmountBN)
        .div(token0ReservesBN.add(inputAmountBN)); //Uniswap's formula

      setCounterPart(toEth(outputAmount));
    }

    if (CurrentTokenAddress === path[1]) {
      const outputAmount = token0ReservesBN
        .mul(inputAmountBN)
        .div(token1ReservesBN.add(inputAmountBN)); //Uniswap's formula
      setCounterPart(toEth(outputAmount));
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);

    populateCounterPart({
      inputValue: e.target.value,
    });
  };

  return (
    <div className="flex items-center rounded-xl">
      <div className="relative">
        <div
          className={`absolute top-[-1.5rem] text-xs mx-2 text-gray-500 pointer-events-none shadow-lg ${
            id === "srcToken" ? " right-[-7.5rem]" : " right-[-6.5rem]"
          }`}
        >
          {id === "srcToken" ? "From:" : "To:"}
        </div>
        <input
          className="w-full outline-none h-8 px-2 appearance-none text-3xl bg-transparent"
          type={"number"}
          value={value}
          placeholder={"0.0"}
          onChange={handleChange}
        />
      </div>
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

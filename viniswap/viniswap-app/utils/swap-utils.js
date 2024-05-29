import { DEFAULT_VALUE, WETH } from "./SupportedCoins";
import toast, { Toaster } from "react-hot-toast";

export const INCREASE_ALLOWANCE = "Increase allowance";
export const ENTER_AMOUNT = "Enter an amount";
export const PAIR_NOT_AVAILABLE = "Pair not available";

export const CONNECT_WALLET = "Connect wallet";
export const SWAP = "Swap";
export const ADD_OR_REMOVE_LIQUIDITY = "Add or remove liquidity";

export const notifyError = (msg) => toast.error(msg, { duration: 6000 });
export const notifySuccess = () => toast.success("Transaction completed.");
export const getSwapBtnClassName = (swapBtnText) => {
  let className = "p-4 w-full my-2 rounded-xl";
  className +=
    swapBtnText === ENTER_AMOUNT || swapBtnText === CONNECT_WALLET
      ? " text-zinc-400 bg-zinc-800 pointer-events-none"
      : " bg-blue-700";
  className += swapBtnText === INCREASE_ALLOWANCE ? " bg-yellow-600" : "";
  return className;
};

export const populateOutputValue = ({
  price,
  destToken,
  srcToken,
  inputValue,
  setOutputValue,
}) => {
  if (destToken === DEFAULT_VALUE || srcToken === DEFAULT_VALUE || !inputValue)
    return;

  try {
    if (srcToken !== WETH && destToken !== WETH) setOutputValue(inputValue);
    else if (srcToken === WETH && destToken !== WETH) {
      const outValue = inputValue / price;
      setOutputValue(outValue);
    } else if (srcToken !== WETH && destToken === WETH) {
      // const outValue = toEth(toWei(inputValue * price, 14));
      const outValue = inputValue * price;
      setOutputValue(outValue);
    }
  } catch (error) {
    setOutputValue("0");
  }
};

export const populateInputValue = ({
  price,
  destToken,
  srcToken,
  outputValue,
  setInputValue,
}) => {
  if (destToken === DEFAULT_VALUE || srcToken === DEFAULT_VALUE || !outputValue)
    return;

  try {
    if (srcToken !== WETH && destToken !== WETH) setInputValue(outputValue);
    else if (srcToken === WETH && destToken !== WETH) {
      // const outValue = toEth(toWei(outputValue, 14));
      setInputValue(outputValue * price);
    } else if (srcToken !== WETH && destToken === WETH) {
      // const outValue = toEth(toWei(outputValue), 14);
      setInputValue(outputValue / price);
    }
  } catch (error) {
    setInputValue("0");
  }
};

export const handleInsufficientAllowance = ({ setSwapBtnText }) => {
  notifyError(
    "Insufficient allowance. Click 'Increase allowance' to increase it."
  );

  setSwapBtnText(INCREASE_ALLOWANCE);
};

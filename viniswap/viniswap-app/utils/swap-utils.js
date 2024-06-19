import { DEFAULT_VALUE, WETH } from "./SupportedCoins";
import toast, { Toaster } from "react-hot-toast";

export const INCREASE_ALLOWANCE = "Increase allowance";
export const ENTER_AMOUNT = "Enter an amount";
export const INVALID_AMOUNT = "Invalid amount";
export const PAIR_NOT_AVAILABLE = "Pair not available";
export const SELECT_PAIR = "Select a valid pair";
export const ADD_OR_REMOVE_LIQUIDITY = "Add or remove liquidity";
export const CONFIRM = "Confirm";
export const CONNECT_WALLET = "Connect wallet";
export const SWAP = "Swap";
export const defaultSlippage = 10;

export const notifyError = (msg) => toast.error(msg, { duration: 6000 });
export const notifySuccess = () => toast.success("Transaction completed.");
export const getSwapBtnClassName = (swapBtnText) => {
  let className = "p-4 w-full my-4 rounded-xl bg-zinc-800";

  switch (swapBtnText) {
    case CONNECT_WALLET:
      className += " cursor-pointer ";
      break;
    case SWAP:
      className += " cursor-pointer";
      break;
    case ENTER_AMOUNT:
      className += " pointer-events-none";
      break;
    case SELECT_PAIR:
      className += " pointer-events-none";
      break;
  }

  return className;
};

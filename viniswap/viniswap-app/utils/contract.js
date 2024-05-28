import { ethers } from "ethers";
import { factoryABI, mtb24ABI, pairABI, routerABI, wethABI } from "./abi";

export const mtb24Contract = async (address) => {
  if (typeof window !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const { ethereum } = window;
    if (ethereum) {
      const signer = provider.getSigner();
      const contractReader = new ethers.Contract(address, mtb24ABI, signer);
      return contractReader;
    }
  }
};

export const wethContract = async () => {
  if (typeof window !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const { ethereum } = window;

    if (ethereum) {
      const routerObj = await routerContract();
      const signer = provider.getSigner();
      const contractReader = new ethers.Contract(
        process.env.NEXT_PUBLIC_WETH_ADDRESS,
        wethABI,
        signer
      );
      return contractReader;
    }
  }
};

export const routerContract = async () => {
  if (typeof window !== "undefined") {
    const { ethereum } = window;

    if (ethereum) {
      try {
        await ethereum.request({ method: "eth_requestAccounts" });

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contractReader = new ethers.Contract(
          process.env.NEXT_PUBLIC_ROUTER,
          routerABI,
          signer
        );

        return contractReader;
      } catch (error) {
        console.error("Need account access", error);
      }
    } else {
      console.error(
        "Wallet is not installed or not available in the current environment."
      );
    }
  } else {
    console.error("You must run this in a browser.");
  }
};

export const factoryContract = async () => {
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const router = await routerContract();
      const factoryAddress = await router.factory();
      return new ethers.Contract(factoryAddress, factoryABI, signer);
    } catch (error) {
      console.error("Failed to get factory contract:", error);
      throw error;
    }
  } else {
    throw new Error("Ethereum object not found or not running in a browser.");
  }
};

export const pairContract = async ({ pairAddress }) => {
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      // const router = await routerContract();
      // const factoryAddress = await router.factory();
      return new ethers.Contract(pairAddress, pairABI, signer);
    } catch (error) {
      console.error("Failed to get factory contract:", error);
      throw error;
    }
  } else {
    throw new Error("Ethereum object not found or not running in a browser.");
  }
};

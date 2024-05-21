import { ethers } from "ethers";
import { mtb24ABI, routerABI, wethABI } from "./abi";

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

// export const routerContract = async () => {
//   if (typeof window !== 'undefined') {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const { ethereum } = window;

//     if (ethereum) {
//       const signer = provider.getSigner();
//       const contractReader = new ethers.Contract(
//         process.env.NEXT_PUBLIC_ROUTER,
//         routerABI,
//         signer
//       );
//       return contractReader;
//     }
//   }
// };

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

import { ethers } from 'ethers';
import { mtb24ABI, routerABI, wethABI } from './abi';

export const mtb24Contract = async (address) => {
  if (typeof window !== 'undefined') {
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
  if (typeof window !== 'undefined') {
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

export const routerContract = async () => {
  if (typeof window !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const { ethereum } = window;

    if (ethereum) {
      const signer = provider.getSigner();
      const contractReader = new ethers.Contract(
        process.env.NEXT_PUBLIC_ROUTER,
        routerABI,
        signer
      );
      return contractReader;
    }
  }
};

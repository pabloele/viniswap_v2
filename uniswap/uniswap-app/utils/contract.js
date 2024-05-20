import { ethers } from 'ethers';
import { UniswapABI } from './Uniswap';
import { CustomTokenABI } from './CustomToken';
// const address = '0xeD697701e8b9C39CB8A5dAC98355d035Fb5e6389'; //mumbai

export const tokenContract = async (address) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { ethereum } = window;
  if (ethereum) {
    const signer = provider.getSigner();
    const contractReader = new ethers.Contract(address, CustomTokenABI, signer);
    return contractReader;
  }
};
export const contract = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { ethereum } = window;
  if (ethereum) {
    const signer = provider.getSigner();
    const contractReader = new ethers.Contract(
      '0xed697701e8b9c39cb8a5dac98355d035fb5e6389',
      UniswapABI,
      signer
    );
    return contractReader;
  }
};

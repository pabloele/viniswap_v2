import { BigNumber, ethers } from 'ethers';
import { contract, tokenContract } from './contract';
import { toEth, toWei } from './ether-utils';

export const swapEthToToken = async (tokenName, amount) => {
  try {
    let tx = { value: toWei(amount) };
    const contractObj = await contract();
    const data = await contractObj.swapEthToToken(tokenName, tx);

    const receipt = await data.wait();
    return receipt;
  } catch (error) {
    console.log(error);
  }
};

export const getTokenBalance = async (tokenName, address) => {
  const contractObj = await contract();
  const balance = contractObj.getBalance(tokenName, address);
  return balance;
};

export const getTokenAddress = async (tokenName) => {
  try {
    const contractObj = await contract();
    const address = await contractObj.getTokenAddress(tokenName);
    return address;
  } catch (error) {
    console.log(error);
  }
};

export const swapTokenToEth = async (tokenName, amount) => {
  try {
    const contractObj = await contract();
    const data = await contractObj.swapTokenToEth(tokenName, toWei(amount));
    const receipt = await data.wait();
    return receipt;
  } catch (error) {}
};

export const increaseAllowance = async (tokenName, amount) => {
  try {
    const contractObj = await contract();
    const address = await contractObj.getTokenAddress(tokenName);
    const tokenContractObj = await tokenContract(address);
    const data = await tokenContractObj.approve(
      '0xed697701e8b9c39cb8a5dac98355d035fb5e6389',
      toWei(amount)
    );
  } catch (error) {
    console.log(error);
  }
};

export const hasValidAllowance = async (owner, tokenName, amount) => {
  try {
    const contractObj = await contract();
    const address = await contractObj.getTokenAddress(tokenName);

    const tokenContractObj = await tokenContract(address);

    const data = await tokenContractObj.allowance(
      owner,
      '0xed697701e8b9c39cb8a5dac98355d035fb5e6389'
    );

    const result = BigNumber.from(data.toString()).gte(
      BigNumber.from(toWei(amount))
    );
    return result;
  } catch (error) {
    console.log(error);
  }
};

export async function swapTokenToToken(srcToken, destToken, amount) {
  try {
    const contractObj = await contract();
    const data = await contractObj.swapTokenToToken(
      srcToken,
      destToken,
      toWei(amount)
    );

    const receipt = await data.wait();
    return receipt;
  } catch (e) {
    return parseErrorMsg(e);
  }
}

import { BigNumber, ethers } from "ethers";
import {
  routerContract,
  mtb24Contract,
  wethContract,
  pairContract,
} from "./contract";
import { toEth, toWei } from "./ether-utils";
import { getCoinName } from "./SupportedCoins";
import { wethABI } from "./abi";

//Viniswap
const WETH_ADDRESS = process.env.NEXT_PUBLIC_WETH_ADDRESS;
const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_MTB24_ADDRESS;

export const tokenBalance = async (tokenAddress = TOKEN_ADDRESS) => {
  try {
    const tokenContractObj = await mtb24Contract(tokenAddress);
    const routerObj = await routerContract();
    const walletAddress = await routerObj.signer.getAddress();

    const name = await tokenContractObj.name();
    const balance = await tokenContractObj.balanceOf(walletAddress);
    const formatedBalance = toEth(balance).toString();
    console.log(name);
    console.log(formatedBalance);
    return formatedBalance;
  } catch (error) {
    console.log(error);
  }
};

export const wethBalance = async () => {
  try {
    const routerObj = await routerContract();
    const walletAddress = await routerObj.signer.getAddress();
    const wethContractObj = await wethContract(WETH_ADDRESS);
    const name = await wethContractObj.name();
    console.log(name);

    const balance = await wethContractObj.provider.getBalance(walletAddress);
    const formatedBalance = toEth(balance).toString();

    console.log(formatedBalance);
    return formatedBalance;
  } catch (error) {
    console.log(error);
  }
};

export const tokenAllowance = async () => {
  try {
    const routerObj = await routerContract();
    const walletAddress = await routerObj.signer.getAddress();
    console.log(walletAddress);
    const tokenContractObj = await mtb24Contract(TOKEN_ADDRESS);
    const name = await tokenContractObj.name();
    const allowance = await tokenContractObj.allowance(
      walletAddress,
      routerObj.address
    );
    const formattedAllowance = toEth(allowance).toString();
    console.log("Nombre del token:", name);
    console.log("Allowance:", formattedAllowance);

    return formattedAllowance;
  } catch (error) {
    console.log(error);
  }
};

export const wethAllowance = async () => {
  try {
    const routerObj = await routerContract();
    const walletAddress = await routerObj.signer.getAddress();
    console.log(walletAddress);
    const wethContractObj = await wethContract(WETH_ADDRESS);
    const name = await wethContractObj.name();
    const allowance = await wethContractObj.allowance(
      walletAddress,
      routerObj.address
    );
    const formattedAllowance = toEth(allowance).toString();
    console.log("Nombre del token:", name);
    console.log("Alloance:", formattedAllowance);

    return formattedAllowance;
  } catch (error) {
    console.log(error);
  }
};

export const increaseTokenAllowance = async (amount) => {
  try {
    const routerObj = await routerContract();
    const tokenContractObj = await mtb24Contract(TOKEN_ADDRESS);
    const walletAddress = await routerObj.signer.getAddress();
    console.log(walletAddress);
    const name = await tokenContractObj.name();
    const totalAmount = await tokenBalance();
    console.log(totalAmount);

    const approvalTx = await tokenContractObj.approve(
      routerObj.address,
      toWei(amount.toString()).toString()
    );

    const receipt = await approvalTx.wait();
    console.log("Approval transaction receipt:", receipt);

    return receipt;
  } catch (error) {
    console.log(error);
  }
};

export const increaseWethAllowance = async (amount) => {
  console.log(amount);
  try {
    const routerObj = await routerContract();
    const wethContractObj = await wethContract(WETH_ADDRESS);
    const walletAddress = await routerObj.signer.getAddress();
    console.log(walletAddress);
    const name = await wethContractObj.name();
    const totalAmount = await wethBalance();
    console.log(totalAmount);
    const approvalTx = await wethContractObj.approve(
      routerObj.address,
      toWei(amount.toString()).toString()
    );

    // const receipt = await approvalTx.wait();
    console.log("Approval transaction receipt:", approvalTx);

    return approvalTx;
  } catch (error) {
    console.log(error);
  }
};

export const getTokenPrice = async () => {
  try {
    const routerObj = await routerContract(); // Obtener instancia del contrato del router
    const amountOut = toWei("1"); // Definir la cantidad de salida deseada (1 unidad del token)

    // Definir la ruta de intercambio (de TOKEN_ADDRESS a WETH_ADDRESS)
    const path = [TOKEN_ADDRESS, WETH_ADDRESS];

    // Obtener las cantidades de entrada necesarias
    let amounts = await routerObj?.getAmountsOut(amountOut, path);

    if (!amounts) {
      amounts = [0, 0];
    }
    // Precio = la cantidad de WETH necesaria para recibir 1 unidad del token de salida
    const priceInWeth = ethers.utils.formatEther(amounts[1]);
    console.log("Precio del token en WETH:", priceInWeth);

    return priceInWeth;
  } catch (error) {
    console.error("Error al obtener el precio del token:", error);
    throw error;
  }
};

export const swapTokensToWeth = async (tokenAmount) => {
  const allowanceStatus = await tokenAllowance();
  console.log("Allowance status: ", allowanceStatus);
  const routerObj = await routerContract();
  console.log("router address:", routerObj.address);
  if (!routerObj) {
    console.error("No se pudo obtener el contrato del router");
    return;
  }

  const signer = await routerObj.provider.getSigner();
  const initialTokenBalance = await tokenBalance();
  const initialWethBalance = await wethBalance();
  console.log(initialTokenBalance, initialWethBalance);

  try {
    const tx = await routerObj.connect(signer).swapExactTokensForTokens(
      toWei(tokenAmount.toString()), // Cantidad exacta de tokens de entrada

      0, // Cantidad mínima de tokens de salida
      [
        // Ruta de tokens (de TOKEN_ADDRESS a WETH_ADDRESS)
        TOKEN_ADDRESS,
        WETH_ADDRESS,
      ],
      signer.getAddress(), // Dirección del destinatario de los tokens de salida
      Math.floor(Date.now() / 1000) + 60 * 10 // Plazo de validez de la transacción
    );
    const result = await tx.wait();
    console.log(result);
    const afterSwapTokenBalance = await tokenBalance();
    const afterSwapWethBalance = await wethBalance();
    console.log(afterSwapTokenBalance, afterSwapWethBalance);
  } catch (error) {
    console.log(error);
  }
};

export const swapWethToTokens = async (tokenAmount) => {
  const exactTokenAmount = Math.floor(tokenAmount);
  console.log(exactTokenAmount);
  const allowanceStatus = await wethAllowance();
  console.log("Allowance status: ", allowanceStatus);
  const routerObj = await routerContract();
  if (!routerObj) {
    console.error("No se pudo obtener el contrato del router");
    return;
  }

  const signer = await routerObj.provider.getSigner();
  const initialTokenBalance = await tokenBalance();
  const initialWethBalance = await wethBalance();
  console.log(initialTokenBalance, initialWethBalance);

  try {
    const tx = await routerObj.connect(signer).swapTokensForExactTokens(
      toWei(exactTokenAmount.toString()),

      toWei(initialWethBalance), // Cantidad mínima de tokens de salida
      [
        // Ruta de tokens (de TOKEN_ADDRESS a WETH_ADDRESS)
        WETH_ADDRESS,
        TOKEN_ADDRESS,
      ],
      signer.getAddress(), // Dirección del destinatario de los tokens de salida
      Math.floor(Date.now() / 1000) + 60 * 10 // Plazo de validez de la transacción
    );
    console.log("hola");
    const receipt = await tx.wait();
    console.log(receipt);
    const afterSwapTokenBalance = await tokenBalance();
    const afterSwapWethBalance = await wethBalance();
    console.log(afterSwapTokenBalance, afterSwapWethBalance);
    return receipt;
  } catch (error) {
    console.log(error);
  }
};

export const lpTokenBalance = async (pairAddress) => {
  try {
    const pairContractObj = await pairContract({ pairAddress });
    const routerObj = await routerContract();
    const walletAddress = await routerObj.signer.getAddress();

    const balance = await pairContractObj.balanceOf(walletAddress);
    const formatedBalance = toEth(balance).toString();

    console.log(formatedBalance);
    return formatedBalance;
  } catch (error) {
    console.log(error);
  }
};

export const addLiquidity = async (
  tokenAAddress,
  tokenBAddress,
  amountAdesired,
  amountBdesired,
  amountAMin,
  amountBMin
) => {
  const allowanceAStatus = await allowanceStatus(tokenAAddress);
  const allowanceBStatus = await allowanceStatus(tokenBAddress);

  const routerObj = await routerContract();
  const signer = await routerObj.provider.getSigner();
  if (!routerObj) {
    console.error("No se pudo obtener el contrato del router");
    return;
  }

  try {
    const tx = await routerObj
      .connect(signer)
      .addLiquidity(
        tokenAAddress,
        tokenBAddress,
        toWei(amountAdesired.toString()),
        toWei(amountBdesired.toString()),
        "0",
        "0",
        signer.getAddress(),
        Math.floor(Date.now() / 1000) + 60 * 10
      );

    const receipt = await tx.wait();
    console.log(receipt);
    const afterSwapTokenBalance = await tokenBalance();
    const afterSwapWethBalance = await wethBalance();
    console.log(afterSwapTokenBalance, afterSwapWethBalance);
    return receipt;
  } catch (error) {
    console.log(error);
  }
};

export const allowanceStatus = async (tokenAddress) => {
  let allowance = 0;
  const name = getCoinName(tokenAddress);
  if (name === "ETH") allowance = await wethAllowance();
  else allowance = await tokenAllowance();
  console.log(allowance);
  return allowance;
};

export const removeLiquidity = async (
  tokenAAddress,
  tokenBAddress,
  lpAmount
) => {
  const routerObj = await routerContract();

  const signer = await routerObj.provider.getSigner();
  if (!routerObj) {
    console.error("No se pudo obtener el contrato del router");
    return;
  }

  const formattedAmount = toWei(lpAmount);
  console.log(formattedAmount);
  try {
    const tx = await routerObj
      .connect(signer)
      .removeLiquidity(
        tokenAAddress,
        tokenBAddress,
        formattedAmount,
        "0",
        "0",
        signer.getAddress(),
        Math.floor(Date.now() / 1000) + 60 * 10
      );

    const receipt = await tx.wait();
    console.log(receipt);

    return receipt;
  } catch (error) {
    console.log(error);
  }
};

export const lpTokenAllowance = async ({ liquidityAmount, address }) => {
  console.log(liquidityAmount, address);
  try {
    const pairContractObj = await pairContract({ pairAddress: address });

    const routerObj = await routerContract();
    const routerAddress = routerObj.address;
    console.log(routerAddress);
    const walletAddress = await routerObj.signer.getAddress();
    const formattedAmount = toWei(liquidityAmount);
    console.log(formattedAmount);
    const receipt = await pairContractObj.approve(
      routerAddress,
      formattedAmount
    );
    console.log(receipt);
    return receipt;
  } catch (error) {
    console.log(error);
  }
};

export const wrapEth = async (amount) => {
  try {
    const routerObj = await routerContract();
    const signer = routerObj.provider.getSigner();
    const wethContractObj = new ethers.Contract(WETH_ADDRESS, wethABI, signer);

    const tx = await wethContractObj.deposit({
      value: toWei(amount.toString()),
    });

    const receipt = await tx.wait();
    console.log("Wrap ETH transaction receipt:", receipt);
    return receipt;
  } catch (error) {
    console.error("Error wrapping ETH:", error);
    throw error;
  }
};

export const unwrapEth = async (amount) => {
  console.log(amount);
  try {
    const signer = new ethers.providers.Web3Provider(
      window.ethereum
    ).getSigner();
    const wethContractObj = new ethers.Contract(WETH_ADDRESS, wethABI, signer);

    const tx = await wethContractObj.withdraw(toWei(amount.toString()));
    const receipt = await tx.wait();
    console.log("Unwrap ETH transaction receipt:", receipt);
    return receipt;
  } catch (error) {
    console.error("Error unwrapping ETH:", error);
    throw error;
  }
};

export const increaseAllowance = async (amount, token) => {
  try {
    if (token.name === "ETH") {
      const depositReceipt = await wrapEth(amount);
      console.log("deposit receipt", depositReceipt);
      const receipt = await increaseWethAllowance(amount * 1.1);
      console.log(receipt);
      return receipt;
    } else {
      const receipt = await increaseTokenAllowance(amount);
      console.log(receipt);
      return receipt;
    }
  } catch (error) {
    console.log(error);
  }
};

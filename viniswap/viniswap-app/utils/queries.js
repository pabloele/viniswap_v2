import { BigNumber, ethers } from "ethers";
import { routerContract, mtb24Contract, wethContract } from "./contract";
import { toEth, toWei } from "./ether-utils";
const WETH_ADDRESS = process.env.NEXT_PUBLIC_WETH_ADDRESS;
const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_MTB24_ADDRESS;

//Viniswap

export const tokenBalance = async () => {
  try {
    const tokenContractObj = await mtb24Contract(TOKEN_ADDRESS);
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

// increaseTokenAllowance(0);
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

// increaseWethAllowance(0);

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
    // El precio será la cantidad de WETH necesaria para recibir 1 unidad del token de salida
    const priceInWeth = ethers.utils.formatEther(amounts[1]);
    console.log("Precio del token en WETH:", priceInWeth);

    return priceInWeth;
  } catch (error) {
    console.error("Error al obtener el precio del token:", error);
    throw error;
  }
};

// getTokenPrice();

// increaseTokenAllowance();

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
      toWei(tokenAmount.toString()), // Cantidad exacta de tokens de entrada (1 token)

      0, // Cantidad mínima de tokens de salida
      [
        // Ruta de tokens (de TOKEN_ADDRESS a WETH_ADDRESS)
        TOKEN_ADDRESS,
        WETH_ADDRESS,
      ],
      signer.getAddress(), // Dirección del destinatario de los tokens de salida
      Math.floor(Date.now() / 1000) + 60 * 10 // Plazo de validez de la transacción
      // {
      //   gasLimit: 1000000,
      // }
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

// swapTokensToWeth();

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

// swapWethToTokens();

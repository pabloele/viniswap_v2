import React, { useState } from "react";
import Modal from "react-modal";
import { tokenBalance } from "../utils/queries";

const LiquidityModal = ({
  isOpen,
  onClose,
  onAddLiquidity,
  onRemoveLiquidity,
  srcToken,
  destToken,
  signerBalances,
  reserves,
}) => {
  const [action, setAction] = useState("add");
  const [amounts, setAmounts] = useState({
    tokenAAmount: 0,
    tokenBAmount: 0,
  });
  const [tokenAAmount, setTokenAAmount] = useState(0);
  const [tokenBAmount, setTokenBAmount] = useState(0);
  const [liquidityAmount, setLiquidityAmount] = useState(0);
  const [removePercentage, setRemovePercentage] = useState(0);
  console.log(srcToken, destToken);
  console.log(signerBalances);

  const handleChangeTokenAmount = (e) => {
    setAmounts((...prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSlidePercentage = (e) => {
    setRemovePercentage(e.target.value);
    setLiquidityAmount(signerBalances.lpBalance * (e.target.value / 100));
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content bg-[#18181b] p-6 rounded-3xl max-w-md mx-auto"
      overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
    >
      <div className="text-white">
        <h2 className="text-2xl mb-4">Liquidity</h2>

        <div className="flex mb-4 justify-center">
          <button
            className={`mr-2 p-2 rounded-xl w-1/2 h-[3rem] ${
              action === "add"
                ? "bg-[#44162e] "
                : "bg-[#212429] hover:bg-[#212429]"
            }`}
            onClick={() => setAction("add")}
          >
            Add
          </button>
          <button
            className={`p-2 rounded-xl w-1/2 h-[3rem] ${
              action === "remove"
                ? "bg-[#44162e] "
                : "bg-[#212429] hover:bg-[#212429]"
            }`}
            onClick={() => setAction("remove")}
          >
            Remove
          </button>
        </div>

        {action === "add" && (
          <div>
            <div className="mb-4">
              <label>{srcToken.name} amount:</label>
              <input
                name="tokenAAmount"
                type="number"
                value={amounts.tokenAAmount}
                placeholder={"0.0"}
                className="w-full p-2 mt-2 bg-[#212429] rounded-xl h-[3rem] text-gray-300 text-3xl py-8"
                onChange={handleChangeTokenAmount}
              />
              <label>{signerBalances.srcBalance}</label>
            </div>
            <div className="mb-4">
              <label>{destToken.name} amount:</label>
              <input
                name="tokenBAmount"
                type="number"
                value={amounts.tokenBAmount}
                className="w-full p-2 mt-2 bg-[#212429] rounded-xl h-[3rem] text-gray-300 hover:text-gray-400 text-3xl py-8"
                onChange={handleChangeTokenAmount}
              />
              <label>{signerBalances.destBalance}</label>
            </div>
            <button
              className="w-full p-2 bg-[#44162e] rounded-xl h-[3rem] hover:bg-[#351223] text-gray-300"
              onClick={() => onAddLiquidity(tokenAAmount, tokenBAmount)}
            >
              Add
            </button>
          </div>
        )}

        {action === "remove" && (
          <div>
            <div className="mb-4">
              <label>Liquidity Amount:</label>
              <input
                type="number"
                value={liquidityAmount}
                className="w-full p-2 mt-2 bg-[#212429] rounded-xl h-[3rem] text-gray-300 text-3xl py-8"
                onChange={(e) => setLiquidityAmount(e.target.value)}
              />
              <label>{signerBalances.lpBalance}</label>
            </div>
            <div className="mb-4 rounded-xl">
              <div className="flex justify-between flex-row">
                <label>%</label>
                <label>{removePercentage}%</label>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={removePercentage}
                className="w-full mt-2 h-[3rem]"
                onChange={handleSlidePercentage}
              />
              {/* <input
                type="number"
                value={removePercentage}
                className="w-full p-2 mt-2 bg-[#212429] rounded-xl h-[3rem] text-gray-300 text-3xl py-8"
                onChange={(e) => setRemovePercentage(e.target.value)}
              /> */}
            </div>
            <button
              className="w-full p-2 bg-[#44162e] rounded-xl h-[3rem] hover:bg-[#351223] text-gray-300"
              onClick={() =>
                onRemoveLiquidity(liquidityAmount, removePercentage)
              }
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default LiquidityModal;

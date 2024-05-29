import React, { useState } from "react";
import Modal from "react-modal";

const LiquidityModal = ({
  isOpen,
  onClose,
  onAddLiquidity,
  onRemoveLiquidity,
}) => {
  const [action, setAction] = useState("add");
  const [tokenAAmount, setTokenAAmount] = useState(0);
  const [tokenBAmount, setTokenBAmount] = useState(0);
  const [liquidityAmount, setLiquidityAmount] = useState(0);
  const [removePercentage, setRemovePercentage] = useState(0);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content bg-[#18181b] p-6 rounded-3xl max-w-md mx-auto "
      overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
    >
      <div className="text-white">
        <h2 className="text-2xl mb-4">Liquidity</h2>

        <div className="flex mb-4 justify-center">
          <button
            className={`mr-2 p-2 rounded-xl w-1/2 h-[3rem]${
              action === "add"
                ? "bg-[#212429] hover:bg-gray-600"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            onClick={() => setAction("add")}
          >
            Add
          </button>
          <button
            className={`mr-2 p-2 rounded-xl w-1/2 h-[3rem]${
              action === "add"
                ? "bg-[#212429] hover:bg-gray-600"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            onClick={() => setAction("remove")}
          >
            Remove
          </button>
        </div>

        {action === "add" && (
          <div>
            <div className="mb-4">
              <label>Tokan A Amount:</label>
              <input
                type="number"
                value={tokenAAmount}
                placeholder={"0.0"}
                className="w-full p-2 mt-2 bg-[#212429] rounded-xl h-[3rem] text-gray-300 text-3xl py-8"
                onChange={(e) => setTokenAAmount(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label>Monto de Token B:</label>
              <input
                type="number"
                value={tokenBAmount}
                className="w-full p-2 mt-2 bg-[#212429] rounded-xl h-[3rem] text-gray-300 text-3xl py-8"
                onChange={(e) => setTokenBAmount(e.target.value)}
              />
            </div>
            <button
              className="w-full p-2 bg-[#840C4A] rounded-xl h-[3rem] hover:bg-[#702f51]"
              onClick={() => onAddLiquidity(tokenAAmount, tokenBAmount)}
            >
              Agregar
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
            </div>
            <div className="mb-4 rounded-xl">
              <label>Percentage</label>
              <input
                type="range"
                min="0"
                max="100"
                value={removePercentage}
                className="w-full mt-2 h-[3rem]"
                onChange={(e) => setRemovePercentage(e.target.value)}
              />
              <input
                type="number"
                value={removePercentage}
                className="w-full p-2 mt-2 bg-[#212429] rounded-xl h-[3rem] text-gray-300 text-3xl py-8"
                onChange={(e) => setRemovePercentage(e.target.value)}
              />
            </div>
            <button
              className="w-full p-2 bg-[#840C4A] rounded-xl h-[3rem] hover:bg-[#ca4d8e]"
              onClick={() =>
                onRemoveLiquidity(liquidityAmount, removePercentage)
              }
            >
              Remove liquidity
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default LiquidityModal;

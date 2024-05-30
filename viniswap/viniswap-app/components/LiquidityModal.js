import React, { useState } from "react";
import Modal from "react-modal";

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
    tokenAAmount: "0",
    tokenBAmount: "0",
  });
  const [liquidityAmount, setLiquidityAmount] = useState("0");
  const [removePercentage, setRemovePercentage] = useState(0);

  const handleChangeTokenAmount = (e) => {
    const { name, value } = e.target;
    let price;

    // Calcular el precio relativo del token destino en términos del token origen
    if (destToken.name === reserves.name1) {
      price = reserves.reserves1 / reserves.reserves0;
    } else {
      price = reserves.reserves0 / reserves.reserves1;
    }

    // Actualizar la cantidad del otro token basado en el precio relativo
    let newAmounts;
    if (name === "tokenAAmount") {
      newAmounts = {
        tokenAAmount: value,
        tokenBAmount: (value * price).toString(),
      };
    } else {
      newAmounts = {
        tokenAAmount: (value / price).toString(),
        tokenBAmount: value,
      };
    }

    setAmounts(newAmounts);
  };

  const handleSlidePercentage = (e) => {
    const percentage = e.target.value;
    setRemovePercentage(percentage);
    const newLiquidityAmount = (signerBalances.lpBalance * percentage) / 100;
    setLiquidityAmount(newLiquidityAmount.toString());
  };

  const isExceedingBalance = (tokenAmount, balance) => {
    return parseFloat(tokenAmount) > parseFloat(balance);
  };

  const handleFocus = (e) => {
    if (e.target.value === "0") {
      e.target.value = "";
    } else {
      e.target.setSelectionRange(e.target.value.length, e.target.value.length);
    }
  };

  const handleBlur = (e) => {
    if (e.target.value === "") {
      setAmounts((prevAmounts) => ({
        ...prevAmounts,
        [e.target.name]: "0",
      }));
      e.target.value = "0";
    }
  };

  const handleAddLiquidity = async () => {
    if (
      isExceedingBalance(amounts.tokenAAmount, signerBalances.srcBalance) ||
      isExceedingBalance(amounts.tokenBAmount, signerBalances.destBalance)
    ) {
      console.log("hola");
      return;
    } else onAddLiquidity(amounts.tokenAAmount, amounts.tokenBAmount);
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
                ? "bg-[#44162e]"
                : "bg-[#212429] hover:bg-[#212429]"
            }`}
            onClick={() => setAction("add")}
          >
            Add
          </button>
          <button
            className={`p-2 rounded-xl w-1/2 h-[3rem] ${
              action === "remove"
                ? "bg-[#44162e]"
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
                type="text"
                value={amounts.tokenAAmount}
                placeholder="0.0"
                className={`w-full p-2 mt-2 rounded-xl h-[3rem] text-3xl py-8 ${
                  isExceedingBalance(
                    amounts.tokenAAmount,
                    signerBalances.srcBalance
                  )
                    ? "text-[#9c5454]"
                    : "text-gray-300 bg-[#212429]"
                } focus:outline-none focus:ring-0`}
                onChange={handleChangeTokenAmount}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <label>{signerBalances.srcBalance}</label>
            </div>
            <div className="mb-4">
              <label>{destToken.name} amount:</label>
              <input
                name="tokenBAmount"
                type="text"
                value={amounts.tokenBAmount}
                placeholder="0.0"
                className={`w-full p-2 mt-2 rounded-xl h-[3rem] text-3xl py-8 ${
                  isExceedingBalance(
                    amounts.tokenBAmount,
                    signerBalances.destBalance
                  )
                    ? "text-[#9c5454]"
                    : "text-gray-300 bg-[#212429]"
                } focus:outline-none focus:ring-0`}
                onChange={handleChangeTokenAmount}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <label>{signerBalances.destBalance}</label>
            </div>
            <button
              className="w-full p-2 bg-[#44162e] rounded-xl h-[3rem] hover:bg-[#351223] text-gray-300"
              onClick={handleAddLiquidity}
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
                type="text"
                value={liquidityAmount}
                className="w-full p-2 mt-2 bg-[#212429] rounded-xl h-[3rem] text-3xl py-8 text-gray-300"
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

// import React, { useState } from "react";
// import Modal from "react-modal";

// const LiquidityModal = ({
//   isOpen,
//   onClose,
//   onAddLiquidity,
//   onRemoveLiquidity,
//   srcToken,
//   destToken,
//   signerBalances,
//   reserves,
// }) => {
//   const [action, setAction] = useState("add");
//   const [amounts, setAmounts] = useState({
//     tokenAAmount: "0",
//     tokenBAmount: "0",
//   });
//   const [liquidityAmount, setLiquidityAmount] = useState("0");
//   const [removePercentage, setRemovePercentage] = useState(0);

//   const handleChangeTokenAmount = (e) => {
//     const { name, value } = e.target;
//     let price = 0;

//     if (destToken.name === reserves.name1) {
//       console.log("hola");
//       price = reserves.reserves1 / reserves.reserves0;
//     } else {
//       console.log("hola");
//       price = reserves.reserves0 / reserves.reserves1;
//     }

//     console.log(reserves.reserves0, reserves.reserves1);
//     console.log(price);
//     setAmounts((prevAmounts) => ({
//       ...prevAmounts,
//       [name]: value,
//     }));
//   };

//   const handleSlidePercentage = (e) => {
//     const percentage = e.target.value;
//     setRemovePercentage(percentage);
//     const newLiquidityAmount = (signerBalances.lpBalance * percentage) / 100;
//     setLiquidityAmount(newLiquidityAmount.toString());
//   };

//   const isExceedingBalance = (tokenAmount, balance) => {
//     return parseFloat(tokenAmount) > parseFloat(balance);
//   };

//   const handleFocus = (e) => {
//     if (e.target.value === "0") {
//       e.target.value = "";
//     } else {
//       e.target.setSelectionRange(e.target.value.length, e.target.value.length);
//     }
//   };

//   const handleBlur = (e) => {
//     if (e.target.value === "") {
//       setAmounts((prevAmounts) => ({
//         ...prevAmounts,
//         [e.target.name]: "0",
//       }));
//       e.target.value = "0";
//     }
//   };

//   const handleAddLiquidity = async () => {
//     if (
//       isExceedingBalance(amounts.tokenAAmount, signerBalances.srcBalance) ||
//       isExceedingBalance(amounts.tokenBAmount, signerBalances.destBalance)
//     ) {
//       console.log("hola");
//       return;
//     } else onAddLiquidity(amounts.tokenAAmount, amounts.tokenBAmount);
//   };
//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onClose}
//       className="modal-content bg-[#18181b] p-6 rounded-3xl max-w-md mx-auto"
//       overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
//     >
//       <div className="text-white">
//         <h2 className="text-2xl mb-4">Liquidity</h2>

//         <div className="flex mb-4 justify-center">
//           <button
//             className={`mr-2 p-2 rounded-xl w-1/2 h-[3rem] ${
//               action === "add"
//                 ? "bg-[#44162e]"
//                 : "bg-[#212429] hover:bg-[#212429]"
//             }`}
//             onClick={() => setAction("add")}
//           >
//             Add
//           </button>
//           <button
//             className={`p-2 rounded-xl w-1/2 h-[3rem] ${
//               action === "remove"
//                 ? "bg-[#44162e]"
//                 : "bg-[#212429] hover:bg-[#212429]"
//             }`}
//             onClick={() => setAction("remove")}
//           >
//             Remove
//           </button>
//         </div>

//         {action === "add" && (
//           <div>
//             <div className="mb-4">
//               <label>{srcToken.name} amount:</label>
//               <input
//                 name="tokenAAmount"
//                 type="text"
//                 value={amounts.tokenAAmount}
//                 placeholder="0.0"
//                 className={`w-full p-2 mt-2 rounded-xl h-[3rem] text-3xl py-8 ${
//                   isExceedingBalance(
//                     amounts.tokenAAmount,
//                     signerBalances.srcBalance
//                   )
//                     ? "text-[#9c5454]"
//                     : "text-gray-300 bg-[#212429]"
//                 } focus:outline-none focus:ring-0`}
//                 onChange={handleChangeTokenAmount}
//                 onFocus={handleFocus}
//                 onBlur={handleBlur}
//               />
//               <label>{signerBalances.srcBalance}</label>
//             </div>
//             <div className="mb-4">
//               <label>{destToken.name} amount:</label>
//               <input
//                 name="tokenBAmount"
//                 type="text"
//                 value={amounts.tokenBAmount}
//                 placeholder="0.0"
//                 className={`w-full p-2 mt-2 rounded-xl h-[3rem] text-3xl py-8 ${
//                   isExceedingBalance(
//                     amounts.tokenBAmount,
//                     signerBalances.destBalance
//                   )
//                     ? "text-[#9c5454]"
//                     : "text-gray-300 bg-[#212429]"
//                 } focus:outline-none focus:ring-0`}
//                 onChange={handleChangeTokenAmount}
//                 onFocus={handleFocus}
//                 onBlur={handleBlur}
//               />
//               <label>{signerBalances.destBalance}</label>
//             </div>
//             <button
//               className="w-full p-2 bg-[#44162e] rounded-xl h-[3rem] hover:bg-[#351223] text-gray-300"
//               onClick={handleAddLiquidity}
//             >
//               Add
//             </button>
//           </div>
//         )}

//         {action === "remove" && (
//           <div>
//             <div className="mb-4">
//               <label>Liquidity Amount:</label>
//               <input
//                 type="text"
//                 value={liquidityAmount}
//                 className="w-full p-2 mt-2 bg-[#212429] rounded-xl h-[3rem] text-3xl py-8 text-gray-300"
//                 onChange={(e) => setLiquidityAmount(e.target.value)}
//               />
//               <label>{signerBalances.lpBalance}</label>
//             </div>
//             <div className="mb-4 rounded-xl">
//               <div className="flex justify-between flex-row">
//                 <label>%</label>
//                 <label>{removePercentage}%</label>
//               </div>

//               <input
//                 type="range"
//                 min="0"
//                 max="100"
//                 value={removePercentage}
//                 className="w-full mt-2 h-[3rem]"
//                 onChange={handleSlidePercentage}
//               />
//             </div>
//             <button
//               className="w-full p-2 bg-[#44162e] rounded-xl h-[3rem] hover:bg-[#351223] text-gray-300"
//               onClick={() =>
//                 onRemoveLiquidity(liquidityAmount, removePercentage)
//               }
//             >
//               Remove
//             </button>
//           </div>
//         )}
//       </div>
//     </Modal>
//   );
// };

// export default LiquidityModal;

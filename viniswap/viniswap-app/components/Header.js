import React, { useEffect, useState } from "react";
import NavItems from "./NavItems";
import toast, { Toaster } from "react-hot-toast";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import TokenBalance from "./TokenBalance";
import { mtb24Contract, wethContract } from "../utils/contract";
import { wethBalance } from "../utils/queries";

const Header = () => {
  const [tokenBalComp, setTokenBalComp] = useState();
  const account = useAccount();
  const { address } = useAccount();

  const notifyConectWallet = () => {
    toast.error("Connect your wallet", { duration: 2000 });
  };

  return (
    <div className="fixed left-0 top-0 w-full  py-4  items-center bg-[#2D242F]">
      <div className="flex items-center justify-center bg-[#2D242F] ">
        <div className="flex flex-col my-4">
          <div className="flex items-center justify-between ">
            <img src="./mtb.png" className="h-12" />

            <div className="hidden md:flex md:px-4">
              <NavItems />
            </div>
            <div className="flex rounded-3xl">
              <ConnectButton className="flex rounded-3xl" />
            </div>
          </div>

          <div className="flex items-center col-start-2 col-end-12 md:hidden my-4 ">
            <NavItems />
          </div>
        </div>
        <div className="flex items-center justify-center col-start-6 col-end-8">
          {tokenBalComp}
        </div>

        <Toaster />
      </div>
    </div>
  );
};

export default Header;

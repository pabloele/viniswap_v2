import React, { useEffect, useState } from 'react';
import NavItems from './NavItems';
import toast, { Toaster } from 'react-hot-toast';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import TokenBalance from './TokenBalance';
import { mtb24Contract, wethContract } from '../utils/contract';
import { wethBalance } from '../utils/queries';

const Header = () => {
  const [tokenBalComp, setTokenBalComp] = useState();
  const account = useAccount();
  const { address } = useAccount();

  const notifyConectWallet = () => {
    toast.error('Connect your wallet', { duration: 2000 });
  };

  return (
    <div className="fixed left-0 top-0 w-full px-8 py-4 flex items-center justify-between">
      <div className="flex items-center">
        <img src="./mtb.png" className="h-12" />
        <NavItems />
      </div>

      <div className="flex items-center">{tokenBalComp}</div>

      <div className="flex">
        <ConnectButton />
      </div>

      <Toaster />
    </div>
  );
};

export default Header;

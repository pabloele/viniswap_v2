import { mtbContracts } from '../utils/contract';
import { toEth } from '../utils/ether-utils';
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi';
const useBridge = (tokenAddress, account) => {
    const [balance, setBalance] = useState(0);
    const {address} = useAccount();
    useEffect(() => {
        const fetchBalance = async () => {
            const tokenContractObj = await mtbContracts(tokenAddress);
            const getBalance = await tokenContractObj.balanceOf(account)
            setBalance(toEth(getBalance).toString().split('.')[0]);
        }
        if (address) {
            fetchBalance()
        }
    }, [tokenAddress, address])
    return {
        balance
    };
};


export default useBridge;
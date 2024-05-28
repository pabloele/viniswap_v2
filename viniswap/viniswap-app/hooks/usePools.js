import { useState, useEffect } from "react";
import {
  routerContract,
  factoryContract,
  pairContract,
} from "../utils/contract";

import { toEth } from "../utils/ether-utils";
import { whitelistedPools } from "../utils/whitelistedPools";

export const usePools = () => {
  const whitelisted = whitelistedPools;
  console.log(whitelisted);
  const [pools, setPools] = useState([]);

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const factory = await factoryContract();

        const pairsCount = await factory.allPairsLength();

        const poolsArray = [];

        for (let i = 0; i < pairsCount; i++) {
          const pairAddress = await factory.allPairs(i);
          const pairObj = await pairContract({ pairAddress });
          const reserves = await pairObj.getReserves();
          const tokenAddress0 = await pairObj.token0();
          const tokenAddress1 = await pairObj.token1();
          const poolObj = {
            address: pairAddress,
            reserves0: toEth(reserves[0].toString()),
            reserves1: toEth(reserves[1].toString()),
            timeStamp: reserves[2].toString(),
            token0: tokenAddress0,
            token1: tokenAddress1,
          };
          console.log(poolObj);
          poolsArray.push({ ...poolObj });
        }

        setPools(poolsArray);
      } catch (error) {
        console.error("Failed to fetch pools:", error);
      }
    };

    fetchPools();
  }, []);

  // TODO restrict to whitelisted pools
  return { pools };
};

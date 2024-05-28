import { useState, useEffect } from "react";
import { routerContract, factoryContract } from "../utils/contract";
import { whitelistedPools } from "../utils/listedPools";

export const usePools = () => {
  const whitelisted = whitelistedPools;
  const [pools, setPools] = useState([]);

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const factory = await factoryContract();

        const pairsCount = await factory.allPairsLength();
        console.log(pairsCount.toString());
        const poolsArray = [];

        for (let i = 0; i < pairsCount; i++) {
          const pairAddress = await factory.allPairs(i);
          poolsArray.push(pairAddress);
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

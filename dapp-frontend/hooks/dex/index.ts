/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { AddressZero } from '@ethersproject/constants';
import { parseUnits } from '@ethersproject/units';
import { ChainId, Fetcher, Pair, TokenAmount, WETH } from 'quasar-sdk-core';
import { abi as erc20Abi } from 'quasar-v1-core/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json';
import { abi as pairAbi } from 'quasar-v1-core/artifacts/contracts/QuasarPair.sol/QuasarPair.json';
import { abi as factoryAbi } from 'quasar-v1-core/artifacts/contracts/QuasarFactory.sol/QuasarFactory.json';
import { Interface } from '@ethersproject/abi';
import { useEffect, useState } from 'react';
import { concat, divide, toString } from 'lodash';
import { gql } from 'graphql-request';
import { ListingModel } from '../../api/models/dex';
import { useWeb3Context } from '../../contexts/web3';
import rpcCall from '../../api/rpc';
import chains from '../../assets/chains.json';
import factories from '../../assets/factories.json';
import { useGQLContext } from '../../contexts/graphql';
import { useContract, useCurrentChain } from '../global';

const SINGLE_PAIR_QUERY = gql`
  query SinglePair($id: ID!) {
    pair(id: $id) {
      id
      token0 {
        id
        symbol
        name
      }
      token1 {
        id
        symbol
        name
      }
      reserve0
      reserve1
    }
  }
`;

const ALL_PAIRS_QUERY = gql`
  {
    pairs {
      id
      reserve0
      reserve1
      token0 {
        id
        name
        symbol
      }
      token1 {
        id
        name
        symbol
      }
    }
  }
`;

export const computePair = (token1: ListingModel, token2: ListingModel) => {
  const [pair, setPair] = useState<string>(AddressZero);
  const [error, setError] = useState<Error | undefined>(undefined);
  const currentChain = useCurrentChain();
  const { chainId } = useWeb3Context();

  useEffect(() => {
    if (token1 && token2 && token1.address && token2.address) {
      (async () => {
        try {
          const url = currentChain.rpcUrl;
          const tokenA =
            token1.address === AddressZero ? WETH[chainId as keyof typeof WETH] : await Fetcher.fetchTokenData(chainId, token1.address, url);
          const tokenB =
            token2.address === AddressZero ? WETH[chainId as keyof typeof WETH] : await Fetcher.fetchTokenData(chainId, token2.address, url);
          const address = Pair.getAddress(tokenA, tokenB);
          setPair(address);
          setError(undefined);
        } catch (error: any) {
          setError(error);
        }
      })();
    }
  }, [token1, token2, chainId]);

  return { pair, error };
};

export const getToken1Price = (tokenA: ListingModel, tokenB: ListingModel, chainId: ChainId) => {
  const [token1Price, setToken1Price] = useState<string>('0');

  useEffect(() => {
    if (tokenA && tokenB && tokenA.address && tokenB.address) {
      (async () => {
        try {
          const url = chains[chainId as unknown as keyof typeof chains].rpcUrl;
          const t0 = tokenA.address === AddressZero ? WETH[chainId] : await Fetcher.fetchTokenData(chainId, tokenA.address, url);
          const t1 = tokenB.address === AddressZero ? WETH[chainId] : await Fetcher.fetchTokenData(chainId, tokenB.address, url);
          const pair = await Fetcher.fetchPairData(t0, t1);
          setToken1Price(pair.priceOf(t1).toSignificant(4));
        } catch (error: any) {
          console.error(error);
        }
      })();
    }
  }, [tokenA, tokenB, chainId]);

  return token1Price;
};

export const useLiquidityValue = (pair: string, tokenAddress: string, liquidity: number) => {
  const [liquidityValue, setLiquidityValue] = useState<number>(0);
  const { chainId } = useWeb3Context();
  const currentChain = useCurrentChain();
  const pairContract = useContract(pair, pairAbi);
  const factoryContract = useContract(factories, factoryAbi);

  useEffect(() => {
    if (!!pair && !!tokenAddress) {
      (async () => {
        try {
          const url = currentChain.rpcUrl;
          const pairTotalSupply = await pairContract?.totalSupply();
          const kLast = await pairContract?.kLast();
          const feeTo = await factoryContract?.feeTo();
          const token0 = await pairContract?.token0();
          const token1 = await pairContract?.token1();

          const firstToken = await Fetcher.fetchTokenData(chainId, token0, url);
          const secondToken = await Fetcher.fetchTokenData(chainId, token1, url);
          const theToken = await Fetcher.fetchTokenData(chainId, tokenAddress, url);
          const pairObjFromFetcher = await Fetcher.fetchPairData(firstToken, secondToken, url);
          const totalSupplyAmount = new TokenAmount(pairObjFromFetcher.liquidityToken, pairTotalSupply);
          const liquidityAmount = new TokenAmount(pairObjFromFetcher.liquidityToken, parseUnits(toString(liquidity), 18).toHexString());

          setLiquidityValue(
            parseFloat(
              pairObjFromFetcher.getLiquidityValue(theToken, totalSupplyAmount, liquidityAmount, feeTo !== AddressZero, kLast).toSignificant(4)
            )
          );
        } catch (error: any) {
          console.log(error);
        }
      })();
    }
  }, [pair, chainId, tokenAddress, liquidity]);

  return liquidityValue;
};

export const quote = (address1: string, address2: string, amount1: number) => {
  const [amount2, setAmount2] = useState<number>(0);
  const { chainId } = useWeb3Context();
  const currentChain = useCurrentChain();

  useEffect(() => {
    if (address1 && address2) {
      (async () => {
        try {
          const url = currentChain.rpcUrl;
          const tokenA = address1 === AddressZero ? WETH[chainId as keyof typeof WETH] : await Fetcher.fetchTokenData(chainId, address1, url);
          const tokenB = address2 === AddressZero ? WETH[chainId as keyof typeof WETH] : await Fetcher.fetchTokenData(chainId, address2, url);
          const pair = await Fetcher.fetchPairData(tokenA, tokenB, url);
          const val = new TokenAmount(tokenA, parseUnits(toString(amount1), tokenA.decimals).toHexString())
            .multiply(pair.reserveOf(tokenB))
            .divide(pair.reserveOf(tokenA));
          setAmount2(parseFloat(val.toSignificant(7)));
        } catch (error: any) {
          console.log(error);
        }
      })();
    }
  }, [address1, address2, amount1, chainId, currentChain]);
  return amount2;
};

export const useSinglePair = (id: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const { dexGQLClient } = useGQLContext();

  useEffect(() => {
    if (id)
      (async () => {
        try {
          setIsLoading(true);
          const req = await dexGQLClient?.request(SINGLE_PAIR_QUERY, { id });
          setData(req.pair);
          setIsLoading(false);
        } catch (error: any) {
          console.error(error);
          setIsLoading(false);
        }
      })();
  }, [id, dexGQLClient]);
  return { isLoading, data };
};

export const getLiquidityPositionsOfConnectedAccount = () => {
  const { active, account } = useWeb3Context();
  const currentChain = useCurrentChain();
  const { dexGQLClient } = useGQLContext();
  const [isLoading, setIsLoading] = useState(false);
  const [positions, setPositions] = useState<any[]>([]);

  useEffect(() => {
    if (active && account && dexGQLClient) {
      (async () => {
        try {
          setIsLoading(true);
          const url = currentChain.rpcUrl;
          const { pairs } = await dexGQLClient.request(ALL_PAIRS_QUERY);
          let p: any[] = [];

          for (const pair of pairs) {
            const erc20Interface = new Interface(erc20Abi);
            const balanceOf = erc20Interface.encodeFunctionData('balanceOf(address)', [account]);
            const call = await rpcCall(url, { method: 'eth_call', params: [{ to: pair.id, data: balanceOf }, 'latest'] });
            const bal = divide(parseInt(call, 16), 10 ** 18);

            if (bal > 0) p = concat(p, { pair, balance: bal });
          }
          setIsLoading(false);
          setPositions(p);
        } catch (error: any) {
          setIsLoading(false);
          console.log(error);
        }
      })();
    } else setPositions([]);
  }, [active, account, dexGQLClient]);
  return { isLoading, positions };
};

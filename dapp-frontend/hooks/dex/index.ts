/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { hexStripZeros } from '@ethersproject/bytes';
import { AddressZero } from '@ethersproject/constants';
import { formatEther, parseUnits } from '@ethersproject/units';
import { ChainId, Fetcher, Pair, TokenAmount, WETH } from 'quasar-sdk-core';
import { abi as erc20Abi } from 'quasar-v1-core/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json';
import { abi as pairAbi } from 'quasar-v1-core/artifacts/contracts/QuasarPair.sol/QuasarPair.json';
import { abi as factoryAbi } from 'quasar-v1-core/artifacts/contracts/QuasarFactory.sol/QuasarFactory.json';
import { Interface } from '@ethersproject/abi';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import { gql } from 'graphql-request';
import { ListingModel } from '../../api/models/dex';
import { useWeb3Context } from '../../contexts/web3';
import rpcCall from '../../api/rpc';
import chains from '../../assets/chains.json';
import factories from '../../assets/factories.json';
import { useGQLContext } from '../../contexts/graphql';

export const computePair = (token1: ListingModel, token2: ListingModel, chainId: ChainId) => {
  const [pair, setPair] = useState<string>(AddressZero);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (token1 && token2 && token1.address && token2.address) {
      (async () => {
        try {
          const url = chains[chainId as unknown as keyof typeof chains].rpcUrl;
          const tokenA = token1.address === AddressZero ? WETH[chainId] : await Fetcher.fetchTokenData(chainId, token1.address, url);
          const tokenB = token2.address === AddressZero ? WETH[chainId] : await Fetcher.fetchTokenData(chainId, token2.address, url);
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

export const getOutputAmount = (inputToken: ListingModel, outputToken: ListingModel, amount: number, chainId: ChainId) => {
  const [outputAmount, setOutputAmount] = useState<number>(0);

  useEffect(() => {
    if (inputToken && inputToken.address && amount > 0) {
      (async () => {
        try {
          const url = chains[chainId as unknown as keyof typeof chains].rpcUrl;
          const t0 = inputToken.address === AddressZero ? WETH[chainId] : await Fetcher.fetchTokenData(chainId, inputToken.address, url);
          const t1 = outputToken.address === AddressZero ? WETH[chainId] : await Fetcher.fetchTokenData(chainId, outputToken.address, url);
          const exponentiated = _.multiply(amount, 10 ** t0.decimals);
          const inputTokenAmount = new TokenAmount(t0, `0x${exponentiated.toString(16)}`);
          const pair = await Fetcher.fetchPairData(t0, t1, url);
          setOutputAmount(parseFloat(pair.getOutputAmount(inputTokenAmount)[0].toSignificant(4)));
        } catch (error: any) {
          console.log(error);
        }
      })();
    }
  }, [inputToken, outputToken, amount, chainId]);
  return outputAmount;
};

export const getInputAmount = (inputToken: ListingModel, outputToken: ListingModel, amount: number, chainId: ChainId) => {
  const [inputAmount, setInputAmount] = useState<number>(0);

  useEffect(() => {
    if (inputToken && inputToken.address && amount > 0) {
      (async () => {
        try {
          const url = chains[chainId as unknown as keyof typeof chains].rpcUrl;
          const t0 = inputToken.address === AddressZero ? WETH[chainId] : await Fetcher.fetchTokenData(chainId, inputToken.address, url);
          const t1 = outputToken.address === AddressZero ? WETH[chainId] : await Fetcher.fetchTokenData(chainId, outputToken.address, url);
          const exponentiated = _.multiply(amount, 10 ** t1.decimals);
          const outputTokenAmount = new TokenAmount(t1, `0x${exponentiated.toString(16)}`);
          const pair = await Fetcher.fetchPairData(t0, t1, url);
          setInputAmount(parseFloat(pair.getInputAmount(outputTokenAmount)[0].toSignificant(4)));
        } catch (error: any) {
          console.log(error);
        }
      })();
    }
  }, [inputToken, outputToken, amount, chainId]);
  return inputAmount;
};

export const fetchTokenBalanceForConnectedWallet = (token: string, deps: Array<any> = []) => {
  const [balance, setBalance] = useState<string>('0');
  const { active, account, chainId } = useWeb3Context();
  useEffect(() => {
    if (active && !!account && !!chainId && token && token) {
      (async () => {
        try {
          const url = chains[chainId as unknown as keyof typeof chains].rpcUrl;
          if (token !== AddressZero) {
            const t = await Fetcher.fetchTokenData(chainId, token, url);
            const erc20Interface = new Interface(erc20Abi);
            const balanceOf = erc20Interface.encodeFunctionData('balanceOf(address)', [account]);
            const call = await rpcCall(url, { method: 'eth_call', params: [{ to: t.address, data: balanceOf }, 'latest'] });
            const bal = _.divide(parseInt(call, 16), 10 ** t.decimals);
            setBalance(bal.toPrecision(4));
          } else {
            const call = await rpcCall(url, { method: 'eth_getBalance', params: [account, 'latest'] });
            setBalance(parseFloat(formatEther(call)).toPrecision(4));
          }
        } catch (error: any) {
          console.log(error);
        }
      })();
    } else {
      setBalance('0');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, account, chainId, token, ...deps]);
  return balance;
};

export const obtainLPDetailsFromPair = (pair: string, chainId: number, account: string) => {
  const [lpDetails, setLpDetails] = useState({
    id: '',
    token0: '',
    token1: '',
    token0Symbol: '',
    token1Symbol: '',
    accountBalance: 0,
    token0Decimals: 18,
    token1Decimals: 18
  });

  useEffect(() => {
    if (!!pair && !!account) {
      (async () => {
        try {
          const url = chains[chainId as unknown as keyof typeof chains].rpcUrl;
          const pairAbiInterface = new Interface(pairAbi);
          const erc20AbiInterface = new Interface(erc20Abi);
          const token0Hash = pairAbiInterface.getSighash('token0()');
          const token1Hash = pairAbiInterface.getSighash('token1()');
          const symbolHash = erc20AbiInterface.getSighash('symbol()');
          const balanceOf = erc20AbiInterface.encodeFunctionData('balanceOf(address)', [account]);

          const token0Call = await rpcCall(url, { method: 'eth_call', params: [{ to: pair, data: token0Hash }, 'latest'] });
          const token1Call = await rpcCall(url, { method: 'eth_call', params: [{ to: pair, data: token1Hash }, 'latest'] });
          const balanceOfCall = await rpcCall(url, { method: 'eth_call', params: [{ to: pair, data: balanceOf }, 'latest'] });

          let token0SymbolCall = await rpcCall(url, { method: 'eth_call', params: [{ to: hexStripZeros(token0Call), data: symbolHash }, 'latest'] });
          let token1SymbolCall = await rpcCall(url, { method: 'eth_call', params: [{ to: hexStripZeros(token1Call), data: symbolHash }, 'latest'] });
          [token0SymbolCall] = erc20AbiInterface.decodeFunctionResult('symbol()', token0SymbolCall);
          [token1SymbolCall] = erc20AbiInterface.decodeFunctionResult('symbol()', token1SymbolCall);

          const tk1 = await Fetcher.fetchTokenData(chainId, hexStripZeros(token0Call), url);
          const tk2 = await Fetcher.fetchTokenData(chainId, hexStripZeros(token1Call), url);

          setLpDetails({
            id: pair,
            token0: hexStripZeros(token0Call),
            token1: hexStripZeros(token1Call),
            token0Symbol: token0SymbolCall,
            token1Symbol: token1SymbolCall,
            accountBalance: parseFloat(formatEther(balanceOfCall)),
            token0Decimals: tk1.decimals,
            token1Decimals: tk2.decimals
          });
        } catch (error: any) {
          console.log(error);
        }
      })();
    }
  }, [pair, chainId, account]);
  return lpDetails;
};

// export const fetchPairVolumeInUSDWithGivenPeriod = (pair: string, chainId: number, period: number = 60 * 60 * 24 * 1000) => {
//   const [usdVolume, setUSDVolume] = useState<number>(0);

//   useEffect(() => {
//     (async () => {
//       try {
//         const url = chains[chainId as unknown as keyof typeof chains].rpcUrl;
//         const pairAbiInterface = new Interface(pairAbi);
//         const factoryAbiInterface = new Interface(factoryAbi);
//         const swapsWithinPeriod = await fetchSwapEventsForPairPerPeriod(pair, chainId, period);
//         const whitelistedPeggedTokens = whitelist[chainId as unknown as keyof typeof whitelist];
//         const factory = factories[chainId as unknown as keyof typeof factories];

//         const token0Hash = pairAbiInterface.getSighash('token0()');
//         const token1Hash = pairAbiInterface.getSighash('token1()');
//         let token0Call = await rpcCall(url, { method: 'eth_call', params: [{ to: pair, data: token0Hash }, 'latest'] });
//         let token1Call = await rpcCall(url, { method: 'eth_call', params: [{ to: pair, data: token1Hash }, 'latest'] });
//         token0Call = hexStripZeros(token0Call);
//         token1Call = hexStripZeros(token1Call);

//         let priceOfToken0InUSD = 0;
//         let priceOfToken1InUSD = 0;

//         if (_.map(whitelistedPeggedTokens, (token) => token.toLowerCase()).includes(token0Call.toLowerCase())) {
//           priceOfToken0InUSD = 1;
//         } else {
//           for (const token of whitelistedPeggedTokens) {
//             const getPairHash = factoryAbiInterface.encodeFunctionData('getPair(address,address)', [token, token0Call]);
//             const pairCall = await rpcCall(url, { method: 'eth_call', params: [{ to: factory, data: getPairHash }, 'latest'] });

//             if (pairCall !== AddressZero) {
//               const token0 = await Fetcher.fetchTokenData(chainId, token, url);
//               const token1 = await Fetcher.fetchTokenData(chainId, token0Call, url);
//               const pairObj = await Fetcher.fetchPairData(token0, token1, url);
//               priceOfToken0InUSD = parseFloat(pairObj.priceOf(token1).toSignificant(4));
//             }
//           }
//         }

//         if (_.map(whitelistedPeggedTokens, (token) => token.toLowerCase()).includes(token1Call.toLowerCase())) {
//           priceOfToken1InUSD = 1;
//         } else {
//           for (const token of whitelistedPeggedTokens) {
//             const getPairHash = factoryAbiInterface.encodeFunctionData('getPair(address,address)', [token, token1Call]);
//             const pairCall = await rpcCall(url, { method: 'eth_call', params: [{ to: factory, data: getPairHash }, 'latest'] });

//             if (pairCall !== AddressZero) {
//               const token0 = await Fetcher.fetchTokenData(chainId, token, url);
//               const token1 = await Fetcher.fetchTokenData(chainId, token1Call, url);
//               const pairObj = await Fetcher.fetchPairData(token0, token1, url);
//               priceOfToken1InUSD = parseFloat(pairObj.priceOf(token1).toSignificant(4));
//             }
//           }
//         }
//         const token0Data = await Fetcher.fetchTokenData(chainId, token0Call, url);
//         const token1Data = await Fetcher.fetchTokenData(chainId, token1Call, url);
//         const volumeInUSD = _.map(
//           swapsWithinPeriod,
//           (swap) =>
//             (_.divide(parseInt(swap.amount0In), Math.pow(10, token0Data.decimals)) +
//               _.divide(parseInt(swap.amount0Out), Math.pow(10, token0Data.decimals))) *
//               priceOfToken0InUSD +
//             (_.divide(parseInt(swap.amount1In), Math.pow(10, token1Data.decimals)) +
//               _.divide(parseInt(swap.amount1Out), Math.pow(10, token1Data.decimals))) *
//               priceOfToken1InUSD
//         ).reduce((prev, curr) => _.add(prev, curr), 0);

//         setUSDVolume(volumeInUSD);
//       } catch (error: any) {
//         console.log(error);
//       }
//     })();
//   }, [pair, chainId, period]);
//   return usdVolume;
// };

export const fetchLiquidityValue = (pair: string, chainId: number, tokenAddress: string, liquidity: number) => {
  const [liquidityValue, setLiquidityValue] = useState<number>(0);

  useEffect(() => {
    if (!!pair && !!tokenAddress) {
      (async () => {
        try {
          const url = chains[chainId as unknown as keyof typeof chains].rpcUrl;
          const token = await Fetcher.fetchTokenData(chainId, tokenAddress, url);
          // const pairAsToken = await Fetcher.fetchTokenData(chainId, pair, url);
          const factory = factories[chainId as unknown as keyof typeof factories];
          const erc20AbiInterface = new Interface(erc20Abi);
          const pairAbiInterface = new Interface(pairAbi);
          const factoryAbiInterface = new Interface(factoryAbi);
          const totalSupplyHash = erc20AbiInterface.getSighash('totalSupply()');
          const kLastHash = pairAbiInterface.getSighash('kLast()');
          const feeToHash = factoryAbiInterface.getSighash('feeTo()');
          const token0Hash = pairAbiInterface.getSighash('token0()');
          const token1Hash = pairAbiInterface.getSighash('token1()');
          const totalSupplyCall = await rpcCall(url, { method: 'eth_call', params: [{ to: pair, data: totalSupplyHash }, 'latest'] });
          const kLastCall = await rpcCall(url, { method: 'eth_call', params: [{ to: pair, data: kLastHash }, 'latest'] });
          const feeToCall = await rpcCall(url, { method: 'eth_call', params: [{ to: factory, data: feeToHash }, 'latest'] });
          const token0Call = await rpcCall(url, { method: 'eth_call', params: [{ to: pair, data: token0Hash }, 'latest'] });
          const token1Call = await rpcCall(url, { method: 'eth_call', params: [{ to: pair, data: token1Hash }, 'latest'] });

          const token0 = await Fetcher.fetchTokenData(chainId, hexStripZeros(token0Call), url);
          const token1 = await Fetcher.fetchTokenData(chainId, hexStripZeros(token1Call), url);
          const pairAsToken = await Fetcher.fetchPairData(token0, token1, url);
          const totalSupplyAmount = new TokenAmount(pairAsToken.liquidityToken, totalSupplyCall);
          const liquidityAmount = new TokenAmount(pairAsToken.liquidityToken, parseUnits(liquidity.toFixed(4), 18).toHexString());

          setLiquidityValue(
            parseFloat(
              pairAsToken.getLiquidityValue(token, totalSupplyAmount, liquidityAmount, feeToCall !== AddressZero, kLastCall).toSignificant(4)
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

export const quote = (address1: string, address2: string, amount1: number, chainId: number) => {
  const [amount2, setAmount2] = useState<number>(0);

  useEffect(() => {
    if (address1 && address2 && amount1 && chainId) {
      (async () => {
        try {
          const url = chains[chainId as unknown as keyof typeof chains].rpcUrl;
          const tokenA = address1 === AddressZero ? WETH[chainId as keyof typeof WETH] : await Fetcher.fetchTokenData(chainId, address1, url);
          const tokenB = address2 === AddressZero ? WETH[chainId as keyof typeof WETH] : await Fetcher.fetchTokenData(chainId, address2, url);
          const pair = await Fetcher.fetchPairData(tokenA, tokenB, url);
          const val = new TokenAmount(tokenA, parseUnits(amount1.toPrecision(4), tokenA.decimals).toHexString())
            .multiply(pair.reserveOf(tokenB))
            .divide(pair.reserveOf(tokenA));
          setAmount2(parseFloat(val.toSignificant(7)));
        } catch (error: any) {
          console.log(error);
        }
      })();
    }
  }, [address1, address2, amount1, chainId]);
  return amount2;
};

export const getLiquidityPositionsOfConnectedAccount = () => {
  const { active, account, chainId } = useWeb3Context();
  const { dexGQLClient } = useGQLContext();
  const [isLoading, setIsLoading] = useState(false);
  const [positions, setPositions] = useState<any[]>([]);

  useEffect(() => {
    if (active && account && chainId && dexGQLClient) {
      (async () => {
        try {
          setIsLoading(true);
          const url = chains[chainId as unknown as keyof typeof chains].rpcUrl;
          const { pairs } = await dexGQLClient.request(
            gql`
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
            `
          );
          let p: any[] = [];

          for (const pair of pairs) {
            const erc20Interface = new Interface(erc20Abi);
            const balanceOf = erc20Interface.encodeFunctionData('balanceOf(address)', [account]);
            const call = await rpcCall(url, { method: 'eth_call', params: [{ to: pair.id, data: balanceOf }, 'latest'] });
            const bal = _.divide(parseInt(call, 16), 10 ** 18);

            if (bal > 0) p = _.concat(p, { pair, balance: bal });
          }
          setIsLoading(false);
          setPositions(p);
        } catch (error: any) {
          setIsLoading(false);
          console.log(error);
        }
      })();
    } else setPositions([]);
  }, [active, account, chainId, dexGQLClient]);
  return { isLoading, positions };
};

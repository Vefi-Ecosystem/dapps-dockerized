/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react';
import { useContract } from '../global';
import { abi as erc20Abi } from 'quasar-v1-core/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json';
import { BigNumber } from '@ethersproject/bignumber';
import { useWeb3Context } from '../../contexts/web3';
import chains from '../../assets/chains.json';
import { JsonRpcProvider } from '@ethersproject/providers';

export const useTokenBalance = (address: string, deps: any[] = []) => {
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const { account } = useWeb3Context();

  const contract = useContract(address, erc20Abi, false);

  useEffect(() => {
    if (account)
      (async () => {
        try {
          setIsLoading(true);
          const decimals: number = (await contract?.decimals()) || 0;
          const balanceBigNumber: BigNumber = (await contract?.balanceOf(account)) || BigNumber.from(0);
          const bal = balanceBigNumber.gt(0) ? balanceBigNumber.div('0x'.concat(Math.pow(10, decimals).toString(16))).toNumber() : 0;
          setBalance(bal);
          setIsLoading(false);
        } catch (error: any) {
          setIsLoading(false);
          console.error('An error occurred while fetching token balance ', error);
        }
      })();
    else setBalance(0);
  }, [account, contract, ...deps]);

  return {
    isLoading,
    balance
  };
};

export const useEtherBalance = (deps: any[] = []) => {
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const { account, chainId } = useWeb3Context();

  const url = useMemo(() => chains[chainId as unknown as keyof typeof chains].rpcUrl, [chainId]);

  useEffect(() => {
    if (account)
      (async () => {
        try {
          setIsLoading(true);
          const bal = (await new JsonRpcProvider(url, chainId).getBalance(account as string)).div(`0x${(10 ** 18).toString(16)}`).toNumber();
          setBalance(bal);
          setIsLoading(false);
        } catch (error: any) {
          setIsLoading(false);
          console.error('An error occurred while fetching ether balance ', error);
        }
      })();
    else setBalance(0);
  }, [account, chainId, url, ...deps]);

  return { isLoading, balance };
};

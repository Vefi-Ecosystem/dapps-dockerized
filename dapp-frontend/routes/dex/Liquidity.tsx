/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import assert from 'assert';
import _ from 'lodash';
import { FiSettings, FiPlus, FiChevronDown } from 'react-icons/fi';
import { IoMdRefreshCircle, IoIosUndo } from 'react-icons/io';
import { ToastContainer, toast } from 'react-toastify';
import { Fetcher, Pair, WETH } from 'quasar-sdk-core';
import { Contract } from '@ethersproject/contracts';
import { AddressZero } from '@ethersproject/constants';
import { Web3Provider } from '@ethersproject/providers';
import { parseUnits } from '@ethersproject/units';
import { abi as erc20Abi } from 'quasar-v1-core/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json';
import { abi as routerAbi } from 'quasar-v1-periphery/artifacts/contracts/QuasarRouter.sol/QuasarRouter.json';
import useSound from 'use-sound';
import { useAPIContext } from '../../contexts/api';
import UserLPItem from '../../components/Dex/PoolsListItem';
import { useWeb3Context } from '../../contexts/web3';
import { ListingModel } from '../../api/models/dex';
import { computePair, fetchTokenBalanceForConnectedWallet, quote } from '../../hooks/dex';
import SwapSettingsModal from '../../components/Dex/SwapSettingsModal';
import TokensListModal from '../../components/Dex/TokensListModal';
import { useDEXSettingsContext } from '../../contexts/dex/settings';
import routers from '../../assets/routers.json';
import { addToMetamask } from '../../utils';
import successFx from '../../assets/sounds/success_sound.mp3';
import errorFx from '../../assets/sounds/error_sound.mp3';
import TradeCard from '../../components/Dex/Card';

enum Route {
  ADD_LIQUIDITY = 'add_liquidity',
  LIQUIDITY_POOLS = 'lps',
  FIND_OTHER_LP_TOKENS = 'find_other_lps'
}

const LPRoute = () => {
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState<boolean>(false);
  const { liquidityPoolsForUser, importedPools } = useAPIContext();
  const { chainId } = useWeb3Context();
  const { push } = useRouter();
  return (
    <div className="flex flex-col lg:flex-row justify-center items-center w-full">
      <div className="w-full lg:w-1/3">
        <TradeCard>
          <div className="flex flex-col justify-evenly items-center w-full">
            <div className="flex justify-between w-full py-6 px-3">
              <div className="flex flex-col justify-start items-start w-8/8">
                <span className="font-Syne text-[1.8em] text-white font-[700]">Your Liquidity</span>
                <p className="font-[400] font-Poppins text-[0.9em] text-[#9d9d9d]">Remove liquidity to get tokens back</p>
              </div>
              <div className="flex justify-evenly w-1/4">
                <button onClick={() => setIsSettingsModalVisible(true)} className="bg-transparent text-[#a6b2ec] text-[1.8em]">
                  <FiSettings />
                </button>
              </div>
            </div>
            <div className="px-2 py-3 flex flex-col justify-center items-center gap-3 w-full overflow-auto">
              <div className="bg-[#0c0b16] rounded-[12px] flex justify-center items-center py-[9px] px-[26px] w-full overflow-auto">
                <div className="flex justify-center items-center w-full flex-col gap-1 px-1 py-1 overflow-auto">
                  {liquidityPoolsForUser.items.length === 0 && importedPools[(chainId as number) || 97]?.length === 0 ? (
                    <span className="text-white">No liquidity found</span>
                  ) : (
                    <ul className="menu w-full bg-[#000]/70 p-2 rounded-box">
                      {_.map(liquidityPoolsForUser.items.concat(importedPools[(chainId as number) || 97]), (lp, index) => (
                        <UserLPItem pair={lp} key={index} />
                      ))}
                    </ul>
                  )}
                  <span className="text-white">Don&apos;t see a pool you&apos;ve joined?</span>
                  <div className="mt-[36px] w-full">
                    <button
                      onClick={() => push(`/dex?tab=liquidity&child_tab=${Route.FIND_OTHER_LP_TOKENS}`)}
                      className="border-[#1673b9] border-[2px] rounded-[19px] w-full py-[13px] px-[17px] text-[#1673b9] text-[18px] font-[600] flex justify-center"
                    >
                      <span className="font-MontserratAlt">Find other LP tokens</span>
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => push(`/dex?tab=liquidity&child_tab=${Route.ADD_LIQUIDITY}`)}
                className="flex justify-center items-center bg-[#1673b9]/50 py-[14px] px-[62px] rounded-[19px] text-[18px] text-white w-full"
              >
                <FiPlus /> <span className="ml-[16px] font-MontserratAlt">Add Liquidity</span>
              </button>
            </div>
          </div>
          <SwapSettingsModal isOpen={isSettingsModalVisible} onClose={() => setIsSettingsModalVisible(false)} />
        </TradeCard>
      </div>
    </div>
  );
};

const AddLiquidityRoute = () => {
  const { reload, back } = useRouter();
  const [val1, setVal1] = useState<number>(0.0);
  const [val2, setVal2] = useState<number>(0.0);
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState<boolean>(false);
  const [isFirstTokensListModalVisible, setIsFirstTokensListModalVisible] = useState<boolean>(false);
  const [isSecondTokensListModalVisible, setIsSecondTokensListModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { tokensListing } = useAPIContext();
  const { chainId, active, library, account } = useWeb3Context();
  const { txDeadlineInMins, gasPrice, playSounds } = useDEXSettingsContext();
  const [firstSelectedToken, setFirstSelectedToken] = useState<ListingModel>({} as ListingModel);
  const [secondSelectedToken, setSecondSelectedToken] = useState<ListingModel>({} as ListingModel);

  const balance1 = fetchTokenBalanceForConnectedWallet(firstSelectedToken.address, [isLoading]);
  const balance2 = fetchTokenBalanceForConnectedWallet(secondSelectedToken.address, [isLoading]);

  const outputAmount1 = quote(firstSelectedToken.address, secondSelectedToken.address, val1, chainId || 97);

  const [playSuccess] = useSound(successFx);
  const [playError] = useSound(errorFx);

  const addLiquidity = useCallback(async () => {
    try {
      setIsLoading(true);
      const firstIsZero = firstSelectedToken.address === AddressZero;
      const secondIsZero = secondSelectedToken.address === AddressZero;
      const t0 = firstIsZero ? WETH[(chainId as keyof typeof WETH) || 97] : await Fetcher.fetchTokenData(chainId || 97, firstSelectedToken.address);
      const t1 = secondIsZero ? WETH[(chainId as keyof typeof WETH) || 97] : await Fetcher.fetchTokenData(chainId || 97, secondSelectedToken.address);
      const router = routers[chainId as unknown as keyof typeof routers];

      assert.notDeepEqual(t0, t1, 'Identical tokens');

      const value0 = parseUnits(val1.toString(), t0.decimals).toHexString();
      const value1 = parseUnits(val2.toString(), t1.decimals).toHexString();

      const provider = new Web3Provider(library?.givenProvider);
      const token0Contract = new Contract(t0.address, erc20Abi, provider.getSigner());
      const token1Contract = new Contract(t1.address, erc20Abi, provider.getSigner());
      const routerContract = new Contract(router, routerAbi, provider.getSigner());

      if (!firstIsZero) {
        const approvalTx = await token0Contract.approve(router, value0);
        await approvalTx.wait();
        toast(`Router approved to spend ${val1} ${t0.symbol}`, { type: 'info' });
      }

      if (!secondIsZero) {
        const approvalTx = await token1Contract.approve(router, value1);
        await approvalTx.wait();
        toast(`Router approved to spend ${val2} ${t1.symbol}`, { type: 'info' });
      }

      let liquidityTx: any;

      if (firstIsZero || secondIsZero) {
        const paths = firstIsZero ? [t0, t1] : [t1, t0];
        const values = firstIsZero ? [value0, value1] : [value1, value0];
        // Estimate gas first
        const gas = await routerContract.estimateGas.addLiquidityETH(
          paths[1].address,
          values[1],
          values[1],
          values[0],
          account,
          `0x${Math.floor(Date.now() / 1000) + _.multiply(txDeadlineInMins, 60)}`,
          { value: values[0], gasPrice: parseUnits(gasPrice.toString(), 'gwei').toHexString() }
        );
        liquidityTx = await routerContract.addLiquidityETH(
          paths[1].address,
          values[1],
          values[1],
          values[0],
          account,
          `0x${Math.floor(Date.now() / 1000) + _.multiply(txDeadlineInMins, 60)}`,
          { value: values[0], gasLimit: gas.toHexString(), gasPrice: parseUnits(gasPrice.toString(), 'gwei').toHexString() }
        );
      } else {
        const gas = await routerContract.estimateGas.addLiquidity(
          firstSelectedToken.address,
          secondSelectedToken.address,
          value0,
          value1,
          value0,
          value1,
          account,
          `0x${Math.floor(Date.now() / 1000) + _.multiply(txDeadlineInMins, 60)}`,
          { gasPrice: parseUnits(gasPrice.toString(), 'gwei').toHexString() }
        );
        liquidityTx = await routerContract.addLiquidity(
          firstSelectedToken.address,
          secondSelectedToken.address,
          value0,
          value1,
          value0,
          value1,
          account,
          `0x${Math.floor(Date.now() / 1000) + _.multiply(txDeadlineInMins, 60)}`,
          { gasPrice: parseUnits(gasPrice.toString(), 'gwei').toHexString(), gasLimit: gas.toHexString() }
        );
      }

      await liquidityTx.wait();
      setIsLoading(false);

      const pair = Pair.getAddress(t0, t1);

      if (playSounds) playSuccess();

      toast(
        <div className="flex justify-between items-center w-full gap-2">
          <span className="text-white font-poppins text-[16px]">Liquidity added successfully!</span>
          <button
            onClick={() => {
              addToMetamask(pair, 'Quasar-LP', 18);
            }}
            className="btn btn-primary"
          >
            Add LP Token
          </button>
        </div>,
        { type: 'success' }
      );
    } catch (error: any) {
      setIsLoading(false);
      if (playSounds) playError();
      toast(error.message, { type: 'error' });
    }
  }, [
    account,
    chainId,
    firstSelectedToken.address,
    gasPrice,
    library?.givenProvider,
    playError,
    playSounds,
    playSuccess,
    secondSelectedToken.address,
    txDeadlineInMins,
    val1,
    val2
  ]);

  useEffect(() => {
    if (tokensListing.length >= 2) {
      setFirstSelectedToken(tokensListing[0]);
      setSecondSelectedToken(tokensListing[1]);
    }
  }, [tokensListing]);

  useEffect(() => {
    if (outputAmount1 > 0) setVal2(outputAmount1);
  }, [outputAmount1]);

  // useEffect(() => {
  //   if (outputAmount2 > 0) setVal1(outputAmount2);
  // }, [outputAmount2]);

  return (
    <div className="bg-[#000]/[.75] rounded-[15px] shadow-lg flex justify-center items-center w-full md:w-1/3 md:max-h-[600px] font-Montserrat">
      <div className="flex flex-col justify-evenly items-center w-full gap-2">
        <div className="flex justify-between w-full bg-[#161525] rounded-t-[15px] py-6 px-3">
          <button onClick={() => back()} className="bg-transparent text-white text-[30px]">
            <IoIosUndo />
          </button>

          <div className="flex justify-center items-center gap-2">
            <button onClick={() => setIsSettingsModalVisible(true)} className="bg-transparent text-white text-[30px]">
              <FiSettings />
            </button>
            <button onClick={reload} className="bg-transparent text-white text-[30px]">
              <IoMdRefreshCircle />
            </button>
          </div>
        </div>
        <div className="flex flex-col justify-center w-full gap-2 px-[9px]">
          <div className="bg-[#0c0b16] rounded-[12px] flex flex-col w-full px-[23px] py-[9px] justify-evenly gap-2">
            <div className="flex justify-between w-full">
              <span className="text-white">From</span>
              <span className="text-white"> Balance: {balance1}</span>
            </div>
            <div className="flex justify-between w-full gap-1">
              <div className="flex justify-between items-center gap-1">
                <div
                  className="flex justify-start items-center border-r border-white p-4 cursor-pointer gap-1 w-[150px]"
                  onClick={() => setIsFirstTokensListModalVisible(true)}
                >
                  <img src={firstSelectedToken.logoURI} alt={firstSelectedToken.name} className="rounded-[50px] w-[30px] h-[30px]" />
                  <span className="text-white uppercase font-[700] text-[16px]">{firstSelectedToken.symbol}</span>
                  <FiChevronDown className="text-white" />
                </div>
                <div className="flex justify-center items-center gap-1 flex-1">
                  <button
                    onClick={() => setVal1(parseFloat(balance1))}
                    className="p-[2px] bg-[#2775ca] opacity-[.19] text-[#c6c3c3] text-[10px] font-[600]"
                  >
                    Max
                  </button>
                  <button
                    onClick={() => setVal1(_.multiply(0.5, parseFloat(balance1)))}
                    className="p-[2px] bg-[#2775ca] opacity-[.19] text-[#c6c3c3] text-[10px] font-[600]"
                  >
                    Half
                  </button>
                </div>
              </div>
              <div className="flex justify-end w-[200px]">
                <input
                  type="number"
                  className="p-[12px] bg-transparent text-white border-0 w-full outline-0 appearance-none font-[600] text-[18px]"
                  value={val1}
                  onChange={(e) => setVal1(e.target.valueAsNumber || 0.0)}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <button className="bg-transparent text-[#ffffff] text-[30px]">
              <FiPlus />
            </button>
          </div>
          <div className="bg-[#0c0b16] rounded-[12px] flex flex-col w-full px-[23px] py-[9px] justify-evenly gap-2">
            <div className="flex justify-between w-full">
              <span className="text-white">To</span>
              <span className="text-white"> Balance: {balance2}</span>
            </div>
            <div className="flex justify-between w-full gap-1">
              <div className="flex justify-center items-center gap-1">
                <div
                  onClick={() => setIsSecondTokensListModalVisible(true)}
                  className="flex justify-start items-center border-r border-white p-4 cursor-pointer gap-1 w-[150px]"
                >
                  <img src={secondSelectedToken.logoURI} alt={secondSelectedToken.name} className="rounded-[50px] w-[30px] h-[30px]" />
                  <span className="text-white uppercase font-[700] text-[16px]">{secondSelectedToken.symbol}</span>
                  <FiChevronDown className="text-white" />
                </div>
                <div className="flex justify-center items-center flex-1 gap-1">
                  <button
                    onClick={() => setVal2(parseFloat(balance2))}
                    className="p-[2px] bg-[#2775ca] opacity-[.19] text-[#c6c3c3] text-[10px] font-[600]"
                  >
                    Max
                  </button>
                  <button
                    onClick={() => setVal2(_.multiply(0.5, parseFloat(balance2)))}
                    className="p-[2px] bg-[#2775ca] opacity-[.19] text-[#c6c3c3] text-[10px] font-[600]"
                  >
                    Half
                  </button>
                </div>
              </div>
              <div className="flex justify-end w-[200px]">
                <input
                  type="number"
                  className="p-[12px] bg-transparent text-white border-0 w-full outline-0 appearance-none font-[600] text-[18px]"
                  value={val2}
                  onChange={(e) => setVal2(e.target.valueAsNumber || 0.0)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center w-full px-2 py-2">
          <button
            onClick={addLiquidity}
            disabled={isLoading || !active}
            className={`flex justify-center font-Montserrat items-center bg-[#1673b9]/50 btn py-[14px] px-[10px] rounded-[19px] text-[18px] text-white w-full ${
              isLoading ? 'loading' : ''
            }`}
          >
            <span className="font-MontserratAlt">{!active ? 'Wallet not connected' : 'Add Liquidity'}</span>
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" theme="dark" autoClose={5000} />
      <SwapSettingsModal isOpen={isSettingsModalVisible} onClose={() => setIsSettingsModalVisible(false)} />
      <TokensListModal
        isVisible={isFirstTokensListModalVisible}
        onClose={() => setIsFirstTokensListModalVisible(false)}
        onTokenSelected={(token) => setFirstSelectedToken(token)}
        selectedTokens={[firstSelectedToken, secondSelectedToken]}
      />
      <TokensListModal
        isVisible={isSecondTokensListModalVisible}
        onClose={() => setIsSecondTokensListModalVisible(false)}
        onTokenSelected={(token) => setSecondSelectedToken(token)}
        selectedTokens={[firstSelectedToken, secondSelectedToken]}
      />
    </div>
  );
};

const FindOtherLPRoute = () => {
  const [firstSelectedToken, setFirstSelectedToken] = useState<ListingModel>({} as ListingModel);
  const [secondSelectedToken, setSecondSelectedToken] = useState<ListingModel>({} as ListingModel);
  const [isImportLoading, setIsImportLoading] = useState<boolean>(false);
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState<boolean>(false);
  const [isFirstTokensListModalVisible, setIsFirstTokensListModalVisible] = useState<boolean>(false);
  const [isSecondTokensListModalVisible, setIsSecondTokensListModalVisible] = useState<boolean>(false);
  const { back } = useRouter();

  const { tokensListing, importPool, importedPools } = useAPIContext();
  const { chainId } = useWeb3Context();
  const { pair, error: pairError } = computePair(firstSelectedToken, secondSelectedToken, chainId || 97);

  const addToPools = useCallback(() => {
    setIsImportLoading(true);
    importPool(pair);
    setIsImportLoading(false);
  }, [pair]);

  useEffect(() => {
    if (tokensListing.length >= 2) {
      setFirstSelectedToken(tokensListing[0]);
      setSecondSelectedToken(tokensListing[1]);
    }
  }, [tokensListing]);
  return (
    <div className="bg-[#000]/[.75] rounded-[15px] shadow-lg flex justify-center items-center w-full md:w-1/3 md:max-h-[600px] font-Montserrat">
      <div className="flex flex-col justify-evenly items-center w-full gap-5">
        <div className="flex justify-between items-center w-full bg-[#161525] rounded-t-[15px] py-6 px-3">
          <div>
            <button onClick={() => back()} className="bg-transparent text-white text-[30px]">
              <IoIosUndo />
            </button>
          </div>
          <div className="flex justify-start items-start flex-col gap-3">
            <span className="text-white text-[20px] font-Montserrat font-semibold">Import Liquidity Pool</span>
            <span className="text-white text-[14px] font-Montserrat">Import an existing pool</span>
          </div>
          <button onClick={() => setIsSettingsModalVisible(true)} className="bg-transparent text-white text-[30px]">
            <FiSettings />
          </button>
        </div>
        <div className="flex flex-col justify-center items-center gap-7 w-full px-4 font-Montserrat text-white">
          <button onClick={() => setIsFirstTokensListModalVisible(true)} className="btn w-full rounded-[25px] flex justify-between items-center">
            <div className="flex justify-between items-center gap-2">
              <div className="avatar">
                <div className="w-6 rounded-full">
                  <img src={firstSelectedToken.logoURI} alt={firstSelectedToken.symbol} />
                </div>
              </div>
              <span>{firstSelectedToken.symbol}</span>
            </div>
            <FiChevronDown />
          </button>
          <button className="bg-transparent text-[30px]">
            <FiPlus />
          </button>
          <button onClick={() => setIsSecondTokensListModalVisible(true)} className="btn w-full rounded-[25px] flex justify-between items-center">
            <div className="flex justify-between items-center gap-2">
              <div className="avatar">
                <div className="w-6 rounded-full">
                  <img src={secondSelectedToken.logoURI} alt={secondSelectedToken.symbol} />
                </div>
              </div>
              <span>{secondSelectedToken.symbol}</span>
            </div>
            <FiChevronDown />
          </button>
          <div className="flex w-full justify-center items-center px-2 py-3">
            {!!pairError ? (
              <span className="text-[red]/50">{pairError.message}</span>
            ) : (
              <button
                disabled={isImportLoading || _.includes(importedPools[chainId as number], pair)}
                onClick={addToPools}
                className={`flex justify-center items-center bg-[#1673b9]/50 btn py-[14px] px-[10px] rounded-[19px] text-[18px] text-white w-full ${
                  isImportLoading ? 'loading' : ''
                }`}
              >
                <span className="font-MontserratAlt">Import</span>
              </button>
            )}
          </div>
        </div>
      </div>
      <SwapSettingsModal isOpen={isSettingsModalVisible} onClose={() => setIsSettingsModalVisible(false)} />
      <TokensListModal
        isVisible={isFirstTokensListModalVisible}
        onClose={() => setIsFirstTokensListModalVisible(false)}
        onTokenSelected={(token) => setFirstSelectedToken(token)}
        selectedTokens={[firstSelectedToken, secondSelectedToken]}
      />
      <TokensListModal
        isVisible={isSecondTokensListModalVisible}
        onClose={() => setIsSecondTokensListModalVisible(false)}
        onTokenSelected={(token) => setSecondSelectedToken(token)}
        selectedTokens={[firstSelectedToken, secondSelectedToken]}
      />
    </div>
  );
};

const useLiqiditySubRoutes = (routes: Route) => {
  const [component, setComponent] = useState(() => LPRoute);

  useEffect(() => {
    switch (routes) {
      case Route.ADD_LIQUIDITY:
        setComponent(() => AddLiquidityRoute);
        break;
      case Route.FIND_OTHER_LP_TOKENS:
        setComponent(() => FindOtherLPRoute);
        break;
      case Route.LIQUIDITY_POOLS:
        setComponent(() => LPRoute);
        break;
      default:
        setComponent(() => LPRoute);
        break;
    }
  }, [routes]);
  return component;
};

export default function Liquidity() {
  const { query } = useRouter();
  const RenderedChild = useLiqiditySubRoutes(query.child_tab as Route);
  return (
    <div className="w-full overflow-auto flex justify-center items-center">
      <RenderedChild />
    </div>
  );
}

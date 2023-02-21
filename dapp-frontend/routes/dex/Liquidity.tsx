/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import assert from 'assert';
import _ from 'lodash';
import { FaWallet } from 'react-icons/fa';
import { FiSettings, FiPlus, FiChevronDown, FiArrowLeftCircle } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';
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
import { computePair, fetchTokenBalanceForConnectedWallet, getLiquidityPositionsOfConnectedAccount, quote } from '../../hooks/dex';
import SwapSettingsModal from '../../components/Dex/SwapSettingsModal';
import TokensListModal from '../../components/Dex/TokensListModal';
import { useDEXSettingsContext } from '../../contexts/dex/settings';
import routers from '../../assets/routers.json';
import { addToMetamask } from '../../utils';
import successFx from '../../assets/sounds/success_sound.mp3';
import errorFx from '../../assets/sounds/error_sound.mp3';
import TradeCard from '../../components/Dex/Card';
import ProviderSelectModal from '../../components/ProviderSelectModal';

enum Route {
  ADD_LIQUIDITY = 'add_liquidity',
  LIQUIDITY_POOLS = 'lps',
  FIND_OTHER_LP_TOKENS = 'find_other_lps'
}

const LPRoute = () => {
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState<boolean>(false);
  const [isProviderSelectModalVisible, setIsProviderSelectModalVisible] = useState<boolean>(false);
  const { isLoading, positions } = getLiquidityPositionsOfConnectedAccount();
  const { active } = useWeb3Context();
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
            {active ? (
              <div className="px-2 py-3 flex flex-col justify-center items-center gap-3 w-full overflow-auto">
                <div className="flex justify-center items-center py-[9px] w-full overflow-auto">
                  <div className="flex justify-center items-center w-full flex-col gap-1 px-1 py-1 overflow-auto">
                    <TailSpin color="#dcdcdc" visible={isLoading} width={20} height={20} />
                    {positions.length === 0 ? (
                      <div className="flex flex-col justify-center items-center gap-2">
                        <Image src="/images/broken_piggy_bank.svg" width={200} height={200} alt="broken_piggy_bank" />
                        <span className="text-[#aaaaaa] font-Poppins font-[400] capitalize">no liquidity found</span>
                      </div>
                    ) : (
                      <div className="w-full px-2 py-2 flex flex-col justify-center items-center gap-3">
                        {_.map(positions, (lp, index) => (
                          <UserLPItem pair={lp} key={index} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => push(`/dex?tab=liquidity&child_tab=${Route.FIND_OTHER_LP_TOKENS}`)}
                  className="border-[#a6b2ec] border rounded-[8px] w-full py-[13px] px-[17px] text-[#a6b2ec] text-[0.89em] font-[600] flex justify-center"
                >
                  <span className="font-Syne capitalize">find other LP tokens</span>
                </button>
                <button
                  onClick={() => push(`/dex?tab=liquidity&child_tab=${Route.ADD_LIQUIDITY}`)}
                  className="flex justify-center items-center bg-[#105dcf] py-[13px] px-[17px] rounded-[8px] gap-2 text-[0.89em] text-white w-full"
                >
                  <FiPlus /> <span className="font-Syne capitalize">add liquidity</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center gap-10 py-10">
                <span className="text-[#fff] font-Poppins font-[400] capitalize">connect wallet to view your liquidity</span>
                <button
                  onClick={() => setIsProviderSelectModalVisible(true)}
                  className="flex justify-center items-center bg-[#105dcf] py-4 px-2 rounded-[8px] gap-2 text-[0.89em] text-white w-full"
                >
                  <FaWallet /> <span className="font-Syne capitalize">connect wallet</span>
                </button>
              </div>
            )}
          </div>
          <SwapSettingsModal isOpen={isSettingsModalVisible} onClose={() => setIsSettingsModalVisible(false)} />
          <ProviderSelectModal isOpen={isProviderSelectModalVisible} onClose={() => setIsProviderSelectModalVisible(false)} />
        </TradeCard>
      </div>
    </div>
  );
};

const AddLiquidityRoute = () => {
  const { back } = useRouter();
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
    <>
      <div className="flex justify-center w-full items-center flex-col lg:flex-row">
        <div className="w-full lg:w-1/3">
          <TradeCard>
            <div className="flex flex-col justify-evenly items-center w-full h-full">
              <div className="flex justify-between w-full py-6 px-3">
                <button onClick={() => back()} className="bg-transparent text-[#a6b2ec] text-[30px]">
                  <FiArrowLeftCircle />
                </button>
                <div className="flex flex-col justify-center items-start">
                  <span className="font-Syne text-[1.8em] text-white font-[700] capitalize">add liquidity</span>
                  <p className="font-[400] font-Poppins text-[0.9em] text-[#9d9d9d] capitalize">receive LP tokens</p>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <button onClick={() => setIsSettingsModalVisible(true)} className="bg-transparent text-[#a6b2ec] text-[30px]">
                    <FiSettings />
                  </button>
                </div>
              </div>
              <div className="flex flex-col justify-center w-full gap-2 px-[9px]">
                <div className="flex flex-col w-full px-2 py-2 justify-evenly gap-2">
                  <div className="flex justify-between w-full font-Syne">
                    <span className="text-white">From</span>
                    <span className="text-[#c8bfbf]"> Balance: {balance1}</span>
                  </div>
                  <div className="flex justify-between w-full gap-1 items-center rounded-[8px] bg-[#fff]/[.07]">
                    <div
                      className="flex justify-evenly items-center p-4 cursor-pointer gap-2 w-auto"
                      onClick={() => setIsFirstTokensListModalVisible(true)}
                    >
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img src={firstSelectedToken.logoURI} alt={firstSelectedToken.name} />
                        </div>
                      </div>
                      <span className="text-white uppercase font-[700] text-[1em] font-Syne">{firstSelectedToken.symbol}</span>
                      <FiChevronDown className="text-white" />
                    </div>

                    <input
                      type="number"
                      value={val1}
                      className="p-3 bg-transparent text-white w-1/2 border-0 outline-0 appearance-none font-[600] text-[1em] font-Poppins text-right"
                      onChange={(e) => setVal1(e.target.valueAsNumber || 0.0)}
                    />
                  </div>
                  <div className="flex justify-end items-center w-full gap-1">
                    <button className="border border-[#3f84ea] rounded-[8px] px-2 py-1 font-Syne text-[#3f84ea] capitalize font-[400] text-[0.75em]">
                      25%
                    </button>
                    <button className="border border-[#3f84ea] rounded-[8px] px-2 py-1 font-Syne text-[#3f84ea] capitalize font-[400] text-[0.75em]">
                      50%
                    </button>
                    <button className="border border-[#3f84ea] rounded-[8px] px-2 py-1 font-Syne text-[#3f84ea] capitalize font-[400] text-[0.75em]">
                      75%
                    </button>
                    <button className="border border-[#3f84ea] rounded-[8px] px-2 py-1 font-Syne text-[#3f84ea] capitalize font-[400] text-[0.75em]">
                      100%
                    </button>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <button className="bg-transparent text-[#a6b2ec] text-[1em] rounded-full border border-[#a6b2ec]">
                    <FiPlus />
                  </button>
                </div>
                <div className="flex flex-col w-full px-2 py-2 justify-evenly gap-2">
                  <div className="flex justify-between w-full font-Syne">
                    <span className="text-white">To</span>
                    <span className="text-[#c8bfbf]"> Balance: {balance2}</span>
                  </div>
                  <div className="flex justify-between w-full gap-1 items-center rounded-[8px] bg-[#fff]/[.07]">
                    <div
                      className="flex justify-evenly items-center p-4 cursor-pointer gap-2 w-auto"
                      onClick={() => setIsSecondTokensListModalVisible(true)}
                    >
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img src={secondSelectedToken.logoURI} alt={secondSelectedToken.name} />
                        </div>
                      </div>
                      <span className="text-white uppercase font-[700] text-[1em] font-Syne">{secondSelectedToken.symbol}</span>
                      <FiChevronDown className="text-white" />
                    </div>

                    <input
                      type="number"
                      value={val2}
                      className="p-3 bg-transparent text-white w-1/2 border-0 outline-0 appearance-none font-[600] text-[1em] font-Poppins text-right"
                      onChange={(e) => setVal2(e.target.valueAsNumber || 0.0)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center w-full px-2 py-8">
                <button
                  onClick={addLiquidity}
                  disabled={isLoading || !active}
                  className="flex justify-center items-center bg-[#105dcf] py-4 px-3 text-[0.95em] text-white w-full rounded-[8px] gap-3"
                >
                  <span className="font-Syne">
                    {!active
                      ? 'Wallet not connected'
                      : val1 > parseFloat(balance1)
                      ? `Insufficient ${firstSelectedToken.symbol} balance`
                      : 'Add Liquidity'}
                  </span>
                  <TailSpin color="#dcdcdc" visible={isLoading} width={20} height={20} />
                </button>
              </div>
            </div>
          </TradeCard>
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
    </>
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
    <div className="flex justify-center w-full items-center flex-col lg:flex-row">
      <div className="w-full lg:w-1/3">
        <TradeCard>
          <div className="flex flex-col justify-evenly items-center w-full gap-5">
            <div className="flex justify-between w-full py-6 px-3">
              <button onClick={() => back()} className="bg-transparent text-[#a6b2ec] text-[30px]">
                <FiArrowLeftCircle />
              </button>
              <div className="flex flex-col justify-center items-start">
                <span className="font-Syne text-[1.8em] text-white font-[700] capitalize">import pool</span>
                <p className="font-[400] font-Poppins text-[0.9em] text-[#9d9d9d] capitalize">import an existing LP token</p>
              </div>
              <div className="flex justify-center items-center gap-2">
                <button onClick={() => setIsSettingsModalVisible(true)} className="bg-transparent text-[#a6b2ec] text-[30px]">
                  <FiSettings />
                </button>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-7 w-full px-4 font-Syne text-white">
              <button onClick={() => setIsFirstTokensListModalVisible(true)} className="bg-[#fff]/[.07] w-full rounded-[8px] flex justify-between items-center px-5 py-7">
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
              <button className="bg-transparent text-[#a6b2ec] text-[1em] rounded-full border border-[#a6b2ec]">
                    <FiPlus />
                  </button>
              <button onClick={() => setIsSecondTokensListModalVisible(true)} className="bg-[#fff]/[.07] w-full rounded-[8px] flex justify-between items-center px-5 py-7">
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
                    className="flex justify-center items-center bg-[#105dcf] py-4 px-3 text-[0.95em] text-white w-full rounded-[8px] gap-3"
                  >
                    <span className="font-Syne capitalize">
                    import
                  </span>
                  <TailSpin color="#dcdcdc" visible={isImportLoading} width={20} height={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </TradeCard>
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

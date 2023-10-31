import { Transition, Dialog } from '@headlessui/react';
import { Fragment, useCallback, useMemo, useState } from 'react';
import { formatEthAddress } from 'eth-address';
import { FiX } from 'react-icons/fi';
import { isNull, multiply, toString } from 'lodash';
import Toast from '../../Toast';
import millify from 'millify';
import { TailSpin } from 'react-loader-spinner';
import { abi as stakingPoolABI } from 'vefi-token-launchpad-staking/artifacts/contracts/StakingPool.sol/StakingPool.json';
import { abi as erc20ABI } from 'vefi-token-launchpad-staking/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json';
import { useContract } from '../../../hooks/global';
import { useAmountStakedMinusTax, useSingleStake, useSingleStakingPool, useStakeReward } from '../../../hooks/staking';
import Countdown from 'react-countdown';
import { useWeb3Context } from '../../../contexts/web3';
import { parseEther, parseUnits } from '@ethersproject/units';
import { useListingAsDictionary } from '../../../hooks/api';

type UnstakeTokenModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedStakingPoolID: string;
  stakeID: string;
};

const StatusLabel = ({ timestamp }: { timestamp: number }) => (
  <div
    className={`flex justify-center items-center rounded-[30px] px-1 py-1 ${multiply(timestamp, 1000) > Date.now() ? 'bg-[#02c35b]/[.15] text-[#23e33e]' : 'bg-[#f63859]/10 text-[#f73859]'
      }`}
  >
    <span className="font-Syne font-[400] text-[0.72em] capitalize">{multiply(timestamp, 1000) > Date.now() ? 'live' : 'sold out'}</span>
  </div>
);

const countdownRender = ({ days, hours, minutes, seconds }: any) => (
  <span className="font-Poppins font-[400] text-[0.72em] capitalize text-[#6093df]">
    {days}d:{hours}h:{minutes}m:{seconds}s
  </span>
);

export default function UnstakeTokenModal({ isOpen, onClose, selectedStakingPoolID, stakeID }: UnstakeTokenModalProps) {
  const [unstakedAmount, setUnstakedAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'info' | 'error'>('info');
  const [showToast, setShowToast] = useState(false);

  const stakingPoolContract = useContract(selectedStakingPoolID, stakingPoolABI, true);
  const { isLoading: isStakingPoolLoading, data } = useSingleStakingPool(selectedStakingPoolID);
  const { data: stakeData } = useSingleStake(stakeID);
  const stakedAmount = useAmountStakedMinusTax(selectedStakingPoolID, [isLoading]);
  const stakeReward = useStakeReward(selectedStakingPoolID);
  const tokensListingAsDictionary = useListingAsDictionary();
  const { active } = useWeb3Context();
  const stakedTokenContract = useContract(data?.stakedToken.id, erc20ABI, true);

  const displayToast = useCallback((msg: string, toastType: 'success' | 'info' | 'error') => {
    setToastMessage(msg);
    setToastType(toastType);
    setShowToast(true);
  }, []);

  const canUnstake = useMemo(
    () => !!stakedAmount && stakedAmount >= unstakedAmount && !!stakingPoolContract,
    [stakedAmount, unstakedAmount, stakingPoolContract]
  );

  const unstakeAmount = useCallback(async () => {
    try {
      if (canUnstake) {
        setIsLoading(true);
        let amountHex = '0x0';
        if (!isNull(stakedTokenContract)) {
          const decimals = await stakedTokenContract.decimals();
          amountHex = parseUnits(toString(unstakedAmount), decimals).toHexString();
        } else {
          amountHex = parseEther(toString(unstakedAmount)).toHexString();
        }

        const unstakeTx = await stakingPoolContract?.unstakeAmount(amountHex);
        await unstakeTx.wait();

        setIsLoading(false);
        displayToast('successfully unstaked amount', 'success');
        setUnstakedAmount(0);
      }
    } catch (error: any) {
      setIsLoading(false);
      displayToast('error occurred', 'error');
    }
  }, [canUnstake, displayToast, stakedTokenContract, stakingPoolContract, unstakedAmount]);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center min-h-full justify-center p-4">
              <div className="fixed inset-0 bg-[#000]/[.95] w-screen" aria-hidden="true" />
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="container top-0 bottom-0 left-0 right-0 max-w-[800px] mx-auto overflow-hidden bg-[#0c0c0c] rounded-[20px] flex flex-col justify-start items-center mix-blend-normal backdrop-blur-[64px] text-white">
                  <div className="w-full h-full flex flex-col justify-start items-center">
                    <div className="bg-transparent px-4 py-4 w-full border-b border-[#5d5d5d]">
                      <div className="flex flex-row items-center justify-between">
                        <h2 className="lg:text-2xl text-sm font-[700] font-Syne capitalize text-[#fff]">staking pool</h2>
                        <button
                          onClick={onClose}
                          className="text-[#eaebec]/[.49] text-[0.67em] border border-[#eaebec]/[.49] p-1 flex justify-center rounded-full font-[700]"
                        >
                          <FiX />
                        </button>
                      </div>
                    </div>
                    {isStakingPoolLoading ? (
                      <TailSpin color="#dcdcdc" visible={isStakingPoolLoading} width={20} height={20} />
                    ) : (
                      <div className="flex w-full flex-1 justify-evenly">
                        <div className="w-1/2 px-4 py-5 flex flex-col justify-start items-start gap-5">
                          <span className="font-Syne text-[#808080] text-[1.2em] capitalize font-[700]">pool information</span>
                          <div className="flex justify-center items-center gap-2">
                            <div className="avatar">
                              <div className="w-6 rounded-full">
                                <img
                                  src={tokensListingAsDictionary[data?.stakedToken.id]?.logoURI ?? '/images/placeholder_image.svg'}
                                  alt={data?.stakedToken.symbol}
                                />
                              </div>
                            </div>
                            <span className="font-[700] text-[1.1em] text-[#fff] font-Syne capitalize">{data?.stakedToken.name}</span>
                            <span className="font-[700] text-[1.1em] text-[#aaa] font-Syne uppercase">{data?.stakedToken.symbol}</span>
                          </div>
                          <div className="flex justify-start items-start w-full flex-col gap-2">
                            <div className="flex justify-between items-center w-full">
                              <span className="text-[#d4d4d4]/50 font-[400] capitalize text-[0.85em]">status</span>
                              <StatusLabel timestamp={parseInt(data?.endsIn || '0')} />
                            </div>
                            <div className="flex justify-between items-center w-full">
                              <span className="text-[#d4d4d4]/50 font-[400] capitalize text-[0.85em]">pool address</span>
                              <span className="text-[#6093df] font-[500] text-[0.72em]">{data && formatEthAddress(data?.id, 4)}</span>
                            </div>
                            <div className="flex justify-between items-center w-full">
                              <span className="text-[#d4d4d4]/50 font-[400] uppercase text-[0.85em]">apy</span>
                              <span className="text-[#23e33e] font-[500] text-[0.72em]">{data?.apy}%</span>
                            </div>
                            <div className="flex justify-between items-center w-full">
                              <span className="text-[#d4d4d4]/50 font-[400] capitalize text-[0.85em]">pool owner</span>
                              <span className="text-[#6093df] font-[500] text-[0.72em]">{data && formatEthAddress(data?.owner, 4)}</span>
                            </div>
                            <div className="flex justify-between items-center w-full">
                              <span className="text-[#d4d4d4]/50 font-[400] capitalize text-[0.85em]">total staked</span>
                              <span className="text-[#6093df] font-[500] text-[0.72em]">
                                {millify(parseInt(data?.totalStaked || '0'))} {data?.stakedToken.symbol}
                              </span>
                            </div>
                            <div className="flex justify-between items-center w-full">
                              <span className="text-[#d4d4d4]/50 font-[400] capitalize text-[0.85em]">total rewards</span>
                              <span className="text-[#6093df] font-[500] text-[0.72em]">
                                {millify(parseInt(data?.totalRewards || '0'))} {data?.rewardToken.symbol}
                              </span>
                            </div>
                            <div className="flex justify-between items-center w-full">
                              <span className="text-[#d4d4d4]/50 font-[400] capitalize text-[0.85em]">start date</span>
                              <span className="text-[#6093df] font-[500] text-[0.72em]">
                                {new Date(multiply(parseInt(data?.blockTimestamp || '0'), 1000)).toDateString()}
                              </span>
                            </div>
                            <div className="flex justify-between items-center w-full">
                              <span className="text-[#d4d4d4]/50 font-[400] capitalize text-[0.85em]">ends in</span>
                              <Countdown date={parseInt(data?.endsIn) * 1000} renderer={countdownRender} />
                            </div>
                          </div>
                        </div>
                        <div className="w-[2px] min-h-full bg-[#5d5d5d]"></div>
                        <div className="w-1/2 px-4 py-5 flex flex-col justify-start items-start gap-5">
                          <span className="font-Syne text-[#808080] text-[1.2em] capitalize font-[700]">unstake tokens</span>
                          <div className="flex justify-center items-center w-full">
                            <div className="flex flex-col justify-center items-center w-full gap-4">
                              <div className="flex flex-col justify-start items-center gap-2 w-full">
                                <div className="flex justify-between w-full font-Syne text-[0.78em] lg:text-[1em]">
                                  <span className="text-white capitalize">amount</span>
                                  <span className="text-[#c8bfbf] capitalize"> staked: {millify(stakedAmount)} </span>
                                </div>
                                <input
                                  type="number"
                                  value={unstakedAmount}
                                  className="p-3 bg-[#fff]/[.07] text-white w-full border-0 outline-0 rounded-[8px] appearance-none font-[600] text-[0.78em] lg:text-[1em] font-Poppins text-left"
                                  onChange={(e) => setUnstakedAmount(e.target.valueAsNumber ?? 0)}
                                />
                                <div className="flex justify-end items-center w-full gap-1">
                                  <button
                                    onClick={() => setUnstakedAmount(multiply(1 / 4, stakedAmount))}
                                    className="border border-[#3f84ea] rounded-[8px] px-2 py-1 font-Syne text-[#3f84ea] capitalize font-[400] text-[0.58em] lg:text-[0.78em]"
                                  >
                                    25%
                                  </button>
                                  <button
                                    onClick={() => setUnstakedAmount(multiply(2 / 4, stakedAmount))}
                                    className="border border-[#3f84ea] rounded-[8px] px-2 py-1 font-Syne text-[#3f84ea] capitalize font-[400] text-[0.58em] lg:text-[0.78em]"
                                  >
                                    50%
                                  </button>
                                  <button
                                    onClick={() => setUnstakedAmount(multiply(3 / 4, stakedAmount))}
                                    className="border border-[#3f84ea] rounded-[8px] px-2 py-1 font-Syne text-[#3f84ea] capitalize font-[400] text-[0.58em] lg:text-[0.78em]"
                                  >
                                    75%
                                  </button>
                                  <button
                                    onClick={() => setUnstakedAmount(stakedAmount)}
                                    className="border border-[#3f84ea] rounded-[8px] px-2 py-1 font-Syne text-[#3f84ea] capitalize font-[400] text-[0.58em] lg:text-[0.78em]"
                                  >
                                    100%
                                  </button>
                                </div>
                              </div>
                              <div className="flex justify-start items-start w-full overflow-auto hidden-scrollbar">
                                <ul className="steps steps-vertical w-full text-[0.63em] lg:text-[0.8em]">
                                  <li className="step step-neutral w-full">
                                    <div className="flex justify-between items-center w-full">
                                      <span className="capitalize font-Syne text-[#d4d4d4]/50">stake date</span>
                                      <span className="capitalize font-Poppins text-[#aaa]">
                                        {new Date(parseInt(stakeData?.blockTimestamp || '0') * 1000).toDateString()}
                                      </span>
                                    </div>
                                  </li>
                                  <li className="step step-neutral w-full">
                                    <div className="flex justify-between items-center w-full">
                                      <span className="capitalize font-Syne text-[#d4d4d4]/50">expected reward</span>
                                      <span className="capitalize font-Poppins text-[#aaa]">
                                        {millify(stakeReward)} {data?.rewardToken.symbol}
                                      </span>
                                    </div>
                                  </li>
                                  <li className="step step-neutral w-full">
                                    <div className="flex justify-between items-center w-full">
                                      <span className="capitalize font-Syne text-[#d4d4d4]/50">block number</span>
                                      <span className="capitalize font-Poppins text-[#aaa]">{stakeData?.blockNumber}</span>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                              <button
                                onClick={unstakeAmount}
                                disabled={isLoading || !canUnstake || !active}
                                className="flex justify-center items-center bg-[#FBAA19] py-4 px-3 text-[0.95em] text-white w-full rounded-[8px] gap-3"
                              >
                                <span className="font-Syne capitalize">
                                  {!active ? 'wallet not connected' : unstakedAmount > stakedAmount ? `insufficient stake` : 'unstake'}
                                </span>
                                <TailSpin color="#dcdcdc" visible={isLoading} width={20} height={20} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <Toast message={toastMessage} toastType={toastType} duration={10} onHide={() => setShowToast(false)} show={showToast} />
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

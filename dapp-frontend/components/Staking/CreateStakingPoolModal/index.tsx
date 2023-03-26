import { Transition, Dialog } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { FiChevronDown, FiX } from 'react-icons/fi';
import { Step, Steps } from '../../Steps';
import { map } from 'lodash';

type CreateStakingPoolModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

enum TimeIntervals {
  DAYS = 86400,
  WEEKS = 604800,
  MONTHS = 2419200,
  YEARS = 31449600
}

export default function CreateStakingPoolModal({ isOpen, onClose }: CreateStakingPoolModalProps) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedInterval, setSelectedInterval] = useState<TimeIntervals>(TimeIntervals.DAYS);
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10 w-screen" onClose={onClose}>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-screen w-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-[#0c0c0c] w-screen" aria-hidden="true" />
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="container  top-0 bottom-0 left-0 right-0 w-screen min-h-screen mx-auto overflow-hidden bg-[#0c0c0c] flex flex-col justify-start items-center mix-blend-normal backdrop-blur-[64px] text-white">
                  <div className="bg-[#0f0f10] px-2 py-4 w-full border-b border-[#5e5e5e]">
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex justify-center items-center gap-4">
                        <button
                          onClick={onClose}
                          className="text-[#eaebec]/[.49] text-[0.67em] border border-[#eaebec]/[.49] p-1 flex justify-center rounded-full font-[700]"
                        >
                          <FiX />
                        </button>
                        <h2 className="lg:text-2xl text-sm font-[700] font-Syne capitalize text-[#88aee7]">create staking pool</h2>
                      </div>
                      <div className="flex justify-center items-center gap-4">
                        <button
                          onClick={() => {
                            if (activeStep > 0) setActiveStep((step) => step - 1);
                          }}
                          className="capitalize font-Inter font-[500] border border-[#aeaeae] text-[0.5em] lg:text-[0.85em] bg-[#0a0a0a] text-[#fff] rounded-[8px] lg:px-4 px-1 lg:py-2 py-1 shadow-[0_1px_2px_rgba(16,_24,_40,_0.05)]"
                        >
                          previous
                        </button>
                        <button
                          onClick={() => {
                            if (activeStep < 2) setActiveStep((step) => step + 1);
                          }}
                          className="capitalize font-Inter font-[500] border border-[#105dcf] text-[0.5em] lg:text-[0.85em] bg-[#105dcf] text-[#fff] rounded-[8px] lg:px-4 px-1 lg:py-2 py-1 shadow-[0_1px_2px_rgba(16,_24,_40,_0.05)]"
                        >
                          next
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#060606] flex justify-center items-center w-full px-12 py-12">
                    <div className="w-full lg:w-1/2">
                      <Steps activeStep={activeStep}>
                        <Step title="token information" />
                        <Step title="staking information" />
                        <Step title="review & submit" />
                      </Steps>
                    </div>
                  </div>
                  <div className="bg-[#0f0f10] flex-1 w-full flex justify-center items-start py-4 px-3">
                    {activeStep === 0 && (
                      <div className="bg-[#191919] rounded-[20px] px-10 py-5 lg:px-24 lg:py-10 flex flex-col justify-center items-center gap-5">
                        <span className="text-[#fff] capitalize font-Syne text-[0.85em] lg:text-[1.5em] font-[600]">
                          enter addresses of stake and reward tokens
                        </span>
                        <div className="w-full flex flex-col justify-center items-center gap-3">
                          <div className="flex flex-col justify-center items-start w-full gap-1">
                            <label className="font-Syne font-[400] text-[0.8em] capitalize text-[#aeaeae]">stake token address</label>
                            <input
                              type="text"
                              className="font-Syne bg-[#fff]/[.07] w-full rounded-[8px] px-2 py-3 text-[#aeaeae] outline-0"
                              placeholder="Enter Address"
                            />
                          </div>
                          <div className="flex flex-col justify-center items-start w-full gap-1">
                            <label className="font-Syne font-[400] text-[0.8em] capitalize text-[#aeaeae]">reward token address</label>
                            <input
                              type="text"
                              className="font-Syne bg-[#fff]/[.07] w-full rounded-[8px] px-2 py-3 text-[#aeaeae] outline-0"
                              placeholder="Enter Address"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {activeStep === 1 && (
                      <div className="bg-[#191919] rounded-[20px] px-10 py-5 lg:px-24 lg:py-10 flex flex-col justify-center items-center gap-5">
                        <span className="text-[#fff] capitalize font-Syne text-[0.85em] lg:text-[1.5em] font-[600]">
                          enter addresses of stake and reward tokens
                        </span>
                        <div className="w-full flex flex-col justify-center items-center gap-3">
                          <div className="flex flex-col justify-center items-start w-full gap-1">
                            <label className="font-Syne font-[400] text-[0.8em] capitalize text-[#aeaeae]">annual percentage yield (APY)</label>
                            <input
                              type="number"
                              className="font-Syne bg-[#fff]/[.07] w-full rounded-[8px] px-2 py-3 text-[#aeaeae] outline-0"
                              placeholder="Enter APY"
                            />
                          </div>
                          <div className="flex flex-col justify-center items-start w-full gap-1">
                            <label className="font-Syne font-[400] text-[0.8em] capitalize text-[#aeaeae]">tax percentage</label>
                            <input
                              type="number"
                              className="font-Syne bg-[#fff]/[.07] w-full rounded-[8px] px-2 py-3 text-[#aeaeae] outline-0"
                              placeholder="Enter Incurred Tax"
                            />
                          </div>
                          <div className="flex flex-col justify-center items-start w-full gap-1">
                            <label className="font-Syne font-[400] text-[0.8em] capitalize text-[#aeaeae]">tax recipient</label>
                            <input
                              type="text"
                              className="font-Syne bg-[#fff]/[.07] w-full rounded-[8px] px-2 py-3 text-[#aeaeae] outline-0"
                              placeholder="Enter Tax Recipient"
                            />
                          </div>
                          <div className="flex flex-col justify-center items-start w-full gap-1">
                            <label className="font-Syne font-[400] text-[0.8em] capitalize text-[#aeaeae]">withdrawal intervals</label>
                            <div className="flex justify-center items-center gap-2 w-full">
                              <input
                                type="number"
                                className="font-Syne bg-[#fff]/[.07] w-full rounded-[8px] px-2 py-3 text-[#aeaeae] outline-0"
                                placeholder="Enter Intervals"
                              />
                              <div className="dropdown dropdown-bottom">
                                <label
                                  className="max-w-sm bg-[#fff]/[.07] px-3 py-4 rounded-[8px] cursor-pointer flex justify-center items-center gap-2 text-[0.75em]"
                                  tabIndex={0}
                                >
                                  {TimeIntervals[selectedInterval]}
                                  <FiChevronDown />
                                </label>
                                <ul className="dropdown-content menu p-2 shadow rounded-box w-52 bg-[#fff]/[.07] cursor-pointer">
                                  {map(
                                    Object.keys(TimeIntervals).filter((k) => !isNaN(TimeIntervals[k as keyof typeof TimeIntervals])),
                                    (interval, index) => (
                                      <li key={index}>
                                        <button onClick={() => setSelectedInterval(TimeIntervals[interval as keyof typeof TimeIntervals])}>
                                          {interval}
                                        </button>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col justify-center items-start w-full gap-1">
                            <label className="font-Syne font-[400] text-[0.8em] capitalize text-[#aeaeae]">initial amount</label>
                            <input
                              type="number"
                              className="font-Syne bg-[#fff]/[.07] w-full rounded-[8px] px-2 py-3 text-[#aeaeae] outline-0"
                              placeholder="Enter Initial Amount"
                            />
                          </div>
                          <div className="flex flex-col justify-center items-start w-full gap-1">
                            <label className="font-Syne font-[400] text-[0.8em] capitalize text-[#aeaeae]">ends in (days)</label>
                            <input
                              type="number"
                              className="font-Syne bg-[#fff]/[.07] w-full rounded-[8px] px-2 py-3 text-[#aeaeae] outline-0"
                              placeholder="How Many Days Should This Pool Last?"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {activeStep === 2 && (
                      <div className="bg-[#191919] rounded-[20px] px-10 py-5 lg:px-24 lg:py-10 flex flex-col justify-center items-center gap-5">
                        <span className="text-[#fff] capitalize font-Syne text-[0.85em] lg:text-[1.5em] font-[600]">review</span>
                      </div>
                    )}
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

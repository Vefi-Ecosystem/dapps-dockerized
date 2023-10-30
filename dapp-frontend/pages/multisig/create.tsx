import Head from 'next/head';
import React, { useState } from 'react';
import { Step, Steps } from '../../ui/Steps';
import { FiPlus } from 'react-icons/fi';
import { useMultiSigFormContext } from '../../contexts/multisig/multiSigForm';

export default function MultiSig() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const { inputForm, setInputForm } = useMultiSigFormContext();

  return (
    <>
      <Head>
        <title>VeFi Dapps | MultiSig</title>
      </Head>
      <div className="container mx-auto">
        <div className="flex w-full py-10 flex-col">
          <div className="flex bg-[#191919] rounded-tl-[30px] rounded-tr-[30px] w-full p-10 justify-center flex-col text-center">
            <div className="flex flex-col justify-center max-w-[500px] mx-auto items-center text-center leading-[40px]">
              <h1 className="text-[24px] md:text-[34px] font-Syne font-[700] text-[#fff]">Create Your multisig with Squads in a few clicks</h1>
              <p className="text-[16px] font-Syne text-[#aeaeae]">Dedicated to increasing user staking income</p>
            </div>

            <div className="flex justify-center items-center w-full px-12 py-12">
              <div className="w-full lg:w-3/4">
                <Steps activeStep={activeStep}>
                  <Step
                    title="Create your MS"
                    desc="Add a profile picture for your squad (JPEG, PNG or GIF), give it a name and add a description. MS details can also be changed after deployment."
                  />
                  <Step
                    title="Add owners and set a threshold"
                    desc="Add up to 10 initial owners for your squad and set a transaction confirmation threshold. owners and threshold can be changed after MS deployment by initiating a transaction.  "
                  />
                  <Step title="review & submit" desc="Review and submit your work" />
                </Steps>
              </div>
            </div>
          </div>
          <div className="flex bg-[#020202] ">
            <div className="p-10 justify-center flex-col mx-auto w-full ">
              {activeStep === 0 && (
                <>
                  <div className="flex  justify-center">
                    <div className="flex flex-col md:w-1/2">
                      <h1 className="text-[#fff] font-Syne font-[600] text-[34px] py-2">Create Your MultiSig</h1>
                      <div className="flex items-center gap-2">
                        <div className="avatar">
                          <div className="w-14 rounded-full  bg-[#373B4F]"></div>
                        </div>
                        <div className="flex flex-col py-3 text-[#aeaeae] leading-tight">
                          <h2>MultiSig Name</h2>
                          <p className="text-[12px]">Supporting Jpeg,.png, or .gif(under 3mb)</p>
                        </div>
                      </div>
                      <div className="flex flex-col py-3">
                        <h2 className="text-[#AEAEAE] font-Syne font-[400]">MS Name</h2>
                        <input
                          type="text"
                          name="msName"
                          value={inputForm.msName}
                          onChange={(e) => {
                            setInputForm({
                              ...inputForm,
                              [e.target.name]: e.target.value
                            });
                          }}
                          placeholder="Enter Name"
                          className="bg-[#191919] border-0 outline-none p-2 text-white font-Syne rounded"
                        />
                      </div>
                      <div className="flex flex-col ">
                        <h2 className="text-[#AEAEAE] font-Syne font-[400]">MS Description</h2>
                        <input
                          type="text"
                          name="msDescription"
                          value={inputForm.msDescription}
                          onChange={(e) => {
                            setInputForm({
                              ...inputForm,
                              [e.target.name]: e.target.value
                            });
                          }}
                          placeholder="Enter Description"
                          className="bg-[#191919] border-0 outline-none p-2 text-white font-Syne rounded"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
              {activeStep === 1 && (
                <>
                  <div className="flex  justify-center">
                    <div className="flex flex-col">
                      <h1 className="text-[#fff] font-Syne font-[600] text-[34px] py-2 leading-tight">Add Owners And Set Threshold</h1>

                      <div className="flex flex-col py-3">
                        <h2 className="text-[#AEAEAE] font-Syne font-[400]">Add Initial Multising Owners</h2>
                        <input
                          type="text"
                          name="msThreshold"
                          value={inputForm.msThreshold}
                          onChange={(e) => {
                            setInputForm({
                              ...inputForm,
                              [e.target.name]: e.target.value
                            });
                          }}
                          placeholder="Enter Public Key"
                          className="bg-[#191919] border-0 outline-none p-2 text-white font-Syne rounded"
                        />
                      </div>
                      <div className="flex flex-col ">
                        <button className="btn flex items-center gap-3 capitalize text-[rgba(255,255,255,0.6)]">
                          <FiPlus />
                          Add Owner #2
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {activeStep === 2 && (
                <>
                  <div className="flex justify-center">
                    <div className="flex flex-col w-2/3">
                      <h1 className="text-[#fff] font-Syne font-[600] text-[34px] py-2 leading-tight">Review Your MS</h1>
                      <div className="flex items-center gap-2">
                        <div className="avatar">
                          <div className="w-14 rounded-full  bg-[#373B4F]"></div>
                        </div>
                      </div>
                      <div className="flex flex-col py-3">
                        <h2 className="text-[#AEAEAE] font-Syne font-[400]">Demo Account</h2>
                        <p className="text-[rgba(255,255,255,0.4)]">This account is a demo account</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full pt-2">
                          <div className="bg-[#141414] p-5 rounded-[15px] ">
                            <div className="flex items-center gap-2">
                              <img src="/images/crypto_logo.png" alt="crypto logo" />
                              <h2 className="text-white font-Syne text-[16px] font-[700]">Threshold</h2>
                            </div>
                            <div className="flex py-5">
                              <h1 className="text-white font-Syne text-[34px]">1/1</h1>
                            </div>
                          </div>
                          <div className="bg-[#141414] p-5 rounded-[15px] ">
                            <div className="flex items-center gap-2">
                              <img src="/images/crypto_logo.png" alt="crypto logo" />
                              <h2 className="text-white font-Syne text-[16px] font-[700]">Owners</h2>
                            </div>
                            <div className="flex py-5">
                              <h1 className="text-white font-Syne text-[34px]">1</h1>
                            </div>
                          </div>
                          <div className="bg-[#141414] p-5 rounded-[15px] ">
                            <div className="flex items-center gap-2">
                              <img src="/images/crypto_logo.png" alt="crypto logo" />
                              <h2 className="text-white font-Syne text-[16px] font-[700]">Fee</h2>
                            </div>
                            <div className="flex py-5">
                              <h1 className="text-white font-Syne text-[34px]">0.000003 VEF</h1>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="flex justify-end gap-4 mt-5 md:mr-20">
                {activeStep > 0 && (
                  <button
                    onClick={() => {
                      if (activeStep > 0) setActiveStep((step) => step - 1);
                    }}
                    className="capitalize font-Inter font-[500] border border-[#aeaeae] text-[0.5em] lg:text-[0.85em] bg-[#0a0a0a] text-[#fff] rounded-[8px] lg:px-4 px-4 lg:py-2 py-2 shadow-[0_1px_2px_rgba(16,_24,_40,_0.05)]"
                  >
                    previous
                  </button>
                )}

                {activeStep === 2 ? (
                  <button className="capitalize font-Inter font-[500] border border-[#FBAA19] text-[0.5em] lg:text-[0.85em] bg-[#FBAA19] text-[#fff] rounded-[8px] lg:px-4 px-2 lg:py-2 py-2 shadow-[0_1px_2px_rgba(16,_24,_40,_0.05)] flex justify-center items-center gap-2">
                    Confirm
                  </button>
                ) : (
                  <>
                    {activeStep < 2 && (
                      <button
                        onClick={() => {
                          if (activeStep < 2) setActiveStep((step) => step + 1);
                        }}
                        className="capitalize font-Inter font-[500] border border-[#FBAA19] text-[0.5em] lg:text-[0.85em] bg-[#FBAA19] text-[#fff] rounded-[8px] lg:px-4 px-4 lg:py-2 py-2 shadow-[0_1px_2px_rgba(16,_24,_40,_0.05)] disabled:cursor-not-allowed"
                      >
                        next
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

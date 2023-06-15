import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function Bridge() {
  const [show, setShow] = useState<boolean>(false);
  const [tokenInfo, setTokenInfo] = useState({
    fromToken: 'Select a token',
    fromNetwork: 'Select a network',
    fromTokenImg: '/images/wallet.png',
    fromNetworkImg: '/images/wallet.png',
    toToken: 'Select a token',
    toTokenImg: '/images/wallet.png',
    toNetworkImg: '/images/wallet.png',
    toNetwork: 'Select a network'
  });

  const [toNetworkBtn, setToNetworkBtn] = useState<boolean>(false);

  const token = [
    {
      id: 1,
      name: 'Wade Cooper',
      avatar: '/images/wallet.png'
    },
    {
      id: 2,
      name: 'Arlene Mccoy',
      avatar: '/images/wallet.png'
    },
    {
      id: 3,
      name: 'Devon Webb',
      avatar: '/images/wallet.png'
    },
    {
      id: 4,
      name: 'Tom Cook',
      avatar: '/images/wallet.png'
    },
    {
      id: 5,
      name: 'Tanya Fox',
      avatar: '/images/wallet.png'
    },
    {
      id: 6,
      name: 'Hellen Schmidt',
      avatar: '/images/wallet.png'
    },
    {
      id: 7,
      name: 'Caroline Schultz',
      avatar: '/images/wallet.png'
    },
    {
      id: 8,
      name: 'Mason Heaney',
      avatar: '/images/wallet.png'
    }
  ];
  return (
    <>
      <Head>
        <title>Vefi DApps | Bridge</title>
      </Head>
      <div className="container mx-auto w-[95%] md:w-2/6  py-20 ">
        <div className="text-[rgba(255,255,255,0.7)] bg-[#1a1a1a] h-fit px-10 py-10 rounded-[20px] shadow-md">
          <div className="flex justify-between items-center text-white">
            <div>
              <h1 className="text-[25px] text-white font-Syne font-[700]">Transfer</h1>
            </div>
            <div className="flex gap-3">
              <Image src="/images/wallet.png" alt="wallet" width={28} height={28} />
              <Image src="/images/setting.png" alt="wallet" width={28} height={28} />
            </div>
          </div>
          <div className="flex w-full flex-col relative">
            <span className="my-3 font-Syne text-sm">From</span>
            <div className="flex justify-between gap-5 bg-[rgba(255,255,255,0.07)] w-full px-5 py-1 rounded-[10px] shadow-md ">
              <div className="">
                <div
                  className="flex items-center gap-2 py-2 cursor-pointer"
                  onClick={() => {
                    setShow(!show);
                    setToNetworkBtn(false);
                  }}
                >
                  <Image src={tokenInfo.fromTokenImg} alt="wallet" width={28} height={28} />
                  <span className="text-sm font-Syne flex items-center gap-1">
                    {tokenInfo.fromToken} {show ? <FiChevronUp /> : <FiChevronDown />}
                  </span>
                </div>
              </div>
              <div className="">
                <div
                  className="flex items-center gap-2 py-2 cursor-pointer"
                  onClick={() => {
                    setShow(!show);
                    setToNetworkBtn(!toNetworkBtn);
                  }}
                >
                  <Image src={tokenInfo.fromNetworkImg} alt="wallet" width={28} height={28} />
                  <span className="text-sm font-Syne flex items-center gap-1">
                    {tokenInfo.fromNetwork} <FiChevronDown />
                  </span>
                </div>
              </div>
            </div>
            {show && (
              <div className="h-[300px] w-full bg-[rgba(0,0,0,1)] absolute z-10 top-[100px] rounded-[5px] p-3 overflow-y-scroll">
                {token.map((item) => (
                  <div className="flex justify-between w-full p-2 mb-1 hover:bg-[#1a1a1a] items-center cursor-pointer rounded-sm" key={item.id}>
                    <div
                      className="flex gap-2 items-center font-Syne font-[700]"
                      onClick={() => {
                        toNetworkBtn
                          ? setTokenInfo({ ...tokenInfo, fromNetwork: item.name, fromNetworkImg: item.avatar })
                          : setTokenInfo({ ...tokenInfo, fromToken: item.name, fromTokenImg: item.avatar });

                        setShow(!show);
                      }}
                    >
                      <Image src={item.avatar} alt="eth" width={30} height={30} />
                      <h1 className="text-sm">{item.name}</h1>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-center items-center py-5">
            <Image src="/images/toggle.png" alt="wallet" width={20} height={20} />
          </div>
          <div className="flex w-full flex-col">
            <span className="font-Syne text-sm">To</span>
            <div className="flex justify-between gap-5 bg-[rgba(255,255,255,0.07)] w-full px-5 py-1 rounded-[10px] shadow-md">
              <div className="">
                <div className="flex items-center gap-2 py-2">
                  <Image src={tokenInfo.toTokenImg} alt="wallet" width={28} height={28} />
                  <span className="text-sm font-Syne flex items-center gap-1">
                    {tokenInfo.toToken} <FiChevronDown />
                  </span>
                </div>
              </div>
              <div className="">
                <div className="flex items-center gap-2 py-2">
                  <Image src={tokenInfo.toNetworkImg} alt="wallet" width={28} height={28} />
                  <span className="text-sm font-Syne flex items-center gap-1">
                    {tokenInfo.toNetwork} <FiChevronDown />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col py-3 px-1">
            <div className="flex justify-between py-2">
              <span className="text-[12px]">Total Amount</span>
              <span className="text-[12px]">Balance: 0.00 VEF</span>
            </div>
            <div className="w-full border border-[rgba(255,255,255,0.5)] rounded-[10px] flex items-center p-2 mb-5">
              <input type="number" name="" id="" className="w-full bg-transparent outline-none border-0 px-2" placeholder="0.0" />
              <button className="btn bg-transparent border-[rgba(255,255,255,0.2)] border p-2 text-[10px] min-h-0 h-fit">MAX</button>
            </div>
            <div className="w-full border border-[rgba(255,255,255,0.5)] rounded-[10px] flex items-center p-2 mb-5">
              <input type="text" name="" id="" className="w-full bg-transparent outline-none border-0 px-2" placeholder="Destination address" />
            </div>
            <div tabIndex={0} className="collapse collapse-arrow border border-[rgba(255,255,255,0.5)] rounded-[10px] mb-5">
              <div className="collapse-title text-sm cursor-pointer">You will receive</div>
              <div className="collapse-content">
                <div className="text-sm">
                  <div className="flex justify-between py-1">
                    <span>Slippage</span>
                    <span>0.5%</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Gas on destination</span>
                    <span>-</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Fee</span>
                    <span>-</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Gas cost</span>
                    <span>-</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="bg-[#105DCF] text-white w-full rounded-[10px] btn capitalize border-0 outline-none">Continue</button>
          </div>
        </div>
      </div>
    </>
  );
}

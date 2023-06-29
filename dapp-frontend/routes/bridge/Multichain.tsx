import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useGetBridgeTokenList, useGetBridgeChainList } from '../../hooks/api/bridge';
import { useWeb3Context } from '../../contexts/web3';
import TokenSelect from '../../ui/Bridge/TokenSelect';
import BridgeSelect from '../../ui/Bridge/BridgeSelect';

export default function Multichain() {
    const [show, setShow] = useState<boolean>(false);
    const [tokenInfo, setTokenInfo] = useState({
        fromToken: 'Token',
        fromNetwork: 'Network',
        fromTokenImg: '/images/wallet.png',
        fromNetworkImg: '/images/wallet.png',
        toToken: 'Token',
        toTokenImg: '/images/wallet.png',
        toNetworkImg: '/images/wallet.png',
        toNetwork: 'Network',
        destinationAddress: '',
    });
    const [showDestinationAddress, setShowDestinationAddress] = useState<boolean>(false);

    // Token Selection State
    const [selectedFromToken, setSelectedFromToken] = useState<any>({});
    const [selectedToToken, setSelectedToToken] = useState<any>({});
    const [selectedFromNetwork, setSelectedFromNetwork] = useState<any>({});
    const [selectedToNetwork, setSelectedToNetwork] = useState<any>({});

    // Token Selection Modal State
    const [showFromTokenModal, setShowFromTokenModal] = useState<boolean>(false);
    const [showToTokenModal, setShowTokenModal] = useState<boolean>(false);
    const [showFromNetworkModal, setShowFromNetworkModal] = useState<boolean>(false);
    const [showToNetworkModal, setShowToNetworkModal] = useState<boolean>(false);


    const [destinationAddress, setDestinationAddress] = useState<string>('');
    const [toNetworkBtn, setToNetworkBtn] = useState<boolean>(false);
    const { chainId } = useWeb3Context();

    // Getting Bridge Token List
    const { chainTokenList } = useGetBridgeTokenList(chainId);
    // Getting Bridge Chain List
    const { chainList } = useGetBridgeChainList();

    useEffect(() => { }, [chainId])

    const handleFromTokenSelect = (token: any) => {
        setSelectedFromToken(token)
        setTokenInfo({
            ...tokenInfo,
            fromToken: token.name,
            fromTokenImg: token.logoUrl,
        })
        setShowFromTokenModal(false)
    }

    const handleToTokenSelect = (token: any) => {
        setSelectedToToken(token)
        setTokenInfo({
            ...tokenInfo,
            toToken: token.name,
            toTokenImg: token.logoUrl,
        })
        setShowTokenModal(false)
    }

    const handleFromNetworkSelect = (network: any) => {
        setSelectedFromNetwork(network)
        setTokenInfo({
            ...tokenInfo,
            fromNetwork: network.name,
            fromNetworkImg: network.logoUrl,
        })
        setShowFromNetworkModal(false)
    }


    return (
        <>
            <Head>
                <title>Vefi DApps | Multichain Bridge</title>
            </Head>
            <div className="container relative mx-auto w-[95%] md:w-2/6 py-15">
                <div className="text-[rgba(255,255,255,0.7)] bg-[#1a1a1a] h-fit px-10 py-10 rounded-[20px] shadow-md">
                    <div className="flex justify-between items-center text-white">
                        <div>
                            <h1 className="text-[25px] text-white font-Syne font-[700]">Transfer</h1>
                        </div>
                        <div className="flex gap-3">
                            <Image src="/images/wallet.png" alt="wallet" width={25} height={25} onClick={() => setShowDestinationAddress(!showDestinationAddress)} className="cursor-pointer" />
                            <Image src="/images/setting.png" alt="wallet" width={25} height={25} className="cursor-pointer" />
                        </div>
                    </div>
                    <div className="flex w-full flex-col relative">
                        <span className="my-3 font-Syne text-sm">From</span>
                        <div className="flex justify-between gap-5 bg-[rgba(255,255,255,0.07)] w-full px-5 py-1 rounded-[10px] shadow-md ">
                            <div className="">
                                <div
                                    className="flex items-center gap-2 py-2 cursor-pointer"
                                    onClick={() => setShowFromTokenModal(true)}
                                >
                                    <Image src={tokenInfo.fromTokenImg} alt="wallet" width={28} height={28} className={`${tokenInfo.fromTokenImg !== "/images/wallet.png" ? "rounded-full" : ""}`} />
                                    <span className="text-sm font-Syne flex items-center gap-1">
                                        {tokenInfo.fromToken} {showFromTokenModal ? <FiChevronUp /> : <FiChevronDown />}
                                    </span>
                                </div>
                            </div>
                            <div className="">
                                <div
                                    className="flex items-center gap-2 py-2 cursor-pointer"
                                    onClick={() => setShowFromNetworkModal(true)}
                                >
                                    <Image src={tokenInfo.fromNetworkImg} alt="wallet" width={28} height={28} />
                                    <span className="text-sm font-Syne flex items-center gap-1">
                                        {tokenInfo.fromNetwork} <FiChevronDown />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center items-center py-5">
                        <Image src="/images/toggle.png" className='cursor-pointer' alt="toggle icon" width={20} height={20} />
                    </div>
                    <div className="flex w-full flex-col">
                        <span className="font-Syne text-sm">To</span>
                        <div className="flex justify-between gap-5 bg-[rgba(255,255,255,0.07)] w-full px-5 py-1 rounded-[10px] shadow-md">
                            <div className="">
                                <div className="flex items-center gap-2 py-2 cursor-pointer"
                                    onClick={() => setShowTokenModal(true)}>
                                    <Image src={tokenInfo.toTokenImg} alt="wallet" width={28} height={28} className={`${tokenInfo.toTokenImg !== "/images/wallet.png" ? "rounded-full" : ""}`} />
                                    <span className="text-sm font-Syne flex items-center gap-1">
                                        {tokenInfo.toToken} {showToTokenModal ? <FiChevronUp /> : <FiChevronDown />}
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
                        {showDestinationAddress && (
                            <div className="w-full border border-[rgba(255,255,255,0.5)] rounded-[10px] flex items-center p-2 mb-5">
                                <input type="text" name="" id="" className="w-full bg-transparent outline-none border-0 px-2" placeholder="Destination address" value={destinationAddress} onChange={(e) => setDestinationAddress(e.target.value)} />
                            </div>)
                        }
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
                <TokenSelect
                    chainId={chainId}
                    isVisible={showFromTokenModal}
                    onClose={() => setShowFromTokenModal(false)}
                    onTokenSelected={(token: any) => handleFromTokenSelect(token)}
                    selectedToken={selectedFromToken}
                    tokenList={chainTokenList}
                />
                <TokenSelect
                    chainId={chainId}
                    isVisible={showToTokenModal}
                    onClose={() => setShowTokenModal(false)}
                    onTokenSelected={(token: any) => handleToTokenSelect(token)}
                    selectedToken={selectedToToken}
                    tokenList={chainTokenList}
                />
                <BridgeSelect
                    isVisible={showFromNetworkModal}
                    onClose={() => setShowFromNetworkModal(false)}
                    selectedBrige={selectedFromNetwork}
                    onBridgeSelect={(bridge: any) => handleFromNetworkSelect(bridge)}
                    bridgeList={chainList}
                />
            </div>
        </>
    );
}

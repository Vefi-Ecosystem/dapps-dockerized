import Image from 'next/image';
import Link from 'next/link';
import { FiArrowUpRight } from 'react-icons/fi';

export default function LaunchPadCard() {
  return (
    <>
      <div className="flex flex-col bg-lightBlue p-5 rounded-[20px] shadow w-full min-h-fit">
        <div className="flex items-center justify-between">
          <span>
            <Image src="/images/token_ring.png" width={25} height={25} alt="token" className="object-contain" />
          </span>
          <span className="bg-lightGreen text-[green] font-Kinn font-[700] rounded text-[10px] px-3 py-[1px]">Live</span>
        </div>
        <div className="my-3">
          <h1 className="font-Syne text-white font-[700] text-[20px] leading-5">Freight Coin Binance Smart Chain</h1>
          <p className="font-Poppins text-[12px] text-[#C8BFBF] ">Native IDO tokens of the IDO Launchpad platform</p>
        </div>
        <div className="my-3">
          <div className="flex justify-between items-center">
            <span className="flex items-center text-white font-Poppins font-[600]">
              <Image src="/images/ethereum.webp" width={25} height={25} alt="eth" className="object-fit" />
              ETH
            </span>
            <span>
              <p className="text-[#9A999C] font-Poppins font-[700] text-[12px] leading-[5px]">Sale end in:</p>
              <h1 className="font-Syne text-white text-[16px] font-[700]">00:12:28:04</h1>
            </span>
          </div>
          <div className="my-3">
            <h1 className="font-Syne font-[700] text-[16px] text-white">Progress (65%)</h1>
            <span className="flex items-center w-full bg-[#909090] rounded">
              <span className="w-[65%] bg-white rounded h-2"></span>
            </span>
            <div className="flex justify-between text-[#9A999C] font-Poppins font-[700] text-[12px] py-1">
              <span>
                <h1>23.365096308565307375 $SAP</h1>
              </span>
              <span>
                <h1>40$SAP</h1>
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between font-Syne font-[700] my-3">
            <div className="w-1/2 text-left">
              <span className="text-[#9A999C]">
                <h1>Access</h1>
              </span>
              <span className="text-[#3F84EA]">
                <h1>Public.</h1>
              </span>
            </div>
            <div className="w-1/2 text-right">
              <span className="text-[#9A999C]">
                <h1>ETHM price</h1>
              </span>
              <span className="text-[#3F84EA]">
                <h1>0.0000013 SAP</h1>
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between font-Syne font-[700] my-3">
            <div className="w-1/2 text-left">
              <span className="text-[#9A999C]">
                <h1>Liquidity</h1>
              </span>
              <span className="text-[#3F84EA]">
                <h1>80%</h1>
              </span>
            </div>
            <div className="w-1/2 text-right">
              <span className="text-[#9A999C]">
                <h1>Swap deal</h1>
              </span>
              <span className="text-[#3F84EA]">
                <h1>0.0000013 ETHM = 1 $VEF</h1>
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between font-Syne font-[700] my-3">
            <div className="w-1/2 text-left">
              <span className="text-[#9A999C]">
                <h1>Lockup time</h1>
              </span>
              <span className="text-[#3F84EA]">
                <h1>30 days</h1>
              </span>
            </div>
            <div className="w-1/2 text-right">
              <span className="text-[#9A999C]">
                <h1>soft-hard cap</h1>
              </span>
              <span className="text-[#3F84EA]">
                <h1>10 $sap - 20 $sap</h1>
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Link href="#" className="text-right">
            <FiArrowUpRight className="text-white font-[700] text-[30px]" />
          </Link>
        </div>
      </div>
    </>
  );
}

import Head from 'next/head';
import Link from 'next/link';
import { FiCheckCircle } from 'react-icons/fi';
import { MdSwapHoriz } from 'react-icons/md';
import { map } from 'lodash';
import chains from '../assets/chains.json';

export default function Index() {
  return (
    <>
      <Head>
        <title>Vefi DApps | Homepage</title>
      </Head>
      <div className="flex flex-col justify-center items-center gap-60 w-full py-10 lg:py-20">
        <div className="hidden lg:block absolute top-[0%] -left-8 w-[499px] h-[499px] bg-[#105dcf]/[.38] rounded-full blur-[125px]"></div>
        <div className="hidden lg:block absolute top-64 -right-8 w-80 h-80 bg-[#74fff7]/[.52] rounded-full blur-[125px]"></div>
        <div className="hidden lg:block absolute top-[1088px] -left-8 w-[499px] h-[499px] bg-[#6093df]/[.38] rounded-full blur-[125px]"></div>
        <div className="hidden lg:block absolute top-[1800px] -right-8 w-80 h-80 bg-[#535976] rounded-full blur-[125px]"></div>
        <div className="absolute top-[8%] lg:top-[3%] -left-14 lg:-left-7 w-28 h-28 lg:w-60 lg:h-60">
          <img src="/images/cube_1.svg" className="w-full h-full" alt="cube" />
        </div>
        <div className="absolute top-[8%] lg:top-[9%] -right-20 lg:-right-12 w-32 h-32 lg:w-80 lg:h-80">
          <img src="/images/cube_1.svg" className="w-full h-full" alt="cube" />
        </div>
        {/* <div className="hidden lg:block absolute -left-[3%] top-[10.93%]">
        <img src="/images/cube_1.svg" alt="cube" />
      </div> */}
        <section className="flex justify-center items-center flex-col w-full px-6 lg:px-12 gap-3 bg-home_radialed">
          <span className="text-white font-Syne capitalize text-[2.5em] lg:text-[3.5em] text-center lg:max-w-[70rem]">
            Enjoy fast transactions, security, and total ownership of your assets.
          </span>
          <p className="text-[#a49999] font-Poppins text-[1em] text-center">
            Lightning-Fast transactions, secure smart contracts, and complete asset control.
          </p>
          <Link href="/dex">
            <button className="flex justify-center items-center bg-[#105dcf] py-[9px] px-[10px] text-[1em] text-white gap-2 rounded-[8px] font-Syne">
              <MdSwapHoriz />
              Start Trading
            </button>
          </Link>
        </section>
        <section className="flex justify-center items-center gap-4 w-full overflow-auto p-2 lg:p-5 hidden-scrollbar">
          <div className="flex w-1/4 flex-col justify-center items-center gap-3 px-4 py-4">
            <span className="font-[700] font-Syne text-[2em] text-[#fff]">$13M</span>
            <span className="font-[400] font-Poppins text-[0.9em] text-[#a49999]">Total Liquidity Raised</span>
          </div>
          <div className="flex w-1/4 flex-col justify-center items-center gap-3 px-4 py-4">
            <span className="font-[700] font-Syne text-[2em] text-[#fff]">$13M</span>
            <span className="font-[400] font-Poppins text-[0.9em] text-[#a49999]">Total Liquidity Raised</span>
          </div>
          <div className="flex w-1/4 flex-col justify-center items-center gap-3 px-4 py-4">
            <span className="font-[700] font-Syne text-[2em] text-[#fff]">$13M</span>
            <span className="font-[400] font-Poppins text-[0.9em] text-[#a49999]">Total Liquidity Raised</span>
          </div>
          <div className="flex w-1/4 flex-col justify-center items-center gap-3 px-4 py-4">
            <span className="font-[700] font-Syne text-[2em] text-[#fff]">$13M</span>
            <span className="font-[400] font-Poppins text-[0.9em] text-[#a49999]">Total Liquidity Raised</span>
          </div>
        </section>
        <section className="flex flex-col w-full justify-center items-center gap-16 p-2 lg:p-5">
          <div className="flex flex-col lg:flex-row justify-evenly items-center gap-12 w-full">
            <div className="flex flex-col justify-start items-center gap-4 w-full lg:w-auto">
              <span className="font-Syne text-[2.5em] lg:text-[4em] capitalize font-[700] text-[#a6b2ec] lg:max-w-[38rem]">
                Fully decentralized. completely secure
              </span>
              <p className="text-[#a49999] font-Poppins text-[1em] lg:max-w-[38rem]">
                Vefi aims to connect all isolated blockchains and establish a cross-chain assets exchange, providing underlying support for the
                ecosystem. Experience lightning-fast transactions, unparalleled security, and complete ownership of your assets.
              </p>
            </div>
            <div className="max-h-[26rem] max-w-[28rem] lg:h-full">
              <img src="/images/blocks.svg" alt="blocks" className="w-[inherit] h-[inherit]" />
            </div>
          </div>
          <div className="flex flex-col justify-center items-center w-full gap-3">
            <div className="flex justify-evenly items-center gap-2 w-full flex-col lg:flex-row px-2 lg:px-10">
              <div className="flex justify-start items-center w-full lg:w-1/3 gap-2 px-3 py-3 self-stretch bg-[#fff]/[.06] order-[0] rounded-[10px]">
                <FiCheckCircle className="text-[green]" />
                <span className="font-[500] font-Syne text-[0.95em] text-[#fff]">Instant Trades</span>
              </div>
              <div className="flex justify-start items-center w-full lg:w-1/3 gap-2 px-3 py-3 self-stretch bg-[#fff]/[.06] order-[0] rounded-[10px]">
                <FiCheckCircle className="text-[green]" />
                <span className="font-[500] font-Syne text-[0.95em] text-[#fff]">Secure Smart Contracts</span>
              </div>
            </div>
            <div className="flex justify-evenly items-center gap-2 w-full flex-col lg:flex-row px-2 lg:px-10">
              <div className="flex justify-start items-center w-full lg:w-1/3 gap-2 px-3 py-3 self-stretch bg-[#fff]/[.06] order-[0] rounded-[10px]">
                <FiCheckCircle className="text-[green]" />
                <span className="font-[500] font-Syne text-[0.95em] text-[#fff]">Community-Driven</span>
              </div>
              <div className="flex justify-start items-center w-full lg:w-1/3 gap-2 px-3 py-3 self-stretch bg-[#fff]/[.06] order-[0] rounded-[10px]">
                <FiCheckCircle className="text-[green]" />
                <span className="font-[500] font-Syne text-[0.95em] text-[#fff]">Accurate Analytics</span>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full flex flex-col justify-center items-center gap-6">
          <span className="text-white font-Syne capitalize text-[2.5em] lg:text-[3.5em] text-center lg:max-w-[70rem] font-[700]">
            Many-In-One DApp
          </span>
          <p className="text-[#a49999] font-Poppins text-[1em] text-center">
            Decentralized Trade. Token Launch. Multi-Signatory Wallets. Staking Pools. Bridge
          </p>
          <div className="flex flex-col w-full justify-center items-center gap-6 px-2 lg:px-10">
            <div className="flex flex-col lg:flex-row w-full justify-center items-center gap-3">
              <Link href="/analytics">
                <a className="w-full lg:w-1/3 h-auto lg:h-full">
                  <div className="bg-[#392200] w-full h-full rounded-[20px] flex flex-col justify-center items-center gap-6 px-7 py-4">
                    <span className="text-white font-Syne capitalize text-[1.5em] text-center lg:max-w-[70rem] font-[700]">Analytics</span>
                    <p className="text-[#fff] font-Poppins text-[1em] text-center">
                      In-depth periodical market data and token information (with charts) gotten from all trades that have occured on our DEX.
                    </p>
                    <img src="/images/charts.png" alt="chart" className="w-full max-h-[18rem]" />
                  </div>
                </a>
              </Link>
              <Link href="/dex">
                <a className="w-full lg:w-1/3">
                  <div className="bg-[#00391e] w-full rounded-[20px] flex flex-col justify-center items-center gap-6 px-7 py-4">
                    <span className="text-white font-Syne capitalize text-[1.5em] text-center lg:max-w-[70rem] font-[700]">Trade</span>
                    <p className="text-[#fff] font-Poppins text-[1em] text-center">
                      Exchange assets or earn LP tokens through liquidity provision on our DEX.
                    </p>
                    <img src="/images/trade.png" alt="trade" className="w-full max-h-[18rem]" />
                  </div>
                </a>
              </Link>
              <Link href="/launchpad">
                <a className="w-full lg:w-1/3">
                  <div className="bg-[#380039] w-full rounded-[20px] flex flex-col justify-center items-center gap-6 px-7 py-4">
                    <span className="text-white font-Syne capitalize text-[1.5em] text-center lg:max-w-[70rem] font-[700]">Launchpad</span>
                    <p className="text-[#fff] font-Poppins text-[1em] text-center">
                      Raise funds for and kickstart your project with a [pre/private]-sale launch through our easy-to-use launchpad.
                    </p>
                    <img src="/images/coins.png" alt="coins" className="w-full max-h-[18rem]" />
                  </div>
                </a>
              </Link>
            </div>
            <div className="flex flex-col lg:flex-row w-full justify-center items-center gap-3">
              <Link href="/staking">
                <a className="w-full lg:w-1/3 h-auto lg:h-full">
                  <div className="bg-[#105dcf] w-full h-full rounded-[20px] flex flex-col justify-center items-center gap-6 px-7 py-4">
                    <span className="text-white font-Syne capitalize text-[1.5em] text-center lg:max-w-[70rem] font-[700]">Staking Pools</span>
                    <p className="text-[#fff] font-Poppins text-[1em] text-center">
                      Stake tokens to earn other tokens as rewards. Maximize profit with this scheme.
                    </p>
                    <img src="/images/piggyvest.png" alt="piggyvest" className="w-full max-h-[18rem]" />
                  </div>
                </a>
              </Link>
              <Link href="/multisig">
                <a className="w-full lg:w-1/3">
                  <div className="bg-[#0b0039] w-full rounded-[20px] flex flex-col justify-center items-center gap-6 px-7 py-4">
                    <span className="text-white font-Syne capitalize text-[1.5em] text-center lg:max-w-[70rem] font-[700]">Multisignature</span>
                    <p className="text-[#fff] font-Poppins text-[1em] text-center">
                      Wallets with more than one custodian. Ideal for firms that control blockchain assets.
                    </p>
                    <img src="/images/scroll.png" alt="scroll" className="w-full max-h-[18rem]" />
                  </div>
                </a>
              </Link>
              <Link href="/bridge">
                <a className="w-full lg:w-1/3">
                  <div className="bg-[#39000e] w-full rounded-[20px] flex flex-col justify-center items-center gap-6 px-7 py-4">
                    <span className="text-white font-Syne capitalize text-[1.5em] text-center lg:max-w-[70rem] font-[700]">Bridge</span>
                    <p className="text-[#fff] font-Poppins text-[1em] text-center">
                      Move assets across chains without much hassle and the alteration of value.
                    </p>
                    <img src="/images/bridge.png" alt="bridge" className="w-full max-h-[18rem]" />
                  </div>
                </a>
              </Link>
            </div>
          </div>
        </section>
        <section className="w-full flex flex-col justify-center items-center gap-6">
          <span className="text-white font-Syne capitalize text-[2.5em] lg:text-[3.5em] text-center lg:max-w-[70rem] font-[700]">
            Supported Chains
          </span>
          <div className="flex justify-center items-center w-full px-1">
            <div className="carousel carousel-center p-4 space-x-6 rounded-box">
              {map(Object.values(chains), (chain, index) => (
                <div key={index} className="carousel-item flex justify-center gap-2 text-white text-[1em] items-center font-Poppins w-auto">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src={chain.logoURI} alt={chain.name} />
                    </div>
                  </div>
                  <span>{chain.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

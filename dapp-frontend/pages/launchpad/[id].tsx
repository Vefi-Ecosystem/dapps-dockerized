import Head from 'next/head';
import { useState } from 'react';
import Image from 'next/image';
import { FiExternalLink, FiSend } from 'react-icons/fi';
import LaunchpadCardInfo from '../../ui/Launchpad/LaunchpadCardInfo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SalesEnd } from '../../ui/Countdown/SalesEnd';
import { useGetIDOTokenInfo } from '../../hooks/launchpad';
import { ProgressBar } from '../../ui/Progress';
import { TailSpin } from 'react-loader-spinner';
import { RiErrorWarningLine } from 'react-icons/ri'

function Loading() {
  return (
    <div className='flex w-full h-full items-center justify-center '>
      <TailSpin color='#fff' height={80} width={80} />
    </div>
  )
}


export default function Index() {
  const [buyAmount, setAmount] = useState();
  const { query } = useRouter();
  const { idoInfo: IDO, isLoading } = useGetIDOTokenInfo(query.id as string);

  function handlePurchase(e: any) {
    e.preventDefault();

  }

  function amountInDollar(price: number, tokenAmount: number) {
    const dollarAmount = price * tokenAmount;
    const roundedAmount = dollarAmount.toFixed(2);
    // Return the dollar amount as a string
    return roundedAmount.toString();
  }

  function RenderComponent() {
    if (isLoading) {
      return <Loading />
    }

    if (!IDO) {
      return (
        <div className='flex items-center justify-center w-full h-full mt-20 flex-col'>
          <RiErrorWarningLine className='text-9xl text-[#FFD549]' />
          <p className='text-4xl'>Uhhh We couldn't find this Project 🤔</p>
        </div>
      )
    }

    return (
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row w-full py-10">
          <div className="w-full px-5 md:w-2/3 pb-5 md:pb-0">
            <div className="flex gap-5 items-start flex-col md:flex-row">
              <Image src="/images/booksclubtoken.png" alt="image" width={80} height={80} />
              <div>
                <h2 className="text-white font-Syne font-[700] text-[20px] md:text-[45px] md:max-w-[550px] leading-[1.2]">
                  Freight Coin Binance Smart Chain.
                </h2>
                <p className=" md:max-w-lg py-2 md:py-4 text-[rgba(255,255,255,0.8)] font-Poppins font-400 text-[10px] md:text-[12px]">
                  Freight Coin 🔥 Devil dust is going to be the biggest support token for one of the greatest tokens to launch on BSC. Go from a
                  fallen angel to an angel by holding Devil Dust😈 Devil Dust holders will be rewarded in Angel Dust tokens. 🔥 Low MC 🔥 Safu Team 🔥
                  Competitions after launch 🔥 Marketing campaign planned & ready to roll. 10/10 taxes 4% to Angeldust ( rewards) 😇 4% to demons
                  (marketing) 👹 2% to HELL (Liquidity)🔥
                </p>
              </div>
            </div>
            <div className="flex w-full justify-start">
              <div className="w-full rounded-[10px] bg-[rgba(63,132,234,0.2)] md:w-2/3 h-fit md:ml-[100px] py-8 px-5 text-white border-[rgba(255,255,255,0.7)] border mt-5">
                <LaunchpadCardInfo label="Presale Address" value="0x695182EDd7064...." color="#FFD549" icon />
                <div className="flex w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <span className="flex items-center gap-2">
                      <Link href="/">Whitepaper</Link>
                      <FiExternalLink />
                    </span>
                    <span className="flex items-center gap-2">
                      <Link href="/">Social</Link>
                      <FiExternalLink />
                    </span>
                    <span className="flex items-center gap-2">
                      <Link href="/">Community</Link>
                      <FiExternalLink />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2  justify-start">
            <div className="flex flex-col w-[93%] mx-auto md:mx-0 md:w-[400px] h-fit">
              <div className="rounded-[10px] bg-[rgba(63,132,234,0.2)]  h-fit  text-white border-[rgba(255,255,255,0.7)] border mt-5 w-full px-4 py-7">
                <SalesEnd />
                <div className="flex w-full">
                  <div className="flex flex-col w-full py-4">
                    <ProgressBar progress={40} />
                    <div className="flex justify-between items-center text-[rgba(63,132,234,1)] font-Poppins font-[700] text-[10px]">
                      <span className="pt-1">23.365096308565307375 $SAP</span>
                      <span>40$SAP</span>
                    </div>
                  </div>
                </div>
                <div className="flex w-full flex-col">
                  <span className="font-Kinn">Buy</span>
                  <form className="flex w-full gap-2 pt-1" onSubmit={handlePurchase}>
                    <input
                      type="number"
                      name="buyAmount"
                      id="buyAmount"
                      value={buyAmount}
                      min={IDO?.softCap ? IDO.softCap : 0}
                      max={IDO?.hardCap ? IDO.hardCap : 0}
                      onChange={(e: any) => setAmount(e.target.value)}
                      className="w-full bg-[rgba(255,251,251,0.08)] h-5 border-[rgba(255,255,255,0.3)] outline-none p-5 border rounded"
                    />
                    <button className="text-sm capitalize cursor-pointer bg-black px-3 rounded-md font-Kinn font-[400]">Buy</button>
                  </form>
                </div>
              </div>
            </div>
            <div className="flex w-full justify-start">
              <div className="rounded-[10px] bg-[rgba(63,132,234,0.2)] w-[93%] mx-auto md:mx-0 md:w-[400px] h-fit py-8 px-5 text-white border-[rgba(255,255,255,0.7)] border mt-5">
                <LaunchpadCardInfo label="Status" value="in progress" color="#FFD549" icon="" />
              </div>
            </div>
            <div className="flex py-2">
              <button className="btn bg-black text-white capitalize w-[93%] mx-auto md:mx-0 md:w-[399px] flex items-center gap-2 font-Kinn">
                Discuss in community <FiSend />
              </button>
            </div>
            <div className="flex py-2 flex-col w-[93%] mx-auto md:mx-0 md:w-[400px]">
              <h2 className="font-Kinn text-white">Remind me about this project</h2>
              <input
                type="number"
                name=""
                id=""
                placeholder="Input E-mail"
                className="w-full bg-[rgba(255,251,251,0.08)] h-5 border-[rgba(255,255,255,0.3)] outline-none p-5 border rounded mb-2"
              />
              <button className="justify-start w-fit bg-[#105DCF] rounded-[4px] text-white font-Kinn py-3 px-5 text-sm">Remind me</button>
            </div>
          </div>
        </div>
      </div>
    )

  }

  return (
    <>
      <Head>
        <title>Vefi DApps | Info Page</title>
      </Head>
      <RenderComponent />
    </>
  );
}

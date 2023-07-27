import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
// import LaunchPadCard from '../../ui/Launchpad/LaunchpadCard';
import CountDown from '../../ui/Countdown';
// import { isAfter } from 'date-fns';
import Link from 'next/link';

export default function Launchpad() {
  const launchDate = "2023-07-31T14:00:00"

  // function Project(){
  //   return (
  //     <>
  //       <div className="grid grid0cols-1 md:grid-cols-3 gap-3">
  //         <LaunchPadCard />
  //         <LaunchPadCard />
  //         <LaunchPadCard />
  //       </div>
  //       <button type="button" className="btn my-5 normal-case font-Syne bg-[#105DCF] text-white rounded-[15px] text-[12px] px-5 border-none">
  //         View more
  //       </button>
  //     </>
  //   )
  // }

  // function Render(){
  //   const today = new Date();
  //   const dateForm = new Date(launchDate);

  //   if(isAfter(today,dateForm)){
  //     return <Project />
  //   }

  //   return (

  //   )
  // }


  return (
    <>
      <Head>
        <title>Vefi Dapps | Launchpad</title>
      </Head>
      <div className="container mx-auto p-3">
        <section className="flex items-center h-[80vh] w-full relative">
          <div className="flex flex-col max-w-[550px] p-3">
            <div className="mb-5">
              <h1 className="font-Syne text-[48px] text-white font-[700] leading-[58px]">Launch a successful IDO with ease-all in one place.</h1>
            </div>
            <Link href="/launchpad/deploy">
              <div>
                <button type="button" className="btn my-5 normal-case font-Syne bg-[#105DCF] text-white rounded-[15px] text-[12px] px-5 border-none">
                  Deploy IDO
                </button>
              </div>
            </Link>
          </div>
        </section>
        <section className="flex flex-col w-full container h-fit mx-auto pb-14">
          <h1 className="text-white font-Kinn font-[700] leading-[27px] pb-10 text-[24px]">What we offer</h1>
          <div className="grid sm:grid-cols-3 grid-rows-3 gap-5">
            <div className="flex flex-col text-center justify-center rounded-[10px] shadow p-8 bg-lightBlue min-h-[200px] ">
              <h1 className="font-Kinn font-[700] text-[16px] leading-[16px] text-white">Secure Assets</h1>
              <p className="py-5 text-[#D8D8D8] font-Poppins text-[12px]">
                Protect your investments with our secure IDO launchpad platform for hassle-free asset management.
              </p>
              <div className="flex text-center justify-center">
                <Image src="/images/secure_assets.png" width={150} height={150} alt="secure assets" className=" object-contain" />
              </div>
            </div>
            <div className="flex flex-col text-center justify-center rounded-[10px] shadow p-8 bg-lightBlue min-h-[200px] ">
              <h1 className="font-Kinn font-[700] text-[16px] leading-[16px] text-white">Free IDO marketing</h1>
              <p className="py-5 text-[#D8D8D8] font-Poppins text-[12px]">
                With a robust presence of over 200k members across various social media platforms, we can confidently amplify your reach.
              </p>
              <div className="flex text-center justify-center">
                <Image src="/images/ido_marketing.png" width={150} height={150} alt="Free IDO marketing" className=" object-contain" />
              </div>
            </div>
            <div className="flex flex-col text-center justify-center rounded-[10px] shadow p-8 bg-lightBlue min-h-[200px] ">
              <h1 className="font-Kinn font-[700] text-[16px] leading-[16px] text-white">Advice and support</h1>
              <p className="py-5 text-[#D8D8D8] font-Poppins text-[12px]">
                We provide industry-tested guidance to projects in maximizing the benefits of their IDO, and achieving project success.
              </p>
              <div className="flex text-center justify-center">
                <Image src="/images/advice_n_support.png" width={150} height={150} alt="Advice and support" className=" object-contain" />
              </div>
            </div>
          </div>
        </section>
        <section className="flex flex-col h-fit my-10 ">
          <div className="container mx-auto text-center">
            <h1 className="max-w-[450px] text-white font-Syne font-[700] text-[32px] py-8 mx-auto">Explore live IDO projects on our launchpad</h1>
            <CountDown date={launchDate} />
          </div>
        </section>
      </div>
    </>
  );
}

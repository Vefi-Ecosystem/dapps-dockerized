import Head from 'next/head';
import React from 'react';
import LaunchPadCard from '../../../ui/Launchpad/LaunchpadCard';

export default function IDO() {
  return (
    <>
      <Head>
        <title>Vefi DApps | IDO</title>
      </Head>
      <div className="container mx-auto">
        <div className="w-full">
          <div className="flex flex-col mx-auto w-[90%] md:w-full">
            <div className="py-10">
              <h2 className="text-white font-Kinn text-[30px] max-w-md md:max-w-[600px] md:text-[40px]">
                Explore live IDO projects on our launchpad.
              </h2>
            </div>
            <div className="flex w-[40%] md:w-full ">
              <div className="flex">
                <button className="btn rounded-none px-5">Live</button>
                <button className="btn rounded-none px-5">Upcoming</button>
                <button className="btn rounded-none px-5">Closed</button>
                <button className="btn rounded-none px-5">All</button>
              </div>
            </div>
            <section className="flex flex-col h-fit my-10 ">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <LaunchPadCard />
                <LaunchPadCard />
                <LaunchPadCard />
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

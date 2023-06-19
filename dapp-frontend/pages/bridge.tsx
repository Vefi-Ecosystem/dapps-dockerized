import React from 'react';
import Head from 'next/head';
import type { NextPage } from 'next';
import WidgetType from '@layerzerolabs/stargate-ui';
import dynamic from 'next/dynamic';
const Widget = dynamic<typeof WidgetType>(() => import('@layerzerolabs/stargate-ui'), {
  ssr: false,
});


const Bridge: NextPage = () => {

  return (
    <>
      <Head>
        <title>VeFi DApps | Bridge</title>
      </Head>
      <div className="container mx-auto w-[95%] md:w-2/6  py-20 ">
        <Widget
          theme="dark"
          partnerId="105"
          feeCollector="0xc13b65f7c53Cd6db2EA205a4b574b4a0858720A6"
          tenthBps="10"
        ></Widget>
      </div>
    </>
  );
}

export default Bridge;
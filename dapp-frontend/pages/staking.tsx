import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import CreateStakingPoolModal from '../components/Staking/CreateStakingPoolModal';

export default function Staking() {
  const { query, push } = useRouter();
  const [showCreatePoolModal, setShowCreatePoolModal] = useState<boolean>(false);
  return (
    <>
      <Head>
        <title>Vefi DApps | Stake</title>
      </Head>
      <div className="flex container mx-auto flex-col justify-center items-start gap-8 px-8 lg:px-10 py-4">
        <div className="flex justify-between items-center gap-2 w-full">
          <div className="flex flex-col gap-1 justify-center items-start">
            <span className="capitalize font-Syne text-[#fff] font-[700] text-[1.2em] lg:text-[1.9em]">stake & earn rewards</span>
            <span className="capitalize font-Inter text-[#aeaeae] font-[400] text-[0.4em] lg:text-[0.9em]">
              increase your financial capacity by engaging in staking programs.
            </span>
          </div>
          <button
            onClick={() => setShowCreatePoolModal(true)}
            className="capitalize font-Inter font-[500] border border-[#105dcf] text-[0.5em] lg:text-[0.85em] bg-[#105dcf] text-[#fff] rounded-[8px] lg:px-4 px-1 lg:py-2 py-1 shadow-[0_1px_2px_rgba(16,_24,_40,_0.05)]"
          >
            create new pool
          </button>
        </div>
        <CreateStakingPoolModal isOpen={showCreatePoolModal} onClose={() => setShowCreatePoolModal(false)} />
      </div>
    </>
  );
}

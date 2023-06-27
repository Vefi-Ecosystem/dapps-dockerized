import Image from 'next/image';
import React from 'react';

interface AknowledgeCardProps {
  onAgreeAndContinue: () => void;
}

export default function AknowledgeCard({ onAgreeAndContinue }: AknowledgeCardProps) {
  return (
    <>
      <div className="flex mx-auto bg-[#191919] lg:mb-72 flex-col justify-start items-center gap-8 max-w-[450px] rounded-[20px]">
        <div className="my-8">
          <div className="flex flex-col justify-center mt-4 mb-8 items-center">
            <Image src="/images/logoterms.png" width={90} height={90} alt="logo" className="object-contain" />
          </div>
          <div className="text-center whitespace-nowrap mb-8">
            <h1 className="text-2xl font-['Syne'] mb-2 font-bold capitalize text-white">Aknowledge Terms</h1>
            <p className="text-sm font-['Poppins'] text-[#9d9d9d]">
              By connecting your wallet, you agree to the <br />
              Vefi Terms of Service and acknowledge
              <br />
              that you have read and understood the
              <br />
              Vefi Disclaimer
            </p>
          </div>
          <button className="bg-[#105dcf]  flex flex-col justify-center mb-8 relative w-full h-12 shrink-0 items-center rounded-lg">
            <span onClick={onAgreeAndContinue} className="whitespace-nowrap font-['Syne'] text-white">
              Agree and Continue
            </span>
          </button>
          <button className="flex flex-col justify-center w-full h-12 shrink-0 items-center rounded-lg">
            <span className="whitespace-nowrap font-['Syne'] text-[#105dcf]">Terms and Conditions</span>
          </button>
        </div>
      </div>
    </>
  );
}

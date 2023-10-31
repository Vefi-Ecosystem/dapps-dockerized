import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { FaMedium, FaTelegram } from 'react-icons/fa';
import { FiInstagram, FiTwitter, FiYoutube, FiGlobe } from 'react-icons/fi';

export default function Footer() {
  return (
    <div className="flex flex-col w-full justify-between items-center bg-[#fff]/[.03]">
      <div className="flex flex-col container mx-auto justify-center items-center gap-4 w-full lg:px-12 px-2 py-12">
        <div className="flex flex-col lg:flex-row justify-center items-start gap-3 lg:justify-between lg:items-center w-full px-12">
          <div className="flex flex-col justify-center items-start gap-3">
            <Link href="/">
              <Image src="/images/logo/vefdefi_logo.svg" alt="vefdefi_logo" width={80} height={40} />
            </Link>
            <p className="text-[#b2b2b2] capitalize font-Syne text-[0.85em] w-full lg:w-[19rem]">
              Our collection of Decentralized Applications allow you to securely swap crypto-assets, bridge across chains, launch your tokens and earn yield via staking all while in control of your crypto-assets.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row justify-center items-start gap-5 lg:gap-16">
            <div className="flex flex-col justify-center items-start gap-3 font-Syne capitalize">
              <span className="text-[#b2b2b2] font-[400] text-[0.97em]">pages</span>
              <div className="text-[#fff] flex flex-col justify-center items-start gap-2 text-[0.82em]">
                <Link href="/dex">trade</Link>
                <Link href="/analytics">analytics</Link>
                {/* <Link href="/launchpad">launchpad</Link> */}
                <Link href="/staking">staking</Link>
                {/* <Link href="/multisig">multi-signature</Link>
                <Link href="/bridge">bridge</Link> */}
              </div>
            </div>
            <div className="flex flex-col justify-center items-start gap-3 font-Syne capitalize">
              <span className="text-[#b2b2b2] font-[400] text-[0.97em]">links & community</span>
              <div className="text-[#fff] flex flex-col justify-center items-start gap-2 text-[0.82em]">
                <a href="https://vefdefi.netlify.app" rel="noreferrer" target="_blank">
                  website
                </a>
                <a href="https://x.com/vefdefi?t=tJZF3rr5Btl_gZrWRnNB2g&s=09" rel="noreferrer" target="_blank">
                  twitter
                </a>
                <a href="https://t.me/VefDefi" rel="noreferrer" target="_blank">
                  telegram
                </a>
                <a href="https://medium.com/@VefDefi/vefi-is-re-inventing-itself-d4f5bb1f3d06" rel="noreferrer" target="_blank">
                  medium
                </a>
                <a href="#" rel="noreferrer" target="_blank">
                  youtube
                </a>
                <a href="https://instagram.com/vefi.official" rel="noreferrer" target="_blank">
                  instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-start lg:items-center w-full border-t border-[#797979] px-4 py-4 gap-3">
        <span className="font-Poppins text-[#aeaeae] text-[0.85em] capitalize">copyright &copy; 2023. all rights reserved.</span>
        <div className="flex justify-start items-center gap-2 text-[#fff]">
          <a href="https://vefdefi.netlify.app" rel="noreferrer" target="_blank">
            <button className="rounded-full px-3 py-3">
              <FiGlobe />
            </button>
          </a>
          <a href="https://x.com/vefdefi?t=tJZF3rr5Btl_gZrWRnNB2g&s=09" rel="noreferrer" target="_blank">
            <button className="rounded-full px-3 py-3">
              <FiTwitter />
            </button>
          </a>
          <a href="https://t.me/VefDefi" rel="noreferrer" target="_blank">
            <button className="rounded-full px-3 py-3">
              <FaTelegram />
            </button>
          </a>
          <a href="https://medium.com/@VefDefi/vefi-is-re-inventing-itself-d4f5bb1f3d06" rel="noreferrer" target="_blank">
            <button className="rounded-full px-3 py-3">
              <FaMedium />
            </button>
          </a>
          <a href="#" rel="noreferrer" target="_blank">
            <button className="rounded-full px-3 py-3">
              <FiYoutube />
            </button>
          </a>
          <a href="https://instagram.com/vefi.official" rel="noreferrer" target="_blank">
            <button className="rounded-full px-3 py-3">
              <FiInstagram />
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}

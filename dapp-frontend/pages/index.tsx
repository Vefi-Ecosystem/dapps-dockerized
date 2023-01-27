import Link from 'next/link';
import { MdSwapHoriz } from 'react-icons/md';

export default function Index() {
  return (
    <div className="flex flex-col justify-center items-center gap-2 w-full py-10 lg:py-20">
      <section className="flex justify-center items-center flex-col w-full px-6 lg:px-12 gap-3">
        <span className="text-white font-Syne capitalize text-[2.5em] lg:text-[3.5em] text-center">
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
    </div>
  );
}

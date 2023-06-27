import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const NotificationMenu: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setDropdownOpen(!dropdownOpen)} className="focus:outline-none">
        <Image src="/images/notif-icon.png" width={75} height={75} alt="" className="object-contain" />
      </button>

      {dropdownOpen && (
        <div className="absolute z-20 left-0 mt-2 w-48 border-solid border-[#5d5d5d] shadow-[-3px_4px_17px_0px_rgba(0,_0,_0,_0.39)] overflow-hidden bg-[#191919] flex flex-col justify-center gap-3 items-center border rounded-[30px]">
          <Link href="https://github.com" className="">
            <a className="font-['Syne'] font-medium capitalize  hover:text-[#105dcf] text-white py-3 px-4 cursor-pointer">Github</a>
          </Link>
          <Link href="https://docs.example.com">
            <a className="font-['Syne'] font-medium capitalize text-white py-3 px-4 cursor-pointer hover:text-[#105dcf]">Docs</a>
          </Link>
          <Link href="https://twitter.com">
            <a className="font-['Syne'] font-medium capitalize text-white py-3 px-4 cursor-pointer hover:text-[#105dcf]">Twitter</a>
          </Link>
          <Link href="https://discord.com">
            <a className="font-['Syne'] font-medium capitalize text-white py-3 px-4 cursor-pointer hover:text-[#105dcf]">Discord</a>
          </Link>
          <Link href="https://example.com/msv2">
            <a className="font-['Syne'] font-medium capitalize text-white py-3 px-4 cursor-pointer hover:text-[#105dcf] whitespace-nowrap">MS V2</a>
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationMenu;

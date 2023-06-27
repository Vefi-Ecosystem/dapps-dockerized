import { useState } from 'react';
import Image from 'next/image';

const SettingMenu: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative ">
      <button onClick={() => setDropdownOpen(!dropdownOpen)} className="focus:outline-none">
        <Image src="/images/toogle-opt.png" width={75} height={75} alt="" className="object-contain" />
      </button>

      {dropdownOpen && (
        <div className="absolute z-20 right-0 mt-2 w-96 bg-[#191919] border-solid border-[#5d5d5d] shadow-[-3px 4px 17px 0px rgba(0, 0, 0, 0.39)] border rounded-[30px] overflow-hidden">
          <div className="p-5">
            <h2 className="text-2xl font-['Syne'] font-medium capitalize text-white">Settings</h2>
            <hr className="border-solid border-[#5d5d5d] mt-2 mb-4" />
            <div className="space-y-2">
              <h2 className="text-white font-['Syne'] capitalize">Wallet</h2>
              <div className="bg-[#5d5d5d] rounded-lg">
                <div className="flex justify-between items-center p-2">
                  <span className="text-[#a6b2ec] text-sm font-['Poppins']">XSD875056...</span>
                  <button className="bg-[#373b4e] w-16 h-8 flex justify-center items-center rounded-lg">
                    <span className="text-white text-sm font-['Poppins']">Enable</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <h2 className="text-white font-['Syne'] capitalize">Telegram</h2>
              <div className="bg-[#5d5d5d] flex items-center rounded-lg pl-4 py-3">
                <span className="text-[#a6b2ec] text-sm font-['Poppins']">@</span>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <h2 className="text-white font-['Syne'] capitalize">Email</h2>
              <div className="bg-[#5d5d5d] flex items-center rounded-lg pl-4 py-3">
                <span className="text-[#a6b2ec] text-sm font-['Poppins']">email</span>
              </div>
            </div>
            <hr className="border-solid border-[#5d5d5d] mt-4 mb-4" />
            <div className="flex flex-col items-start pb-2 bg-[#5d5d5d] rounded-lg py-2 pl-2">
              <span className="text-white text-sm font-['Poppins'] capitalize">Welcome message</span>
              <span className="text-[#a6b2ec] text-xs font-['Poppins']">on Signup</span>
            </div>
            <div className="text-[#a6b2ec] text-xs font-['Poppins'] mt-6">
              By enabling notifications you agree to our{' '}
              <a href="/" className="text-[#a6b2ec] underline underline-offset-4">
                terms of service
              </a>{' '}
              and{' '}
              <a href="/" className="text-[#a6b2ec] underline underline-offset-4">
                privacy policy
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingMenu;

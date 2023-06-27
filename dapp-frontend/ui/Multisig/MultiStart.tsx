import Image from 'next/image';
import React from 'react';
import NotificationMenu from './DropdownMenus/NotificationMenu';
import SettingMenu from './DropdownMenus/SettingMenu';

export default function MultiStart() {
  return (
    <>
      <div className="lg:px-12">
        <div className="flex justify-between items-center mb-2">
          <h1 className="whitespace-nowrap text-base md:text-4xl font-['Syne'] font-bold capitalize text-white">Your Multi Sig</h1>
          <div className="flex gap-1 md:gap-3">
            <SettingMenu />
            <NotificationMenu />
            <button className="bg-[#105dcf] flex flex-row justify-center gap-2 w-full h-10 items-center rounded-lg">
              <Image src="/images/plus-white.png" width={15} height={15} alt="plus" className="object-contain" />
              <span className="font-['Syne'] font-medium capitalize text-white">Create</span>
            </button>
          </div>
        </div>
        <div className="flex mx-auto bg-[#191919] lg:mb-72 flex-col justify-start items-center gap-8 rounded-[20px]">
          <div className="my-20">
            <div className="flex flex-col justify-center mb-8 items-center">
              <Image src="/images/logoterms.png" width={90} height={90} alt="logo" className="object-contain" />
            </div>
            <div className="text-center whitespace-nowrap mb-8">
              <h1 className="text-2xl font-['Syne'] mb-2 font-bold capitalize text-white">
                You don’t have any
                <br />
                joint wallets yet
              </h1>
              <p className="text-sm font-['Poppins'] text-[#9d9d9d]">
                Click on “Create” to set one up with
                <br />a few clicks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

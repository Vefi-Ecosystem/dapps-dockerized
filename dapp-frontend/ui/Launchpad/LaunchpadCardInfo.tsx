import React from 'react';
import { FiCopy } from 'react-icons/fi';

interface ILaunchpadCardInfo {
  label: string;
  value: any;
  color: string | undefined | null;
  icon: any | undefined | null;
}
export default function LaunchpadCardInfo({ label, value, color, icon }: ILaunchpadCardInfo) {
  return (
    <>
      <div className="flex justify-between items-center pb-2">
        <span className="text-white font-Kinn text-[16px] font-[700]">{label}</span>
        <span className={`flex items-center gap-3 text-[${color && color}]`}>
          <h3>{value}</h3>
          {icon && <FiCopy />}
        </span>
      </div>
    </>
  );
}

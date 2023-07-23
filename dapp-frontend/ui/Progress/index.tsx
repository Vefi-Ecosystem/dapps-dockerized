import { useState } from 'react';

type ProgressProps = {
    progress: number;
}

export function ProgressBar({ progress }: ProgressProps) {
    return (
        <>
            <span className="pb-2 font-Kinn text-white">Progress({progress}%)</span>
            <span className="flex items-center w-full bg-[#909090] rounded">
                <span className={`w-[${progress}%] bg-white rounded h-2`}></span>
            </span>
        </>
    )
}
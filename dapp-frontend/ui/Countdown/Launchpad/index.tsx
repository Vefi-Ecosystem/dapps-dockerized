import { useState, useEffect } from 'react';
import {
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    differenceInSeconds,
} from 'date-fns';

export function LaunchPadTimer({ endDate }: any) {
    const [timeLeft, setTimeLeft] = useState<any>({});

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const targetDate = new Date(endDate ? endDate : "2023-10-28");
            const days = differenceInDays(targetDate, now);
            const hours = differenceInHours(targetDate, now) % 24;
            const minutes = differenceInMinutes(targetDate, now) % 60;
            const seconds = differenceInSeconds(targetDate, now) % 60;
            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <span>
            <p className="text-[#9A999C] font-Poppins font-[700] text-[12px] leading-[5px]">Sale end in:</p>
            <h1 className="font-Syne text-white text-[16px] font-[700]">{timeLeft.days || "0"}:{timeLeft.hours || "0"}:{timeLeft.minutes || "0"}:{timeLeft.seconds || "0"}</h1>
        </span>
    )
}
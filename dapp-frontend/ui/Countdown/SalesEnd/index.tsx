import { useState, useEffect } from 'react';
import {
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    differenceInSeconds,
} from 'date-fns';


export function SalesEnd({ endDate }: any) {
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
        <div className="flex justify-between gap-2">
            <div className="text-white">
                <span className="text-[rgba(63,132,234,1)] font-Poppins font-[700] text-[10px]">Sale end in</span>
                <div className="flex font-Kinn gap-1 text-[24px]">
                    <div className="border-b-2">{timeLeft.days || "0"}</div>
                    <div>:</div>
                    <div className="border-b-2">{timeLeft.hours || "0"}</div>
                    <div>:</div>
                    <div className="border-b-2">{timeLeft.minutes || "0"}</div>
                    <div>:</div>
                    <div className="border-b-2">{timeLeft.seconds || "0"}</div>
                </div>
            </div>
            <span>Live</span>
        </div>
    )
}
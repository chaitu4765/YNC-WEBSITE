import React, { useState, useEffect } from 'react';

export const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const addLeadingZero = (num) => String(num).padStart(2, '0');

  const timeItems = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.minutes },
    { label: 'Secs', value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-3 md:gap-4 justify-center items-center">
      {timeItems.map((item, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="w-16 h-16 md:w-20 md:h-20 glass-card rounded-2xl flex items-center justify-center border border-white/20 dark:border-white/5 shadow-lg backdrop-blur-md">
            <span className="text-xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-light via-secondary-light to-accent-light">
              {addLeadingZero(item.value ?? 0)}
            </span>
          </div>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mt-2">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

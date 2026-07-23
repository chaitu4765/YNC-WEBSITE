import React, { useState, useEffect } from 'react';

const parseTargetDate = (dateInput) => {
  if (!dateInput) return new Date();
  if (dateInput instanceof Date) return dateInput;

  // 1. Try native parsing
  let dateObj = new Date(dateInput);
  if (!isNaN(dateObj.getTime())) {
    return dateObj;
  }

  // 2. Try replacing dashes with slashes (Safari compatibility)
  try {
    const cleanInput = String(dateInput).replace(/-/g, '/').replace('T', ' ');
    dateObj = new Date(cleanInput);
    if (!isNaN(dateObj.getTime())) {
      return dateObj;
    }
  } catch (e) {}

  // 3. Strict manual fallback split
  try {
    const parts = String(dateInput).split(/[T ]/);
    const datePart = parts[0];
    const timePart = parts[1] || "00:00:00";

    const dateSubparts = datePart.split('/');
    const timeSubparts = timePart.split(':');

    if (dateSubparts.length >= 3) {
      const year = parseInt(dateSubparts[0], 10);
      const month = parseInt(dateSubparts[1], 10) - 1; // 0-indexed
      const day = parseInt(dateSubparts[2], 10);
      
      const hour = timeSubparts.length >= 1 ? parseInt(timeSubparts[0], 10) : 0;
      const minute = timeSubparts.length >= 2 ? parseInt(timeSubparts[1], 10) : 0;
      const second = timeSubparts.length >= 3 ? parseInt(timeSubparts[2], 10) : 0;

      const parsedDate = new Date(year, month, day, hour, minute, second);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
  } catch (err) {}

  return new Date(); // Fallback to current time
};

export const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +parseTargetDate(targetDate) - +new Date();
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
            <span className="text-xl md:text-3xl font-extrabold text-white">
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

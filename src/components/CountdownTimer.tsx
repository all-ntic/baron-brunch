import React, { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2025-09-28T14:00:00Z'); // 28 September 2025, 14h GMT

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-4 justify-center animate-fade-in">
      <div className="countdown-box animate-float">
        <div className="text-3xl font-bold">{timeLeft.days}</div>
        <div className="text-sm uppercase tracking-wider">Jours</div>
      </div>
      <div className="countdown-box animate-float" style={{ animationDelay: '0.2s' }}>
        <div className="text-3xl font-bold">{timeLeft.hours}</div>
        <div className="text-sm uppercase tracking-wider">Heures</div>
      </div>
      <div className="countdown-box animate-float" style={{ animationDelay: '0.4s' }}>
        <div className="text-3xl font-bold">{timeLeft.minutes}</div>
        <div className="text-sm uppercase tracking-wider">Min</div>
      </div>
      <div className="countdown-box animate-float" style={{ animationDelay: '0.6s' }}>
        <div className="text-3xl font-bold">{timeLeft.seconds}</div>
        <div className="text-sm uppercase tracking-wider">Sec</div>
      </div>
    </div>
  );
};

export default CountdownTimer;
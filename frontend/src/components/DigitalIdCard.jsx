import React, { useState } from 'react';
import { Shield, Sparkles, User as UserIcon } from 'lucide-react';

export const DigitalIdCard = ({ user, onClick }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // cursor x within card
    const y = e.clientY - rect.top; // cursor y within card

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (-12deg to 12deg)
    const rotateX = -((y - centerY) / centerY) * 12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const formattedJoinDate = user?.join_date
    ? new Date(user.join_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    : 'July 18, 2026';

  const isPremium = user?.membership_tier === 'premium';

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* 3D Wrapper */}
      <div
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.02 : 1})`,
          transition: isHovered ? 'none' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
        className={`w-full max-w-sm h-80 rounded-2xl relative cursor-pointer overflow-hidden p-6 border shadow-xl flex flex-col justify-between group class-card-container animate-float ${isPremium
            ? 'bg-gradient-to-br from-amber-900/40 via-amber-950/60 to-slate-950 border-amber-400/40 shadow-lg'
            : 'glass-card border-slate-200/80 dark:border-white/10'
          }`}
      >
        {/* Card Header */}
        <div className="flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt="YNC Logo"
              className="w-8 h-8 object-contain rounded-full shadow-sm"
            />
            <div>
              <h4 className="text-sm font-bold tracking-widest text-slate-800 dark:text-white leading-none">YNC</h4>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wider">NETWORKING</span>
            </div>
          </div>
          {isPremium ? (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black tracking-wider uppercase bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md">
              👑 PREMIUM VIP
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {user?.membership_status || 'Active'}
            </div>
          )}
        </div>

        {/* Card Middle Info */}
        <div className="flex items-center gap-4 my-auto z-10">
          {/* Profile Picture Frame */}
          <div className="relative">
            <div className={`absolute -inset-0.5 rounded-full blur-xs group-hover:opacity-100 transition-opacity ${isPremium ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 opacity-90' : 'bg-gradient-to-r from-primary via-secondary to-accent opacity-70'
              }`} />
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-darkbg flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-800 relative z-10 shadow-inner">
              {user?.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt={user.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-9 h-9 text-slate-400 dark:text-slate-500" />
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-extrabold tracking-tight text-slate-800 dark:text-white truncate flex items-center gap-1 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
              {user?.full_name || 'Chaitanya Kumar'}
              {isPremium && <span className="text-amber-400 font-normal">👑</span>}
              {user?.role === 'admin' && <Shield className="w-4 h-4 text-secondary-light inline" />}
            </h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
              ID: <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">{user?.member_id || 'YCN-2026-1234'}</span>
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium truncate">{user?.email || 'user@ycn.com'}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{user?.phone_number || '+91 89199 54925 '}</p>
          </div>
        </div>

        {/* Card Footer: Join Date & Simulated Barcode */}
        <div className="flex justify-between items-end border-t border-slate-200/50 dark:border-slate-800/40 pt-4 z-10">
          <div>
            <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 block leading-none">Joined Since</span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1 block">{formattedJoinDate}</span>
          </div>
          {/* Holographic Barcode */}
          <div className="flex flex-col items-end opacity-75 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-[1.5px] items-center h-7 bg-white/40 dark:bg-white/5 px-2 py-1 rounded-sm border border-slate-200/20">
              <div className="w-[1.5px] h-full bg-slate-800 dark:bg-slate-300" />
              <div className="w-[3px] h-full bg-slate-800 dark:bg-slate-300" />
              <div className="w-[1.5px] h-full bg-slate-800 dark:bg-slate-300" />
              <div className="w-[1.5px] h-full bg-slate-800 dark:bg-slate-300" />
              <div className="w-[2.5px] h-full bg-slate-800 dark:bg-slate-300" />
              <div className="w-[1.5px] h-full bg-slate-800 dark:bg-slate-300" />
              <div className="w-[3.5px] h-full bg-slate-800 dark:bg-slate-300" />
              <div className="w-[1.5px] h-full bg-slate-800 dark:bg-slate-300" />
              <div className="w-[2px] h-full bg-slate-800 dark:bg-slate-300" />
            </div>
            <span className="text-[7px] font-mono tracking-widest text-slate-400 dark:text-slate-500 mt-1 uppercase">MEMBER</span>
          </div>
        </div>

        {/* Shine sweeping layer */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent -translate-x-full group-hover:animate-gradient-x pointer-events-none" />
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 flex items-center gap-1">
        <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" />
        Hover to tilt 3D card. Click to view profile timeline.
      </p>
    </div>
  );
};

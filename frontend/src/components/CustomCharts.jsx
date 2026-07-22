import React from 'react';

// Sleek Vertical Bar Chart for Monthly Registrations
export const MonthlyRegistrationsChart = ({ data = {} }) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const values = months.map(m => data[m] || 0);
  const maxValue = Math.max(...values, 5); // default floor to prevent division by 0

  return (
    <div className="glass-card p-6 rounded-2xl border border-white/20 dark:border-white/5 flex flex-col justify-between h-80">
      <div>
        <h3 className="text-sm font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Monthly Registrations</h3>
        <p className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">Growth Index</p>
      </div>

      <div className="flex items-end justify-between gap-2 h-44 mt-4 px-2">
        {months.map((month, idx) => {
          const val = values[idx];
          const heightPercent = (val / maxValue) * 100;
          return (
            <div key={month} className="flex-1 flex flex-col items-center group relative">
              {/* Tooltip */}
              <div className="absolute -top-8 bg-slate-800 dark:bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                {val} users
              </div>
              
              {/* Column Bar */}
              <div className="w-full bg-slate-100 dark:bg-darkbg rounded-lg h-full flex items-end overflow-hidden">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full bg-gradient-to-t from-primary via-secondary to-accent rounded-lg transition-all duration-1000 ease-out group-hover:brightness-110 shadow-sm"
                />
              </div>
              
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2">
                {month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Sleek Horizontal Bar Chart for Domain Recruitment Applications
export const DomainRecruitmentChart = ({ data = {} }) => {
  const domains = Object.keys(data);
  const values = Object.values(data);
  const maxValue = Math.max(...values, 1);

  return (
    <div className="glass-card p-6 rounded-2xl border border-white/20 dark:border-white/5 flex flex-col justify-between h-auto min-h-[320px]">
      <div>
        <h3 className="text-sm font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Recruitment Domains</h3>
        <p className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">Applications by Field</p>
      </div>

      <div className="flex flex-col gap-4 mt-6">
        {domains.map(domain => {
          const count = data[domain] || 0;
          const percentage = (count / maxValue) * 100;
          return (
            <div key={domain} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">{domain}</span>
                <span className="font-mono font-extrabold text-primary dark:text-primary-light bg-primary/10 px-2 py-0.5 rounded-full text-[10px]">
                  {count}
                </span>
              </div>
              {/* Progress Bar Container */}
              <div className="w-full h-3 bg-slate-100 dark:bg-darkbg rounded-full overflow-hidden border border-slate-200/20 dark:border-slate-800/40">
                <div
                  style={{ width: `${percentage}%` }}
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out shadow-inner"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Side-by-Side Event Participation statistics card
export const EventParticipationGrid = ({ eventsData = [] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {eventsData.map((ev, index) => {
        const regRatio = Math.min((ev.registrations_count / ev.capacity) * 100, 100);
        const attRatio = ev.registrations_count > 0 
          ? (ev.attendance_count / ev.registrations_count) * 100 
          : 0;

        return (
          <div key={index} className="glass-card p-6 rounded-2xl border border-white/20 dark:border-white/5 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent blur-xl group-hover:scale-125 transition-transform" />
            
            <h4 className="text-lg font-bold text-slate-800 dark:text-white truncate">{ev.event_name}</h4>
            
            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="bg-slate-50 dark:bg-darkbg p-2 rounded-xl border border-slate-200/10">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Registrations</span>
                <span className="text-lg font-extrabold text-primary dark:text-primary-light mt-1 block">
                  {ev.registrations_count}
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-darkbg p-2 rounded-xl border border-slate-200/10">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Capacity</span>
                <span className="text-lg font-extrabold text-slate-700 dark:text-slate-300 mt-1 block">
                  {ev.capacity}
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-darkbg p-2 rounded-xl border border-slate-200/10">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Attended</span>
                <span className="text-lg font-extrabold text-emerald-500 mt-1 block">
                  {ev.attendance_count}
                </span>
              </div>
            </div>

            {/* Metrics Bars */}
            <div className="mt-6 flex flex-col gap-3">
              {/* Capacity Filled */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                  <span>Slot Booking</span>
                  <span>{Math.round(regRatio)}% Full</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-darkbg rounded-full overflow-hidden">
                  <div
                    style={{ width: `${regRatio}%` }}
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  />
                </div>
              </div>

              {/* Attendance Ratio */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                  <span>Show-up Rate</span>
                  <span>{Math.round(attRatio)}% Attended</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-darkbg rounded-full overflow-hidden">
                  <div
                    style={{ width: `${attRatio}%` }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

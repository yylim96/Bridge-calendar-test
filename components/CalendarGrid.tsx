import React, { useState, useMemo } from 'react';
import { CalendarEvent, UserProfile, CalendarViewType } from '../types';
import EventCard from './EventCard';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarGridProps {
  events: CalendarEvent[];
  onToggleShare: (id: string) => void;
  members: UserProfile[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  viewType: CalendarViewType;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ 
  events, 
  onToggleShare, 
  members, 
  currentDate, 
  viewType 
}) => {
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const today = useMemo(() => new Date(2026, 0, 10), []);

  // Pre-index events by date string for O(1) lookup during grid render
  const eventMap = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach(e => {
      const key = new Date(e.start_time).toDateString();
      if (!map[key]) map[key] = [];
      map[key].push(e);
    });
    return map;
  }, [events]);

  const weekDays = useMemo(() => {
    const start = new Date(currentDate);
    start.setDate(currentDate.getDate() - currentDate.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [currentDate]);

  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const first = new Date(year, month, 1);
    const firstDayIdx = first.getDay();
    const days = [];
    
    // Padding from prev month
    for (let i = 0; i < firstDayIdx; i++) {
      days.push({ date: new Date(year, month, 1 - (firstDayIdx - i)), isCurrent: false });
    }
    // Current month
    const totalDays = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= totalDays; i++) {
      days.push({ date: new Date(year, month, i), isCurrent: true });
    }
    // Padding to complete grid
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrent: false });
    }
    return days;
  }, [currentDate]);

  const DayCell = ({ date, isCurrent, isCompact }: { date: Date, isCurrent: boolean, isCompact?: boolean }) => {
    const key = date.toDateString();
    const dayEvents = eventMap[key] || [];
    const isToday = key === today.toDateString();
    const isSelected = key === selectedDate.toDateString();

    if (isCompact) {
      return (
        <button 
          onClick={() => setSelectedDate(date)}
          className={`aspect-square flex flex-col items-center justify-center rounded-xl relative transition-all ${
            isSelected ? 'bg-indigo-600 text-white shadow-lg' : isCurrent ? 'text-slate-700 hover:bg-slate-50' : 'text-slate-200'
          }`}
        >
          <span className={`text-xs font-black ${isToday && !isSelected ? 'text-indigo-600' : ''}`}>{date.getDate()}</span>
          {dayEvents.length > 0 && !isSelected && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-indigo-400" />}
        </button>
      );
    }

    return (
      <div className={`p-2 border-r border-b border-slate-50 flex flex-col min-h-[120px] ${!isCurrent ? 'bg-slate-50/20' : 'bg-white'}`}>
        <div className="flex justify-between items-start mb-2">
          <span className={`text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-lg ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
            {date.getDate()}
          </span>
        </div>
        <div className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
          {dayEvents.map(e => (
            <EventCard key={e.id} event={e} onToggleShare={onToggleShare} isCompact members={members} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden h-full">
      {viewType === 'week' ? (
        <div className="flex-1 flex flex-col md:p-8 overflow-hidden">
          <div className="hidden md:grid grid-cols-7 gap-4 h-full">
            {weekDays.map(day => (
              <div key={day.toISOString()} className="bg-white rounded-[32px] border border-slate-100 flex flex-col overflow-hidden shadow-sm">
                <div className="p-4 bg-slate-50/50 border-b border-slate-50 text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{day.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                  <p className="text-lg font-black">{day.getDate()}</p>
                </div>
                <div className="flex-1 p-3 space-y-2 overflow-y-auto no-scrollbar">
                  {(eventMap[day.toDateString()] || []).map(e => (
                    <EventCard key={e.id} event={e} onToggleShare={onToggleShare} isCompact members={members} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Mobile Weekly Scroller */}
          <div className="md:hidden flex flex-col h-full">
            <div className="flex gap-2 px-4 py-4 overflow-x-auto no-scrollbar bg-white border-b border-slate-100">
              {weekDays.map(day => (
                <button 
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`flex flex-col items-center min-w-[54px] py-3 rounded-2xl transition-all ${
                    day.toDateString() === selectedDate.toDateString() ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400'
                  }`}
                >
                  <span className="text-[9px] font-black uppercase mb-1">{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  <span className="text-lg font-black">{day.getDate()}</span>
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
              {(eventMap[selectedDate.toDateString()] || []).map(e => (
                <EventCard key={e.id} event={e} onToggleShare={onToggleShare} members={members} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col md:p-8 overflow-hidden">
          <div className="hidden md:flex flex-col h-full bg-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden">
            <div className="grid grid-cols-7 border-b border-slate-50 bg-slate-50/30">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="py-4 text-center text-[9px] font-black text-slate-300 uppercase tracking-widest">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 flex-1 overflow-hidden">
              {monthDays.map((day, i) => (
                <DayCell key={i} date={day.date} isCurrent={day.isCurrent} />
              ))}
            </div>
          </div>
          {/* Mobile Month View */}
          <div className="md:hidden flex flex-col h-full">
            <div className="bg-white p-3 border-b border-slate-100">
              <div className="grid grid-cols-7 gap-y-1">
                {monthDays.map((day, i) => (
                  <DayCell key={i} date={day.date} isCurrent={day.isCurrent} isCompact />
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
              {(eventMap[selectedDate.toDateString()] || []).map(e => (
                <EventCard key={e.id} event={e} onToggleShare={onToggleShare} members={members} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarGrid;
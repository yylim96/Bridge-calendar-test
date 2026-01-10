
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
  onDateChange,
  viewType 
}) => {
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const now = new Date(2026, 0, 10);

  // Week days calculation
  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const day = currentDate.getDay();
    startOfWeek.setDate(currentDate.getDate() - day);
    
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  }, [currentDate]);

  // Month days calculation - includes previous and next month fillers
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    // Previous month filler
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({ 
        date: new Date(year, month, 1 - (i + 1)), // Correctly calculate previous month dates
        isCurrentMonth: false 
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ 
        date: new Date(year, month, i), 
        isCurrentMonth: true 
      });
    }
    
    // Next month filler - fill up to 42 cells (6 rows)
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({ 
        date: new Date(year, month + 1, i), 
        isCurrentMonth: false 
      });
    }
    
    return days;
  }, [currentDate]);

  const getEventsForDate = (date: Date) => {
    return events.filter(e => {
      const d = new Date(e.start_time);
      return d.getDate() === date.getDate() && 
             d.getMonth() === date.getMonth() && 
             d.getFullYear() === date.getFullYear();
    });
  };

  const WeekView = () => (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F8FAFC] md:bg-transparent md:p-8 h-full overflow-hidden">
      <div className="hidden md:grid grid-cols-7 gap-4 h-full">
        {weekDays.map((day, i) => {
          const dayEvents = getEventsForDate(day);
          const isToday = day.getDate() === now.getDate() && day.getMonth() === now.getMonth();
          return (
            <div key={i} className="flex flex-col h-full bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-all group">
              <div className={`p-4 border-b border-slate-50 text-center ${isToday ? 'bg-indigo-600 text-white' : 'bg-slate-50/50'}`}>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{day.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                <p className="text-xl font-black">{day.getDate()}</p>
              </div>
              <div className="flex-1 p-3 overflow-y-auto no-scrollbar space-y-2 touch-pan-y min-h-0">
                {dayEvents.length > 0 ? dayEvents.map(e => (
                  <EventCard 
                    key={e.id} 
                    event={e} 
                    onToggleShare={onToggleShare} 
                    isCompact 
                    members={members}
                  />
                )) : (
                  <div className="h-full flex items-center justify-center opacity-10 grayscale">
                    <Clock size={20} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Mobile Weekly: Scroller with independent list */}
      <div className="md:hidden flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex gap-3 px-6 py-4 overflow-x-auto no-scrollbar bg-white border-b border-slate-100 shrink-0">
          {weekDays.map((day, i) => {
            const isSelected = day.getDate() === selectedDate.getDate() && day.getMonth() === selectedDate.getMonth();
            const isToday = day.getDate() === now.getDate() && day.getMonth() === now.getMonth();
            return (
              <button 
                key={i}
                onClick={() => setSelectedDate(day)}
                className={`flex flex-col items-center min-w-[58px] py-4 rounded-3xl transition-all ${
                  isSelected 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' 
                    : isToday 
                      ? 'bg-indigo-50 text-indigo-600' 
                      : 'text-slate-400 hover:bg-slate-50'
                }`}
              >
                <span className="text-[10px] font-black mb-1 uppercase tracking-widest">{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                <span className="text-xl font-black">{day.getDate()}</span>
              </button>
            );
          })}
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-6 space-y-4 bg-slate-50/50 touch-pan-y overscroll-contain">
          <div className="flex items-center justify-between px-1 mb-2">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</h4>
            <div className="bg-white px-3 py-1 rounded-full text-[9px] font-black text-indigo-500 border border-slate-100 uppercase tracking-widest">
              {getEventsForDate(selectedDate).length} {getEventsForDate(selectedDate).length === 1 ? 'EVENT' : 'EVENTS'}
            </div>
          </div>
          <div className="space-y-4 pb-12">
            {getEventsForDate(selectedDate).length > 0 ? (
              getEventsForDate(selectedDate).map(e => (
                <EventCard key={e.id} event={e} onToggleShare={onToggleShare} members={members} />
              ))
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-slate-300 gap-4">
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-slate-100">
                  <Clock size={28} />
                </div>
                <p className="text-sm font-black uppercase tracking-widest">Quiet Day</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const MonthView = () => {
    const selectedDateEvents = getEventsForDate(selectedDate);
    
    return (
      <div className="flex-1 flex flex-col min-h-0 bg-[#F8FAFC] md:bg-transparent md:p-8 h-full overflow-hidden">
        <div className="hidden md:flex flex-col h-full border border-slate-100 bg-white rounded-[40px] overflow-hidden shadow-2xl">
          <div className="grid grid-cols-7 border-b border-slate-50 bg-slate-50/50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 flex-1 min-h-0">
            {calendarDays.map((day, i) => {
              const dayEvents = getEventsForDate(day.date);
              const isToday = day.date.getDate() === now.getDate() && day.date.getMonth() === now.getMonth() && day.date.getFullYear() === now.getFullYear();
              return (
                <div key={i} className={`p-3 border-r border-b border-slate-50 flex flex-col gap-1 hover:bg-slate-50/30 transition-colors ${!day.isCurrentMonth ? 'bg-slate-50/20' : ''}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm font-black p-1 rounded-lg ${isToday ? 'bg-indigo-600 text-white px-2' : day.isCurrentMonth ? 'text-slate-800' : 'text-slate-200'}`}>
                      {day.date.getDate()}
                    </span>
                  </div>
                  <div className="flex-1 overflow-y-auto no-scrollbar space-y-1 touch-pan-y">
                    {dayEvents.map(e => (
                      <EventCard key={e.id} event={e} onToggleShare={onToggleShare} isCompact members={members} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Month View: Compact Grid + Large Independent List */}
        <div className="md:hidden flex-1 flex flex-col min-h-0 h-full overflow-hidden">
          <div className="bg-white border-b border-slate-100 p-3 shrink-0">
            <div className="grid grid-cols-7 mb-1">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                <div key={d} className="text-center text-[8px] font-black text-slate-300 uppercase tracking-widest py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-0.5">
              {calendarDays.map((day, i) => {
                const dayEvents = getEventsForDate(day.date);
                const isSelected = day.date.toDateString() === selectedDate.toDateString();
                const isToday = day.date.toDateString() === now.toDateString();
                const hasEvents = dayEvents.length > 0;
                
                return (
                  <button 
                    key={i} 
                    onClick={() => setSelectedDate(day.date)}
                    className={`aspect-square flex flex-col items-center justify-center rounded-xl relative transition-all ${
                      isSelected ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : ''
                    } ${!day.isCurrentMonth ? 'text-slate-200' : 'text-slate-700'}`}
                  >
                    <span className={`text-xs font-bold ${isToday && !isSelected && day.isCurrentMonth ? 'text-indigo-600' : ''}`}>
                      {day.date.getDate()}
                    </span>
                    {hasEvents && !isSelected && day.isCurrentMonth && (
                      <div className="absolute bottom-1 flex gap-0.5">
                        <div className="w-0.5 h-0.5 rounded-full bg-indigo-400" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-50/50 px-5 py-6 touch-pan-y overscroll-contain">
            <div className="flex items-center justify-between px-1 mb-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</h4>
              <div className="bg-white px-3 py-1 rounded-full text-[9px] font-black text-indigo-500 border border-slate-100 uppercase tracking-widest">
                {selectedDateEvents.length} {selectedDateEvents.length === 1 ? 'EVENT' : 'EVENTS'}
              </div>
            </div>
            
            <div className="space-y-4 pb-24">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map(e => (
                  <EventCard key={e.id} event={e} onToggleShare={onToggleShare} members={members} />
                ))
              ) : (
                <div className="py-16 flex flex-col items-center justify-center text-slate-300 gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                    <CalendarIcon size={20} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Agenda Items</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden h-full">
      {viewType === 'week' ? <WeekView /> : <MonthView />}
    </div>
  );
};

export default CalendarGrid;


import React from 'react';
import { CalendarEvent, UserProfile } from '../types';
import { Globe, Lock, Clock, MapPin, ShieldCheck } from 'lucide-react';

interface EventCardProps {
  event: CalendarEvent;
  onToggleShare: (id: string) => void;
  isCompact?: boolean;
  members: UserProfile[];
}

const EventCard: React.FC<EventCardProps> = ({ event, onToggleShare, isCompact, members }) => {
  const isShared = event.is_shared;
  const start = new Date(event.start_time);
  const timeStr = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const owner = members.find(m => m.id === event.user_id);
  const ownerName = owner?.full_name || 'System';
  const ownerAvatar = owner?.avatar_url || `https://api.dicebear.com/7.x/big-smile/svg?seed=${event.user_id}`;

  if (isCompact) {
    return (
      <div 
        className={`px-2 py-1.5 rounded-lg text-[9px] font-black truncate border-l-2 mb-1 flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer ${
          isShared 
            ? 'bg-indigo-50 text-indigo-700 border-indigo-600 shadow-sm' 
            : 'bg-white text-slate-500 border-slate-200 shadow-sm'
        }`}
      >
        <img src={ownerAvatar} className="w-3.5 h-3.5 rounded-md shrink-0 object-cover bg-slate-100" alt="" />
        <span className="truncate tracking-tight uppercase">{event.title}</span>
      </div>
    );
  }

  return (
    <div 
      className={`relative flex flex-col p-5 rounded-[32px] border transition-all duration-300 group ${
        isShared 
          ? 'bg-white border-indigo-100 shadow-xl shadow-indigo-500/5 ring-4 ring-indigo-50/30' 
          : 'bg-white border-slate-100 shadow-sm hover:border-slate-200'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative">
            <img 
              src={ownerAvatar} 
              className={`w-12 h-12 rounded-2xl object-cover border-2 shadow-sm ${isShared ? 'border-indigo-50' : 'border-slate-50'}`} 
              alt={ownerName} 
            />
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${isShared ? 'bg-indigo-600' : 'bg-slate-400'}`}>
              {isShared ? <Globe size={10} className="text-white" /> : <Lock size={10} className="text-white" />}
            </div>
          </div>
          <div className="min-w-0">
            <h4 className={`text-lg font-black truncate tracking-tight leading-tight ${isShared ? 'text-slate-900' : 'text-slate-700'}`}>
              {event.title}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${isShared ? 'text-indigo-500' : 'text-slate-400'}`}>
                {owner?.role === 'owner' && <ShieldCheck size={10} />}
                {ownerName.split(' ')[0]}
              </span>
              <div className="w-1 h-1 rounded-full bg-slate-200" />
              <span className={`text-[9px] font-bold uppercase tracking-widest ${isShared ? 'text-emerald-500' : 'text-slate-300'}`}>
                {isShared ? 'Shared' : 'Private'}
              </span>
            </div>
          </div>
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleShare(event.id);
          }}
          className={`shrink-0 p-3 rounded-2xl transition-all shadow-md active:scale-90 ${
            isShared 
              ? 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700' 
              : 'bg-slate-50 text-slate-400 border border-slate-100 hover:border-indigo-200 hover:text-indigo-600'
          }`}
        >
          {isShared ? <Globe size={18} /> : <Lock size={18} />}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-slate-50/80 px-4 py-3 rounded-2xl border border-slate-100 flex items-center gap-2.5">
          <Clock size={14} className={isShared ? 'text-indigo-400' : 'text-slate-400'} />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{timeStr}</span>
        </div>
        {event.location ? (
          <div className="bg-slate-50/80 px-4 py-3 rounded-2xl border border-slate-100 flex items-center gap-2.5 truncate">
            <MapPin size={14} className={isShared ? 'text-indigo-400' : 'text-slate-400'} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 truncate">{event.location}</span>
          </div>
        ) : (
          <div className="bg-slate-50/30 px-4 py-3 rounded-2xl border border-dashed border-slate-100 flex items-center gap-2.5 opacity-40">
            <MapPin size={14} className="text-slate-300" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">No Location</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">via {event.provider}</span>
        </div>
        
        {isShared && (
          <div className="flex -space-x-2">
            {members.slice(0, 4).map(m => (
              <img 
                key={m.id} 
                src={m.avatar_url} 
                className="w-6 h-6 rounded-lg border-2 border-white shadow-sm ring-1 ring-slate-100 object-cover bg-white" 
                title={m.full_name}
              />
            ))}
            {members.length > 4 && (
              <div className="w-6 h-6 rounded-lg border-2 border-white shadow-sm bg-indigo-50 flex items-center justify-center text-[8px] font-black text-indigo-400">
                +{members.length - 4}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;

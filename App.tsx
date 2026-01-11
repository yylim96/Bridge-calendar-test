
import React, { useState, useCallback, useMemo } from 'react';
import { CalendarEvent, AuthState, UserProfile, BaseLocation, CalendarViewType } from './types';
import { MOCK_EVENTS, MOCK_USER, MOCK_GROUP, MOCK_MEMBERS, AVATAR_ILLUSTRATIONS } from './services/mockData';
import CalendarGrid from './components/CalendarGrid';
import AIAssistant from './components/AIAssistant';
import MemberManager from './components/MemberManager';
import { 
  Search, 
  Calendar as CalendarIcon, 
  Users, 
  Layers,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Menu,
  LogOut,
  MapPin,
  ShieldCheck,
  UserCircle,
  Bell,
  Smartphone,
  Globe,
  Lock,
  Camera,
  Check,
  Zap,
  Shield,
  X,
  Plus,
  ChevronDown
} from 'lucide-react';

const App: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [members, setMembers] = useState<UserProfile[]>(MOCK_MEMBERS);
  const [currentUserIdx, setCurrentUserIdx] = useState(0);
  const activeUser = members[currentUserIdx] || members[0];

  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 10));
  const [view, setView] = useState<'calendar' | 'members' | 'settings'>('calendar');
  const [calendarView, setCalendarView] = useState<CalendarViewType>('month');
  const [filter, setFilter] = useState<'all' | 'shared' | 'private'>('all');
  const [isAIActive, setIsAIActive] = useState(false);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

  const handleToggleShare = useCallback((id: string) => {
    setEvents(prev => prev.map(event => {
      if (event.id === id) return { ...event, is_shared: !event.is_shared };
      return event;
    }));
  }, []);

  const handleAIEventCreated = useCallback((aiEvent: any) => {
    const newEvent: CalendarEvent = {
      id: Math.random().toString(36).substr(2, 9),
      user_id: activeUser.id,
      group_id: MOCK_GROUP.id,
      title: aiEvent.title,
      description: aiEvent.description,
      start_time: aiEvent.start_time,
      end_time: aiEvent.end_time,
      is_shared: aiEvent.is_shared,
      provider: 'bridge'
    };
    setEvents(prev => [newEvent, ...prev]);
    setIsAIActive(false);
  }, [activeUser]);

  const changeDateRange = (delta: number) => {
    const newDate = new Date(currentDate);
    if (calendarView === 'month') {
      newDate.setMonth(currentDate.getMonth() + delta);
    } else {
      newDate.setDate(currentDate.getDate() + (delta * 7));
    }
    setCurrentDate(newDate);
  };

  const updateAvatar = (key: string) => {
    const newMembers = [...members];
    newMembers[currentUserIdx] = {
      ...activeUser,
      avatar_url: AVATAR_ILLUSTRATIONS[key as keyof typeof AVATAR_ILLUSTRATIONS],
      avatar_illustration: key,
      avatar_type: 'illustration'
    };
    setMembers(newMembers);
    setIsAvatarPickerOpen(false);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    const newMembers = [...members];
    newMembers[currentUserIdx] = { ...activeUser, ...data };
    setMembers(newMembers);
  };

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (filter === 'shared') return e.is_shared;
      if (filter === 'private') return !e.is_shared;
      return true;
    });
  }, [events, filter]);

  return (
    <div className="h-[100dvh] w-full bg-[#F8FAFC] flex flex-col overflow-hidden md:flex-row font-inter">
      <aside className="hidden md:flex w-72 lg:w-80 bg-white border-r border-slate-100 flex-col shrink-0 shadow-sm z-30">
        <div className="p-6 lg:p-8 pb-0">
          <div className="flex items-center gap-4 px-2 mb-10 lg:mb-12">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-indigo-600 rounded-[18px] lg:rounded-[20px] flex items-center justify-center text-white font-black text-2xl lg:text-3xl shadow-2xl shadow-indigo-100">B</div>
            <div>
              <h1 className="text-xl lg:text-2xl font-black tracking-tighter text-slate-900 leading-none mb-1">Bridge</h1>
              <p className="text-[9px] lg:text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] truncate max-w-[120px]">{MOCK_GROUP.name}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto no-scrollbar px-6 lg:px-8 space-y-2 lg:space-y-3 pb-8">
          <NavItem icon={<CalendarIcon size={22} />} label="Calendar" active={view === 'calendar'} onClick={() => setView('calendar')} />
          <NavItem icon={<Users size={22} />} label="Members" active={view === 'members'} onClick={() => setView('members')} badge={members.length} />
          
          <div className="pt-8 lg:pt-10 pb-4 px-5 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Layers</div>
          <FilterItem label="Master View" active={filter === 'all'} onClick={() => setFilter('all')} color="bg-indigo-600" />
          <FilterItem label="Shared Stack" active={filter === 'shared'} onClick={() => setFilter('shared')} color="bg-emerald-500" />
          <FilterItem label="Personal Stack" active={filter === 'private'} onClick={() => setFilter('private')} color="bg-slate-300" />
        </nav>

        <div className="p-6 lg:p-8 pt-6 border-t border-slate-100 space-y-4 lg:space-y-6">
          <div className="flex items-center gap-4 lg:gap-5 px-3">
            <div className="relative group cursor-pointer" onClick={() => setIsAvatarPickerOpen(true)}>
              <img src={activeUser.avatar_url} className="w-12 h-12 lg:w-14 lg:h-14 rounded-[18px] lg:rounded-[22px] border-4 border-slate-50 shadow-lg object-cover bg-slate-50" alt="Avatar" />
              <div className="absolute inset-0 bg-black/40 rounded-[18px] lg:rounded-[22px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={16} className="text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm lg:text-base font-black text-slate-900 truncate tracking-tight">{activeUser.full_name.split(' ')[0]}</p>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-0.5">
                <ShieldCheck size={12} /> {activeUser.role}
              </div>
            </div>
            <button onClick={() => setView('settings')} className={`p-2.5 lg:p-3 rounded-2xl transition-all ${view === 'settings' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-300 hover:bg-slate-50 hover:text-indigo-600'}`}>
              <SettingsIcon size={22} />
            </button>
          </div>
          <button className="w-full flex items-center gap-3 lg:gap-4 px-5 lg:px-6 py-3.5 lg:py-4 text-red-400 hover:bg-red-50 rounded-[20px] lg:rounded-[22px] transition-all text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em]"><LogOut size={18} /> Exit</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 relative pb-20 md:pb-0 h-full overflow-hidden">
        <header className="h-20 md:h-24 bg-white border-b border-slate-100 flex items-center justify-between px-6 md:px-10 lg:px-14 shrink-0 z-20">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="flex flex-col">
              <button 
                onClick={() => setIsMonthPickerOpen(true)}
                className="flex items-center gap-2 group outline-none"
              >
                <h2 className="text-lg md:text-2xl lg:text-3xl font-black text-slate-900 tracking-tighter leading-none group-hover:text-indigo-600 transition-colors">
                  {view === 'calendar' ? currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : view.charAt(0).toUpperCase() + view.slice(1)}
                </h2>
                {view === 'calendar' && <ChevronDown size={18} className="text-slate-400 group-hover:text-indigo-600 transition-all" />}
              </button>
            </div>
            
            {view === 'calendar' && (
              <div className="flex items-center gap-2 md:gap-5">
                <div className="flex items-center border border-slate-100 rounded-[18px] md:rounded-[20px] p-1 bg-slate-50/50 shadow-sm">
                  <button onClick={() => changeDateRange(-1)} className="p-2 md:p-2.5 hover:bg-white hover:shadow-sm rounded-xl md:rounded-2xl transition-all"><ChevronLeft size={20}/></button>
                  <button onClick={() => changeDateRange(1)} className="p-2 md:p-2.5 hover:bg-white hover:shadow-sm rounded-xl md:rounded-2xl transition-all"><ChevronRight size={20}/></button>
                </div>
                <div className="hidden sm:flex bg-slate-100/60 p-1 md:p-1.5 rounded-[18px] md:rounded-[22px]">
                  <button onClick={() => setCalendarView('month')} className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all ${calendarView === 'month' ? 'bg-white shadow-xl text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>Grid</button>
                  <button onClick={() => setCalendarView('week')} className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all ${calendarView === 'week' ? 'bg-white shadow-xl text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>Stack</button>
                </div>
              </div>
            )}
          </div>
          <button onClick={() => setIsAIActive(true)} className="flex items-center gap-3 md:gap-4 px-6 md:px-8 py-4 md:py-5 rounded-[24px] md:rounded-[28px] bg-indigo-600 text-white font-black shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 active:scale-95 transition-all">
            <Sparkles size={22} /> <span className="hidden sm:inline text-[10px] md:text-[11px] uppercase tracking-[0.2em]">Bridge AI</span>
          </button>
        </header>

        <div className="flex-1 flex flex-col min-h-0 relative h-full overflow-hidden">
          {view === 'calendar' && (
            <CalendarGrid 
              currentDate={currentDate} 
              onDateChange={setCurrentDate} 
              events={filteredEvents} 
              onToggleShare={handleToggleShare} 
              members={members} 
              viewType={calendarView} 
            />
          )}
          {view === 'members' && <MemberManager members={members} currentUser={activeUser} onUpdateMembers={setMembers} />}
          {view === 'settings' && <SettingsView user={activeUser} onUpdate={updateProfile} openAvatarPicker={() => setIsAvatarPickerOpen(true)} />}
        </div>

        {isAvatarPickerOpen && <AvatarPicker onClose={() => setIsAvatarPickerOpen(false)} onSelect={updateAvatar} current={activeUser.avatar_illustration} />}
        {isAIActive && <AIAssistant onEventCreated={handleAIEventCreated} onClose={() => setIsAIActive(false)} />}
        {isMonthPickerOpen && <MonthYearPicker onClose={() => setIsMonthPickerOpen(false)} onSelect={setCurrentDate} current={currentDate} />}
        
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 h-20 flex items-center justify-around px-4 z-40 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
          <MobileNavBtn icon={<CalendarIcon size={24} />} label="VIEW" active={view === 'calendar'} onClick={() => setView('calendar')} />
          <MobileNavBtn icon={<Users size={24} />} label="GROUP" active={view === 'members'} onClick={() => setView('members')} />
          <MobileNavBtn icon={<SettingsIcon size={24} />} label="SETTINGS" active={view === 'settings'} onClick={() => setView('settings')} />
        </nav>
      </main>
    </div>
  );
};

const MonthYearPicker = ({ onClose, onSelect, current }: { onClose: () => void, onSelect: (date: Date) => void, current: Date }) => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = [2024, 2025, 2026, 2027, 2028];
  
  const handleSelect = (m: number, y: number) => {
    onSelect(new Date(y, m, current.getDate()));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
      <div className="bg-white rounded-[40px] p-8 md:p-12 w-full max-w-xl shadow-2xl relative animate-in zoom-in-95 duration-300 max-h-[80dvh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-8 right-8 p-2 text-slate-300 hover:text-slate-600 transition-colors">
          <X size={28} />
        </button>
        <div className="text-center mb-8">
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">Jump to Date</h3>
          <p className="text-sm text-slate-500 font-medium">Quickly navigate months and years.</p>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-10">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Months</h4>
            <div className="grid grid-cols-3 gap-3">
              {months.map((m, idx) => (
                <button 
                  key={m} 
                  onClick={() => handleSelect(idx, current.getFullYear())}
                  className={`py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${current.getMonth() === idx ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                >
                  {m.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-4 pb-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Years</h4>
            <div className="grid grid-cols-3 gap-3">
              {years.map(y => (
                <button 
                  key={y} 
                  onClick={() => handleSelect(current.getMonth(), y)}
                  className={`py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${current.getFullYear() === y ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsView: React.FC<{user: UserProfile, onUpdate: (data: Partial<UserProfile>) => void, openAvatarPicker: () => void}> = ({ user, onUpdate, openAvatarPicker }) => {
  const [localName, setLocalName] = useState(user.full_name);

  const handleNameChange = (newName: string) => {
    setLocalName(newName);
    onUpdate({ full_name: newName });
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-[#F8FAFC] p-5 md:p-16 h-full touch-pan-y min-h-0">
      <div className="max-w-xl mx-auto space-y-10 md:space-y-12 pb-24">
        <header className="mb-8 md:mb-12 px-1 text-center md:text-left">
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-2">Preferences</h3>
          <p className="text-sm md:text-base text-slate-500 font-medium">Sync settings across the group profile.</p>
        </header>

        <section className="space-y-4 md:space-y-6">
          <h3 className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">IDENTITY & PRESENCE</h3>
          <div className="bg-[#EBEDF2]/40 rounded-[40px] p-8 md:p-12 border border-slate-100 shadow-sm space-y-10">
            <div className="flex flex-col items-center gap-8">
              <div 
                className="relative group cursor-pointer"
                onClick={openAvatarPicker}
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-[36px] md:rounded-[48px] overflow-hidden bg-white shadow-2xl border-4 border-white ring-1 ring-slate-100">
                  <img src={user.avatar_url} className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-indigo-600/10 rounded-[36px] md:rounded-[48px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white/90 p-3 rounded-2xl shadow-xl">
                    <Camera className="text-indigo-600" size={24} />
                  </div>
                </div>
              </div>
              
              <div className="w-full space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">DISPLAY NAME</label>
                  <input 
                    value={localName} 
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="text-xl md:text-2xl font-black bg-white border border-slate-100 rounded-[24px] px-6 py-4 md:px-8 md:py-6 w-full shadow-sm focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 outline-none transition-all placeholder:text-slate-300" 
                    placeholder="Enter Name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ACTIVE LOCATION</label>
                  <div className="bg-white p-5 md:p-6 rounded-[24px] border border-slate-100 flex items-center justify-center shadow-sm">
                    <span className="font-black text-slate-900 uppercase tracking-widest text-lg md:text-xl">
                      {user.base_locations[0]?.city || 'SINGAPORE'}
                    </span>
                  </div>
                </div>

                <button className="w-full bg-indigo-600 text-white py-5 md:py-6 rounded-[28px] font-black text-xs md:text-sm uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-3">
                  UPDATE LOCATION
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4 md:space-y-6">
          <h3 className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">PROVIDER STACKS</h3>
          <div className="grid grid-cols-1 gap-4">
            <SyncCard icon={<Zap size={20} className="text-blue-500"/>} label="Google" status="Live" color="bg-blue-50 text-blue-600" />
            <SyncCard icon={<Layers size={20} className="text-indigo-600"/>} label="Native" status="On" color="bg-indigo-50 text-indigo-600" />
          </div>
        </section>
      </div>
    </div>
  );
};

const SyncCard = ({ icon, label, status, color }: any) => (
  <div className="bg-white p-6 md:p-8 rounded-[30px] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
    <div className="flex items-center gap-4 md:gap-5">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-white transition-colors">{icon}</div>
      <p className="text-base font-black text-slate-800 tracking-tight">{label}</p>
    </div>
    <button className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl ${color} shadow-sm`}>{status}</button>
  </div>
);

const AvatarPicker = ({ onClose, onSelect, current }: any) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
    <div className="bg-white rounded-[48px] p-8 md:p-12 w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
      <button onClick={onClose} className="absolute top-8 right-8 p-2 text-slate-300 hover:text-slate-600 transition-colors">
        <X size={28} />
      </button>
      <div className="text-center mb-10">
        <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">Bridge Avatar</h3>
        <p className="text-sm text-slate-500 font-medium">Select your group persona.</p>
      </div>
      
      <div className="grid grid-cols-3 gap-4 md:gap-6">
        {Object.entries(AVATAR_ILLUSTRATIONS).map(([key, url]) => (
          <button 
            key={key} 
            onClick={() => onSelect(key)}
            className={`relative aspect-square rounded-[32px] overflow-hidden border-4 transition-all hover:scale-105 active:scale-95 ${current === key ? 'border-indigo-600 shadow-2xl' : 'border-slate-50 hover:border-indigo-100'}`}
          >
            <img src={url} className="w-full h-full object-cover bg-slate-50" />
            {current === key && (
              <div className="absolute top-2 right-2 bg-indigo-600 text-white p-1.5 rounded-full shadow-lg">
                <Check size={12} />
              </div>
            )}
          </button>
        ))}
      </div>
      <button onClick={onClose} className="w-full mt-10 md:mt-12 py-6 bg-indigo-600 text-white font-black uppercase tracking-[0.2em] text-[10px] md:text-xs rounded-[28px] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">Confirm</button>
    </div>
  </div>
);

const NavItem: React.FC<{icon: any, label: string, active: boolean, onClick: () => void, badge?: number}> = ({ icon, label, active, onClick, badge }) => (
  <button onClick={onClick} className={`w-full flex items-center justify-between px-5 py-4 lg:px-6 lg:py-5 rounded-[22px] lg:rounded-[28px] text-sm lg:text-base font-black transition-all group ${active ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-500/20 translate-x-2' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}>
    <div className="flex items-center gap-4 lg:gap-5">
      <div className={`transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-slate-300 group-hover:text-indigo-500'}`}>{icon}</div>
      <span className="tracking-tight uppercase">{label}</span>
    </div>
    {badge !== undefined && badge > 0 && <span className={`text-[10px] px-2.5 py-1.5 rounded-xl font-black ${active ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'}`}>{badge}</span>}
  </button>
);

const FilterItem: React.FC<{label: string, active: boolean, onClick: () => void, color: string}> = ({ label, active, onClick, color }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-[10px] font-black transition-all uppercase tracking-[0.2em] ${active ? 'bg-slate-50 text-slate-900 shadow-sm' : 'text-slate-300 hover:text-slate-500'}`}>
    <div className={`w-2 h-2 rounded-full ${color} ${active ? 'scale-125 shadow-lg' : 'opacity-20'}`} />
    <span>{label}</span>
  </button>
);

const MobileNavBtn: React.FC<{icon: any, label: string, active: boolean, onClick: () => void}> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all duration-300 flex-1 ${active ? 'text-indigo-600' : 'text-slate-400'}`}>
    <div className={`p-2.5 rounded-[20px] transition-all ${active ? 'bg-indigo-50' : 'opacity-60'}`}>{icon}</div>
    <span className="text-[9px] font-black tracking-[0.2em] uppercase">{label}</span>
  </button>
);

export default App;

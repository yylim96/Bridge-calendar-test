import React, { useState, useCallback, useMemo } from 'react';
import { CalendarEvent, UserProfile, CalendarViewType } from './types';
import { MOCK_EVENTS, MOCK_GROUP, MOCK_MEMBERS, AVATAR_ILLUSTRATIONS } from './services/mockData';
import CalendarGrid from './components/CalendarGrid';
import AIAssistant from './components/AIAssistant';
import MemberManager from './components/MemberManager';
import { 
  Calendar as CalendarIcon, 
  Users, 
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut,
  Camera,
  ChevronDown,
  ShieldCheck,
  Check
} from 'lucide-react';

const App: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [members, setMembers] = useState<UserProfile[]>(MOCK_MEMBERS);
  const [activeUserIdx, setActiveUserIdx] = useState(0);
  const currentUser = members[activeUserIdx];

  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 10));
  const [view, setView] = useState<'calendar' | 'members' | 'settings'>('calendar');
  const [calendarView, setCalendarView] = useState<CalendarViewType>('month');
  const [filter, setFilter] = useState<'all' | 'shared' | 'private'>('all');
  
  const [overlay, setOverlay] = useState<'ai' | 'avatar' | 'month' | null>(null);

  const handleToggleShare = useCallback((id: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, is_shared: !e.is_shared } : e));
  }, []);

  const handleAIEvent = useCallback((aiData: any) => {
    const newEvent: CalendarEvent = {
      id: Math.random().toString(36).substr(2, 9),
      user_id: currentUser.id,
      group_id: MOCK_GROUP.id,
      title: aiData.title || 'New Sync Event',
      description: aiData.description || '',
      start_time: aiData.start_time || new Date().toISOString(),
      end_time: aiData.end_time || new Date(Date.now() + 3600000).toISOString(),
      is_shared: !!aiData.is_shared,
      provider: 'bridge'
    };
    setEvents(prev => [newEvent, ...prev]);
    setOverlay(null);
  }, [currentUser]);

  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    setMembers(prev => prev.map((m, i) => i === activeUserIdx ? { ...m, ...data } : m));
  }, [activeUserIdx]);

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (filter === 'shared') return e.is_shared;
      if (filter === 'private') return !e.is_shared;
      return true;
    });
  }, [events, filter]);

  const changeDate = (direction: number) => {
    const d = new Date(currentDate);
    if (calendarView === 'month') {
      d.setMonth(d.getMonth() + direction);
    } else {
      d.setDate(d.getDate() + (direction * 7));
    }
    setCurrentDate(d);
  };

  return (
    <div className="h-[100dvh] w-full bg-[#F8FAFC] flex flex-col overflow-hidden md:flex-row font-inter">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-72 lg:w-80 bg-white border-r border-slate-100 flex-col shrink-0 z-30">
        <div className="p-8 pb-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-11 h-11 bg-indigo-600 rounded-[16px] flex items-center justify-center text-white font-black text-xl shadow-lg">B</div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-slate-900 leading-none mb-1">Bridge</h1>
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest truncate max-w-[140px]">{MOCK_GROUP.name}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-1.5">
          <NavItem icon={<CalendarIcon size={18} />} label="Calendar" active={view === 'calendar'} onClick={() => setView('calendar')} />
          <NavItem icon={<Users size={18} />} label="Members" active={view === 'members'} onClick={() => setView('members')} badge={members.length} />
          
          <div className="pt-8 pb-3 px-5 text-[9px] font-black text-slate-300 uppercase tracking-widest">Filters</div>
          <FilterItem label="Master View" active={filter === 'all'} onClick={() => setFilter('all')} color="bg-indigo-600" />
          <FilterItem label="Shared Stack" active={filter === 'shared'} onClick={() => setFilter('shared')} color="bg-emerald-500" />
          <FilterItem label="Private Stack" active={filter === 'private'} onClick={() => setFilter('private')} color="bg-slate-300" />
        </nav>

        <div className="p-6 border-t border-slate-50 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="relative group cursor-pointer" onClick={() => setOverlay('avatar')}>
              <img src={currentUser.avatar_url} className="w-10 h-10 rounded-xl border border-slate-100 shadow-sm object-cover" alt="" />
              <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera size={12} className="text-white"/></div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-slate-900 truncate tracking-tight">{currentUser.full_name}</p>
              <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{currentUser.role}</p>
            </div>
            <button onClick={() => setView('settings')} className={`p-2 rounded-xl transition-all ${view === 'settings' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-300 hover:text-indigo-600'}`}>
              <SettingsIcon size={18} />
            </button>
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-50 rounded-xl transition-all text-[9px] font-black uppercase tracking-widest"><LogOut size={14} /> Log Out</button>
        </div>
      </aside>

      {/* Main content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative pb-20 md:pb-0 h-full overflow-hidden">
        <header className="h-20 md:h-24 bg-white border-b border-slate-100 flex items-center justify-between px-6 md:px-10 lg:px-12 shrink-0 z-20">
          <div className="flex items-center gap-6">
            <button onClick={() => setOverlay('month')} className="flex items-center gap-2 group outline-none">
              <h2 className="text-lg md:text-2xl font-black text-slate-900 tracking-tighter group-hover:text-indigo-600 transition-colors">
                {view === 'calendar' ? currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : view.charAt(0).toUpperCase() + view.slice(1)}
              </h2>
              {view === 'calendar' && <ChevronDown size={18} className="text-slate-300 group-hover:text-indigo-600" />}
            </button>
            
            {view === 'calendar' && (
              <div className="hidden sm:flex items-center border border-slate-100 rounded-xl p-0.5 bg-slate-50 shadow-sm">
                <button onClick={() => changeDate(-1)} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"><ChevronLeft size={16}/></button>
                <button onClick={() => changeDate(1)} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"><ChevronRight size={16}/></button>
              </div>
            )}
          </div>
          <button onClick={() => setOverlay('ai')} className="flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-indigo-600 text-white font-black shadow-lg shadow-indigo-100 hover:-translate-y-0.5 hover:bg-indigo-700 transition-all active:scale-95">
            <Sparkles size={16} /> <span className="hidden sm:inline text-[10px] uppercase tracking-widest">Sync AI</span>
          </button>
        </header>

        <div className="flex-1 flex flex-col min-h-0 relative h-full bg-[#F8FAFC]">
          {view === 'calendar' && <CalendarGrid currentDate={currentDate} onDateChange={setCurrentDate} events={filteredEvents} onToggleShare={handleToggleShare} members={members} viewType={calendarView} />}
          {view === 'members' && <MemberManager members={members} currentUser={currentUser} onUpdateMembers={setMembers} />}
          {view === 'settings' && <SettingsView user={currentUser} onUpdate={updateProfile} openAvatar={() => setOverlay('avatar')} />}
        </div>

        {/* Overlays */}
        {overlay === 'ai' && <AIAssistant onEventCreated={handleAIEvent} onClose={() => setOverlay(null)} />}
        {overlay === 'avatar' && <AvatarPicker onClose={() => setOverlay(null)} onSelect={(key: string) => {
          updateProfile({ avatar_illustration: key, avatar_url: AVATAR_ILLUSTRATIONS[key as keyof typeof AVATAR_ILLUSTRATIONS] });
          setOverlay(null);
        }} current={currentUser.avatar_illustration} />}
        {overlay === 'month' && <div className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setOverlay(null)}>
          <div className="bg-white p-8 rounded-[32px] w-full max-w-sm shadow-2xl space-y-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-black text-slate-900 tracking-tight text-center">Switch View Mode</h3>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => { setCalendarView('month'); setOverlay(null); }} className={`p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${calendarView === 'month' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-50 text-slate-400 hover:border-slate-100'}`}>Monthly</button>
              <button onClick={() => { setCalendarView('week'); setOverlay(null); }} className={`p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${calendarView === 'week' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-50 text-slate-400 hover:border-slate-100'}`}>Weekly</button>
            </div>
          </div>
        </div>}
        
        {/* Mobile Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 h-20 flex items-center justify-around z-40 shadow-xl">
          <MobileNavBtn icon={<CalendarIcon size={20} />} label="View" active={view === 'calendar'} onClick={() => setView('calendar')} />
          <MobileNavBtn icon={<Users size={20} />} label="Circle" active={view === 'members'} onClick={() => setView('members')} />
          <MobileNavBtn icon={<SettingsIcon size={20} />} label="Setup" active={view === 'settings'} onClick={() => setView('settings')} />
        </nav>
      </main>
    </div>
  );
};

const SettingsView = ({ user, onUpdate, openAvatar }: any) => {
  const [name, setName] = useState(user.full_name);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const save = () => {
    if (!name.trim() || name === user.full_name) return;
    setSaving(true);
    setTimeout(() => { 
      onUpdate({ full_name: name }); 
      setSaving(false); 
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }, 600);
  };

  return (
    <div className="flex-1 p-6 md:p-12 lg:p-16 overflow-y-auto no-scrollbar animate-in fade-in duration-500">
      <div className="max-w-xl mx-auto space-y-10 pb-20">
        <header className="space-y-1">
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Preferences</h3>
          <p className="text-sm text-slate-400 font-medium">Manage your personal profile and visibility.</p>
        </header>
        
        <div className="bg-white rounded-[32px] p-8 md:p-10 border border-slate-100 shadow-sm space-y-10 transition-all hover:shadow-md">
          <div className="flex flex-col items-center gap-8">
            <div className="relative">
              <button onClick={openAvatar} className="w-24 h-24 rounded-[32px] overflow-hidden border-4 border-slate-50 shadow-lg group relative">
                <img src={user.avatar_url} className="w-full h-full object-cover bg-slate-50" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera className="text-white" size={20}/></div>
              </button>
              <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-xl shadow-lg border-2 border-white">
                <ShieldCheck size={14} />
              </div>
            </div>

            <div className="w-full space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Public Persona</label>
                  {showSuccess && <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1"><Check size={10}/> Sync Successful</span>}
                </div>
                <input 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  onBlur={save}
                  onKeyDown={e => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                  className="w-full px-6 py-4.5 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-black text-slate-800 focus:ring-4 focus:ring-indigo-500/5 focus:bg-white outline-none transition-all shadow-inner" 
                />
                {saving && <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest text-center animate-pulse pt-2">Processing profile change...</p>}
              </div>

              <div className="p-5 bg-indigo-50/30 rounded-2xl border border-indigo-100/50 space-y-3">
                <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Global Location</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-slate-700">{user.base_locations[0]?.city || 'Singapore'}</span>
                  <button className="text-[9px] font-black text-indigo-500 uppercase tracking-widest hover:underline">Edit</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="text-sm font-black text-slate-800">Linked Accounts</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Google Calendar Active</p>
          </div>
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm text-blue-500">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

const AvatarPicker = ({ onClose, onSelect, current }: any) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}>
    <div className="bg-white rounded-[40px] p-8 w-full max-w-sm shadow-2xl relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
      <div className="mb-8 text-center">
        <h4 className="text-xl font-black text-slate-900 tracking-tight">Pick an Avatar</h4>
        <p className="text-xs text-slate-400 font-medium">Choose your visual representation.</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(AVATAR_ILLUSTRATIONS).map(([key, url]) => (
          <button key={key} onClick={() => onSelect(key)} className={`aspect-square rounded-[24px] overflow-hidden border-4 transition-all hover:scale-105 active:scale-95 ${current === key ? 'border-indigo-600 shadow-lg' : 'border-slate-50'}`}>
            <img src={url} className="w-full h-full object-cover bg-slate-50" alt="" />
          </button>
        ))}
      </div>
    </div>
  </div>
);

const NavItem = ({ icon, label, active, onClick, badge }: any) => (
  <button onClick={onClick} className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-sm font-black transition-all group ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/10 translate-x-1' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
    <div className="flex items-center gap-4">
      <span className={`transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-slate-300 group-hover:text-indigo-500'}`}>{icon}</span> 
      <span className="uppercase tracking-widest text-[11px]">{label}</span>
    </div>
    {badge !== undefined && <span className={`text-[9px] px-2 py-1 rounded-lg font-black ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>{badge}</span>}
  </button>
);

const FilterItem = ({ label, active, onClick, color }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-slate-50 text-slate-900 shadow-sm' : 'text-slate-300 hover:text-slate-500'}`}>
    <div className={`w-1.5 h-1.5 rounded-full ${color} ${active ? 'scale-125 shadow-lg shadow-current' : 'opacity-20'}`} /> {label}
  </button>
);

const MobileNavBtn = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all flex-1 py-1 ${active ? 'text-indigo-600' : 'text-slate-300'}`}>
    <div className={`p-2 rounded-xl transition-all ${active ? 'bg-indigo-50' : 'opacity-60'}`}>{icon}</div>
    <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default App;
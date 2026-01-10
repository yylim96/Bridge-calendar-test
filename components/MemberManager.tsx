
import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { AVATAR_ILLUSTRATIONS } from '../services/mockData';
import { 
  UserPlus, 
  MapPin, 
  Trash2, 
  ShieldCheck,
  Globe,
  X,
  Check,
  ArrowUpRight
} from 'lucide-react';

interface MemberManagerProps {
  members: UserProfile[];
  currentUser: UserProfile;
  onUpdateMembers: (newMembers: UserProfile[]) => void;
}

const MemberManager: React.FC<MemberManagerProps> = ({ members, currentUser, onUpdateMembers }) => {
  const isOwner = currentUser.role === 'owner';
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const animalKeys = Object.keys(AVATAR_ILLUSTRATIONS);
    const randomKey = animalKeys[Math.floor(Math.random() * animalKeys.length)];
    
    const newMember: UserProfile = {
      id: `user-${Math.random().toString(36).substr(2, 4)}`,
      email: inviteEmail,
      full_name: inviteName,
      avatar_url: AVATAR_ILLUSTRATIONS[randomKey as keyof typeof AVATAR_ILLUSTRATIONS],
      avatar_type: 'illustration',
      avatar_illustration: randomKey,
      role: 'member' as UserRole,
      base_locations: []
    };
    onUpdateMembers([...members, newMember]);
    setInviteName('');
    setInviteEmail('');
    setIsInviteModalOpen(false);
  };

  const removeMember = (id: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      onUpdateMembers(members.filter(m => m.id !== id));
    }
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-[#F8FAFC] p-5 md:p-12 h-full touch-pan-y min-h-0">
      <div className="max-w-5xl mx-auto space-y-10 md:space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8 md:pb-10 px-1">
          <div>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-2 md:mb-3">Group Access</h3>
            <p className="text-sm md:text-base text-slate-500 font-medium">Coordinate locations with your circle.</p>
          </div>
          {isOwner && (
            <button 
              onClick={() => setIsInviteModalOpen(true)}
              className="flex items-center justify-center gap-3 px-6 md:px-8 py-4 md:py-5 bg-indigo-600 text-white rounded-[22px] md:rounded-[24px] font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
            >
              <UserPlus size={20} />
              <span className="uppercase tracking-widest text-[10px] md:text-xs">Invite</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {members.map(member => (
            <div key={member.id} className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-10 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 flex flex-col">
              <div className="flex items-start justify-between mb-8 md:mb-10">
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="relative">
                    <img src={member.avatar_url} className="w-16 h-16 md:w-20 md:h-20 rounded-[24px] md:rounded-[30px] object-cover shadow-xl border-4 border-white ring-1 ring-slate-100 bg-slate-50" />
                    {member.role === 'owner' && (
                      <div className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white p-1.5 md:p-2 rounded-xl md:rounded-2xl shadow-lg border-2 border-white">
                        <ShieldCheck size={14} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mb-1 md:mb-2 leading-none">{member.full_name}</h4>
                    <div className="flex items-center gap-2 md:gap-3">
                      <span className="text-[9px] md:text-[11px] text-indigo-500 font-black uppercase tracking-widest bg-indigo-50/50 px-2 md:px-2.5 py-0.5 md:py-1 rounded-lg">{member.role}</span>
                      <span className="text-[10px] md:text-xs text-slate-400 font-medium truncate max-w-[100px] md:max-w-none">{member.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-5 md:space-y-6">
                <div className="flex items-center justify-between px-1">
                  <h5 className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Globe size={14} className="text-indigo-400" /> Current Tracking
                  </h5>
                  <button className="p-1.5 text-slate-300 hover:text-indigo-500 transition-colors">
                    <ArrowUpRight size={18} />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {member.base_locations.length > 0 ? (
                    member.base_locations.map(loc => (
                      <div key={loc.id} className="bg-slate-50/80 rounded-[24px] md:rounded-3xl p-4 md:p-5 border border-slate-100 flex items-center gap-3 md:gap-4 group/loc hover:bg-white hover:border-indigo-100 transition-all">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-[18px] md:rounded-2xl bg-white flex items-center justify-center text-indigo-500 shadow-sm ring-1 ring-slate-100 shrink-0">
                          <MapPin size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base md:text-lg font-black text-slate-800 tracking-tight truncate">{loc.city}</p>
                          <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5 truncate">
                            {loc.type === 'recurring' ? 'Primary' : 'Visiting'}
                          </p>
                        </div>
                        <div className="bg-emerald-50 text-emerald-600 px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest shrink-0">Live</div>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 md:py-12 text-center border-2 border-dashed border-slate-100 rounded-[28px] md:rounded-[32px] bg-slate-50/50">
                      <p className="text-[10px] md:text-[11px] font-black text-slate-300 uppercase tracking-widest">Awaiting Location</p>
                    </div>
                  )}
                </div>
              </div>

              {isOwner && member.id !== currentUser.id && (
                <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-slate-50 flex justify-end">
                  <button 
                    onClick={() => removeMember(member.id)}
                    className="text-[9px] md:text-[10px] font-black text-red-400 hover:text-red-500 uppercase tracking-widest flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 hover:bg-red-50 rounded-xl md:rounded-2xl transition-all"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {isInviteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsInviteModalOpen(false)} />
            <form onSubmit={handleAddMember} className="relative w-full max-w-lg bg-white rounded-[40px] md:rounded-[48px] p-8 md:p-12 shadow-2xl animate-in zoom-in-95 duration-300">
              <button 
                type="button" 
                onClick={() => setIsInviteModalOpen(false)} 
                className="absolute top-8 right-8 md:top-10 md:right-10 p-2 text-slate-300 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="mb-8 md:mb-10 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-50 text-indigo-600 rounded-[28px] md:rounded-[32px] flex items-center justify-center mb-6 mx-auto">
                  <UserPlus size={32} />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter mb-2">Invite Member</h3>
                <p className="text-sm md:text-base text-slate-500 font-medium px-4">They'll get a secure invite to your calendar.</p>
              </div>

              <div className="space-y-4 md:space-y-5 mb-8 md:mb-10">
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-3">Full Name</label>
                  <input 
                    required
                    value={inviteName}
                    onChange={e => setInviteName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full px-6 md:px-8 py-4 md:py-5 bg-slate-50 border border-slate-100 rounded-[20px] md:rounded-3xl text-slate-800 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-3">Email Address</label>
                  <input 
                    required
                    type="email"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    placeholder="member@email.com"
                    className="w-full px-6 md:px-8 py-4 md:py-5 bg-slate-50 border border-slate-100 rounded-[20px] md:rounded-3xl text-slate-800 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-5 md:py-6 bg-indigo-600 text-white rounded-[24px] md:rounded-[28px] font-black shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <Check size={20} />
                <span className="uppercase tracking-[0.2em] text-[11px] md:text-sm">Send Invitation</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberManager;

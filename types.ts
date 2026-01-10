
export type Provider = 'google' | 'apple' | 'bridge';
export type UserRole = 'owner' | 'member';
export type CalendarViewType = 'month' | 'week';

export interface BaseLocation {
  id: string;
  city: string;
  country_code: string;
  type: 'recurring' | 'temporary';
  recurring_days?: number[]; // 0-6 (Sun-Sat)
  start_date?: string; // ISO string
  end_date?: string;   // ISO string
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  avatar_type: 'custom' | 'illustration';
  avatar_illustration?: string; // 'fox' | 'koala' | 'panda' | 'rabbit' | 'cat' | 'bear'
  role: UserRole;
  base_locations: BaseLocation[];
}

export interface CalendarEvent {
  id: string;
  user_id: string;
  group_id: string;
  external_provider_id?: string;
  title: string;
  description?: string;
  start_time: string; // ISO string
  end_time: string;   // ISO string
  is_shared: boolean;
  location?: string;
  provider: Provider;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}

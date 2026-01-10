
import { CalendarEvent, UserProfile, Group, BaseLocation } from '../types';

export const AVATAR_ILLUSTRATIONS = {
  fox: 'https://api.dicebear.com/7.x/big-smile/svg?seed=fox&backgroundColor=ffdfbf',
  koala: 'https://api.dicebear.com/7.x/big-smile/svg?seed=koala&backgroundColor=b6e3f4',
  panda: 'https://api.dicebear.com/7.x/big-smile/svg?seed=panda&backgroundColor=d1d4f9',
  rabbit: 'https://api.dicebear.com/7.x/big-smile/svg?seed=rabbit&backgroundColor=ffd5dc',
  cat: 'https://api.dicebear.com/7.x/big-smile/svg?seed=cat&backgroundColor=c0aede',
  bear: 'https://api.dicebear.com/7.x/big-smile/svg?seed=bear&backgroundColor=ffdfbf'
};

export const MOCK_USER: UserProfile = {
  id: 'user-123',
  email: 'alex@bridge.app',
  full_name: 'Alex Rivera',
  avatar_url: AVATAR_ILLUSTRATIONS.fox,
  avatar_type: 'illustration',
  avatar_illustration: 'fox',
  role: 'owner',
  base_locations: [
    {
      id: 'loc-1',
      city: 'Singapore',
      country_code: 'SG',
      type: 'recurring',
      recurring_days: [1, 2, 3, 4]
    }
  ]
};

export const MOCK_MEMBERS: UserProfile[] = [
  MOCK_USER,
  {
    id: 'user-456',
    email: 'sarah@bridge.app',
    full_name: 'Sarah Chen',
    avatar_url: AVATAR_ILLUSTRATIONS.panda,
    avatar_type: 'illustration',
    avatar_illustration: 'panda',
    role: 'member',
    base_locations: [
      {
        id: 'loc-2',
        city: 'Bangkok',
        country_code: 'TH',
        type: 'temporary',
        start_date: new Date(2026, 0, 1).toISOString(),
        end_date: new Date(2026, 0, 15).toISOString()
      }
    ]
  },
  {
    id: 'user-789',
    email: 'jordan@bridge.app',
    full_name: 'Jordan Smith',
    avatar_url: AVATAR_ILLUSTRATIONS.koala,
    avatar_type: 'illustration',
    avatar_illustration: 'koala',
    role: 'member',
    base_locations: [
      {
        id: 'loc-3',
        city: 'London',
        country_code: 'GB',
        type: 'recurring',
        recurring_days: [0, 1, 2, 3, 4, 5, 6]
      }
    ]
  }
];

export const MOCK_GROUP: Group = {
  id: 'bridge-core-group',
  name: 'Rivera Household',
  description: 'Shared calendar for coordination',
  owner_id: 'user-123'
};

export const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: 'e1',
    user_id: 'user-123',
    group_id: 'bridge-core-group',
    title: 'Dentist Appointment',
    start_time: new Date(2026, 0, 10, 9, 0).toISOString(),
    end_time: new Date(2026, 0, 10, 10, 0).toISOString(),
    is_shared: false,
    provider: 'google'
  },
  {
    id: 'e2',
    user_id: 'user-123',
    group_id: 'bridge-core-group',
    title: 'Family Dinner',
    start_time: new Date(2026, 0, 10, 19, 0).toISOString(),
    end_time: new Date(2026, 0, 10, 21, 0).toISOString(),
    is_shared: true,
    provider: 'bridge'
  },
  {
    id: 'e3',
    user_id: 'user-456',
    group_id: 'bridge-core-group',
    title: 'Flight to Singapore',
    start_time: new Date(2026, 0, 11, 14, 0).toISOString(),
    end_time: new Date(2026, 0, 11, 16, 30).toISOString(),
    is_shared: true,
    provider: 'apple'
  },
  {
    id: 'e4',
    user_id: 'user-789',
    group_id: 'bridge-core-group',
    title: 'Grocery Stock-up',
    start_time: new Date(2026, 0, 10, 11, 0).toISOString(),
    end_time: new Date(2026, 0, 10, 12, 0).toISOString(),
    is_shared: true,
    provider: 'bridge'
  },
  {
    id: 'e5',
    user_id: 'user-123',
    group_id: 'bridge-core-group',
    title: 'Gym Session',
    start_time: new Date(2026, 0, 12, 7, 0).toISOString(),
    end_time: new Date(2026, 0, 12, 8, 30).toISOString(),
    is_shared: false,
    provider: 'bridge'
  }
];

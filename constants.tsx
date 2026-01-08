
import React from 'react';
import { Katha, Scripture } from './types.ts';

export const MOCK_KATHA: Katha[] = [
  {
    id: '1',
    title: 'The Essence of Japji Sahib',
    speaker: 'Giani Thakur Singh Ji',
    thumbnail: 'https://picsum.photos/seed/katha1/400/225',
    type: 'video',
    url: '#',
    duration: '45:20'
  }
];

export const MOCK_SCRIPTURES: Scripture[] = [
  { id: '1', title: 'Nitnem Sahib', pdfUrl: '#', category: 'Daily Prayers' }
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fa-house' },
  { id: 'library', label: 'Library', icon: 'fa-book-open' },
  { id: 'community', label: 'Community', icon: 'fa-users' },
  { id: 'admin', label: 'Admin', icon: 'fa-user-shield' }
];

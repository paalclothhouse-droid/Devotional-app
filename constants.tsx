
import React from 'react';
import { Katha, Scripture } from './types';

export const MOCK_KATHA: Katha[] = [
  {
    id: '1',
    title: 'The Essence of Japji Sahib',
    speaker: 'Giani Thakur Singh Ji',
    thumbnail: 'https://picsum.photos/seed/katha1/400/225',
    type: 'video',
    url: '#',
    duration: '45:20'
  },
  {
    id: '2',
    title: 'Daily Meditation Guide',
    speaker: 'Bhai Satpal Singh',
    thumbnail: 'https://picsum.photos/seed/katha2/400/225',
    type: 'audio',
    url: '#',
    duration: '12:05'
  },
  {
    id: '3',
    title: 'Understanding Seva',
    speaker: 'Bhai Amandeep Singh Ji',
    thumbnail: 'https://picsum.photos/seed/katha3/400/225',
    type: 'video',
    url: '#',
    duration: '32:15'
  }
];

export const MOCK_SCRIPTURES: Scripture[] = [
  { id: '1', title: 'Nitnem Sahib', pdfUrl: '#', category: 'Daily Prayers' },
  { id: '2', title: 'Sukhmani Sahib', pdfUrl: '#', category: 'Prayers' },
  { id: '3', title: 'Asa Di Var', pdfUrl: '#', category: 'Kirtan' }
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fa-house' },
  { id: 'library', label: 'Library', icon: 'fa-book-open' },
  { id: 'community', label: 'Community', icon: 'fa-users' },
  { id: 'admin', label: 'Admin', icon: 'fa-user-shield' }
];

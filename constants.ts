
import { User, Post } from './types';

export const USERS: User[] = [
  {
    id: 1,
    name: 'Original Poster Alice',
    avatar: 'https://picsum.photos/seed/alice/100/100',
  },
  {
    id: 2,
    name: 'Tamperer Bob',
    avatar: 'https://picsum.photos/seed/bob/100/100',
  },
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post1',
    userId: 1,
    imageUrl: 'https://picsum.photos/seed/nature/800/800',
    caption: 'A beautiful day in the mountains! 🏔️',
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
  },
];

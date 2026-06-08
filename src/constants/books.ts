export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  status: 'Available' | 'Borrowed';
  coverUrl: string;
  description: string;
  rating: number;
  publishYear: number;
}

export const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    category: 'Technology',
    status: 'Available',
    coverUrl:
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
    description:
      'The definitive guide to the architecture of storage and processing systems under the hood.',
    rating: 4.9,
    publishYear: 2017,
  },
  {
    id: '2',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    category: 'Technology',
    status: 'Borrowed',
    coverUrl:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400',
    description:
      'A handbook of agile software craftsmanship, filled with clean code examples and principles.',
    rating: 4.8,
    publishYear: 2008,
  },
  {
    id: '3',
    title: 'Dune',
    author: 'Frank Herbert',
    category: 'Literature',
    status: 'Available',
    coverUrl:
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400',
    description:
      'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, who would become the Messiah.',
    rating: 4.7,
    publishYear: 1965,
  },
  {
    id: '4',
    title: '1984',
    author: 'George Orwell',
    category: 'Literature',
    status: 'Available',
    coverUrl:
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400',
    description:
      'A dystopian social science fiction novel and cautionary tale about totalitarianism and state surveillance.',
    rating: 4.8,
    publishYear: 1949,
  },
  {
    id: '5',
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    category: 'Science',
    status: 'Available',
    coverUrl:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400',
    description:
      'A landmark volume in science writing by one of the great minds of our time, exploring cosmology.',
    rating: 4.9,
    publishYear: 1988,
  },
  {
    id: '6',
    title: 'Cosmos',
    author: 'Carl Sagan',
    category: 'Science',
    status: 'Borrowed',
    coverUrl:
      'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=400',
    description:
      "The science, philosophy, and history of cosmic evolution, based on Sagan's legendary television series.",
    rating: 4.9,
    publishYear: 1980,
  },
  {
    id: '7',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Business',
    status: 'Available',
    coverUrl:
      'https://images.unsplash.com/photo-1544716278-e54731a3ab71?auto=format&fit=crop&q=80&w=400',
    description:
      'An easy & proven way to build good habits & break bad ones, revealing how tiny changes yield big results.',
    rating: 4.8,
    publishYear: 2018,
  },
  {
    id: '8',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    category: 'Business',
    status: 'Available',
    coverUrl:
      'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=400',
    description:
      'A comprehensive guide to the two systems that drive our choices: fast, intuitive thinking and slow, logical thinking.',
    rating: 4.7,
    publishYear: 2011,
  },
];

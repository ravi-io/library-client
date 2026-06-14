'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  AlertTriangle,
  BookMarked,
  Search,
  Bell,
  ArrowRight,
  Star,
  Calendar,
  TrendingUp,
  Heart,
  RotateCcw,
  ChevronRight,
  Bookmark,
  Library,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/Navbar';

// ── Mock data ──────────────────────────────────────────────────────────────────

const ACTIVE_LOANS = [
  {
    id: '1',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    dueDate: '2026-06-20',
    daysLeft: 6,
    cover:
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=80&q=80',
    status: 'on-time' as const,
  },
  {
    id: '2',
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt',
    dueDate: '2026-06-16',
    daysLeft: 2,
    cover:
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=80&q=80',
    status: 'due-soon' as const,
  },
  {
    id: '3',
    title: 'Design Patterns',
    author: 'Gang of Four',
    dueDate: '2026-06-12',
    daysLeft: -2,
    cover:
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=80&q=80',
    status: 'overdue' as const,
  },
];

const RESERVATIONS = [
  {
    id: '1',
    title: 'Atomic Habits',
    author: 'James Clear',
    reservedDate: '2026-06-10',
    readyDate: '2026-06-18',
    cover:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=80&q=80',
    status: 'ready' as const,
  },
  {
    id: '2',
    title: 'Deep Work',
    author: 'Cal Newport',
    reservedDate: '2026-06-12',
    readyDate: '2026-06-25',
    cover:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
    status: 'waiting' as const,
  },
];

const RECOMMENDED_BOOKS = [
  {
    id: '1',
    title: "You Don't Know JS",
    author: 'Kyle Simpson',
    rating: 4.8,
    category: 'Technology',
    cover:
      'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=120&q=80',
  },
  {
    id: '2',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    rating: 4.7,
    category: 'Science',
    cover:
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=120&q=80',
  },
  {
    id: '3',
    title: 'The Lean Startup',
    author: 'Eric Ries',
    rating: 4.5,
    category: 'Business',
    cover:
      'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=120&q=80',
  },
  {
    id: '4',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    rating: 4.9,
    category: 'History',
    cover:
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=120&q=80',
  },
];

const ACTIVITY = [
  {
    id: '1',
    action: 'Borrowed',
    book: 'Clean Code',
    time: '2 days ago',
    icon: BookOpen,
    color: 'text-blue-400',
  },
  {
    id: '2',
    action: 'Returned',
    book: 'Refactoring',
    time: '5 days ago',
    icon: RotateCcw,
    color: 'text-emerald-400',
  },
  {
    id: '3',
    action: 'Reserved',
    book: 'Atomic Habits',
    time: '1 week ago',
    icon: Bookmark,
    color: 'text-violet-400',
  },
  {
    id: '4',
    action: 'Returned',
    book: 'The Art of War',
    time: '2 weeks ago',
    icon: RotateCcw,
    color: 'text-emerald-400',
  },
  {
    id: '5',
    action: 'Borrowed',
    book: 'Design Patterns',
    time: '3 weeks ago',
    icon: BookOpen,
    color: 'text-blue-400',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getLoanStatusStyle(status: 'on-time' | 'due-soon' | 'overdue') {
  switch (status) {
    case 'on-time':
      return {
        badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        dot: 'bg-emerald-400',
        label: 'On Time',
      };
    case 'due-soon':
      return {
        badge: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        dot: 'bg-amber-400',
        label: 'Due Soon',
      };
    case 'overdue':
      return {
        badge: 'text-red-400 bg-red-500/10 border-red-500/20',
        dot: 'bg-red-400',
        label: 'Overdue',
      };
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function StudentDashboardPage() {
  const { data: session } = authClient.useSession();
  const [wishlist] = useState<string[]>([]);

  const firstName = session?.user?.name?.split(' ')[0] ?? 'Student';
  const overdueCount = ACTIVE_LOANS.filter(
    (l) => l.status === 'overdue'
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar wishlistCount={wishlist.length} />

      {/* ── Main content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-10">
        {/* ── Welcome Banner ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-800/60 bg-linear-to-br from-slate-900 via-slate-900/90 to-slate-950 p-8 shadow-2xl shadow-black/40">
          {/* decorative glow */}
          <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 left-10 w-48 h-48 rounded-full bg-indigo-500/8 blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mb-1">
                Student Dashboard
              </p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Welcome back,{' '}
                <span className="bg-linear-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                  {firstName}
                </span>{' '}
                👋
              </h1>
              <p className="text-slate-400 text-sm mt-2 max-w-md">
                Track your borrowed books, manage reservations, and discover new
                reads — all in one place.
              </p>

              {overdueCount > 0 && (
                <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  You have {overdueCount} overdue book
                  {overdueCount > 1 ? 's' : ''}. Please return them to avoid
                  fines.
                </div>
              )}
            </div>

            <div className="flex gap-3 shrink-0">
              <Button
                asChild
                className="bg-primary hover:bg-primary-dark text-primary-foreground font-semibold rounded-xl h-10 px-5 text-sm shadow-lg shadow-primary/20 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
              >
                <Link href="/">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Books
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white font-semibold rounded-xl h-10 px-5 text-sm transition-all duration-200 hover:scale-[1.02] cursor-pointer"
              >
                <Link href="/notifications">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Stats Grid ─────────────────────────────────────────────────── */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: 'Books Borrowed',
              value: '12',
              sub: 'All time',
              icon: BookOpen,
              gradient: 'from-blue-500/20 to-indigo-500/10',
              border: 'border-blue-500/20',
              iconColor: 'text-blue-400',
              trend: '+2 this month',
            },
            {
              label: 'Currently Reading',
              value: '3',
              sub: 'Active loans',
              icon: BookMarked,
              gradient: 'from-violet-500/20 to-purple-500/10',
              border: 'border-violet-500/20',
              iconColor: 'text-violet-400',
              trend: '1 due soon',
            },
            {
              label: 'Reservations',
              value: '2',
              sub: 'Pending pickup',
              icon: Bookmark,
              gradient: 'from-emerald-500/20 to-teal-500/10',
              border: 'border-emerald-500/20',
              iconColor: 'text-emerald-400',
              trend: '1 ready now',
            },
            {
              label: 'Reading Streak',
              value: '14',
              sub: 'Days active',
              icon: TrendingUp,
              gradient: 'from-amber-500/20 to-orange-500/10',
              border: 'border-amber-500/20',
              iconColor: 'text-amber-400',
              trend: 'Personal best!',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`relative overflow-hidden rounded-2xl border ${stat.border} bg-linear-to-br ${stat.gradient} p-5 backdrop-blur-sm shadow-lg shadow-black/20 hover:scale-[1.02] transition-all duration-200`}
            >
              <div className="flex items-start justify-between mb-4">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide leading-tight">
                  {stat.label}
                </p>
                <div
                  className={`w-8 h-8 rounded-xl bg-slate-900/60 border border-slate-800/60 flex items-center justify-center ${stat.iconColor}`}
                >
                  <stat.icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-white mb-0.5">
                {stat.value}
              </p>
              <p className="text-[11px] text-slate-500">{stat.sub}</p>
              <p className={`text-[10px] font-semibold mt-2 ${stat.iconColor}`}>
                {stat.trend}
              </p>
            </div>
          ))}
        </section>

        {/* ── Main Grid: Loans + Reservations + Activity ─────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Loans (spans 2 cols) */}
          <section className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4.5 h-4.5 text-blue-400" />
                Active Loans
              </h2>
              <Link
                href="/loans"
                className="text-xs text-slate-400 hover:text-primary-light flex items-center gap-1 transition-colors"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {ACTIVE_LOANS.map((loan) => {
                const style = getLoanStatusStyle(loan.status);
                return (
                  <div
                    key={loan.id}
                    className="group flex items-center gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 hover:bg-slate-900/70 hover:border-slate-700/60 transition-all duration-200 shadow-sm"
                  >
                    {/* Cover */}
                    <div className="w-12 h-16 rounded-xl overflow-hidden bg-slate-800 shrink-0 shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={loan.cover}
                        alt={loan.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate group-hover:text-primary-light transition-colors">
                        {loan.title}
                      </p>
                      <p className="text-xs text-slate-400 mb-2">
                        by {loan.author}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-bold ${style.badge} border px-2 py-0.5 rounded-full`}
                        >
                          <span
                            className={`inline-block w-1.5 h-1.5 rounded-full ${style.dot} mr-1.5`}
                          />
                          {style.label}
                        </Badge>
                        <span className="flex items-center gap-1 text-[10px] text-slate-500">
                          <Calendar className="w-3 h-3" />
                          Due {loan.dueDate}
                        </span>
                      </div>
                    </div>

                    {/* Days left */}
                    <div className="text-right shrink-0">
                      {loan.daysLeft < 0 ? (
                        <p className="text-sm font-extrabold text-red-400">
                          {Math.abs(loan.daysLeft)}d late
                        </p>
                      ) : (
                        <p className="text-sm font-extrabold text-slate-200">
                          {loan.daysLeft}d left
                        </p>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-1.5 text-[10px] h-6 px-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-all"
                      >
                        Renew
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reservations */}
            <div className="flex items-center justify-between pt-2">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Bookmark className="w-4.5 h-4.5 text-violet-400" />
                Reservations
              </h2>
              <Link
                href="/reservations"
                className="text-xs text-slate-400 hover:text-primary-light flex items-center gap-1 transition-colors"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {RESERVATIONS.map((res) => (
                <div
                  key={res.id}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 hover:bg-slate-900/70 hover:border-slate-700/60 transition-all duration-200 shadow-sm"
                >
                  <div className="w-12 h-16 rounded-xl overflow-hidden bg-slate-800 shrink-0 shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={res.cover}
                      alt={res.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">
                      {res.title}
                    </p>
                    <p className="text-xs text-slate-400 mb-2">
                      by {res.author}
                    </p>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${res.status === 'ready' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20'}`}
                    >
                      {res.status === 'ready' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 mr-1 inline" />
                          Ready for Pickup
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 mr-1 inline" />
                          In Queue
                        </>
                      )}
                    </Badge>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-slate-500">Available</p>
                    <p className="text-xs font-bold text-slate-300">
                      {res.readyDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Activity Feed (1 col) */}
          <section className="space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Library className="w-4.5 h-4.5 text-slate-400" />
              Recent Activity
            </h2>
            <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 overflow-hidden shadow-sm">
              <ul className="divide-y divide-slate-800/50">
                {ACTIVITY.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-3.5 p-4 hover:bg-slate-800/30 transition-colors"
                  >
                    <div
                      className={`mt-0.5 w-7 h-7 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 ${item.color}`}
                    >
                      <item.icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-200">
                        <span className="text-slate-400">{item.action}</span>{' '}
                        <span className="text-white">{item.book}</span>
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {item.time}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Actions */}
            <h2 className="text-base font-bold text-white flex items-center gap-2 pt-2">
              <Award className="w-4.5 h-4.5 text-amber-400" />
              Quick Actions
            </h2>
            <div className="space-y-2">
              {[
                {
                  label: 'Browse Book Catalog',
                  href: '/',
                  icon: Search,
                  color: 'text-blue-400',
                  bg: 'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/15',
                },
                {
                  label: 'My Wishlist',
                  href: '/',
                  icon: Heart,
                  color: 'text-rose-400',
                  bg: 'bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/15',
                },
                {
                  label: 'Loan History',
                  href: '/loans',
                  icon: Clock,
                  color: 'text-violet-400',
                  bg: 'bg-violet-500/10 border-violet-500/20 hover:bg-violet-500/15',
                },
                {
                  label: 'My Profile',
                  href: '/profile',
                  icon: BookOpen,
                  color: 'text-emerald-400',
                  bg: 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/15',
                },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border ${action.bg} transition-all duration-200 group`}
                >
                  <div className="flex items-center gap-3">
                    <action.icon className={`w-4 h-4 ${action.color}`} />
                    <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
                      {action.label}
                    </span>
                  </div>
                  <ArrowRight
                    className={`w-3.5 h-3.5 ${action.color} opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all`}
                  />
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* ── Recommended Books ──────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Star className="w-4.5 h-4.5 text-amber-400 fill-amber-400" />
              Recommended for You
            </h2>
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-primary-light flex items-center gap-1 transition-colors"
            >
              See all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {RECOMMENDED_BOOKS.map((book) => (
              <Link
                key={book.id}
                href="/"
                className="group flex flex-col rounded-2xl overflow-hidden bg-slate-900/40 border border-slate-800/60 hover:border-slate-700 hover:bg-slate-900/70 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-black/20 hover:scale-[1.02]"
              >
                <div className="aspect-3/4 bg-slate-800 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="p-3 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary-light mb-1">
                    {book.category}
                  </p>
                  <p className="text-xs font-bold text-white line-clamp-2 group-hover:text-primary-light transition-colors mb-1">
                    {book.title}
                  </p>
                  <p className="text-[10px] text-slate-500">by {book.author}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-[10px] font-bold text-amber-400">
                      {book.rating}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

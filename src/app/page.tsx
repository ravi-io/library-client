'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { MOCK_BOOKS } from '@/constants/books';
import {
  Search,
  BookOpen,
  LogOut,
  LayoutDashboard,
  Heart,
  Bookmark,
  Lock,
  X,
  Check,
  Star,
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [reservedBooks, setReservedBooks] = useState<string[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [modalAction, setModalAction] = useState<
    'wishlist' | 'reserve' | 'general'
  >('general');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Categories list
  const categories = ['All', 'Technology', 'Literature', 'Science', 'Business'];

  // Filter books
  const filteredBooks = useMemo(() => {
    return MOCK_BOOKS.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || book.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Show temporary toast message
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sign out handler
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          triggerToast('Signed out successfully');
          router.refresh();
        },
      },
    });
  };

  // Wishlist handler
  const handleWishlist = (bookId: string, bookTitle: string) => {
    if (!session) {
      setModalAction('wishlist');
      setShowAuthModal(true);
      return;
    }

    setWishlist((prev) => {
      const exists = prev.includes(bookId);
      if (exists) {
        triggerToast(`Removed "${bookTitle}" from your wishlist`);
        return prev.filter((id) => id !== bookId);
      } else {
        triggerToast(`Added "${bookTitle}" to your wishlist!`);
        return [...prev, bookId];
      }
    });
  };

  // Reserve handler
  const handleReserve = (
    bookId: string,
    bookTitle: string,
    status: 'Available' | 'Borrowed'
  ) => {
    if (!session) {
      setModalAction('reserve');
      setShowAuthModal(true);
      return;
    }

    if (status === 'Borrowed') {
      triggerToast(
        `"${bookTitle}" is currently borrowed. You will be notified when it returns.`
      );
      return;
    }

    setReservedBooks((prev) => {
      const exists = prev.includes(bookId);
      if (exists) {
        triggerToast(`Cancelled reservation for "${bookTitle}"`);
        return prev.filter((id) => id !== bookId);
      } else {
        triggerToast(
          `Successfully reserved "${bookTitle}"! You can pick it up within 24 hours.`
        );
        return [...prev, bookId];
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-primary selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 border border-emerald-500/30 text-emerald-400 rounded-xl shadow-xl shadow-black/50 animate-bounce duration-500">
          <Check className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
              <BookOpen className="w-5 h-5 text-primary-light" />
            </div>
            <span className="text-lg font-bold bg-linear-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
              BeaconLibrary
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <a href="#browse" className="hover:text-white transition-colors">
              Browse Books
            </a>
            <a href="#featured" className="hover:text-white transition-colors">
              Popular Reads
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/books"
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 hover:text-white transition-all font-medium"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </Link>

                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/60 rounded-lg border border-slate-900 text-xs text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary-light font-bold">
                    {session.user.name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden md:inline font-semibold">
                    {session.user.name}
                  </span>
                  {wishlist.length > 0 && (
                    <span className="flex items-center gap-1 ml-2 text-rose-400 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded-full text-[10px]">
                      <Heart className="w-2.5 h-2.5 fill-rose-400" />
                      {wishlist.length}
                    </span>
                  )}
                </div>

                <button
                  onClick={handleSignOut}
                  className="p-2 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-all cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Browse Only
                </div>
                <Link
                  href="/login"
                  className="px-4 py-1.5 text-sm hover:bg-slate-900 rounded-lg text-slate-300 hover:text-white transition-all font-medium"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-1.5 text-sm bg-primary hover:bg-primary-dark text-primary-foreground rounded-lg transition-all font-semibold shadow-lg shadow-primary/10 hover:shadow-primary/20"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 flex flex-col items-center justify-center text-center px-4 overflow-hidden border-b border-slate-900">
        {/* Background Image with dark overlay */}
        <div className="absolute inset-0 z-0 bg-slate-950">
          <Image
            src="/library_bg.png"
            alt="Library Hero background"
            fill
            priority
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-linear-to-b from-slate-950/10 via-slate-950/80 to-slate-950" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-xs font-semibold mb-6">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Welcome to Brindavan Library Portal
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-white max-w-2xl leading-[1.15]">
            Explore a World of{' '}
            <span className="bg-linear-to-r from-blue-400 via-indigo-400 to-cyan-300 bg-clip-text text-transparent">
              Knowledge
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-xl leading-relaxed">
            Search, preview, and request books from our collection.{' '}
            {session
              ? 'Manage your borrows from the dashboard.'
              : 'Sign in to access reservations and wishlists.'}
          </p>

          {/* Real-time Search Box */}
          <div
            id="browse"
            className="w-full max-w-xl relative flex items-center group"
          >
            <Search className="absolute left-4 w-5 h-5 text-slate-500 group-focus-within:text-primary-light transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, or keywords..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-xl shadow-black/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Browse Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filtering & Headers */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-900 pb-6">
          <div>
            <h2 id="featured" className="text-2xl font-bold text-white">
              Book Collection
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Showing {filteredBooks.length} of {MOCK_BOOKS.length} books
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/15'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredBooks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-900/20 border border-slate-900/60 rounded-3xl p-8">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              No Books Found
            </h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">
              We couldn&apos;t find any books matching &quot;{searchQuery}&quot;
              in {selectedCategory}. Try adjusting your keywords.
            </p>
          </div>
        )}

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => {
            const isWishlisted = wishlist.includes(book.id);
            const isReserved = reservedBooks.includes(book.id);

            return (
              <div
                key={book.id}
                className="group flex flex-col bg-slate-900/40 border border-slate-900 rounded-2xl overflow-hidden hover:border-slate-800/80 hover:bg-slate-900/60 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-black/20"
              >
                {/* Book Cover Container */}
                <div className="relative aspect-3/4 bg-slate-950 overflow-hidden">
                  <Image
                    src={book.coverUrl}
                    alt={book.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Floating category badge */}
                  <span className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md text-[10px] font-bold rounded-lg text-primary-light uppercase tracking-wider border border-white/5">
                    {book.category}
                  </span>

                  {/* Rating */}
                  <span className="absolute bottom-3 right-3 px-2 py-1 bg-slate-900/90 backdrop-blur-md text-[10px] font-bold rounded-lg text-amber-400 border border-slate-800 flex items-center gap-1 shadow-md">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    {book.rating}
                  </span>

                  {/* Wishlist Floating Button */}
                  <button
                    onClick={() => handleWishlist(book.id, book.title)}
                    className={`absolute top-3 right-3 p-2 rounded-full border backdrop-blur-md transition-all cursor-pointer ${
                      isWishlisted
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                        : 'bg-black/60 border-white/5 text-slate-400 hover:text-rose-400'
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500' : ''}`}
                    />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Availability Badge */}
                  <div className="mb-2">
                    {book.status === 'Available' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        Borrowed
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-white line-clamp-1 group-hover:text-primary-light transition-colors mb-1">
                    {book.title}
                  </h3>

                  <p className="text-xs text-slate-400 mb-3">
                    by{' '}
                    <span className="font-medium text-slate-300">
                      {book.author}
                    </span>
                  </p>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4 flex-1">
                    {book.description}
                  </p>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-900/60 mt-auto flex items-center justify-between gap-2">
                    <button
                      onClick={() =>
                        handleReserve(book.id, book.title, book.status)
                      }
                      disabled={book.status === 'Borrowed' && !isReserved}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isReserved
                          ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30'
                          : book.status === 'Borrowed'
                            ? 'bg-slate-950 border border-slate-900 text-slate-500 cursor-not-allowed'
                            : 'bg-primary text-primary-foreground hover:bg-primary-dark shadow-md shadow-primary/10 hover:shadow-primary/20'
                      }`}
                    >
                      {isReserved ? (
                        <>
                          <Bookmark className="w-3.5 h-3.5 fill-emerald-400" />
                          Reserved
                        </>
                      ) : book.status === 'Borrowed' ? (
                        'Waitlisted'
                      ) : (
                        'Reserve Book'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-10 mt-20 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="mb-2">
            © {new Date().getFullYear()} Brindavan College Library System. All
            rights reserved.
          </p>
          <div className="flex gap-4 justify-center mt-3 text-slate-600">
            <a href="#" className="hover:text-slate-400">
              Terms of Service
            </a>
            <span>•</span>
            <a href="#" className="hover:text-slate-400">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-slate-400">
              Contact Support
            </a>
          </div>
        </div>
      </footer>

      {/* Authentic Glassmorphism Login Required Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-md p-8 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl shadow-2xl animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20 text-amber-500">
                <Lock className="w-5 h-5" />
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Authentication Required
            </h3>

            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              {modalAction === 'wishlist'
                ? 'Adding books to your personal wishlist requires an account. Log in or create an account to start curating your reads.'
                : 'Reserving books for quick counter pickup requires an authenticated account. Join us to start borrow records.'}
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setShowAuthModal(false)}
                className="w-full py-2.5 px-4 bg-primary text-primary-foreground hover:bg-primary-dark font-bold rounded-xl shadow-lg shadow-primary/25 text-center transition-all duration-200"
              >
                Sign In to Account
              </Link>
              <Link
                href="/signup"
                onClick={() => setShowAuthModal(false)}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold rounded-xl text-center transition-all duration-200"
              >
                Register New Account
              </Link>
              <button
                onClick={() => setShowAuthModal(false)}
                className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-300 font-medium transition-all cursor-pointer"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

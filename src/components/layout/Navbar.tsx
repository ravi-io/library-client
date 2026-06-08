'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { BookOpen, LogOut, LayoutDashboard, Heart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface NavbarProps {
  wishlistCount: number;
}

export function Navbar({ wishlistCount }: NavbarProps) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success('Signed out successfully');
          router.refresh();
        },
      },
    });
  };

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'border-b border-slate-900 bg-slate-950/80 backdrop-blur-md shadow-lg shadow-black/20'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex-1 flex items-center justify-start gap-2.5">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
            <BookOpen className="w-5 h-5 text-primary-light" />
          </div>
          <span className="text-xl font-bold bg-linear-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
            BeaconLibrary
          </span>
        </div>

        <nav className="hidden md:flex items-center justify-center gap-8 text-sm font-medium text-slate-400">
          <a href="#browse" className="hover:text-white transition-colors">
            Browse Books
          </a>
          <a href="#featured" className="hover:text-white transition-colors">
            Popular Reads
          </a>
        </nav>

        <div className="flex-1 flex items-center justify-end gap-4">
          {isPending ? (
            <div className="flex items-center gap-3.5">
              <div className="hidden sm:block w-28 h-10 bg-slate-900/50 rounded-xl border border-slate-800/40 animate-pulse" />
              <div className="w-10 h-10 bg-slate-900/50 rounded-full border border-slate-800/40 animate-pulse" />
            </div>
          ) : session ? (
            <div className="flex items-center gap-3.5">
              <Button
                asChild
                variant="outline"
                className="hidden sm:inline-flex items-center justify-center border border-slate-800 bg-slate-900/90 hover:bg-slate-800 text-slate-100 hover:text-white rounded-xl h-10 px-4 text-sm font-semibold cursor-pointer transition-all duration-200 shadow-md shadow-black/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Link href="/books">
                  <LayoutDashboard className="w-4 h-4 mr-2 text-slate-400" />
                  Dashboard
                </Link>
              </Button>

              {wishlistCount > 0 && (
                <span className="flex items-center gap-1.5 text-rose-400 font-semibold bg-rose-500/10 px-2.5 py-1 rounded-full text-xs border border-rose-500/20 h-6">
                  <Heart className="w-3.5 h-3.5 fill-rose-400" />
                  {wishlistCount}
                </span>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-10 h-10 rounded-full overflow-hidden border border-slate-800 hover:border-slate-600 cursor-pointer select-none transition-all duration-200 hover:scale-105 active:scale-[0.95] data-[state=open]:border-primary data-[state=open]:ring-2 data-[state=open]:ring-primary/20 shadow-md shadow-black/30">
                    <AvatarFallback className="bg-slate-900 text-slate-200 text-sm font-bold rounded-full flex items-center justify-center">
                      {session.user.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-68 p-1.5 bg-slate-950/75 backdrop-blur-xl border border-slate-800/40 rounded-xl shadow-2xl shadow-black/80 space-y-1 text-slate-200"
                >
                  <DropdownMenuLabel className="font-normal flex items-center gap-3 px-2.5 py-2.5">
                    <Avatar className="w-9 h-9 rounded-full overflow-hidden border border-slate-800">
                      <AvatarFallback className="bg-primary/20 text-primary-light text-xs font-bold rounded-full flex items-center justify-center">
                        {session.user.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-semibold text-white leading-none">
                        {session.user.name}
                      </p>
                      <p className="text-xs leading-none text-slate-400 mt-1">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-800/60 my-1" />
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer px-3 py-2 rounded-xl transition-all duration-200 hover:bg-slate-800/80 focus:bg-slate-800/80 text-slate-300 hover:text-white focus:text-white"
                  >
                    <Link href="/books" className="flex items-center w-full">
                      <LayoutDashboard className="mr-2.5 h-4 w-4 text-slate-400" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer px-3 py-2 rounded-xl transition-all duration-200 hover:bg-slate-800/80 focus:bg-slate-800/80 text-slate-300 hover:text-white focus:text-white"
                  >
                    <Link href="/account" className="flex items-center w-full">
                      <User className="mr-2.5 h-4 w-4 text-slate-400" />
                      <span>Account Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-800/60 my-1" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer px-3 py-2 rounded-xl transition-all duration-200 text-red-400 hover:bg-red-500/10 hover:text-red-300 focus:bg-red-500/10 focus:text-red-300"
                  >
                    <LogOut className="mr-2.5 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                asChild
                className="bg-primary hover:bg-primary-dark text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/35 rounded-xl h-10 px-4 text-sm cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Link href="/login">Log In</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

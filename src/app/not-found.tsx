import Link from 'next/link';
import { Compass, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center relative px-4 overflow-hidden select-none">
      {/* Decorative gradient glowing spots */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 text-center flex flex-col items-center max-w-md w-full">
        {/* Animated icon container */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-xl scale-90 animate-pulse" />
          <div className="w-20 h-20 bg-slate-900/90 border border-slate-800 rounded-3xl flex items-center justify-center shadow-2xl relative z-10">
            <Compass className="w-10 h-10 text-primary-light animate-pulse" />
          </div>
        </div>

        {/* 404 text and headers */}
        <span className="text-sm font-semibold tracking-wider text-primary-light uppercase mb-2">
          404 Error
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
          Lost in the Stacks?
        </h1>
        <p className="text-slate-400 text-sm md:text-base mb-10 leading-relaxed">
          The page you are looking for doesn&apos;t exist, has been moved, or is temporarily unavailable. Let&apos;s get you back on track!
        </p>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <Button
            asChild
            className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-primary-foreground font-semibold shadow-lg shadow-primary/10 hover:shadow-primary/20 rounded-xl px-5 h-10 transition-all duration-200 cursor-pointer"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Back Home
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:text-white text-slate-300 rounded-xl px-5 h-10 transition-all duration-200 cursor-pointer"
          >
            <Link href="/#browse">
              <Search className="w-4 h-4 mr-2 text-slate-400" />
              Browse Books
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

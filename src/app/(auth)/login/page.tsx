import { LoginForm } from '@/modules/auth/components/LoginForm';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 overflow-hidden">
      {/* Background Image with deep black overlay */}
      <div className="absolute inset-0 z-0 bg-slate-950">
        <Image
          src="/library_bg.png"
          alt="Library Background"
          fill
          priority
          className="object-cover opacity-60"
        />
        {/* Soft black/slate-950 radial overlay to focus center card */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,#020617_90%)]" />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/80" />
      </div>

      <div className="relative z-10 w-full flex justify-center">
        <LoginForm />
      </div>
    </div>
  );
}

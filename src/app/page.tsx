import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground gap-4 p-6">
      <h1 className="text-3xl font-bold text-center">Library Management System</h1>
      <p className="text-muted-foreground text-center">Welcome to the administration portal.</p>
      <div className="flex gap-4 mt-2">
        <Link
          href="/login"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary-dark transition-colors font-medium"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}

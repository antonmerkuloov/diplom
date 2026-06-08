import RuneBackground from '@/components/ui/RuneBackground';
import ThemeToggle from '@/components/ui/ThemeToggle';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="dark">
      <body className="bg-[var(--bg-card)]k text-[var(--text-primary)]">
        <RuneBackground />
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}
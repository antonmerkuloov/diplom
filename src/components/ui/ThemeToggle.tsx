'use client';
export default function ThemeToggle() {
  return (
    <button
      onClick={() => {
        console.log('clicked');
        document.documentElement.classList.toggle('dark');
      }}
      className="fixed bottom-4 right-4 z-50 bg-gold text-black p-3 rounded-full shadow-lg"
    >
      🌓
    </button>
  );
}
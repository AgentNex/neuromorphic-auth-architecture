import "./globals.css";
import { ReactNode } from "react";
import Navbar from "@/components/ui/Navbar";

export const metadata = {
  title: 'Antigravity | Neuromorphic Auth & Platform',
  description: 'Enterprise-grade high-performance neuromorphic authentication suite built with Next.js and InsForge',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('neuro-theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (stored === 'dark' || (!stored && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased bg-[var(--neuro-base)] text-[var(--neuro-text-primary)] transition-colors duration-200 flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col w-full">
          {children}
        </main>
      </body>
    </html>
  );
}

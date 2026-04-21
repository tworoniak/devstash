import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevStash",
  description: "A unified hub for developer knowledge & resources",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <ThemeProvider>
          {children}
          <Toaster
            theme="dark"
            toastOptions={{
              classNames: {
                toast: 'border border-border bg-card text-foreground text-sm',
                title: 'font-medium',
                description: 'text-muted-foreground',
                success: 'border-green-500/40 bg-green-950/60 text-green-100 [&>[data-icon]]:text-green-400',
                error: 'border-red-500/40 bg-red-950/60 text-red-100 [&>[data-icon]]:text-red-400',
                warning: 'border-amber-500/40 bg-amber-950/60 text-amber-100 [&>[data-icon]]:text-amber-400',
                info: 'border-blue-500/40 bg-blue-950/60 text-blue-100 [&>[data-icon]]:text-blue-400',
                actionButton: 'bg-foreground text-background text-xs font-medium',
                cancelButton: 'bg-muted text-muted-foreground text-xs',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}

import { Geist } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-theme="dark" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background antialiased">
        {children}
      </body>
    </html>
  );
}

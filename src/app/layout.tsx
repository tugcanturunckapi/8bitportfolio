import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "8-Bit Portfolio | Frontend Developer",
  description:
    "A fun, interactive 8-bit retro style portfolio website showcasing frontend development skills and projects.",
  keywords:
    "frontend developer, portfolio, 8-bit, retro, react, typescript, tailwind",
  authors: [{ name: "Frontend Developer" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="retro-bg min-h-screen">{children}</body>
    </html>
  );
}

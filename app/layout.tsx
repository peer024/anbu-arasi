import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A Little Something For You",
  description: "A special birthday experience ❤️",

  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
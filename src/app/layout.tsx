import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PhishNet 3D | Cyber Security Simulator",
  description: "An immersive First-Person Simulator for Cyber Security training.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

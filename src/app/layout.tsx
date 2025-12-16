import type { Metadata } from "next";
import "./globals.css";

export const metadata = {
  title: "PhishNet 3D - Cyber Defense Simulator",
  description: "Advanced cybersecurity training simulation.",
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

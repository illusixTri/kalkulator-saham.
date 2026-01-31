import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// --- BAGIAN INI YANG MENGATUR JUDUL TAB BROWSER ---
export const metadata: Metadata = {
  title: "Kalkulator Saham & RI | Illusix",
  description: "Tools Lengkap Analisa Saham, Right Issue, dan Strategi Scale In/Out.",
  icons: {
    icon: "/favicon.ico", // Ikon kecil di tab (opsional)
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-slate-100 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
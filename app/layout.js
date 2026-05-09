import { DM_Sans } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/query/QueryProvider";
import { Toaster } from "react-hot-toast";

const dm_sans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Oiki",
  description: "Muslim Fashion",
  icons: {
    icon: "/assets/oiki-icon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dm_sans.variable} h-full antialiased`}>
      <body className="min-h-full font-dm-sans">
        <QueryProvider>
          <Toaster />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}

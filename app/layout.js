import { DM_Sans } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/query/QueryProvider";
import MyProvider from "@/context/MyProvider";
import { ToastContainer } from "react-toastify";
import { CartProvider } from "@/context/CartContext";

const dm_sans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Prety Pet",
  description: "Pet Accessories and Gadgets",
  icons: {
    icon: "/assets/pretypet-logo-short.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dm_sans.variable} h-full antialiased`}>
      <body className="min-h-full font-dm-sans">
        <QueryProvider>
          <MyProvider>
            <CartProvider>
              <ToastContainer />
              {children}
            </CartProvider>
          </MyProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

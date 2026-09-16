import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CartProvider } from "@/lib/context/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";
import { AICuratorProvider } from "@/lib/context/AICuratorContext";
import AICuratorChatbot from "@/components/ai/AICuratorChatbot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ArtHall — Premium Art Gallery & Marketplace",
  description: "A modern digital art gallery and marketplace platform connecting global creators with art enthusiasts.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const storedTheme = localStorage.getItem('theme') || 'dark';
                if (storedTheme === 'light') {
                  document.documentElement.classList.add('light');
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="" suppressHydrationWarning={true}>
        <CartProvider>
          <AICuratorProvider>
            <Navbar />
            <CartDrawer />
            <AICuratorChatbot />
            <main>
              {children}
            </main>
            <Footer />
          </AICuratorProvider>
        </CartProvider>
      </body>
    </html>
  );
}

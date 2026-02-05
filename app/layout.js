import { Geist, Geist_Mono, Jost, Lato } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import ReduxProvider from "@/Providers/ReduxProvider";
import WhatsAppFloating from "@/components/Whatsapp/WhatsAppFloating";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const googleJost = Jost({
  variable: "--font-Jost",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const googleLato = Lato({
  variable: "--font-Lato",
  weight: ["100", "300", "400", "700", "900"],
});

export const metadata = {
  title: {
    default: "United Furniture UAE | Premium Home & Office Furniture",
    template: "%s | United Furniture UAE"
  },
  description: "Discover luxury furniture in UAE. Shop premium home and office furniture at United Furniture. Quality, elegance, and comfort for your living space.",
  keywords: ["furniture uae", "luxury furniture", "home decor", "office furniture dubai"],
  authors: [{ name: "United Furniture" }],
  creator: "United Furniture",
  publisher: "United Furniture",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "United Furniture UAE | Premium Home & Office Furniture",
    description: "Discover luxury furniture in UAE. Shop premium home and office furniture at United Furniture.",
    url: "https://unitedfurniture.ae",
    siteName: "United Furniture",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "United Furniture UAE | Premium Home & Office Furniture",
    description: "Discover luxury furniture in UAE. Shop premium home and office furniture at United Furniture.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${googleJost.variable} ${googleLato.variable} antialiased`}
      >
        <ReduxProvider>
          <ToastContainer />
          {children}
          {/* <a
            href="https://wa.me/+8801611239608"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              backgroundColor: "#25D366",
              color: "#fff",
              borderRadius: "50%",
              width: "60px",
              height: "60px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "28px",
              zIndex: 1000,
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              transition: "transform 0.2s",
            }}
          >
            <FaWhatsapp />
          </a> */}

          <WhatsAppFloating />
        </ReduxProvider>
      </body>
    </html>
  );
}

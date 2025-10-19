import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "FlashTimez - Breaking News & Global Updates",
  description:
    "Stay ahead with FlashTimez - Your premier destination for breaking news, international updates, politics, technology, business, sports, and entertainment from around the world.",
  keywords:
    "breaking news, international news, world news, politics, technology, business, sports, entertainment, global updates, current events, FlashTimez",
  authors: [{ name: "FlashTimez Editorial Team" }],
  creator: "FlashTimez",
  publisher: "FlashTimez Media",
  robots: "index, follow",
  openGraph: {
    title: "FlashTimez - Breaking News & Global Updates",
    description:
      "Your premier destination for breaking news and international updates",
    url: "https://flashtimez.com",
    siteName: "FlashTimez",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlashTimez - Breaking News & Global Updates",
    description:
      "Your premier destination for breaking news and international updates",
    creator: "@flashtimez",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
      </head>
      <body className="antialiased bg-flash-secondary transition-colors duration-300">
        <div className="min-h-screen flex flex-col">
          {/* Skip to main content for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-flash-primary text-white px-4 py-2 rounded-md z-50 transition-all"
          >
            Skip to main content
          </a>

          <Navbar />

          <main id="main-content" className="flex-1">
            {children}
          </main>

          <Footer />
        </div>

        {/* Background Pattern */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-100/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-yellow-100/20 to-transparent rounded-full blur-3xl"></div>
        </div>
      </body>
    </html>
  );
}

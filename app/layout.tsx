import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "RoleScope AI | Kariyer Asistanı",
  description: "Yapay zeka destekli CV analizi ve kariyer yönlendirme platformu.",
};

const GA_MEASUREMENT_ID = "G-VSP4HJQMVX";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>

        {/* --- GOOGLE ANALYTICS (GA4) --- */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        {/* --- GOOGLE ANALYTICS END --- */}

        {children}
      </body>
    </html>
  );
}

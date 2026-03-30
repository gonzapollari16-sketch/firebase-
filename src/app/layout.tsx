import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Sidebar } from '@/components/sidebar';
import Script from 'next/script';

/**
 * @fileOverview Root Layout (Server Component).
 * Configurado para máxima estabilidad en SSR. 
 */

export const metadata: Metadata = {
  title: 'Crushome | Real Estate OS 2026',
  description: 'Infraestructura de control económico del mercado inmobiliario.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href='https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css' rel='stylesheet' />
      </head>
      <body className="antialiased selection:bg-accent/30 selection:text-white">
        <Providers>
          <div className="flex min-h-screen">
            <Sidebar />
            {children}
          </div>
        </Providers>

        {/* Carga de dependencias externas críticas */}
        <Script 
          src="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js" 
          strategy="beforeInteractive" 
        />
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';

import { CartProvider } from '@/lib/CartContext';
import { CartDrawer } from '@/components/CartDrawer';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: 'REV SYSTEM | Plataforma de Produtos Digitais',
  description: 'A plataforma perfeita para suas compras virtuais.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="antialiased bg-black text-foreground">
        <CartProvider>
          <Header />
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}

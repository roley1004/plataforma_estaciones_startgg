import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Start.gg Station Manager | Gestor de Estaciones para Torneos',
  description: 'Plataforma de logística física, asignación de consolas y check-in QR para torneos de eSports.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

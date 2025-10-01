import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Product Insights Dashboard',
  description: 'View product data and business insights',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <div className="container">
            <h1>Product Insights Dashboard</h1>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}

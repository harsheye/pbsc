'use client';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

interface LayoutWrapperProps {
  children: React.ReactNode;
  includeHeader?: boolean;
}

export default function LayoutWrapper({ children, includeHeader = true }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {!isHomePage && includeHeader && <Header />}
      <main className={`${!isHomePage ? 'pt-24' : ''} flex-grow`}>
        {children}
      </main>
      <Footer />
    </div>
  );
} 
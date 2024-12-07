'use client';
import { usePathname } from 'next/navigation';

export default function LayoutWrapper({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <main className={`
      ${pathname === '/' ? '' : 'pt-24'}
      flex-grow bg-gray-900
    `}>
      {children}
    </main>
  );
} 
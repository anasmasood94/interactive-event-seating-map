import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
      {children}
    </div>
  );
}

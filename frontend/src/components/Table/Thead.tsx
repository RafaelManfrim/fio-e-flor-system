import type { ReactNode } from 'react';

interface TheadProps {
  children: ReactNode;
}

export function Thead({ children }: TheadProps) {
  return (
    <thead className="bg-gray-50 dark:bg-gray-900 transition-colors">
      {children}
    </thead>
  );
}

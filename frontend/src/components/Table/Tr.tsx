import type { ReactNode } from 'react';

interface TrProps {
  children: ReactNode;
}

export function Tr({ children }: TrProps) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      {children}
    </tr>
  );
}

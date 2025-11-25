import type { ReactNode } from 'react';

interface TbodyProps {
  children: ReactNode;
}

export function Tbody({ children }: TbodyProps) {
  return (
    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors">
      {children}
    </tbody>
  );
}

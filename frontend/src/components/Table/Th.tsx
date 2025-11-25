import type { ReactNode } from 'react';

interface ThProps {
  children: ReactNode;
  align?: 'left' | 'center' | 'right';
}

export function Th({ children, align = 'left' }: ThProps) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[align];

  return (
    <th className={`px-6 py-3 ${alignClass} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`}>
      {children}
    </th>
  );
}

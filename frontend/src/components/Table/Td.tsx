import type { ReactNode } from 'react';

interface TdProps {
  children: ReactNode;
  align?: 'left' | 'center' | 'right';
  colSpan?: number;
}

export function Td({ children, align = 'left', colSpan }: TdProps) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[align];

  return (
    <td className={`px-6 py-3 ${alignClass}`} colSpan={colSpan}>
      {children}
    </td>
  );
}

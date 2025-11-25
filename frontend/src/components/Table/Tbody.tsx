import type { ReactNode } from 'react';

interface TbodyProps {
  children: ReactNode;
}

export function Tbody({ children }: TbodyProps) {
  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {children}
    </tbody>
  );
}

import { ReactNode } from 'react';

export default function StickyActions({ children }: { children: ReactNode }) {
  return (
    <div className="sticky top-0 z-10 bg-white py-3 mb-4 border-b border-gray-100 flex justify-end gap-2">
      {children}
    </div>
  );
}

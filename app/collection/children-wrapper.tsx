'use client';

import { Fragment } from 'react';

// Ensure children are re-rendered when the search query changes
export default function ChildrenWrapper({ children }: { children: React.ReactNode }) {
  return <Fragment key={"searchParams.get('q')"}>{children}</Fragment>;
}

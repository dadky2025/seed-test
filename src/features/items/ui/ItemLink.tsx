import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';

interface ItemLinkProps {
  id: string;
  className?: string;
  children: ReactNode;
}

/** The one place this feature touches the router's link component: Screens stay router-agnostic. */
export function ItemLink({ id, className, children }: ItemLinkProps) {
  return (
    <Link to="/items/$id" params={{ id }} className={className}>
      {children}
    </Link>
  );
}

interface ItemsListLinkProps {
  className?: string;
  children: ReactNode;
}

export function ItemsListLink({ className, children }: ItemsListLinkProps) {
  return (
    <Link to="/items" className={className}>
      {children}
    </Link>
  );
}

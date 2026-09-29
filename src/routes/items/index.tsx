import { noop } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { ItemsListPage, itemsListQuery } from '@/features/items';

export const Route = createFileRoute('/items/')({
  // Prefetch on navigation (and on hover, through defaultPreload: 'intent'). query(…).catch(noop)
  // never throws (it replaces prefetchQuery, deprecated since TanStack Query 5.104), so a failed load
  // reaches the view model and the Screen's error state (with retry) — not the route's errorComponent.
  loader: ({ context }) => context.queryClient.query(itemsListQuery()).catch(noop),
  component: ItemsListPage,
});

import { noop } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { ItemsDetailPage, itemsDetailQuery } from '@/features/items';

export const Route = createFileRoute('/items/$id')({
  // Same as the list: query(…).catch(noop) never throws, so a 404 reaches the Screen's notFound branch.
  loader: ({ context, params }) =>
    context.queryClient.query(itemsDetailQuery(params.id)).catch(noop),
  component: ItemsDetailPage,
});

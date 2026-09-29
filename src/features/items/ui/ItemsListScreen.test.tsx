import { screen } from '@testing-library/react';
import { IntlMessageFormat } from 'intl-messageformat';
import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LOCALE } from '@/shared/i18n/i18n';
import messages from '@/shared/i18n/messages/es.json';
import { renderWithProviders } from '@/test/render';
import type { Item } from '../model/items';
import { ItemsListScreen } from './ItemsListScreen';

const items: Item[] = [
  { id: 'coffee', title: 'Coffee', updatedAt: new Date('2026-09-25T16:45:00Z') },
  { id: 'rent', title: 'Rent', updatedAt: new Date('2026-09-01T08:00:00Z') },
];

const count = (value: number) =>
  String(new IntlMessageFormat(messages.items.count, DEFAULT_LOCALE).format({ count: value }));

describe('ItemsListScreen', () => {
  it('shows a busy status while loading', async () => {
    renderWithProviders(<ItemsListScreen state={{ status: 'loading' }} onRetry={vi.fn()} />);

    expect(await screen.findByRole('status', { name: messages.common.loading })).toHaveAttribute(
      'aria-busy',
      'true',
    );
  });

  it('shows the error message and retries on click', async () => {
    const onRetry = vi.fn();
    const { user } = renderWithProviders(
      <ItemsListScreen state={{ status: 'error', error: { kind: 'network' } }} onRetry={onRetry} />,
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(messages.errors.network);
    await user.click(screen.getByRole('button', { name: messages.common.retry }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('shows the empty message', async () => {
    renderWithProviders(<ItemsListScreen state={{ status: 'empty' }} onRetry={vi.fn()} />);

    expect(await screen.findByText(messages.items.empty)).toBeInTheDocument();
  });

  it('lists every item as a link to its detail page', async () => {
    renderWithProviders(
      <ItemsListScreen state={{ status: 'content', data: items }} onRetry={vi.fn()} />,
    );

    expect(await screen.findByRole('heading', { name: messages.items.title })).toBeInTheDocument();
    expect(screen.getByText(count(items.length))).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Coffee' })).toHaveAttribute('href', '/items/coffee');
    expect(screen.getByRole('link', { name: 'Rent' })).toHaveAttribute('href', '/items/rent');
  });
});

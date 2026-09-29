import { screen } from '@testing-library/react';
import { IntlMessageFormat } from 'intl-messageformat';
import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LOCALE } from '@/shared/i18n/i18n';
import messages from '@/shared/i18n/messages/es.json';
import { renderWithProviders } from '@/test/render';
import type { Item } from '../model/items';
import { ItemsDetailScreen } from './ItemsDetailScreen';

const item: Item = { id: 'rent', title: 'Rent', updatedAt: new Date('2026-09-01T08:00:00Z') };

const updated = (date: Date) =>
  String(new IntlMessageFormat(messages.items.updated, DEFAULT_LOCALE).format({ date }));

describe('ItemsDetailScreen', () => {
  it('shows the title and the formatted date', async () => {
    renderWithProviders(
      <ItemsDetailScreen state={{ status: 'content', data: item }} onRetry={vi.fn()} />,
    );

    expect(await screen.findByRole('heading', { name: 'Rent' })).toBeInTheDocument();
    expect(screen.getByText(updated(item.updatedAt))).toBeInTheDocument();
  });

  it('shows the not-found message without a retry', async () => {
    renderWithProviders(
      <ItemsDetailScreen
        state={{ status: 'error', error: { kind: 'notFound' } }}
        onRetry={vi.fn()}
      />,
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(messages.items.notFound);
    expect(screen.queryByRole('button', { name: messages.common.retry })).not.toBeInTheDocument();
  });

  it('offers a retry for other errors', async () => {
    const onRetry = vi.fn();
    const { user } = renderWithProviders(
      <ItemsDetailScreen
        state={{ status: 'error', error: { kind: 'server', status: 500 } }}
        onRetry={onRetry}
      />,
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(messages.errors.server);
    await user.click(screen.getByRole('button', { name: messages.common.retry }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('shows a busy status while loading', async () => {
    renderWithProviders(<ItemsDetailScreen state={{ status: 'loading' }} onRetry={vi.fn()} />);

    expect(
      await screen.findByRole('status', { name: messages.common.loading }),
    ).toBeInTheDocument();
  });

  it('shows the empty message', async () => {
    renderWithProviders(<ItemsDetailScreen state={{ status: 'empty' }} onRetry={vi.fn()} />);

    expect(await screen.findByText(messages.items.empty)).toBeInTheDocument();
  });

  it('links back to the list', async () => {
    renderWithProviders(<ItemsDetailScreen state={{ status: 'loading' }} onRetry={vi.fn()} />);

    expect(await screen.findByRole('link', { name: messages.common.back })).toHaveAttribute(
      'href',
      '/items',
    );
  });
});

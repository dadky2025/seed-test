import { QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { env } from '@/shared/config/env';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/render';
import { useItemsDetail } from './useItemsDetail';

const detailUrl = new URL('items/items/:id', env.apiBaseUrl).href;

function renderUseItemsDetail(id: string) {
  const queryClient = createTestQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return renderHook(() => useItemsDetail(id), { wrapper });
}

describe('useItemsDetail', () => {
  it('goes from loading to the item', async () => {
    const { result } = renderUseItemsDetail('rent');

    expect(result.current.state).toEqual({ status: 'loading' });
    await waitFor(() => {
      expect(result.current.state).toMatchObject({ status: 'content', data: { id: 'rent' } });
    });
  });

  it('reports notFound for an unknown id', async () => {
    const { result } = renderUseItemsDetail('missing');

    await waitFor(() => {
      expect(result.current.state).toEqual({ status: 'error', error: { kind: 'notFound' } });
    });
  });

  it('refetches on retry', async () => {
    server.use(http.get(detailUrl, () => new HttpResponse(null, { status: 500 })));
    const { result } = renderUseItemsDetail('rent');

    await waitFor(() => {
      expect(result.current.state).toEqual({
        status: 'error',
        error: { kind: 'server', status: 500 },
      });
    });

    server.resetHandlers();
    act(() => {
      result.current.onRetry();
    });
    await waitFor(() => {
      expect(result.current.state.status).toBe('content');
    });
  });
});

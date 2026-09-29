import { QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { env } from '@/shared/config/env';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/render';
import { useItemsList } from './useItemsList';

const listUrl = new URL('items/items', env.apiBaseUrl).href;

function renderUseItemsList() {
  const queryClient = createTestQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return renderHook(() => useItemsList(), { wrapper });
}

describe('useItemsList', () => {
  it('goes from loading to content', async () => {
    const { result } = renderUseItemsList();

    expect(result.current.state).toEqual({ status: 'loading' });
    await waitFor(() => {
      expect(result.current.state.status).toBe('content');
    });
  });

  it('reports empty when the list has no items', async () => {
    server.use(http.get(listUrl, () => HttpResponse.json([])));
    const { result } = renderUseItemsList();

    await waitFor(() => {
      expect(result.current.state).toEqual({ status: 'empty' });
    });
  });

  it('maps a failing request to its AppError and refetches on retry', async () => {
    server.use(http.get(listUrl, () => new HttpResponse(null, { status: 500 })));
    const { result } = renderUseItemsList();

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

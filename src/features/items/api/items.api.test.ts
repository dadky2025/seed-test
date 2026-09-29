import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { env } from '@/shared/config/env';
import { ApiError, toAppError } from '@/shared/lib/errors';
import { server } from '@/test/msw/server';
import { fetchItem, fetchItems } from './items.api';
import fixtures from './items.fixtures.json';

const listUrl = new URL('items/items', env.apiBaseUrl).href;
const detailUrl = new URL('items/items/:id', env.apiBaseUrl).href;

async function failure(promise: Promise<unknown>) {
  try {
    await promise;
  } catch (error) {
    expect(error).toBeInstanceOf(ApiError);
    return toAppError(error);
  }
  throw new Error('expected the request to fail');
}

describe('fetchItems', () => {
  it('maps every DTO to an Item, most recent first', async () => {
    const items = await fetchItems();

    expect(items).toHaveLength(fixtures.length);
    expect(items.map((item) => item.id)).toEqual(['coffee', 'groceries', 'rent']);
    expect(items[0]?.updatedAt).toEqual(new Date('2026-09-25T16:45:00Z'));
  });

  it('turns a 500 into a server error', async () => {
    server.use(http.get(listUrl, () => new HttpResponse(null, { status: 500 })));

    expect(await failure(fetchItems())).toEqual({ kind: 'server', status: 500 });
  });

  it('turns a malformed payload into a validation error', async () => {
    server.use(http.get(listUrl, () => HttpResponse.json([{ id: 1 }])));

    expect(await failure(fetchItems())).toMatchObject({ kind: 'validation' });
  });
});

describe('fetchItem', () => {
  it('maps the DTO of one item', async () => {
    const item = await fetchItem('rent');

    expect(item).toEqual({
      id: 'rent',
      title: 'Rent',
      updatedAt: new Date('2026-09-01T08:00:00Z'),
    });
  });

  it('turns a 404 into notFound', async () => {
    expect(await failure(fetchItem('missing'))).toEqual({ kind: 'notFound' });
  });

  it('turns a 500 into a server error', async () => {
    server.use(http.get(detailUrl, () => new HttpResponse(null, { status: 500 })));

    expect(await failure(fetchItem('rent'))).toEqual({ kind: 'server', status: 500 });
  });
});

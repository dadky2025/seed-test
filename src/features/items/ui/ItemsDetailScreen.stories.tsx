import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ItemsDetailScreen } from './ItemsDetailScreen';

const meta = {
  component: ItemsDetailScreen,
  args: { onRetry: fn(), state: { status: 'loading' } },
} satisfies Meta<typeof ItemsDetailScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {};

export const ErrorState: Story = {
  args: { state: { status: 'error', error: { kind: 'server', status: 500 } } },
};

export const NotFound: Story = {
  args: { state: { status: 'error', error: { kind: 'notFound' } } },
};

export const Empty: Story = { args: { state: { status: 'empty' } } };

export const Content: Story = {
  args: {
    state: {
      status: 'content',
      data: { id: 'rent', title: 'Rent', updatedAt: new Date('2026-09-01T08:00:00Z') },
    },
  },
};

export const LongText: Story = {
  args: {
    state: {
      status: 'content',
      data: {
        id: 'long',
        title:
          'Quarterly reconciliation of the shared household account including utilities, insurance and the car',
        updatedAt: new Date('2026-09-25T16:45:00Z'),
      },
    },
  },
};

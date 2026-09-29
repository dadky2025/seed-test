import type { Preview } from '@storybook/react-vite';
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import { I18nextProvider } from 'react-i18next';
import i18n, { DEFAULT_LOCALE } from '../src/shared/i18n/i18n';
import '../src/shared/ui/styles/globals.css';

const preview: Preview = {
  // The browser reports its own language; stories always read the default locale's catalog.
  beforeAll: async () => {
    await i18n.changeLanguage(DEFAULT_LOCALE);
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Every story is an accessibility test: a violation fails `pnpm test:storybook`.
    a11y: { test: 'error' },
  },
  // Like renderWithProviders: the default locale's messages, and a memory router for Link.
  decorators: [
    (Story) => (
      <RouterProvider
        router={createRouter({
          routeTree: createRootRoute({ component: Story }),
          history: createMemoryHistory({ initialEntries: ['/'] }),
        })}
      />
    ),
    (Story) => (
      <I18nextProvider i18n={i18n}>
        <Story />
      </I18nextProvider>
    ),
  ],
};

export default preview;

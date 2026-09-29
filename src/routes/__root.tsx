import type { QueryClient } from '@tanstack/react-query';
import {
  Link,
  Outlet,
  createRootRouteWithContext,
  type ErrorComponentProps,
} from '@tanstack/react-router';
import { Suspense, lazy, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { reportError } from '@/shared/lib/observability/report-error';
import { Button } from '@/shared/ui/button';

// Development tools only: lazy-imported behind import.meta.env.DEV, so they never reach the production bundle.
const TanStackRouterDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/react-router-devtools').then((module) => ({
        default: module.TanStackRouterDevtools,
      })),
    )
  : () => null;
const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/react-query-devtools').then((module) => ({
        default: module.ReactQueryDevtools,
      })),
    )
  : () => null;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
  notFoundComponent: NotFound,
  errorComponent: RootError,
});

function RootLayout() {
  const { t } = useTranslation();

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only">
        {t('app.skipToContent')}
      </a>
      <header className="border-b">
        <nav className="mx-auto flex max-w-2xl gap-4 p-4">
          <Link to="/">{t('app.nav.home')}</Link>
          <Link to="/items">{t('app.nav.items')}</Link>
        </nav>
      </header>
      <main id="main">
        <Outlet />
      </main>
      <Suspense>
        <TanStackRouterDevtools />
        <ReactQueryDevtools />
      </Suspense>
    </>
  );
}

function NotFound() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-2xl p-4">
      <p>{t('errors.notFound')}</p>
    </section>
  );
}

function RootError({ error }: ErrorComponentProps) {
  const { t } = useTranslation();

  useEffect(() => {
    reportError(error);
  }, [error]);

  return (
    <section role="alert" className="mx-auto max-w-2xl space-y-3 p-4">
      <p>{t('errors.unknown')}</p>
      <Button
        onClick={() => {
          window.location.reload();
        }}
      >
        {t('common.retry')}
      </Button>
    </section>
  );
}

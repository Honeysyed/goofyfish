import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import type { Route } from './+types/root';
import { NotFound } from './components/not-found';
import './app.css';

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;

export const links: Route.LinksFunction = () => [
  { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
  { rel: 'preload', href: '/fonts/geist-variable.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Balsamiq+Sans:wght@400;700&display=swap' },
];

function Analytics() {
  if (!GA_ID) {
    return null;
  }

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');`,
        }}
      />
    </>
  );
}

export function Layout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='theme-color' content='#ffffff' />
        <Meta />
        <Links />
        <Analytics />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary(props: Route.ErrorBoundaryProps) {
  const { error } = props;

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFound />;
  }

  const details = import.meta.env.DEV && error instanceof Error ? error.stack : undefined;

  return <NotFound title='Something broke' message='The fish tripped over a wire. Try again in a bit.' details={details} />;
}

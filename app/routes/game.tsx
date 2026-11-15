import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import type { Route } from './+types/game';
import { NotFound } from '~/components/not-found';
import { findGame, SITE } from '~/lib/games';
import { seo } from '~/lib/seo';

export function meta(args: Route.MetaArgs) {
  const game = findGame(args.params.slug);
  if (!game) {
    return [{ title: `Nothing swims here · ${SITE.name}` }, { name: 'robots', content: 'noindex' }];
  }

  return seo({
    title: `${game.name} · ${SITE.name}`,
    description: game.description,
    path: `/${game.slug}`,
    image: `/og/${game.slug}.jpg`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'VideoGame',
      name: game.name,
      url: new URL(`/${game.slug}`, SITE.url).href,
      description: game.description,
      gamePlatform: 'Web browser',
      applicationCategory: 'Game',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      author: { '@type': 'Person', name: 'Kamran Ahmed', url: 'https://kamran.fyi' },
    },
  });
}

export default function GamePage(props: Route.ComponentProps) {
  const location = useLocation();
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [search, setSearch] = useState('');
  const game = findGame(props.params.slug);

  useEffect(() => {
    setSearch(location.search);
  }, [location.search]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) {
      return;
    }

    const focus = () => frame.contentWindow?.focus();
    if (frame.contentDocument?.readyState === 'complete') {
      focus();
    }

    frame.addEventListener('load', focus);
    return () => frame.removeEventListener('load', focus);
  }, [game?.slug]);

  if (!game) {
    return <NotFound />;
  }

  return (
    <main className='fixed inset-0 overflow-hidden overscroll-none bg-white'>
      <h1 className='sr-only'>{game.name}</h1>
      <p className='sr-only'>{game.description}</p>
      <iframe
        ref={frameRef}
        key={game.slug}
        src={`/games/${game.slug}.html${search}`}
        title={game.name}
        allow='camera; microphone; fullscreen; autoplay; web-share; clipboard-write'
        className='block h-dvh w-full border-0'
      />
    </main>
  );
}

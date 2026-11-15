import { Link } from 'react-router';
import type { Route } from './+types/home';
import { Fish } from '~/components/fish';
import { games, isNew, SITE, type Game } from '~/lib/games';
import { seo } from '~/lib/seo';

export function meta(_: Route.MetaArgs) {
  return seo({
    title: `${SITE.name} · ${SITE.tagline}`,
    description: SITE.description,
    path: '/',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: SITE.name,
      itemListElement: games.map((g, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: new URL(`/${g.slug}`, SITE.url).href,
        name: g.name,
      })),
    },
  });
}

function GameCard(props: { game: Game; priority: boolean }) {
  const { game, priority } = props;

  return (
    <Link to={`/${game.slug}`} prefetch='intent' className='group block'>
      <div className='relative aspect-[1200/630] overflow-hidden rounded-2xl bg-white shadow-[0_0_0_1px_rgba(0,0,0,.06),0_2px_8px_rgba(0,0,0,.04)] transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_0_0_1px_rgba(0,0,0,.08),0_14px_32px_-14px_rgba(0,0,0,.22)]'>
        <img
          src={`/cards/${game.slug}.jpg`}
          alt={`${game.name} gameplay`}
          width={720}
          height={378}
          loading={priority ? 'eager' : 'lazy'}
          className='size-full object-cover transition duration-500 group-hover:scale-[1.03]'
        />
        {isNew(game) && (
          <span className='font-goofy absolute top-3 right-3 rounded-lg bg-butter px-2 py-0.5 text-[13px] text-umber shadow-[0_0_0_1px_rgba(180,83,9,.18)]'>
            New
          </span>
        )}
      </div>
      <div className='mt-3 flex items-baseline gap-3 px-0.5'>
        <h2 className='font-goofy text-[19px] leading-tight'>{game.name}</h2>
        <span className='ml-auto shrink-0 font-mono text-[11px] text-neutral-400'>
          {game.needs ?? game.controls}
        </span>
      </div>
      <p className='mt-0.5 px-0.5 text-[14px] text-neutral-500'>{game.tagline}</p>
    </Link>
  );
}

export default function Home() {
  return (
    <main className='mx-auto max-w-[1080px] px-5 pt-10 pb-20 sm:px-8 sm:pt-14'>
      <header className='flex items-center gap-2.5'>
        <Fish className='size-11 -ml-1' />
        <span className='font-goofy text-[26px] leading-none font-bold'>goofyfish</span>
        <span className='ml-auto font-mono text-[12px] text-neutral-400'>{games.length} games</span>
      </header>

      <section className='mt-14 max-w-xl sm:mt-20'>
        <h1 className='font-goofy text-[34px] leading-[1.1] sm:text-[44px]'>
          Small, silly games
          <br />
          for the browser.
        </h1>
        <p className='mt-4 text-[16px] leading-relaxed text-neutral-500'>
          Free, no ads, no sign-ups, nothing to install. Tap, swipe or hold, on your phone or your
          laptop. Best with sound on.
        </p>
      </section>

      <section className='mt-12 grid gap-x-6 gap-y-10 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3'>
        {games.map((game, i) => (
          <GameCard key={game.slug} game={game} priority={i < 3} />
        ))}
      </section>

      <footer className='mt-24 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#ededed] pt-6 text-[13.5px] text-neutral-400'>
        <span>New games every now and then.</span>
        <a
          href='https://kamran.fyi'
          className='ml-auto transition-colors hover:text-neutral-900'
        >
          Made by Kamran Ahmed
        </a>
      </footer>
    </main>
  );
}

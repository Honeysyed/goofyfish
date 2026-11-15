import { Link } from 'react-router';
import type { Route } from './+types/home';
import { GithubIcon } from '~/components/github-icon';
import { Logo } from '~/components/logo';
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

function GameCard(props: { game: Game }) {
  const { game } = props;

  return (
    <Link
      to={`/${game.slug}`}
      prefetch='intent'
      className='group relative flex flex-col rounded-2xl border border-neutral-200 bg-white p-2 transition-colors hover:border-neutral-300'
    >
      <div className='relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-white'>
        <img
          src={`/thumbs/${game.slug}.webp`}
          alt=''
          loading='lazy'
          className='h-[78%] w-[84%] object-contain'
        />
        {isNew(game) && (
          <span className='absolute top-2 right-2 rounded-md bg-butter px-1.5 py-0.5 font-mono text-[10.5px] uppercase tracking-wide border border-amber-ink/20 text-umber'>
            New
          </span>
        )}
      </div>
      <div className='px-2 pt-3 pb-2'>
        <h2 className='font-display text-[17px] leading-tight sm:text-[18px]'>{game.name}</h2>
        <p className='mt-1 text-[13px] leading-snug text-neutral-500'>{game.tagline}</p>
      </div>
    </Link>
  );
}

function MakeCard() {
  return (
    <Link
      to='/make'
      className='group flex flex-col rounded-2xl border-2 border-dashed border-neutral-200 p-2 transition-colors hover:border-amber-ink/40 hover:bg-butter-soft/40'
    >
      <div className='flex aspect-[4/3] items-center justify-center'>
        <span className='grid size-14 place-items-center rounded-full bg-butter border border-amber-ink/20 text-umber sm:size-16'>
          <svg viewBox='0 0 24 24' className='size-7' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round'>
            <path d='M12 5v14M5 12h14' />
          </svg>
        </span>
      </div>
      <div className='px-2 pt-3 pb-2'>
        <h2 className='font-display text-[17px] leading-tight sm:text-[18px]'>Make & submit a game</h2>
        <p className='mt-1 text-[13px] leading-snug text-neutral-500'>Build it with Claude Code, we put it on the site</p>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <main className='mx-auto max-w-[1120px] px-4 pt-10 pb-20 sm:px-8 sm:pt-16'>
      <section id='games' className='grid scroll-mt-8 grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4'>
        <header className='col-span-2 flex flex-col justify-center rounded-2xl border border-amber-ink/20 bg-butter-soft p-5 sm:px-7 sm:py-6'>
          <div className='flex items-center gap-5 sm:gap-6'>
            <Logo className='size-14 shrink-0 sm:size-[72px]' />
            <h1 className='font-display text-[22px] leading-[1.12] text-balance sm:text-[30px]'>
              Small, silly games for the browser.
            </h1>
          </div>
          <p className='mt-4 max-w-[40ch] text-[14px] leading-snug text-pretty text-stone-500 sm:text-[15px]'>
            Free, no ads, no sign-ups, nothing to install.
          </p>

          <div className='mt-4 flex flex-wrap items-center gap-2'>
            <Link
              to='/make'
              className='font-display flex h-10 items-center rounded-xl bg-butter px-4 text-[15px] border border-amber-ink/25 text-umber transition hover:bg-butter-hi active:scale-[.98]'
            >
              Make your own game
            </Link>
            <a
              href={SITE.github}
              className='font-display flex h-10 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-[15px] transition hover:bg-[#f5f5f5] active:scale-[.98]'
            >
              <GithubIcon className='size-[17px]' />
              GitHub
            </a>
          </div>
        </header>

        {games.map((game) => (
          <GameCard key={game.slug} game={game} />
        ))}
        <MakeCard />
      </section>

      <footer className='mt-20 flex flex-col items-center gap-1 text-center text-[13.5px] text-neutral-400'>
        <span>
          {games.length} games so far.{' '}
          <Link to='/make' className='underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-neutral-900'>
            Add yours
          </Link>
          .
        </span>
        <a href='https://kamran.fyi' className='transition-colors hover:text-neutral-900'>
          Made by Kamran Ahmed
        </a>
      </footer>
    </main>
  );
}

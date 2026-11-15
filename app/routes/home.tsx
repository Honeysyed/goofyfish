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
      className='group relative flex flex-col rounded-2xl bg-white p-2 shadow-[0_0_0_1px_rgba(0,0,0,.06),0_2px_8px_rgba(0,0,0,.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(0,0,0,.08),0_16px_32px_-16px_rgba(0,0,0,.25)]'
    >
      <div className='relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-white'>
        <img
          src={`/thumbs/${game.slug}.webp`}
          alt=''
          loading='lazy'
          className='h-[78%] w-[84%] object-contain transition-transform duration-300 group-hover:scale-[1.05]'
        />
        {isNew(game) && (
          <span className='absolute top-2 right-2 rounded-md bg-butter px-1.5 py-0.5 font-mono text-[10.5px] uppercase tracking-wide text-umber shadow-[0_0_0_1px_rgba(180,83,9,.18)]'>
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
      className='group flex flex-col rounded-2xl border-2 border-dashed border-neutral-200 p-2 transition duration-300 hover:-translate-y-1 hover:border-amber-ink/40 hover:bg-butter-soft/40'
    >
      <div className='flex aspect-[4/3] items-center justify-center'>
        <span className='grid size-14 place-items-center rounded-full bg-butter text-umber shadow-[0_0_0_1px_rgba(180,83,9,.2),0_2px_8px_rgba(0,0,0,.04)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-90 sm:size-16'>
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
    <main className='mx-auto max-w-[1120px] px-4 pb-20 sm:px-8'>
      <header className='mx-auto flex max-w-2xl flex-col items-center pt-16 text-center sm:pt-24'>
        <Logo className='animate-bob size-28 sm:size-32' />

        <h1 className='font-display mt-8 text-[40px] leading-[1.08] text-balance sm:text-[58px]'>
          Small, silly games for the browser.
        </h1>
        <p className='mt-5 max-w-md text-[16px] leading-relaxed text-pretty text-neutral-500 sm:text-[17px]'>
          Free, no ads, no sign-ups, nothing to install. Tap, swipe or hold, on your phone or your
          laptop. Best with sound on.
        </p>

        <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
          <Link
            to='/make'
            className='font-display flex h-11 items-center rounded-xl bg-butter px-5 text-[16px] text-umber shadow-[0_0_0_1px_rgba(180,83,9,.2),0_2px_8px_rgba(0,0,0,.04)] transition hover:bg-butter-hi active:scale-[.98]'
          >
            Make your own game
          </Link>
          <a
            href={SITE.github}
            className='font-display flex h-11 items-center gap-2 rounded-xl bg-[#f5f5f5] px-5 text-[16px] shadow-[0_0_0_1px_rgba(0,0,0,.05)] transition hover:bg-[#ececec] active:scale-[.98]'
          >
            <GithubIcon className='size-[18px]' />
            GitHub
          </a>
        </div>
      </header>

      <section
        id='games'
        className='mt-20 grid scroll-mt-8 grid-cols-2 gap-3 sm:mt-28 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4'
      >
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

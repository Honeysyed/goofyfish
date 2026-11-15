import { Link, useNavigate } from 'react-router';
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
          className='size-[72%] object-contain transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-[1.06]'
        />
        {isNew(game) && (
          <span className='absolute top-2 right-2 rounded-md bg-butter px-1.5 py-0.5 font-mono text-[10.5px] uppercase tracking-wide text-umber shadow-[0_0_0_1px_rgba(180,83,9,.18)]'>
            New
          </span>
        )}
      </div>
      <div className='px-2 pt-3 pb-2'>
        <h2 className='text-[15.5px] leading-tight font-semibold tracking-tight sm:text-[16px]'>{game.name}</h2>
        <p className='mt-1 text-[13px] leading-snug text-neutral-500'>{game.tagline}</p>
      </div>
    </Link>
  );
}

export default function Home() {
  const navigate = useNavigate();

  const playRandom = () => {
    const game = games[Math.floor(Math.random() * games.length)];
    navigate(`/${game.slug}`);
  };

  return (
    <main className='mx-auto max-w-[1120px] px-4 pb-20 sm:px-8'>
      <header className='mx-auto flex max-w-2xl flex-col items-center pt-16 text-center sm:pt-24'>
        <Fish className='animate-bob size-24 sm:size-28' />
        <span className='font-goofy mt-3 text-[22px] leading-none font-bold'>goofyfish</span>

        <h1 className='mt-10 text-[38px] leading-[1.05] font-semibold tracking-[-0.035em] text-balance sm:text-[56px]'>
          Small, silly games for the browser.
        </h1>
        <p className='mt-5 max-w-md text-[16px] leading-relaxed text-pretty text-neutral-500 sm:text-[17px]'>
          Free, no ads, no sign-ups, nothing to install. Tap, swipe or hold, on your phone or your
          laptop. Best with sound on.
        </p>

        <div className='mt-8 flex items-center gap-3'>
          <button
            type='button'
            onClick={playRandom}
            className='flex h-11 items-center gap-2 rounded-xl bg-butter px-5 text-[15px] font-medium text-umber shadow-[0_0_0_1px_rgba(180,83,9,.2),0_2px_8px_rgba(0,0,0,.04)] transition hover:bg-butter-hi active:scale-[.98]'
          >
            Surprise me
          </button>
          <a
            href='#games'
            className='flex h-11 items-center rounded-xl bg-[#f5f5f5] px-5 font-mono text-[13px] shadow-[0_0_0_1px_rgba(0,0,0,.05)] transition hover:bg-[#ececec]'
          >
            {games.length} games
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
      </section>

      <footer className='mt-20 flex flex-col items-center gap-1 text-center text-[13.5px] text-neutral-400'>
        <span>New games every now and then.</span>
        <a href='https://kamran.fyi' className='transition-colors hover:text-neutral-900'>
          Made by Kamran Ahmed
        </a>
      </footer>
    </main>
  );
}

import { useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import type { Route } from './+types/make';
import { GithubIcon } from '~/components/github-icon';
import { Logo } from '~/components/logo';
import { SITE } from '~/lib/games';
import { seo } from '~/lib/seo';

const PROMPT = 'make a goofyfish game where you keep a balloon in the air';

export function meta(_: Route.MetaArgs) {
  return seo({
    title: `Make your own game · ${SITE.name}`,
    description:
      'Describe a game to Claude Code. It builds it in the goofyfish style and sends it in as a pull request.',
    path: '/make',
  });
}

function CopyButton(props: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(props.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type='button'
      onClick={copy}
      className='shrink-0 rounded-md px-2 py-1 font-mono text-[11px] text-neutral-400 transition-colors hover:bg-white hover:text-neutral-900'
    >
      {copied ? 'copied' : 'copy'}
    </button>
  );
}

function Code(props: { children: string }) {
  return (
    <div className='mt-3 flex items-start gap-2 rounded-xl bg-[#f5f5f4] py-2.5 pr-2 pl-4 shadow-[0_0_0_1px_rgba(0,0,0,.04)]'>
      <pre className='min-w-0 flex-1 py-0.5 font-mono whitespace-pre-wrap [overflow-wrap:anywhere] text-[13px] leading-relaxed text-neutral-800'>
        {props.children}
      </pre>
      <CopyButton text={props.children} />
    </div>
  );
}

function Step(props: { n: number; title: string; children: ReactNode }) {
  return (
    <li className='relative rounded-2xl bg-white p-5 shadow-[0_0_0_1px_rgba(0,0,0,.06),0_2px_8px_rgba(0,0,0,.04)] sm:p-6'>
      <div className='flex items-center gap-3'>
        <span className='font-display grid size-7 shrink-0 place-items-center rounded-full bg-butter text-[15px] text-umber shadow-[0_0_0_1px_rgba(180,83,9,.18)]'>
          {props.n}
        </span>
        <h2 className='font-display text-[20px] leading-tight'>{props.title}</h2>
      </div>
      <div className='mt-3 text-[15px] leading-relaxed text-neutral-600'>{props.children}</div>
    </li>
  );
}

function Terminal() {
  return (
    <div className='mt-3 overflow-hidden rounded-xl bg-[#1f2329] shadow-[0_0_0_1px_rgba(0,0,0,.08),0_8px_24px_-12px_rgba(0,0,0,.35)]'>
      <div className='flex items-center gap-1.5 px-3.5 py-2.5'>
        <span className='size-2.5 rounded-full bg-[#ff5f57]' />
        <span className='size-2.5 rounded-full bg-[#febc2e]' />
        <span className='size-2.5 rounded-full bg-[#28c840]' />
        <span className='ml-2 font-mono text-[11px] text-neutral-500'>goofyfish</span>
      </div>
      <div className='px-4 pt-1 pb-4 font-mono text-[13px] leading-relaxed'>
        <div className='text-neutral-500'>
          <span className='text-neutral-400'>$</span> claude
        </div>
        <div className='mt-3 flex gap-2 rounded-lg border border-neutral-600/70 px-3 py-2 text-neutral-100'>
          <span className='text-neutral-500'>&gt;</span>
          <span>
            {PROMPT}
            <span className='animate-blink ml-0.5 inline-block h-[1.05em] w-[0.55em] translate-y-[0.2em] bg-butter' />
          </span>
        </div>
      </div>
    </div>
  );
}

const rules = [
  'One input: tap, hold, swipe, or aim and let go.',
  'A stick figure doing one physical thing.',
  'Playing in 3 seconds, a run lasts under 3 minutes.',
  'Fun for a 6-year-old and a 40-year-old.',
];

export default function Make() {
  return (
    <main className='mx-auto max-w-[640px] px-5 pt-10 pb-24 sm:pt-14'>
      <Link to='/' className='inline-flex items-center gap-2 text-[14px] text-neutral-400 transition-colors hover:text-neutral-900'>
        <span aria-hidden='true'>←</span> All games
      </Link>

      <header className='mt-10 flex flex-col items-center text-center'>
        <Logo className='size-20' />
        <h1 className='font-display mt-6 text-[38px] leading-[1.08] text-balance sm:text-[50px]'>Make your own game</h1>
        <p className='mt-4 max-w-sm text-[16px] leading-relaxed text-pretty text-neutral-500 sm:text-[17px]'>
          Describe a game to Claude Code. It builds it in our style and sends it in.
        </p>
      </header>

      <ol className='mt-12 flex flex-col gap-4'>
        <Step n={1} title='Get the code'>
          <Code>{`git clone ${SITE.github}\ncd goofyfish && pnpm install`}</Code>
        </Step>

        <Step n={2} title='Ask for a game'>
          Open Claude Code in the folder and describe your idea.
          <Terminal />
        </Step>

        <Step n={3} title='Play and tweak'>
          It builds the game, tests it and draws the thumbnail. Play it and ask for changes.
        </Step>

        <Step n={4} title='Send it in'>
          Say the word and it walks you through the pull request. We play it and put it on the site.
        </Step>
      </ol>

      <section className='mt-12 rounded-2xl bg-butter-soft/70 p-5 shadow-[0_0_0_1px_rgba(180,83,9,.12)] sm:p-6'>
        <h2 className='font-display text-[20px]'>What makes a goofyfish game</h2>
        <ul className='mt-3 flex flex-col gap-2 text-[15px] leading-relaxed text-neutral-700'>
          {rules.map((rule) => (
            <li key={rule} className='flex gap-2.5'>
              <span className='mt-[9px] size-1.5 shrink-0 rounded-full bg-amber-ink/70' />
              {rule}
            </li>
          ))}
        </ul>
      </section>

      <div className='mt-10 flex flex-wrap items-center justify-center gap-3'>
        <a
          href={SITE.github}
          className='font-display flex h-11 items-center gap-2 rounded-xl bg-butter px-5 text-[16px] text-umber shadow-[0_0_0_1px_rgba(180,83,9,.2),0_2px_8px_rgba(0,0,0,.04)] transition hover:bg-butter-hi active:scale-[.98]'
        >
          <GithubIcon className='size-[18px]' />
          Open on GitHub
        </a>
        <a
          href='/skill.zip'
          download
          className='font-display flex h-11 items-center rounded-xl bg-[#f5f5f5] px-5 text-[16px] shadow-[0_0_0_1px_rgba(0,0,0,.05)] transition hover:bg-[#ececec] active:scale-[.98]'
        >
          Download the skill
        </a>
      </div>
    </main>
  );
}

import { useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import type { Route } from './+types/make';
import { GithubIcon } from '~/components/github-icon';
import { Logo } from '~/components/logo';
import { SITE } from '~/lib/games';
import { seo } from '~/lib/seo';

const SKILL_PATH = '.claude/skills/make-goofyfish-game';
const SKILL_URL = `${SITE.github}/tree/main/${SKILL_PATH}`;

export function meta(_: Route.MetaArgs) {
  return seo({
    title: `Make your own game · ${SITE.name}`,
    description:
      'Every goofyfish game is one HTML file. Clone the repo, ask Claude Code to make a game with the goofyfish skill, and send a pull request.',
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
      <pre className='min-w-0 flex-1 overflow-x-auto py-0.5 font-mono text-[13px] leading-relaxed text-neutral-800'>
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

const rules = [
  'One input: tap, hold, swipe, or aim and let go.',
  'A stick figure doing one physical thing: hop, stack, chop, throw.',
  'Playing within 3 seconds, a run lasts 30 seconds to 3 minutes.',
  'Fun for a 6-year-old and a 40-year-old.',
  'One HTML file. No ads, no tracking, works offline.',
];

export default function Make() {
  return (
    <main className='mx-auto max-w-[680px] px-5 pt-10 pb-24 sm:pt-14'>
      <Link to='/' className='inline-flex items-center gap-2 text-[14px] text-neutral-400 transition-colors hover:text-neutral-900'>
        <span aria-hidden='true'>←</span> All games
      </Link>

      <header className='mt-10 flex flex-col items-center text-center'>
        <Logo className='size-20' />
        <h1 className='font-display mt-6 text-[38px] leading-[1.08] text-balance sm:text-[50px]'>Make your own game</h1>
        <p className='mt-4 max-w-md text-[16px] leading-relaxed text-pretty text-neutral-500 sm:text-[17px]'>
          Every game here is a single HTML file you can read. The repo comes with a Claude Code skill that knows the house
          style, builds a game with you and gets it ready to send in.
        </p>
      </header>

      <ol className='mt-12 flex flex-col gap-4'>
        <Step n={1} title='Get the code'>
          You need Node and pnpm.
          <Code>{`git clone ${SITE.github}.git\ncd goofyfish\npnpm install`}</Code>
        </Step>

        <Step n={2} title='Ask Claude Code for a game'>
          Open the folder in{' '}
          <a href='https://claude.com/claude-code' className='text-neutral-900 underline decoration-neutral-300 underline-offset-2'>
            Claude Code
          </a>{' '}
          and describe your idea, or ask it to pitch a few. The <span className='font-mono text-[13px]'>make-goofyfish-game</span> skill
          picks it up, builds the game from the starter template and plays it to check it works.
          <Code>{'claude "make a goofyfish game where you keep a balloon in the air"'}</Code>
        </Step>

        <Step n={3} title='Play it'>
          Start the site and open your game. Try it on your phone too.
          <Code>{'pnpm dev'}</Code>
        </Step>

        <Step n={4} title='Send it in'>
          The skill adds the card thumbnail, the share image and the entry in the game list. Open a pull request on GitHub with a
          screenshot. We play it, maybe suggest a tweak, and put it on the site.
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
        <p className='mt-4 text-[14px] leading-relaxed text-neutral-500'>
          Not using Claude Code? The skill is plain text: read{' '}
          <a href={`${SKILL_URL}/SKILL.md`} className='text-neutral-900 underline decoration-neutral-300 underline-offset-2'>
            the steps
          </a>{' '}
          and{' '}
          <a href={`${SKILL_URL}/references/style-guide.md`} className='text-neutral-900 underline decoration-neutral-300 underline-offset-2'>
            the style guide
          </a>{' '}
          and start from the template by hand.
        </p>
      </section>

      <div className='mt-10 flex flex-wrap items-center justify-center gap-3'>
        <a
          href={SKILL_URL}
          className='font-display flex h-11 items-center gap-2 rounded-xl bg-butter px-5 text-[16px] text-umber shadow-[0_0_0_1px_rgba(180,83,9,.2),0_2px_8px_rgba(0,0,0,.04)] transition hover:bg-butter-hi active:scale-[.98]'
        >
          <GithubIcon className='size-[18px]' />
          See the skill on GitHub
        </a>
        <Link
          to='/'
          className='font-display flex h-11 items-center rounded-xl bg-[#f5f5f5] px-5 text-[16px] shadow-[0_0_0_1px_rgba(0,0,0,.05)] transition hover:bg-[#ececec] active:scale-[.98]'
        >
          Play the games
        </Link>
      </div>
    </main>
  );
}

import { useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import type { Route } from './+types/make';
import { GithubIcon } from '~/components/github-icon';
import { Logo } from '~/components/logo';
import { SITE } from '~/lib/games';
import { seo } from '~/lib/seo';

const SKILL_PATH = '.claude/skills/make-goofyfish-game';
const LINK = 'text-neutral-900 underline decoration-neutral-300 underline-offset-2';
const SKILL_URL = `${SITE.github}/tree/main/${SKILL_PATH}`;

export function meta(_: Route.MetaArgs) {
  return seo({
    title: `Make your own game · ${SITE.name}`,
    description:
      'Clone the repo, describe your game to Claude Code, and the goofyfish skill builds it in the house style, draws the thumbnail and opens a pull request.',
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
          Clone the repo and describe your idea to Claude Code. The goofyfish skill inside builds the game in the house style,
          plays it, draws the thumbnail and sends it in as a pull request.
        </p>
      </header>

      <ol className='mt-12 flex flex-col gap-4'>
        <Step n={1} title='Get the code'>
          The skill comes with the repo, so there's nothing else to install.
          <Code>{`git clone ${SITE.github}\ncd goofyfish && pnpm install`}</Code>
          <p className='mt-4 text-[14px] text-neutral-500'>You need Git, Node 20+ and pnpm.</p>
        </Step>

        <Step n={2} title='Ask for a game'>
          Inside the folder, start{' '}
          <a href='https://claude.com/claude-code' className={LINK}>
            Claude Code
          </a>{' '}
          with your idea, or ask it to pitch a few. It builds the game from the starter template and plays it at phone and
          laptop sizes to check it works.
          <Code>{'claude "make a goofyfish game where you keep a balloon in the air"'}</Code>
        </Step>

        <Step n={3} title='Play it, tweak it'>
          Open the link it gives you and play. Ask for changes until it feels right: faster, goofier, a new twist. It also
          takes the screenshot for link previews and draws the card thumbnail in the stick-figure style (that part uses your{' '}
          <span className='font-mono text-[13px]'>OPENAI_API_KEY</span>; without one, we draw it for you).
        </Step>

        <Step n={4} title='It opens the pull request'>
          When you say go, it forks the repo, pushes your game and opens a pull request with a screenshot. This step needs the{' '}
          <a href='https://cli.github.com' className={LINK}>
            GitHub CLI
          </a>{' '}
          signed in. We play it, maybe suggest a tweak, and put it on the site.
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
          <a href={`${SKILL_URL}/SKILL.md`} className={LINK}>
            the steps
          </a>{' '}
          and{' '}
          <a href={`${SKILL_URL}/references/style-guide.md`} className={LINK}>
            the style guide
          </a>
          , or drop the folder wherever your agent reads skills.
        </p>
      </section>

      <div className='mt-10 flex flex-wrap items-center justify-center gap-3'>
        <a
          href={SITE.github}
          className='font-display flex h-11 items-center gap-2 rounded-xl bg-butter px-5 text-[16px] text-umber shadow-[0_0_0_1px_rgba(180,83,9,.2),0_2px_8px_rgba(0,0,0,.04)] transition hover:bg-butter-hi active:scale-[.98]'
        >
          <GithubIcon className='size-[18px]' />
          Open on GitHub
        </a>
        <Link
          to='/'
          className='font-display flex h-11 items-center rounded-xl bg-[#f5f5f5] px-5 text-[16px] shadow-[0_0_0_1px_rgba(0,0,0,.05)] transition hover:bg-[#ececec] active:scale-[.98]'
        >
          Play the games
        </Link>
      </div>

      <p className='mt-12 text-center text-[14px] leading-relaxed text-neutral-400'>
        Want the skill in every folder, without cloning first?{' '}
        <a href='/skill.zip' download className='text-neutral-600 underline decoration-neutral-300 underline-offset-2 hover:text-neutral-900'>
          Download skill.zip
        </a>{' '}
        and unzip it into <span className='font-mono text-[13px]'>~/.claude/skills/</span>.
      </p>
    </main>
  );
}

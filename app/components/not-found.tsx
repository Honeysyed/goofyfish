import { Link } from 'react-router';
import { Fish } from './fish';

type NotFoundProps = {
  title?: string;
  message?: string;
  details?: string;
};

export function NotFound(props: NotFoundProps) {
  const title = props.title ?? 'Nothing swims here';
  const message = props.message ?? "That page doesn't exist, or it got eaten by a bigger fish.";

  return (
    <main className='mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 text-center'>
      <title>{`${title} · Goofy Fish`}</title>
      <Fish className='size-20 -scale-x-100 rotate-12' />
      <h1 className='mt-6 text-3xl font-semibold tracking-tight'>{title}</h1>
      <p className='mt-2 text-neutral-500'>{message}</p>
      <Link
        to='/'
        className='mt-8 inline-flex h-11 font-medium items-center rounded-xl bg-butter px-5 text-umber shadow-[0_0_0_1px_rgba(180,83,9,.2),0_2px_8px_rgba(0,0,0,.04)] transition-colors hover:bg-butter-hi'
      >
        Back to the games
      </Link>
      {props.details && (
        <pre className='mt-8 max-w-full overflow-x-auto rounded-lg bg-neutral-100 p-4 text-left text-xs'>
          {props.details}
        </pre>
      )}
    </main>
  );
}

type FishProps = {
  className?: string;
};

export function Fish(props: FishProps) {
  const { className } = props;

  return (
    <svg viewBox='0 0 64 64' className={className} aria-hidden='true'>
      <g
        fill='none'
        stroke='#1f2329'
        strokeWidth='2.6'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M24 20.5C26.5 13 35 11 40.5 16' fill='#fcd34d' />
        <path d='M16 32 6 21.5c-1.6 6.6-1.6 14.4 0 21L16 32Z' fill='#fcd34d' />
        <path
          d='M14.5 32C20 18.5 43 14 54 27.5c2.2 2.7 2.2 6.3 0 9C43 50 20 45.5 14.5 32Z'
          fill='#fde68a'
        />
        <path d='M30 37c2.5 2.2 5.5 2.6 8 1' />
        <path d='M49.5 38.5c-1.6 1.3-3.6 1.3-5 .2' />
        <circle cx='42' cy='27.5' r='7' fill='#fff' />
      </g>
      <circle cx='44.2' cy='29.6' r='3.1' fill='#1f2329' />
    </svg>
  );
}

import type { ReactNode } from 'react';

const INK = '#1f2329';
const SOFT = '#a3a3a3';
const FAINT = '#e5e5e5';
const BUTTER = '#fde68a';
const BUTTER_HI = '#fcd34d';
const BUTTER_SOFT = '#fef3c7';
const AMBER = '#b45309';

const seeds = [
  [80, 74],
  [100, 84],
  [120, 74],
  [92, 68],
  [110, 66],
];

const arts: Record<string, ReactNode> = {
  stomping: (
    <>
      <path d='M66 34v10M82 28v12M98 34v10' stroke={SOFT} strokeDasharray='2 5' />
      <path d='M62 104V56q0-8 8-8h20q8 0 8 8v14q0 6 6 8l30 9q16 5 16 19z' fill={BUTTER} />
      <path d='M98 66l-8 5M98 76l-8 5M106 82l-6 6' strokeWidth='2' />
      <rect x='56' y='104' width='100' height='12' rx='5' fill='#fff' />
      <path d='M70 116v-5M84 116v-5M98 116v-5M112 116v-5M126 116v-5M140 116v-5' strokeWidth='1.8' stroke={SOFT} />
    </>
  ),
  punching: (
    <>
      <path d='M58 50h-14M56 66H38M58 82H46' stroke={SOFT} />
      <path d='M72 74V58q0-26 30-26h14q30 0 30 28 0 30-30 32H90q-18 0-18-18z' fill={BUTTER} />
      <path d='M90 68q-4 16 16 16h12' />
      <path d='M118 40q10 2 14 10' stroke='#fff' strokeWidth='4' />
      <rect x='72' y='92' width='40' height='26' rx='5' fill='#fff' />
      <path d='M72 103h40' stroke={AMBER} strokeWidth='3' />
    </>
  ),
  knockdown: (
    <>
      <g transform='rotate(-24 100 84)'>
        <rect x='64' y='68' width='78' height='32' rx='12' fill='#fff' />
        <rect x='128' y='64' width='16' height='40' rx='5' fill={BUTTER_HI} />
        <path d='M84 68v32' stroke={SOFT} />
      </g>
      <circle cx='92' cy='104' r='20' fill={BUTTER} />
      <path d='M92 84v40M72 104h40M78 90l28 28M106 90l-28 28' strokeWidth='1.8' stroke={AMBER} opacity='.7' />
      <circle cx='92' cy='104' r='5' fill='#fff' />
      <circle cx='164' cy='38' r='9' fill={INK} />
      <path d='M146 52l-6 4M150 60l-7 1M156 66l-4 5' stroke={SOFT} />
    </>
  ),
  selves: (
    <>
      <rect x='64' y='26' width='72' height='9' rx='3' fill={BUTTER_HI} />
      <rect x='64' y='115' width='72' height='9' rx='3' fill={BUTTER_HI} />
      <path d='M74 35q0 24 26 40-26 16-26 40M126 35q0 24-26 40 26 16 26 40' fill='#fff' />
      <path d='M84 48h32q-6 14-16 20-10-6-16-20z' fill={BUTTER} strokeWidth='1.8' />
      <path d='M80 115q20-26 40 0z' fill={BUTTER} strokeWidth='1.8' />
      <path d='M100 76v20' stroke={AMBER} strokeWidth='2' strokeDasharray='2 4' />
      <g transform='translate(170 75) scale(.7) translate(-150 -60)'>
        <path d='M150 60a22 22 0 1 1-8-16' stroke={AMBER} strokeWidth='3.4' />
        <path d='M146 36l-4 8 9 1' stroke={AMBER} strokeWidth='3.4' />
      </g>
    </>
  ),
  mirror: (
    <g transform='rotate(-18 100 75)'>
      <rect x='92' y='96' width='16' height='44' rx='7' fill={BUTTER_HI} />
      <ellipse cx='100' cy='60' rx='34' ry='40' fill={BUTTER} />
      <ellipse cx='100' cy='60' rx='25' ry='31' fill='#e0f2fe' />
      <path d='M86 44q4-10 14-12M84 56l14-16' stroke='#fff' strokeWidth='4' />
      <circle cx='100' cy='18' r='4' fill={BUTTER_HI} />
    </g>
  ),
  slicing: (
    <g transform='rotate(-14 100 70)'>
      <path d='M44 58a56 56 0 0 0 112 0z' fill='#bbf7d0' />
      <path d='M54 58a46 46 0 0 0 92 0z' fill='#fca5a5' strokeWidth='2' />
      <path d='M60 58h80' stroke='#fff' strokeWidth='3' opacity='.6' />
      {seeds.map(([cx, cy]) => (
        <ellipse key={`${cx}-${cy}`} cx={cx} cy={cy} rx='2.2' ry='3.4' fill={INK} stroke='none' />
      ))}
    </g>
  ),
  chopping: (
    <g transform='rotate(-28 100 78)'>
      <rect x='94' y='34' width='13' height='100' rx='6' fill='#fed7aa' />
      <path d='M100 64v60' stroke={AMBER} strokeWidth='1.6' opacity='.45' />
      <path d='M86 22h44q14 18 0 40H86q-6-20 0-40z' fill={FAINT} />
      <path d='M128 26q9 15 0 32' stroke='#fff' strokeWidth='3' />
      <rect x='90' y='30' width='21' height='26' rx='3' fill={SOFT} />
    </g>
  ),
  stones: (
    <>
      <ellipse cx='100' cy='94' rx='78' ry='22' stroke='#7dd3fc' strokeDasharray='5 7' />
      <ellipse cx='100' cy='94' rx='56' ry='15' stroke='#7dd3fc' />
      <ellipse cx='100' cy='88' rx='38' ry='15' fill={FAINT} />
      <path d='M70 84q30-12 60 0' stroke='#fff' strokeWidth='4' />
      <circle cx='100' cy='86' r='5' fill={BUTTER_HI} />
      <path d='M100 36v18M92 46l8 8 8-8' stroke={SOFT} />
    </>
  ),
  glider: (
    <>
      <path d='M22 116C40 84 54 120 70 96' stroke={SOFT} strokeDasharray='3 6' />
      <path d='M60 92 166 40 92 118z' fill='#fff' />
      <path d='M60 92 166 40 104 92z' fill={BUTTER} />
      <path d='M104 92l-12 26' />
    </>
  ),
  stacks: (
    <>
      <path d='M100 12v20' />
      <path d='M62 60l20-18h66l-20 18z' fill={BUTTER} />
      <path d='M128 60l20-18v50l-20 18z' fill={BUTTER_HI} />
      <rect x='62' y='60' width='66' height='50' fill={BUTTER_SOFT} />
      <path d='M88 60l20-18h12l-20 18z' fill='#fff' strokeWidth='1.8' />
      <path d='M88 60v14h12V60' strokeWidth='1.8' stroke={AMBER} />
      <path d='M72 94h18M72 100h10' strokeWidth='1.8' stroke={SOFT} />
    </>
  ),
  hoops: (
    <>
      <path d='M36 58h14M30 74h18M36 90h14' stroke={SOFT} />
      <circle cx='104' cy='74' r='42' fill='#fdba74' />
      <path d='M62 74h84M104 32v84' strokeWidth='2' />
      <path d='M74 44q20 30 0 60M134 44q-20 30 0 60' strokeWidth='2' />
      <path d='M84 44q8-6 16-7' stroke='#fff' strokeWidth='4' opacity='.7' />
    </>
  ),
  boxline: (
    <>
      <path d='M30 52h32v54h14' stroke={AMBER} strokeWidth='4' />
      <circle cx='30' cy='52' r='5' fill={INK} />
      <rect x='132' y='96' width='22' height='22' rx='3' fill='#fecaca' stroke='#dc2626' />
      <g transform='rotate(40 100 75)'>
        <rect x='92' y='26' width='18' height='68' fill={BUTTER} />
        <path d='M98 30v62' stroke={BUTTER_HI} strokeWidth='3' />
        <rect x='92' y='14' width='18' height='12' rx='3' fill='#fecaca' />
        <rect x='92' y='24' width='18' height='6' fill={SOFT} />
        <path d='M92 94l9 20 9-20z' fill='#fed7aa' />
        <path d='M97.5 106.5 101 114l3.5-7.5z' fill={INK} />
      </g>
    </>
  ),
};

type GameArtProps = {
  slug: string;
  className?: string;
};

export function GameArt(props: GameArtProps) {
  const art = arts[props.slug];
  if (!art) {
    return null;
  }

  return (
    <svg viewBox='0 0 200 150' className={props.className} aria-hidden='true'>
      <g fill='none' stroke={INK} strokeWidth='2.6' strokeLinecap='round' strokeLinejoin='round'>
        {art}
      </g>
    </svg>
  );
}

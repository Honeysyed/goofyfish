import type { ReactNode } from 'react';

const INK = '#1f2329';
const SOFT = '#a3a3a3';
const FAINT = '#d4d4d4';
const BUTTER = '#fde68a';
const BUTTER_HI = '#fcd34d';
const BUTTER_SOFT = '#fef3c7';
const AMBER = '#b45309';

type StickProps = {
  head: [number, number];
  lines: string;
  color?: string;
  dashed?: boolean;
};

function Stick(props: StickProps) {
  const color = props.color ?? INK;
  const dash = props.dashed ? '3 4' : undefined;

  return (
    <g stroke={color} strokeDasharray={dash}>
      <circle cx={props.head[0]} cy={props.head[1]} r='7' fill='#fff' />
      <path d={props.lines} />
    </g>
  );
}

function Goon(props: { x: number; y: number }) {
  const { x, y } = props;

  return (
    <g>
      <ellipse cx={x} cy={y} rx='14' ry='12' fill='#fff' />
      <circle cx={x - 5} cy={y - 2} r='3.2' fill='#fff' strokeWidth='1.6' />
      <circle cx={x + 5} cy={y - 2} r='3.2' fill='#fff' strokeWidth='1.6' />
      <circle cx={x - 4.4} cy={y - 1.4} r='1.3' fill={INK} stroke='none' />
      <circle cx={x + 5.6} cy={y - 1.4} r='1.3' fill={INK} stroke='none' />
      <path d={`M${x - 4} ${y + 5}q4 2.5 8 0`} strokeWidth='1.6' />
    </g>
  );
}

function Crate(props: { x: number; y: number; size: number; rotate?: number }) {
  const { x, y, size } = props;
  const r = props.rotate ?? 0;
  const cx = x + size / 2;
  const cy = y + size / 2;

  return (
    <g transform={`rotate(${r} ${cx} ${cy})`}>
      <rect x={x} y={y} width={size} height={size} fill={BUTTER_SOFT} rx='1.5' />
      <path d={`M${x + 4} ${y + 4}L${x + size - 4} ${y + size - 4}M${x + size - 4} ${y + 4}L${x + 4} ${y + size - 4}`} strokeWidth='1.6' stroke={AMBER} opacity='.55' />
    </g>
  );
}

function spikes(from: number, to: number, base: number, height: number) {
  let d = `M${from} ${base}`;
  for (let x = from; x < to; x += 10) {
    d += `L${x + 5} ${base - height}L${x + 10} ${base}`;
  }
  return d;
}

const arts: Record<string, ReactNode> = {
  stomping: (
    <>
      <path d={spikes(0, 200, 142, 10)} fill={FAINT} stroke={INK} strokeWidth='2' />
      <Goon x={48} y={118} />
      <Goon x={102} y={112} />
      <Goon x={156} y={118} />
      <path d='M90 96q12-9 24 0M94 90q8-5 16 0' stroke={AMBER} />
      <Stick head={[112, 34]} lines='M110 41 106 58M106 58 97 64 101 73M106 58 115 64 111 73M109 45 98 37M109 45 121 38' />
      <path d='M96 82v6M104 80v8M112 82v6' stroke={SOFT} strokeDasharray='2 4' />
      <path d='M150 28l4 4M162 22l-2 6M170 34l-6 0' stroke={BUTTER_HI} strokeWidth='3' />
    </>
  ),
  punching: (
    <>
      <path d='M0 128h200' />
      <Stick head={[44, 64]} color={SOFT} lines='M45 71 47 98M47 98 40 128M47 98 56 128M46 78 58 70M46 78 56 88' />
      <Stick head={[98, 62]} lines='M98 69 96 97M96 97 86 112 82 128M96 97 106 112 110 128M97 76 112 74 127 72M97 76 90 85 95 74' />
      <path d='M90 59q8-3 16 0' stroke={AMBER} strokeWidth='3' />
      <path d='M106 58l8 6' stroke={AMBER} strokeWidth='2.4' />
      <circle cx='128' cy='72' r='3.5' fill={INK} />
      <path d='M140 60l3 8 8-2-6 7 6 6-8 0-2 8-4-7-7 3 3-8-6-5 8-1z' fill={BUTTER} />
      <g transform='rotate(14 160 96)'>
        <Stick head={[160, 62]} color={SOFT} lines='M160 69 160 97M160 97 152 128M160 97 170 128M160 76 172 66M160 76 172 86' />
      </g>
    </>
  ),
  knockdown: (
    <>
      <path d='M12 40q6-8 14-4 6-8 15-2 9 0 8 8H10q-4-2 2-2z' fill='#fff' stroke={FAINT} />
      <path d='M8 150q45-52 92 0' fill='#fff' />
      <g transform='rotate(-38 54 110)'>
        <rect x='46' y='94' width='16' height='26' rx='3' fill='#fff' />
        <rect x='44' y='92' width='20' height='6' rx='2' fill={BUTTER} />
      </g>
      <circle cx='54' cy='114' r='7' fill='#fff' />
      <circle cx='54' cy='114' r='1.6' fill={INK} />
      <path d='M68 92Q104 26 140 66' stroke={SOFT} strokeDasharray='3 6' />
      <circle cx='138' cy='86' r='16' fill={BUTTER} stroke={AMBER} opacity='.5' />
      <circle cx='144' cy='70' r='5' fill={INK} />
      <path d='M132 120h56M140 120v20M180 120v20' />
      <Crate x={140} y={100} size={20} />
      <Crate x={160} y={100} size={20} />
      <Crate x={156} y={70} size={20} rotate={24} />
      <path d='M152 62l-4-6M162 60l2-7M172 64l5-4' stroke={AMBER} />
    </>
  ),
  selves: (
    <>
      <path d='M0 128h140V82h60' />
      <path d='M146 128l6-6M156 128l10-10M168 128l14-14M180 128l18-18M192 128l8-8' stroke={FAINT} />
      <path d='M180 82V52' />
      <path d='M180 52l18 6-18 6z' fill={BUTTER} />
      <Stick head={[52, 92]} color={FAINT} dashed lines='M52 99 52 114M52 114 46 128M52 114 59 128M52 104 44 112M52 104 60 112' />
      <Stick head={[120, 90]} color={SOFT} dashed lines='M120 97 120 114M120 114 113 128M120 114 127 128M120 102 111 110M120 102 129 110' />
      <Stick head={[124, 50]} lines='M123 57 121 72M121 72 115 83M121 72 128 83M122 61 134 55M122 61 140 64' />
      <path d='M24 30a10 10 0 1 0 10-10' stroke={AMBER} />
      <path d='M30 16l4 4-4 4' stroke={AMBER} />
    </>
  ),
  mirror: (
    <>
      <path d='M0 130h200' />
      <rect x='38' y='18' width='124' height='112' rx='3' fill={BUTTER_SOFT} />
      <g strokeWidth='18' stroke={INK}>
        <path d='M100 60v32M100 66 78 44M100 66 122 46M100 92 86 120M100 92 116 118' />
      </g>
      <g strokeWidth='13' stroke='#fff'>
        <path d='M100 60v32M100 66 78 44M100 66 122 46M100 92 86 120M100 92 116 118' />
      </g>
      <circle cx='100' cy='46' r='11' fill='#fff' />
      <Stick head={[100, 47]} lines='M100 55 100 91M100 66 80 47M100 66 120 48M100 91 87 118M100 91 114 117' />
      <path d='M46 26h16M46 32h10' stroke={AMBER} opacity='.5' />
    </>
  ),
  slicing: (
    <>
      <path d='M24 132 178 24' stroke={FAINT} strokeWidth='8' opacity='.6' />
      <path d='M24 132 178 24' stroke={AMBER} strokeWidth='2' />
      <g transform='translate(-8 -8) rotate(-12 100 78)'>
        <path d='M74 78a26 26 0 0 1 52 0z' fill={BUTTER_HI} />
        <path d='M80 78a20 20 0 0 1 40 0z' fill={BUTTER} strokeWidth='1.6' />
        <path d='M100 78V60M100 78 86 66M100 78l14-12' strokeWidth='1.4' stroke={AMBER} />
      </g>
      <g transform='translate(8 10) rotate(-12 100 78)'>
        <path d='M74 80a26 26 0 0 0 52 0z' fill={BUTTER_HI} />
        <path d='M80 80a20 20 0 0 0 40 0z' fill={BUTTER} strokeWidth='1.6' />
        <path d='M100 80v18M100 80l-14 12M100 80l14 12' strokeWidth='1.4' stroke={AMBER} />
      </g>
      <circle cx='44' cy='44' r='13' fill='#fed7aa' />
      <circle cx='44' cy='44' r='4.5' fill='#fff' />
      <path d='M36 38l2 1M48 36l1 2M50 48l2-1M38 50l1-2' stroke={AMBER} strokeWidth='1.6' />
      <path d='M150 110l20 20M166 108l-2 6M172 114l-6 2' />
      <path d='M60 112q2 6 0 10M140 50q3 4 2 8' stroke={BUTTER_HI} strokeWidth='3' />
    </>
  ),
  chopping: (
    <>
      <path d='M0 128h200' />
      <rect x='98' y='4' width='28' height='124' fill='#fff' />
      <path d='M98 30h28M98 56h28M98 82h28M98 108h28' stroke={FAINT} />
      <path d='M98 40H66' />
      <ellipse cx='60' cy='38' rx='10' ry='7' fill={BUTTER} />
      <path d='M126 70h34' />
      <ellipse cx='166' cy='68' rx='10' ry='7' fill={BUTTER} />
      <Stick head={[60, 84]} lines='M60 91 61 110M61 110 54 128M61 110 69 128M60 96 76 100 90 96' />
      <path d='M90 96 96 88' strokeWidth='3' stroke={AMBER} />
      <path d='M90 82l10 2-4 10-8-3z' fill={SOFT} />
      <path d='M106 98l6-4M110 106l7 1M104 112l5 4' stroke={AMBER} strokeWidth='2' />
    </>
  ),
  stones: (
    <>
      <rect x='0' y='86' width='200' height='64' fill='#e0f2fe' stroke='none' />
      <path d='M0 86h200' stroke='#7dd3fc' />
      <path d='M20 132q8-4 16 0M150 140q8-4 16 0M120 126q6-3 12 0' stroke='#7dd3fc' />
      <ellipse cx='36' cy='108' rx='22' ry='7' fill={FAINT} />
      <ellipse cx='108' cy='104' rx='20' ry='6.5' fill={FAINT} />
      <circle cx='108' cy='104' r='2.5' fill={AMBER} stroke='none' />
      <ellipse cx='170' cy='112' rx='16' ry='5.5' fill='#bbf7d0' />
      <path d='M170 112l10-4' stroke='#e0f2fe' strokeWidth='3' />
      <path d='M38 98Q72 18 106 94' stroke={SOFT} strokeDasharray='3 6' />
      <Stick head={[74, 36]} lines='M73 43 70 60M70 60 60 64 62 72M70 60 80 66 76 74M72 48 60 42M72 48 84 42' />
    </>
  ),
  glider: (
    <>
      <path d='M0 12h200M0 138h200' />
      <path d='M154 12v22' />
      <path d='M140 34h28l8 16h-44z' fill={BUTTER} />
      <path d='M142 56l-6 10M154 56v12M166 56l6 10' stroke={BUTTER_HI} strokeWidth='2.4' />
      <path d='M8 118C30 70 44 128 60 96' stroke={SOFT} strokeDasharray='3 6' />
      <path d='M62 92 122 66 84 104z' fill='#fff' />
      <path d='M62 92 122 66 92 92z' fill={BUTTER_SOFT} />
      <path d='M92 92l-8 12' />
      <path d='M30 138v-22' />
      <circle cx='30' cy='104' r='12' fill='#fff' />
      <path d='M30 104l-6-9M30 104l10 2M30 104l-4 10' stroke={SOFT} />
      <circle cx='30' cy='104' r='2' fill={INK} />
      <path d='M140 120q8-6 16 0t16 0M146 108q6-5 12 0t12 0' stroke={SOFT} />
    </>
  ),
  stacks: (
    <>
      <path d='M10 14h180M10 24h180' />
      <path d={'M10 24' + Array.from({ length: 18 }, (_, i) => `L${15 + i * 10} 14L${20 + i * 10} 24`).join('')} strokeWidth='1.6' />
      <rect x='108' y='24' width='12' height='5' fill='#fff' />
      <path d='M114 29 108 52' />
      <g transform='rotate(-8 106 62)'>
        <rect x='92' y='52' width='30' height='20' fill={BUTTER_SOFT} rx='1.5' />
        <path d='M100 52v6h14v-6' strokeWidth='1.6' stroke={AMBER} />
      </g>
      <path d='M0 128h200' />
      <rect x='80' y='106' width='40' height='22' fill='#fff' rx='1.5' />
      <path d='M86 112h10M86 117h6' strokeWidth='1.6' stroke={SOFT} />
      <rect x='84' y='86' width='34' height='20' fill={BUTTER_SOFT} rx='1.5' />
      <path d='M94 86v6h14v-6' strokeWidth='1.6' stroke={AMBER} />
      <rect x='86' y='68' width='30' height='18' fill='#fff' rx='1.5' />
      <path d='M92 74h8' strokeWidth='1.6' stroke={SOFT} />
      <path d='M136 64l3 3M142 60v4M134 56h4' stroke={BUTTER_HI} strokeWidth='3' />
    </>
  ),
  hoops: (
    <>
      <path d='M0 132h200' />
      <path d='M176 132V40h-12' />
      <path d='M164 22v48' strokeWidth='4' />
      <ellipse cx='148' cy='60' rx='15' ry='4' stroke={AMBER} />
      <path d='M134 61l5 20h18l5-20M139 81l4-19M157 81l-4-19M148 64v17' strokeWidth='1.4' stroke={SOFT} />
      <path d='M42 76Q78 -4 140 52' stroke={SOFT} strokeDasharray='3 6' />
      <circle cx='96' cy='30' r='10' fill='#fdba74' />
      <path d='M86 30h20M96 20v20' strokeWidth='1.4' />
      <Stick head={[36, 86]} lines='M36 93 36 112M36 112 30 132M36 112 43 132M36 98 45 92 49 80M36 98 27 92' />
    </>
  ),
  boxline: (
    <>
      <g fill={FAINT} stroke='none'>
        {Array.from({ length: 9 }, (_, i) =>
          Array.from({ length: 7 }, (_, j) => <circle key={`${i}-${j}`} cx={20 + i * 20} cy={15 + j * 20} r='1.6' />),
        )}
      </g>
      <rect x='52' y='83' width='20' height='20' fill='#fecaca' stroke='#dc2626' rx='2' />
      <rect x='92' y='23' width='20' height='20' fill='#fecaca' stroke='#dc2626' rx='2' />
      <rect x='132' y='83' width='20' height='20' fill='#fecaca' stroke='#dc2626' rx='2' />
      <path d='M160 116v18h24v-18' fill={BUTTER} />
      <path d='M40 135V55h80v60h52' stroke={INK} strokeWidth='3.5' />
      <circle cx='40' cy='135' r='5' fill={INK} />
      <path d='M166 109l7 6-7 6' strokeWidth='3' />
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
      <g fill='none' stroke={INK} strokeWidth='2.4' strokeLinecap='round' strokeLinejoin='round'>
        {art}
      </g>
    </svg>
  );
}

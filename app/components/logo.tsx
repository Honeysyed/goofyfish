type LogoProps = {
  className?: string;
};

export function Logo(props: LogoProps) {
  return <img src='/logo.webp' alt='' width={256} height={256} className={props.className} />;
}

/**
 * Primary action for the /go quiz. Sharp corners (clinical scope
 * zeroes radii), navy fill, full width, 44px+ tap target. Renders an
 * anchor when href is given (results CTA), otherwise a button.
 */
export default function QuizButton({
  label,
  onClick,
  href,
  className,
}: {
  label: string;
  onClick?: () => void;
  href?: string;
  className?: string;
}) {
  const classes = `block w-full px-6 py-4 text-center text-base font-medium text-white transition-opacity duration-150 hover:opacity-90 ${className ?? ""}`;
  const style = { backgroundColor: "var(--brand-accent)" };

  if (href) {
    return (
      <a href={href} onClick={onClick} className={classes} style={style}>
        {label}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={classes} style={style}>
      {label}
    </button>
  );
}

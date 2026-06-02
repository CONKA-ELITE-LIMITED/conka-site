/* The site-wide reassurance mark: dark green square + white tick, square
   corners so it reads clinical/sharp rather than rounded consumer green.
   Used by GuaranteeRow and the PDP tile checklist so trust signals look
   identical everywhere. */
export default function GreenCheckSquare({
  size = 18,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" fill="#047857" />
      <path
        d="M8 12.5L10.5 15L16 9.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

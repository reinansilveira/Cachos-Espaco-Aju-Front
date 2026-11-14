export function Stars({
  count = 5,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <span
      className={className}
      aria-label={`${count} de 5 estrelas`}
      role="img"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <svg
          key={index}
          viewBox="0 0 24 24"
          width="14"
          height="14"
          aria-hidden="true"
        >
          <path
            fill={index < count ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
            d="M12 2.5l2.9 6.2 6.8.7-5.1 4.6 1.5 6.7L12 17.3l-6.1 3.4 1.5-6.7-5.1-4.6 6.8-.7z"
          />
        </svg>
      ))}
    </span>
  );
}

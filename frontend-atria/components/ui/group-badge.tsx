interface GroupBadgeProps {
  name: string;
  color?: string;
  className?: string;
}

export function GroupBadge({ name, color = "#E8C39E", className = "" }: GroupBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-[var(--atria-primary)] ${className}`}
      style={{ backgroundColor: `${color}66` }}
    >
      {name}
    </span>
  );
}

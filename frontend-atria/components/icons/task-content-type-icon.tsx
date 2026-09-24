import type { KanbanTaskContentType } from "@/services/types";
import { cn } from "@/lib/utils";

const ICON_COLOR = "#00A67E";

interface TaskContentTypeIconProps {
  type: KanbanTaskContentType;
  className?: string;
  size?: number;
}

export function TaskContentTypeIcon({
  type,
  className,
  size = 14,
}: TaskContentTypeIconProps) {
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center", className)}
      aria-hidden
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {type === "static" && (
          <rect
            x="2"
            y="2"
            width="12"
            height="12"
            rx="2.5"
            fill={ICON_COLOR}
          />
        )}
        {type === "carousel" && (
          <>
            <rect
              x="1"
              y="4"
              width="3"
              height="8"
              rx="0.75"
              fill={ICON_COLOR}
              opacity="0.45"
            />
            <rect
              x="5.5"
              y="2"
              width="5"
              height="12"
              rx="1"
              fill={ICON_COLOR}
            />
            <rect
              x="12"
              y="4"
              width="3"
              height="8"
              rx="0.75"
              fill={ICON_COLOR}
              opacity="0.45"
            />
          </>
        )}
        {type === "video_with_script" && (
          <>
            <rect
              x="2"
              y="4.5"
              width="12"
              height="9"
              rx="2"
              fill={ICON_COLOR}
            />
            <path d="M7 7.5L10.5 9.5L7 11.5V7.5Z" fill="white" />
            <path
              d="M3 2.5H13V5H3V2.5Z"
              fill={ICON_COLOR}
            />
            <path
              d="M4.5 2.5L5.5 5M7 2.5L8 5M9.5 2.5L10.5 5"
              stroke="white"
              strokeWidth="0.9"
              strokeLinecap="round"
            />
          </>
        )}
        {type === "stories_no_script" && (
          <>
            <circle
              cx="8"
              cy="8"
              r="5.75"
              stroke={ICON_COLOR}
              strokeWidth="1.5"
              strokeDasharray="2.5 2"
              fill="none"
            />
            <rect
              x="6.25"
              y="4.5"
              width="3.5"
              height="7"
              rx="1.25"
              fill={ICON_COLOR}
            />
          </>
        )}
      </svg>
    </span>
  );
}

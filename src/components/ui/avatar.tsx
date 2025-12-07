import { cn } from "@/lib/utils";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";

export function hash(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const character = name.charCodeAt(i);
    hash = (hash << 5) - hash + character;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export function getDigit(number: number, ntn: number) {
  return Math.floor((number / Math.pow(10, ntn)) % 10);
}

export function getUnit(number: number, range: number, index?: number) {
  const value = number % range;

  if (index && getDigit(number, index) % 2 === 0) {
    return -value;
  } else return value;
}

export function getRandomColor(
  number: number,
  colors: string[],
  range: number
) {
  return colors[number % range];
}

const DEFAULT_SIZE = 40;
const DEFAULT_FALLBACK_DELAY_MS = 500;

interface AvatarProps
  extends React.ComponentProps<typeof AvatarPrimitive.Root> {
  src?: string;
  alt: string;
  size?: number;
  fallbackDelayMs?: number;
}

export const AvatarImpl = React.forwardRef<HTMLDivElement, AvatarProps>(
  function Avatar(
    {
      children,
      src,
      alt,
      size = DEFAULT_SIZE,
      fallbackDelayMs = DEFAULT_FALLBACK_DELAY_MS,
      className,
      style,
      ...rest
    },
    ref
  ) {
    return (
      <AvatarPrimitive.Root
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center overflow-hidden select-none rounded-full",
          className
        )}
        style={{
          ...style,
          width: size,
          height: size,
        }}
        {...rest}
      >
        {src && (
          <AvatarPrimitive.Image
            asChild={!!children}
            src={src}
            alt={alt}
            className="w-full h-full object-cover rounded-full"
          >
            {children}
          </AvatarPrimitive.Image>
        )}
        <AvatarPrimitive.Fallback
          asChild
          delayMs={fallbackDelayMs}
          className="rounded-full"
        >
          <Fallback size={size}>{alt}</Fallback>
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
    );
  }
);

const colors = [
  "#F6C750", // Golden yellow
  "#E63525", // Deep red
  "#050D4C", // Navy blue
  "#D4EBEE", // Soft blue
  "#6B73FF", // Sophisticated purple
  "#16A085", // Deep teal
  "#ED8936", // Warm orange
  "#38B2AC", // Teal
  "#9F7AEA", // Lavender
  "#8E44AD", // Rich purple
  "#F687B3", // Dusty rose
  "#667EEA", // Periwinkle
  "#81E6D9", // Mint
  "#FBB6CE", // Blush pink
  "#B794F6", // Soft violet
];

function Fallback({
  children,
  size = DEFAULT_SIZE,
}: {
  children: string;
  size?: number;
  className?: string;
}) {
  const titleId = React.useId();
  const properties = generateColors(children, colors);

  const maskId = React.useId();
  const filterId = React.useId();

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      role="img"
      aria-describedby={titleId}
      width={size}
      height={size}
    >
      <mask
        id={maskId}
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={size}
        height={size}
      >
        <rect width={size} height={size} rx={size * 2} fill="#FFFFFF" />
      </mask>
      <g mask={`url(#${maskId})`}>
        <rect width={size} height={size} fill={properties[0].color} />
        <path
          filter={`url(#${filterId})`}
          d="M32.414 59.35L50.376 70.5H72.5v-71H33.728L26.5 13.381l19.057 27.08L32.414 59.35z"
          fill={properties[1].color}
          transform={`
            translate(${properties[1].translateX} ${properties[1].translateY})
            rotate(${properties[1].rotate} ${size / 2} ${size / 2})
            scale(${properties[1].scale})
          `}
        />
        <path
          filter={`url(#${filterId})`}
          style={{
            mixBlendMode: "overlay",
          }}
          d="M22.216 24L0 46.75l14.108 38.129L78 86l-3.081-59.276-22.378 4.005 12.972 20.186-23.35 27.395L22.215 24z"
          fill={properties[2].color}
          transform={`
            translate(${properties[2].translateX} ${properties[2].translateY})
            rotate(${properties[2].rotate} ${size / 2} ${size / 2})
            scale(${properties[2].scale})
          `}
        />
      </g>
      <defs>
        <filter
          id={filterId}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation={7} result="effect1_foregroundBlur" />
        </filter>
      </defs>
    </svg>
  );
}

export function generateColors(name: string, colors: string[]) {
  const numFromName = hash(name);
  const range = colors && colors.length;

  const elementsProperties = Array.from({ length: 3 }, (_, i) => ({
    color: getRandomColor(numFromName + i, colors, range),
    translateX: getUnit(numFromName * (i + 1), DEFAULT_SIZE / 10, 1),
    translateY: getUnit(numFromName * (i + 1), DEFAULT_SIZE / 10, 2),
    scale: 1.2 + getUnit(numFromName * (i + 1), DEFAULT_SIZE / 20) / 10,
    rotate: getUnit(numFromName * (i + 1), 360, 1),
  }));

  return elementsProperties;
}

export const Avatar = Object.assign(AvatarImpl, { Fallback });

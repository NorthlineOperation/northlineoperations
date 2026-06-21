import { motion, type Variants } from "motion/react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------- *
 * Motion variants
 * ---------------------------------------------------------------- */

const EASE = [0.22, 0.61, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.7, ease: EASE } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 14 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } },
};

/* ---------------------------------------------------------------- *
 * Reveal — fade/slide a block in when it scrolls into view
 * ---------------------------------------------------------------- */

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: Variants;
  amount?: number;
};

export function Reveal({
  children,
  className,
  delay = 0,
  variant = fadeUp,
  amount = 0.15,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={variant}
      initial="hidden"
      whileInView="show"
      // A low amount + bottom margin keeps the reveal reliable on small screens,
      // where stacked blocks are often taller than the viewport (a high amount
      // threshold could never be met, leaving content un-revealed).
      viewport={{ once: true, amount, margin: "0px 0px -64px 0px" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/* Stagger group + item — children animate in sequence */

export function Stagger({
  children,
  className,
  amount = 0.1,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount, margin: "0px 0px -64px 0px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  variant = fadeUp,
}: {
  children: ReactNode;
  className?: string;
  variant?: Variants;
}) {
  return (
    <motion.div className={className} variants={variant}>
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------- *
 * IconTile — premium icon presentation (gradient / glass + glow)
 * ---------------------------------------------------------------- */

type IconTileProps = {
  icon: LucideIcon;
  /** "solid" = gold gradient tile w/ ink icon · "glass" = glass tile w/ gold icon · "outline" = ringed glass */
  variant?: "solid" | "glass" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const TILE_SIZE = {
  sm: "h-11 w-11 rounded-xl",
  md: "h-14 w-14 rounded-2xl",
  lg: "h-16 w-16 rounded-2xl",
} as const;

const ICON_SIZE = {
  sm: "h-5 w-5",
  md: "h-6 w-6",
  lg: "h-7 w-7",
} as const;

export function IconTile({
  icon: Icon,
  variant = "solid",
  size = "md",
  className,
}: IconTileProps) {
  const base = cn(
    "relative grid place-items-center transition-all duration-300",
    "group-hover:-translate-y-0.5",
    TILE_SIZE[size],
  );

  if (variant === "solid") {
    return (
      <div
        className={cn(
          base,
          "bg-gold-gradient text-ink shadow-[0_12px_30px_-12px_var(--gold)] ring-1 ring-white/30",
          "group-hover:shadow-[0_18px_40px_-12px_var(--gold)]",
          className,
        )}
      >
        <span className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/40 to-transparent opacity-60" />
        <Icon className={cn(ICON_SIZE[size], "relative")} strokeWidth={2.1} />
      </div>
    );
  }

  if (variant === "glass") {
    return (
      <div
        className={cn(
          base,
          "glass-gold text-gold",
          "group-hover:glow-gold",
          className,
        )}
      >
        <Icon
          className={cn(ICON_SIZE[size], "relative drop-shadow")}
          strokeWidth={1.9}
        />
      </div>
    );
  }

  // outline
  return (
    <div
      className={cn(
        base,
        "glass text-gold ring-1 ring-gold/40",
        "group-hover:ring-gold/70 group-hover:glow-gold",
        className,
      )}
    >
      <Icon className={cn(ICON_SIZE[size], "relative")} strokeWidth={1.9} />
    </div>
  );
}

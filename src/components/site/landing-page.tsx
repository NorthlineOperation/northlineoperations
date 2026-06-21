"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
  AnimatePresence,
} from "motion/react";
import {
  ArrowRight,
  Shield,
  HardHat,
  Clock,
  Building2,
  ChevronDown,
  ShieldCheck,
  MessageSquare,
  Search,
  User,
  Award,
  Phone,
  Mail,
  MapPin,
  Globe,
  Sparkles,
  SprayCan,
  Home,
  TrafficCone,
  Facebook,
  Linkedin,
  Instagram,
  Menu,
  X,
  BadgeCheck,
  Truck,
  CheckCircle2,
} from "lucide-react";
import {
  Reveal,
  Stagger,
  StaggerItem,
  IconTile,
  fadeUp,
  scaleIn,
} from "@/components/site/primitives";
import { QuoteRequestForm } from "@/components/site/quote-request-form";
import { JoinTeamDialog } from "@/components/site/join-team-dialog";
import { ContactSection } from "@/components/site/contact-section";
import { ReviewsSection } from "@/components/site/reviews-section";
import type { GoogleReviewsData } from "@/lib/reviews/google";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  CmsImageAsset,
  LandingPageContent,
} from "@/lib/cms/landing-page-content";
import { KOT_DEVELOPER_URL } from "@/lib/cms/landing-page-content";
import { cn } from "@/lib/utils";
import heroImg from "@/assets/hero.jpg";
import vanImg from "@/assets/about-van.jpeg";
import sPost from "@/assets/service-post.jpg";
import sJan from "@/assets/service-janitor.jpg";
import sMove from "@/assets/service-moveout.jpg";
import sSite from "@/assets/service-site.jpg";
import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";
import p4 from "@/assets/project-4.jpg";

/* ---------------------------------------------------------------- *
 * Brand mark
 * ---------------------------------------------------------------- */

const Logo = ({ light = true }: { light?: boolean }) => (
  <a href="#top" className="flex items-center gap-2.5">
    <div className="relative h-9 w-9 shrink-0">
      <div className="absolute inset-0 rounded-lg bg-gold/20 blur-md" />
      <svg viewBox="0 0 40 40" className="relative h-full w-full">
        <path
          d="M6 34 L6 6 L14 6 L34 34 L34 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-gold"
        />
        <path
          d="M10 30 L10 10 L30 30"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className={light ? "text-white" : "text-ink"}
        />
      </svg>
    </div>
    <div className="leading-none">
      <div
        className={`font-display text-xl font-bold tracking-wide ${light ? "text-white" : "text-ink"}`}
      >
        NORTHLINE
      </div>
      <div className="text-[10px] tracking-[0.3em] text-gold mt-0.5">
        OPERATION
      </div>
    </div>
  </a>
);

const FooterCopyright = ({ value }: { value: string }) => {
  const [beforeKot, afterKot] = value.split("KOT");

  if (afterKot === undefined) {
    return <p>{value}</p>;
  }

  return (
    <p>
      {beforeKot}
      <a
        href={KOT_DEVELOPER_URL}
        className="font-semibold text-white/70 underline-offset-4 transition hover:text-gold hover:underline"
      >
        KOT
      </a>
      {afterKot}
    </p>
  );
};

/* ---------------------------------------------------------------- *
 * Data
 * ---------------------------------------------------------------- */

const navLinks = [
  { label: "HOME", href: "#top" },
  { label: "ABOUT", href: "#about" },
  { label: "SERVICES", href: "#services" },
  { label: "PROJECTS", href: "#projects" },
  { label: "GET A QUOTE", href: "#quote" },
  { label: "CONTACT", href: "#contact" },
];

const heroPillIcons = [BadgeCheck, Building2, ShieldCheck];

const valuePropIcons = {
  shield: Shield,
  hardHat: HardHat,
  clock: Clock,
  building: Building2,
  shieldCheck: ShieldCheck,
} as const;

const serviceIcons = {
  sparkles: Sparkles,
  sprayCan: SprayCan,
  home: Home,
  trafficCone: TrafficCone,
} as const;

const serviceImages = {
  post: sPost,
  janitor: sJan,
  moveout: sMove,
  site: sSite,
} as const;

const projectImages = [p1, p2, p3, p4] as const;

const whyChooseIcons = {
  message: MessageSquare,
  building: Building2,
  shield: Shield,
  search: Search,
  user: User,
  award: Award,
} as const;

function getCmsImageSource(
  image: CmsImageAsset | undefined,
  fallback: StaticImageData,
) {
  return image?.url || fallback;
}

function getCmsImageAlt(image: CmsImageAsset | undefined, fallback: string) {
  return image?.alt || fallback;
}

type ProjectItem = LandingPageContent["projects"]["items"][number];

function getProjectFallback(index: number) {
  return projectImages[index % projectImages.length];
}

function ProjectPhoto({
  image,
  fallback,
  alt,
  className,
}: {
  image: CmsImageAsset | undefined;
  fallback: StaticImageData;
  alt: string;
  className?: string;
}) {
  return (
    <Image
      src={getCmsImageSource(image, fallback)}
      alt={getCmsImageAlt(image, alt)}
      width={900}
      height={675}
      sizes="(min-width: 1024px) 24vw, (min-width: 640px) 50vw, 100vw"
      className={cn("h-full w-full object-cover", className)}
    />
  );
}

/* ---------------------------------------------------------------- *
 * Buttons
 * ---------------------------------------------------------------- */

function GoldButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.a
      href={href}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "btn-shimmer inline-flex items-center justify-center gap-2 rounded-md bg-gold-gradient px-6 py-3.5 text-xs font-bold tracking-wider text-ink shadow-[0_14px_34px_-14px_var(--gold)]",
        className,
      )}
    >
      {children}
    </motion.a>
  );
}

function GhostButton({
  href,
  children,
  dark = false,
  className = "",
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md border px-6 py-3.5 text-xs font-bold tracking-wider transition-colors",
        dark
          ? "border-ink/20 text-ink hover:bg-ink hover:text-white"
          : "border-white/30 text-white hover:bg-white/10",
        className,
      )}
    >
      {children}
    </motion.a>
  );
}

/* ---------------------------------------------------------------- *
 * Sticky header — transparent over hero, glass on scroll
 * ---------------------------------------------------------------- */

function Header({ onJoinTeam }: { onJoinTeam: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("top");

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.replace("#", ""));
    const onScroll = () => {
      setScrolled(window.scrollY > 24);

      // Scrollspy: the last section whose top has passed below the header line.
      const probe = window.scrollY + 140;
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= probe) current = id;
      }
      setActive(atBottom ? ids[ids.length - 1] : current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Close the mobile menu once the viewport grows to desktop width.
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mql.matches && setOpen(false);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const solid = scrolled || open;

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? "glass-strong shadow-[0_10px_30px_-18px_rgba(0,0,0,0.8)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <Logo />
        <nav className="hidden items-center gap-7 text-xs font-semibold tracking-wider lg:flex">
          {navLinks.map((l) => {
            const isActive = active === l.href.replace("#", "");
            return (
              <a
                key={l.label}
                href={l.href}
                className={`group relative py-1 transition hover:text-gold ${isActive ? "text-gold" : "text-white/90"}`}
              >
                {l.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-gold transition-all duration-300 ${isActive ? "w-6" : "w-0 group-hover:w-full"}`}
                />
              </a>
            );
          })}
          <button
            type="button"
            onClick={onJoinTeam}
            className="py-1 text-white/90 transition hover:text-gold"
          >
            JOIN THE TEAM
          </button>
        </nav>
        <div className="flex items-center gap-3">
          <GoldButton href="#quote" className="hidden lg:inline-flex">
            GET A QUOTE
          </GoldButton>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-md glass text-white lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-white/10 lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-8">
              {navLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-md px-3 py-3 text-sm font-semibold tracking-wider transition hover:bg-white/10 hover:text-gold ${
                    active === l.href.replace("#", "")
                      ? "bg-white/5 text-gold"
                      : "text-white/90"
                  }`}
                >
                  {l.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onJoinTeam();
                }}
                className="rounded-md px-3 py-3 text-left text-sm font-semibold tracking-wider text-white/90 transition hover:bg-white/10 hover:text-gold"
              >
                JOIN THE TEAM
              </button>
              <GoldButton href="#quote" className="mt-2 justify-center">
                GET A QUOTE <ArrowRight className="h-4 w-4" />
              </GoldButton>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function ProjectComparison({
  project,
  index,
}: {
  project: ProjectItem;
  index: number;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[
        {
          label: "Before",
          image: project.beforeImage,
          fallback: getProjectFallback(index + 1),
          alt: `${project.title} before service`,
        },
        {
          label: "After",
          image: project.afterImage,
          fallback: getProjectFallback(index),
          alt: `${project.title} after service`,
        },
      ].map((item) => (
        <div key={item.label} className="overflow-hidden rounded-lg border">
          <div className="relative h-60 bg-secondary sm:h-72">
            <ProjectPhoto
              image={item.image}
              fallback={item.fallback}
              alt={item.alt}
            />
            <div className="absolute left-3 top-3 rounded-md bg-ink px-2.5 py-1 text-xs font-bold tracking-wider text-gold">
              {item.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectViewerDialog({
  project,
  index,
  onOpenChange,
}: {
  project: ProjectItem | null;
  index: number | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={Boolean(project)} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-5xl flex-col overflow-hidden p-0">
        {project && index !== null ? (
          <>
            <DialogHeader className="shrink-0 border-b px-6 py-5 pr-14 text-left">
              <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider text-gold">
                <span>{project.category}</span>
                <span className="text-muted-foreground">/</span>
                <span>{project.location}</span>
              </div>
              <DialogTitle className="font-display text-3xl">
                {project.title}
              </DialogTitle>
              <DialogDescription>{project.summary}</DialogDescription>
            </DialogHeader>
            <div className="min-h-0 flex-1 overflow-y-auto p-6">
              <ProjectComparison project={project} index={index} />
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function AllProjectsDialog({
  projects,
  open,
  onOpenChange,
  onSelectProject,
}: {
  projects: ProjectItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectProject: (index: number) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-w-6xl flex-col overflow-hidden p-0 [&>button:last-child]:hidden"
        style={{
          top: "1rem",
          maxHeight: "calc(100vh - 2rem)",
          translate: "-50% 0",
        }}
      >
        <DialogHeader className="shrink-0 border-b px-6 py-5 text-left">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <DialogTitle className="font-display text-3xl">
                All Projects
              </DialogTitle>
              <DialogDescription>
                Before and after views from Northline project work.
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <DialogClose className="inline-flex w-fit items-center justify-center rounded-md border border-ink/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:bg-ink hover:text-white">
                Back to landing page
              </DialogClose>
              <DialogClose
                aria-label="Close all projects"
                className="grid size-10 shrink-0 place-items-center rounded-md border border-ink/15 bg-white text-ink shadow-sm transition-colors hover:bg-ink hover:text-white focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <X className="size-4" />
              </DialogClose>
            </div>
          </div>
        </DialogHeader>
        <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto p-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <article
              key={project.id}
              className="overflow-hidden rounded-lg border bg-white"
            >
              <button
                type="button"
                onClick={() => onSelectProject(index)}
                className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <div className="grid grid-cols-2">
                  <div className="bg-secondary">
                    <div className="border-b bg-ink px-3 py-2 text-xs font-bold tracking-wider text-gold">
                      Before
                    </div>
                    <div style={{ height: "clamp(132px, 15vw, 164px)" }}>
                      <ProjectPhoto
                        image={project.beforeImage}
                        fallback={getProjectFallback(index + 1)}
                        alt={`${project.title} before service`}
                      />
                    </div>
                  </div>
                  <div className="bg-secondary">
                    <div className="border-b bg-ink px-3 py-2 text-xs font-bold tracking-wider text-gold">
                      After
                    </div>
                    <div style={{ height: "clamp(132px, 15vw, 164px)" }}>
                      <ProjectPhoto
                        image={project.afterImage}
                        fallback={getProjectFallback(index)}
                        alt={`${project.title} after service`}
                      />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider text-gold">
                    <span>{project.category}</span>
                    <span className="text-muted-foreground">/</span>
                    <span>{project.location}</span>
                  </div>
                  <h3 className="mt-2 font-display text-xl font-bold">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {project.summary}
                  </p>
                </div>
              </button>
            </article>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------------------------------------------------------- *
 * Page
 * ---------------------------------------------------------------- */

export function LandingPage({
  content,
  reviews = null,
}: {
  content: LandingPageContent;
  reviews?: GoogleReviewsData | null;
}) {
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<
    number | null
  >(null);
  const [allProjectsOpen, setAllProjectsOpen] = useState(false);
  const [joinTeamOpen, setJoinTeamOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const heroFade = useTransform(scrollYProgress, [0, 1], [1, 0]);

  // Pointer-reactive 3D parallax for the hero (no-op on touch / reduced-motion).
  const reduce = useReducedMotion();
  const px = useMotionValue(0); // -0.5 .. 0.5 (horizontal)
  const py = useMotionValue(0); // -0.5 .. 0.5 (vertical)
  const sx = useSpring(px, { stiffness: 90, damping: 18, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 90, damping: 18, mass: 0.4 });
  const rotX = useTransform(sy, [-0.5, 0.5], [5, -5]); // tilt content
  const rotY = useTransform(sx, [-0.5, 0.5], [-5, 5]);
  const imgX = useTransform(sx, [-0.5, 0.5], [-14, 14]); // background drifts with cursor
  const imgYm = useTransform(sy, [-0.5, 0.5], [-10, 10]);
  const orbAX = useTransform(sx, [-0.5, 0.5], [36, -36]); // near orb moves most
  const orbAY = useTransform(sy, [-0.5, 0.5], [26, -26]);
  const orbBX = useTransform(sx, [-0.5, 0.5], [-22, 22]);
  const gridX = useTransform(sx, [-0.5, 0.5], [10, -10]);

  const onHeroMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onHeroLeave = () => {
    px.set(0);
    py.set(0);
  };
  const featuredProjects = content.projects.items.slice(0, 4);
  const selectedProject =
    selectedProjectIndex === null
      ? null
      : content.projects.items[selectedProjectIndex];

  return (
    <div id="top" className="min-h-screen bg-white text-ink">
      <Header onJoinTeam={() => setJoinTeamOpen(true)} />

      {/* HERO */}
      <section
        ref={heroRef}
        onPointerMove={onHeroMove}
        onPointerLeave={onHeroLeave}
        className="relative overflow-hidden bg-ink-gradient text-white [perspective:1200px]"
      >
        <motion.div style={{ y: heroImgY }} className="absolute -inset-12">
          <motion.div
            style={{ x: imgX, y: imgYm }}
            className="relative h-full w-full"
          >
            <Image
              src={getCmsImageSource(content.hero.image, heroImg)}
              alt={getCmsImageAlt(
                content.hero.image,
                "Commercial building lobby",
              )}
              fill
              priority
              sizes="100vw"
              className="scale-105 object-cover opacity-75"
            />
          </motion.div>
        </motion.div>
        {/* Lightened overlay: keeps the left readable, fades clear toward the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/42 via-transparent to-transparent" />
        <motion.div
          style={{ x: gridX }}
          className="absolute inset-0 grid-pattern opacity-50"
        />
        {/* floating gold glow orbs (parallax depth) */}
        <motion.div
          style={{ x: orbAX, y: orbAY }}
          className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-gold/20 blur-3xl animate-pulse-glow"
        />
        <motion.div
          style={{ x: orbBX }}
          className="pointer-events-none absolute left-1/3 top-1/2 h-56 w-56 rounded-full bg-gold/10 blur-3xl"
        />

        <motion.div
          style={{
            opacity: heroFade,
            rotateX: rotX,
            rotateY: rotY,
            transformPerspective: 1200,
          }}
          className="relative mx-auto grid max-w-7xl gap-8 px-4 pb-24 pt-36 [transform-style:preserve-3d] sm:px-8 lg:pb-32 lg:pt-44"
        >
          <div
            className="min-w-0 max-w-2xl"
            style={{ transform: "translateZ(40px)" }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08 }}
              className="font-display text-5xl font-bold leading-[0.95] sm:text-6xl lg:text-7xl"
            >
              {content.hero.titleLine1}
              <br />
              <span className="text-gradient-gold">
                {content.hero.titleLine2}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="mt-6 text-lg text-white/90"
            >
              {content.hero.summary}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.26 }}
              className="mt-4 max-w-md text-sm text-white/70"
            >
              {content.hero.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.34 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <GoldButton href={content.hero.primaryCta.href}>
                {content.hero.primaryCta.label}{" "}
                <ArrowRight className="h-4 w-4" />
              </GoldButton>
              <GhostButton href={content.hero.secondaryCta.href}>
                {content.hero.secondaryCta.label}{" "}
                <ArrowRight className="h-4 w-4" />
              </GhostButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.44 }}
              className="mt-10 flex flex-wrap gap-3"
            >
              {content.hero.pills.map((label, index) => {
                const Icon = heroPillIcons[index % heroPillIcons.length];
                return (
                  <div
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-medium text-white/90"
                  >
                    <Icon className="h-4 w-4 text-gold" /> {label}
                  </div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>

        {/* gradient fade into next section */}
        <div className="absolute inset-x-0 bottom-0 h-px divider-gold" />
      </section>

      {/* VALUE PROPS */}
      <section className="bg-ink-gradient text-white">
        <Stagger className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-14 sm:px-8 md:grid-cols-3 lg:grid-cols-5">
          {content.valueProps.map((v) => (
            <StaggerItem key={v.title} variant={scaleIn}>
              <div className="group flex h-full flex-col items-center rounded-2xl glass p-6 text-center transition-colors hover:border-gold/40">
                <IconTile icon={valuePropIcons[v.iconKey]} variant="glass" />
                <h3 className="mt-4 text-xs font-bold tracking-wider text-gold">
                  {v.title}
                </h3>
                <p className="mt-2 text-xs text-white/70">{v.description}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ABOUT */}
      <section className="bg-white py-24" id="about">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-8 lg:grid-cols-2">
          <Reveal>
            <div className="text-xs font-bold tracking-[0.25em] text-gold">
              {content.about.eyebrow}
            </div>
            <h2 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
              {content.about.headingLine1}
              <br />
              <span className="text-gradient-gold">
                {content.about.headingLine2}
              </span>
            </h2>
            <p className="mt-6 text-sm font-semibold text-ink">
              {content.about.intro}
            </p>
            {content.about.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-4 text-sm text-muted-foreground">
                {paragraph}
              </p>
            ))}
            <p className="mt-4 text-sm font-bold text-ink">
              {content.about.emphasis}
            </p>
            <div className="mt-8">
              <GhostButton href={content.about.cta.href} dark>
                {content.about.cta.label} <ArrowRight className="h-4 w-4" />
              </GhostButton>
            </div>
          </Reveal>

          <Reveal variant={scaleIn} delay={0.1}>
            <div className="group relative">
              <div className="absolute -inset-3 rounded-2xl bg-gold-gradient opacity-15 blur-2xl transition-opacity duration-500 group-hover:opacity-30" />
              <div className="relative overflow-hidden rounded-2xl glow-soft ring-1 ring-black/5">
                <Image
                  src={getCmsImageSource(content.about.image, vanImg)}
                  alt={getCmsImageAlt(
                    content.about.image,
                    "Northline service van",
                  )}
                  width={1200}
                  height={800}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="h-auto w-full transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full glass-strong px-4 py-2 text-xs font-semibold text-white">
                  <Truck className="h-4 w-4 text-gold" />{" "}
                  {content.about.imageBadge}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section
        className="relative overflow-hidden bg-secondary py-24"
        id="services"
      >
        <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
          <Reveal className="text-center">
            <div className="text-xs font-bold tracking-[0.25em] text-gold">
              {content.servicesIntro.eyebrow}
            </div>
            <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
              {content.servicesIntro.headingPrefix}{" "}
              <span className="text-gradient-gold">
                {content.servicesIntro.headingHighlight}
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground">
              {content.servicesIntro.description}
            </p>
          </Reveal>

          <Stagger
            className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            amount={0.1}
          >
            {content.services.map((s) => (
              <StaggerItem key={s.title} variant={fadeUp}>
                <motion.article
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-xl"
                >
                  <div className="relative">
                    <div className="relative overflow-hidden">
                      <Image
                        src={getCmsImageSource(
                          s.image,
                          serviceImages[s.imageKey],
                        )}
                        alt={getCmsImageAlt(s.image, s.title)}
                        width={900}
                        height={600}
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="h-44 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                    </div>
                    <div className="absolute -bottom-6 left-1/2 z-10 -translate-x-1/2">
                      <IconTile
                        icon={serviceIcons[s.iconKey]}
                        variant="solid"
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6 pt-10">
                    <h3 className="text-center font-display text-base font-bold leading-tight">
                      {s.title}
                    </h3>
                    <ul className="mt-4 flex-1 space-y-2 text-sm text-muted-foreground">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />{" "}
                          {b}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="#quote"
                      className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-gold transition-all hover:gap-2.5"
                    >
                      LEARN MORE <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </motion.article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* WHY CHOOSE — MISSION */}
      <section className="relative overflow-hidden bg-ink-gradient py-24 text-white">
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-8 lg:grid-cols-[1fr_2fr]">
          <Reveal>
            <div className="text-xs font-bold tracking-[0.25em] text-gold">
              {content.whyChoose.eyebrow}
            </div>
            <h2 className="mt-3 font-display text-4xl font-bold leading-tight">
              {content.whyChoose.headingLine1}
              <br />
              <span className="text-gradient-gold">
                {content.whyChoose.headingLine2}
              </span>
            </h2>
            <p className="mt-5 max-w-sm text-sm text-white/70">
              {content.whyChoose.description}
            </p>
            <div className="mt-6">
              <GoldButton href={content.whyChoose.cta.href}>
                {content.whyChoose.cta.label} <ArrowRight className="h-4 w-4" />
              </GoldButton>
            </div>
          </Reveal>

          <Stagger
            className="grid grid-cols-2 gap-4 sm:grid-cols-3"
            amount={0.15}
          >
            {content.whyChoose.items.map((w) => (
              <StaggerItem key={w.label} variant={scaleIn}>
                <div className="group flex h-full flex-col items-center rounded-2xl glass p-5 text-center transition-colors hover:border-gold/40">
                  <IconTile
                    icon={whyChooseIcons[w.iconKey]}
                    variant="outline"
                  />
                  <p className="mt-3 text-xs font-semibold leading-tight text-white/90">
                    {w.label}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* MISSION */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <Reveal>
              <h2 className="font-display text-5xl font-bold leading-none sm:text-6xl">
                {content.mission.headingLine1}
                <br />
                <span className="text-gradient-gold">
                  {content.mission.headingLine2}
                </span>
              </h2>
              <div className="mt-6 h-1 w-24 rounded-full bg-gold-gradient" />
              <p className="mt-6 max-w-md text-base text-muted-foreground">
                {content.mission.description}
              </p>
            </Reveal>

            <Reveal variant={scaleIn} delay={0.1}>
              <div className="relative overflow-hidden rounded-2xl border-l-4 border-gold bg-ink-gradient p-8 text-white glow-soft">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/15 blur-2xl" />
                <div className="relative font-display text-6xl leading-none text-gradient-gold">
                  "
                </div>
                <p className="relative mt-2 text-lg text-white/80">
                  {content.mission.quoteLead}
                </p>
                <p className="relative mt-3 text-xl font-bold text-gold">
                  {content.mission.quoteEmphasis}
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.05}>
            <div className="mt-14 overflow-hidden rounded-2xl bg-ink-gradient p-8 text-white glow-soft">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="text-xs font-bold tracking-[0.25em] text-gold">
                    {content.mission.focusLabelLine1}
                    <br />
                    {content.mission.focusLabelLine2}
                  </div>
                  <div className="h-12 w-px bg-gold/40" />
                </div>
                <p className="max-w-3xl flex-1 text-lg">
                  {content.mission.focusText}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="bg-white pb-20" id="projects">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:items-center">
            <Reveal>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                {content.projects.headingPrefix}{" "}
                <span className="text-gradient-gold">
                  {content.projects.headingHighlight}
                </span>
              </h2>
              <p className="mt-4 text-sm text-muted-foreground">
                {content.projects.description}
              </p>
              <div className="mt-6">
                <GhostButton
                  href={content.projects.cta.href}
                  dark
                  className="px-5 py-2.5"
                  onClick={(event) => {
                    event.preventDefault();
                    setAllProjectsOpen(true);
                  }}
                >
                  {content.projects.cta.label}{" "}
                  <ArrowRight className="h-4 w-4" />
                </GhostButton>
              </div>
            </Reveal>

            <Stagger
              className="grid grid-cols-2 gap-3 sm:grid-cols-4"
              amount={0.1}
            >
              {featuredProjects.map((project, i) => (
                <StaggerItem key={project.id} variant={scaleIn}>
                  <button
                    type="button"
                    onClick={() => setSelectedProjectIndex(i)}
                    className="group relative block w-full overflow-hidden rounded-xl text-left ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    <div className="relative h-36 w-full">
                      <ProjectPhoto
                        image={project.afterImage}
                        fallback={getProjectFallback(i)}
                        alt={`${project.title} after service`}
                        className="transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
                    <div className="absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                      <span className="text-xs font-bold tracking-wider text-gold">
                        VIEW PROJECT
                      </span>
                      <p className="mt-1 line-clamp-1 text-sm font-semibold text-white">
                        {project.title}
                      </p>
                    </div>
                  </button>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <Reveal delay={0.05}>
            <div className="mt-10 rounded-2xl bg-secondary px-6 py-5 ring-1 ring-black/5">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-xs font-semibold">
                <span className="tracking-wider text-ink">PROJECT TYPES</span>
                {content.projects.projectTypes.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <Building2 className="h-4 w-4 text-gold" /> {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-border px-6 py-5 text-xs">
              <span className="flex items-center gap-2 font-bold tracking-wider text-ink">
                <MapPin className="h-4 w-4 text-gold" />{" "}
                {content.projects.serviceAreaLabel}
              </span>
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-muted-foreground">
                {content.projects.cities.map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {reviews ? <ReviewsSection data={reviews} /> : null}

      <QuoteRequestForm quote={content.quote} footer={content.footer} />

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 bg-white py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-8">
          <Reveal>
            <details className="group/faq">
              <summary className="flex cursor-pointer list-none flex-col items-center text-center [&::-webkit-details-marker]:hidden">
                <div className="text-xs font-bold tracking-[0.25em] text-gold">
                  FREQUENTLY ASKED
                </div>
                <h2 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
                  Frequently Asked Questions
                </h2>
                <p className="mt-4 max-w-xl text-sm text-muted-foreground">
                  Answers to common questions about our commercial cleaning and
                  site support services across Columbus and Central Ohio.
                </p>
                <span className="mt-6 inline-flex items-center gap-2 rounded-md border px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-ink transition group-hover/faq:border-gold/50 group-hover/faq:text-gold">
                  <span className="group-open/faq:hidden">View Questions</span>
                  <span className="hidden group-open/faq:inline">
                    Hide Questions
                  </span>
                  <ChevronDown className="h-4 w-4 text-gold transition-transform duration-300 group-open/faq:rotate-180" />
                </span>
              </summary>

              <div className="mt-10 flex flex-col gap-3">
                {content.faq.map((item) => (
                  <details
                    key={item.question}
                    className="group/item rounded-lg border bg-white p-5 transition hover:border-gold/40 open:border-gold/40"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold [&::-webkit-details-marker]:hidden">
                      {item.question}
                      <ChevronDown className="h-5 w-5 shrink-0 text-gold transition-transform duration-300 group-open/item:rotate-180" />
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </details>
          </Reveal>
        </div>
      </section>

      <ContactSection />

      {/* FOOTER */}
      <footer className="bg-ink-gradient py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-8 md:grid-cols-2 lg:grid-cols-4">
          <Reveal>
            <Logo />
            <p className="mt-5 text-sm text-white/60">
              {content.footer.description}
            </p>
            <div className="mt-5 flex gap-3">
              {[
                {
                  label: "Facebook",
                  href: content.footer.socialLinks.facebook,
                  icon: Facebook,
                },
                {
                  label: "LinkedIn",
                  href: content.footer.socialLinks.linkedin,
                  icon: Linkedin,
                },
                {
                  label: "Instagram",
                  href: content.footer.socialLinks.instagram,
                  icon: Instagram,
                },
              ].map(({ label, href, icon: Icon }) => (
                <motion.a
                  key={label}
                  href={href || "#"}
                  aria-label={label}
                  whileHover={{ y: -3 }}
                  className="grid h-9 w-9 place-items-center rounded-lg glass text-gold transition-colors hover:bg-gold hover:text-ink"
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h4 className="font-display text-sm font-bold tracking-wider">
              {content.footer.quickLinksTitle}
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="inline-flex items-center gap-1.5 transition-all hover:gap-2.5 hover:text-gold"
                  >
                    {l.label.charAt(0) + l.label.slice(1).toLowerCase()}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#faq"
                  className="inline-flex items-center gap-1.5 transition-all hover:gap-2.5 hover:text-gold"
                >
                  FAQ
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setJoinTeamOpen(true)}
                  className="inline-flex items-center gap-1.5 transition-all hover:gap-2.5 hover:text-gold"
                >
                  Join the team
                </button>
              </li>
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <h4 className="font-display text-sm font-bold tracking-wider">
              {content.footer.servicesTitle}
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {content.services.map((service) => (
                <li key={service.title}>
                  <a
                    href="#services"
                    className="inline-flex items-center gap-1.5 transition-all hover:gap-2.5 hover:text-gold"
                  >
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.15}>
            <h4 className="font-display text-sm font-bold tracking-wider">
              {content.footer.contactTitle}
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gold" /> {content.footer.email}
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gold" /> {content.footer.phone}
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gold" />{" "}
                {content.footer.location}
              </li>
              <li className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-gold" /> {content.footer.website}
              </li>
            </ul>
          </Reveal>
        </div>
        <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-8">
          <div className="divider-gold" />
          <div className="mt-6 flex flex-col items-center justify-center gap-2 text-center text-xs text-white/50 sm:flex-row sm:gap-4">
            <FooterCopyright value={content.footer.copyright} />
            <a href="/privacy" className="transition hover:text-gold">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>

      <ProjectViewerDialog
        project={selectedProject}
        index={selectedProjectIndex}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedProjectIndex(null);
          }
        }}
      />
      <AllProjectsDialog
        projects={content.projects.items}
        open={allProjectsOpen}
        onOpenChange={setAllProjectsOpen}
        onSelectProject={(index) => {
          setAllProjectsOpen(false);
          setSelectedProjectIndex(index);
        }}
      />
      <JoinTeamDialog open={joinTeamOpen} onOpenChange={setJoinTeamOpen} />
    </div>
  );
}

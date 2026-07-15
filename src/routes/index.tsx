import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import {
  ArrowUpRight,
  Search,
  Heart,
  User,
  ShoppingBag,
  Star,
  Leaf,
  ShieldCheck,
  FlaskConical,
  Sparkles,
  Recycle,
  HeartHandshake,
  Plus,
  Instagram,
} from "lucide-react";

import heroSerum from "@/assets/hero-serum.jpg";
import productCream from "@/assets/product-cream.jpg";
import productCleanser from "@/assets/product-cleanser.jpg";
import productEye from "@/assets/product-eye.jpg";
import modelPortrait from "@/assets/model-portrait.jpg";
import textureDrip from "@/assets/texture-drip.jpg";
import ingTea from "@/assets/ingredient-tea.jpg";
import ingVitc from "@/assets/ingredient-vitc.jpg";
import ingHydro from "@/assets/ingredient-hydro.jpg";
import ingRose from "@/assets/ingredient-rose.jpg";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "Aurelia Skin — Pure Science. Timeless Beauty." },
      {
        name: "description",
        content:
          "An ultra-luxury skincare house crafting rituals from pure botanicals and clinical science. Discover Aurelia's radiance collection.",
      },
      { property: "og:title", content: "Aurelia Skin — Pure Science. Timeless Beauty." },
      { property: "og:description", content: "Luxury skincare powered by nature and science." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

/* ---------------- Preloader ---------------- */
function Preloader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const total = 1800;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / total);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 350);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: "-100%" }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="text-eyebrow text-gold">Est. 2015 · Paris</div>
        <div className="mt-4 font-display text-5xl tracking-[0.2em] text-foreground md:text-7xl">
          AURELIA
        </div>
        <div className="mt-2 text-eyebrow text-muted-foreground">Pure Science · Timeless Beauty</div>
      </motion.div>
      <div className="mt-14 h-px w-72 overflow-hidden bg-border md:w-96">
        <div
          className="h-full bg-foreground"
          style={{ width: `${progress * 100}%`, transition: "width 0.15s linear" }}
        />
      </div>
      <div className="mt-3 font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
        {String(Math.round(progress * 100)).padStart(3, "0")}
      </div>
    </motion.div>
  );
}

/* ---------------- Custom Cursor ---------------- */
function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);
    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let rx = x, ry = y;
    let raf = 0;
    const move = (e: MouseEvent) => { x = e.clientX; y = e.clientY; };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const magnetic = t.closest("[data-magnetic]");
      if (ring.current) ring.current.dataset.hover = magnetic ? "1" : "0";
    };
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${x - 3}px, ${y - 3}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      cancelAnimationFrame(raf);
    };
  }, []);
  if (!enabled) return null;
  return (
    <>
      <div
        ref={ring}
        data-hover="0"
        className="pointer-events-none fixed left-0 top-0 z-[90] h-9 w-9 rounded-full border border-foreground/60 mix-blend-difference transition-[transform,width,height,background] duration-200 data-[hover=1]:h-14 data-[hover=1]:w-14 data-[hover=1]:-translate-x-4 data-[hover=1]:-translate-y-4 data-[hover=1]:bg-foreground/10"
        style={{ willChange: "transform" }}
      />
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[91] h-1.5 w-1.5 rounded-full bg-foreground mix-blend-difference"
        style={{ willChange: "transform" }}
      />
    </>
  );
}

/* ---------------- Navigation ---------------- */
const NAV = ["Shop", "Collections", "Ingredients", "Skin Quiz", "Journal", "About"];

function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "py-3" : "py-6"
        }`}
      >
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <div
            className={`flex items-center justify-between rounded-full px-5 py-3 transition-all duration-500 ${
              scrolled ? "glass shadow-[0_20px_60px_-30px_rgba(22,22,22,0.25)]" : ""
            }`}
          >
            <button
              onClick={() => setOpen(true)}
              data-magnetic
              className="flex items-center gap-3 text-eyebrow text-foreground"
            >
              <span className="flex flex-col gap-1">
                <span className="h-px w-6 bg-foreground" />
                <span className="h-px w-4 bg-foreground" />
              </span>
              Menu
            </button>

            <a href="#top" className="font-display text-2xl tracking-[0.35em] text-foreground md:text-[26px]">
              AURELIA
            </a>

            <div className="flex items-center gap-4 text-foreground">
              <button data-magnetic aria-label="Search"><Search className="h-4 w-4" /></button>
              <button data-magnetic aria-label="Wishlist" className="hidden md:inline-flex"><Heart className="h-4 w-4" /></button>
              <button data-magnetic aria-label="Account" className="hidden md:inline-flex"><User className="h-4 w-4" /></button>
              <button data-magnetic aria-label="Bag" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden text-[10px] tracking-[0.28em] md:inline">BAG (0)</span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80]"
          >
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-0 bg-background"
            >
              <div className="mx-auto flex h-full max-w-[1600px] flex-col justify-between px-6 py-8 md:px-10">
                <div className="flex items-center justify-between">
                  <div className="font-display text-xl tracking-[0.35em]">AURELIA</div>
                  <button onClick={() => setOpen(false)} className="text-eyebrow" data-magnetic>Close</button>
                </div>
                <nav className="flex flex-col gap-2 md:gap-4">
                  {NAV.map((item, i) => (
                    <motion.a
                      key={item}
                      href="#"
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className="group flex items-center justify-between border-b border-border py-4 font-display text-5xl text-foreground transition hover:text-gold md:text-8xl"
                    >
                      <span>{item}</span>
                      <ArrowUpRight className="h-6 w-6 -translate-x-4 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 md:h-10 md:w-10" />
                    </motion.a>
                  ))}
                </nav>
                <div className="grid grid-cols-2 gap-8 text-eyebrow text-muted-foreground md:grid-cols-4">
                  <div><div className="mb-2 text-foreground">Contact</div>hello@aurelia.co</div>
                  <div><div className="mb-2 text-foreground">Ateliers</div>Paris · Kyoto · NYC</div>
                  <div><div className="mb-2 text-foreground">Follow</div>Instagram · TikTok</div>
                  <div><div className="mb-2 text-foreground">Newsletter</div>The Beauty Club</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const bottleY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const bottleRot = useTransform(scrollYProgress, [0, 1], [0, 8]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section ref={ref} id="top" className="relative h-[100svh] w-full overflow-hidden">
      {/* Cinematic background */}
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img
          src={heroSerum}
          alt="Aurelia luminous repair serum on golden silk"
          className="h-full w-full object-cover"
          width={1600}
          height={1808}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/25 to-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,220,170,0.15),transparent_60%)]" />
      </motion.div>

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="absolute block h-1 w-1 rounded-full bg-white/40 animate-drift"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              animationDelay: `${(i % 6) * 1.4}s`,
              animationDuration: `${12 + (i % 5) * 3}s`,
              filter: "blur(0.5px)",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        style={{ y: textY }}
        className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-6 pb-16 md:px-10 md:pb-24"
      >
        <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-eyebrow text-white/80"
            >
              <span className="mr-3 inline-block h-px w-10 translate-y-[-4px] bg-white/60" />
              The Radiance Collection · N°01
            </motion.div>
            <h1 className="mt-6 font-display text-[13vw] leading-[0.9] tracking-[-0.02em] text-white md:text-[8.5vw]">
              {"Reveal Your".split("").map((c, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.03, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block"
                >
                  {c === " " ? "\u00A0" : c}
                </motion.span>
              ))}
              <br />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 1.4 }}
                className="italic gold-gradient-text"
              >
                Natural Radiance
              </motion.span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="mt-8 max-w-lg text-base text-white/75 md:text-lg"
            >
              Luxury skincare powered by pure botanicals and clinical science —
              rituals crafted for skin that ages with grace.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <MagneticButton variant="light">Shop Collection</MagneticButton>
              <MagneticButton variant="ghost">Discover Story</MagneticButton>
            </motion.div>
          </div>

          {/* Floating serum accent card */}
          <motion.div
            style={{ y: bottleY, rotate: bottleRot }}
            className="hidden md:col-span-4 md:block"
          >
            <div className="glass ml-auto max-w-xs rounded-3xl p-5 text-white/90 animate-floaty">
              <div className="flex items-center justify-between text-eyebrow text-white/70">
                <span>Featured</span>
                <span>€ 148</span>
              </div>
              <div className="mt-4 font-display text-3xl leading-tight">
                Luminous <span className="italic gold-gradient-text">Repair Serum</span>
              </div>
              <p className="mt-3 text-sm text-white/70">
                24-hour hydration · 3% Encapsulated Retinol · Botanical Ceramides
              </p>
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] tracking-[0.28em] text-white/70">
                  <Star className="h-3 w-3 fill-gold text-gold" /> 4.9 · 2,410 reviews
                </div>
                <button data-magnetic className="rounded-full border border-white/40 p-2 transition hover:bg-white/10">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom marquee */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-black/25 backdrop-blur-md">
        <div className="flex overflow-hidden py-3 text-eyebrow text-white/70">
          <div className="flex shrink-0 animate-marquee gap-14 pr-14">
            {Array.from({ length: 2 }).flatMap((_, k) =>
              [
                "Cruelty-Free",
                "Dermatologist-Approved",
                "Cold-Pressed Botanicals",
                "Clinically Tested",
                "Certified Vegan",
                "Reef-Safe",
                "Fragrance-Optional",
                "Sustainable Glass",
              ].map((t) => (
                <span key={`${k}-${t}`} className="flex items-center gap-14">
                  <span>{t}</span>
                  <span className="text-gold">✦</span>
                </span>
              )),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Magnetic button ---------------- */
function MagneticButton({
  children,
  variant = "dark",
}: {
  children: React.ReactNode;
  variant?: "dark" | "light" | "ghost" | "gold";
}) {
  const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const el = btn.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
    };
    const reset = () => (el.style.transform = "translate(0,0)");
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", reset);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", reset);
    };
  }, []);
  const base =
    "group relative inline-flex items-center gap-3 rounded-full px-7 py-4 text-[11px] tracking-[0.3em] uppercase transition-transform duration-300 will-change-transform";
  const style =
    variant === "light"
      ? "bg-white text-foreground hover:bg-white/90"
      : variant === "ghost"
        ? "border border-white/50 text-white hover:bg-white/10"
        : variant === "gold"
          ? "bg-gold text-white hover:bg-gold/90"
          : "bg-foreground text-background hover:bg-foreground/90";
  return (
    <button ref={btn} data-magnetic className={`${base} ${style}`}>
      {children}
      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </button>
  );
}

/* ---------------- Reveal helper ---------------- */
function Reveal({
  children,
  delay = 0,
  className = "",
  y = 40,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- Marquee band ---------------- */
function StoryBand() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-background py-10">
      <div className="flex whitespace-nowrap">
        <div className="flex shrink-0 animate-marquee items-center gap-16 pr-16 font-display text-6xl italic text-foreground/90 md:text-8xl">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            ["Pure Science", "Timeless Beauty", "Rituals of Radiance", "Aurelia Skin"].map((t, i) => (
              <span key={`${k}-${i}`} className="flex items-center gap-16">
                <span>{t}</span>
                <span className="text-gold">✦</span>
              </span>
            )),
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Collections ---------------- */
const COLLECTIONS = [
  { name: "Cleansers", count: "06 objets", tag: "Ritual N°01", img: productCleanser },
  { name: "Serums", count: "09 objets", tag: "Ritual N°02", img: heroSerum },
  { name: "Moisturisers", count: "07 objets", tag: "Ritual N°03", img: productCream },
  { name: "Eye Care", count: "04 objets", tag: "Ritual N°04", img: productEye },
];

function Collections() {
  return (
    <section className="relative bg-background py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <Reveal>
              <div className="text-eyebrow text-gold">Featured Collections</div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 font-display text-5xl leading-[0.95] tracking-tight text-foreground md:text-7xl">
                Curated rituals for <em className="italic gold-gradient-text">every hour</em> of the day.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-sm text-muted-foreground">
              Eight family collections, hand-blended in small ateliers across Paris and Kyoto.
              Each object earns its place in your morning and evening routine.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {COLLECTIONS.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.08}>
              <a
                href="#"
                data-magnetic
                className="group relative block overflow-hidden rounded-[28px] bg-secondary"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={c.img}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-90" />
                  <div className="absolute right-4 top-4 rounded-full bg-white/85 px-3 py-1 text-[10px] tracking-[0.28em] text-foreground backdrop-blur">
                    {c.tag}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-white">
                    <div>
                      <div className="font-display text-3xl">{c.name}</div>
                      <div className="mt-1 text-[10px] tracking-[0.28em] text-white/70">{c.count}</div>
                    </div>
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-foreground transition-transform duration-500 group-hover:rotate-45">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Editorial split ---------------- */
function Editorial() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  return (
    <section ref={ref} className="relative overflow-hidden bg-[var(--beige)] py-24 md:py-36">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-14 px-6 md:grid-cols-12 md:px-10">
        <motion.div style={{ y: y1 }} className="md:col-span-6">
          <div className="relative overflow-hidden rounded-[36px]">
            <img src={modelPortrait} alt="Editorial portrait" loading="lazy" className="h-[75vh] w-full object-cover" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
              <div className="font-display text-xl italic">Édition · Autumn</div>
              <div className="text-eyebrow">Chapter N°04</div>
            </div>
          </div>
        </motion.div>
        <motion.div style={{ y: y2 }} className="flex flex-col justify-center md:col-span-6">
          <Reveal><div className="text-eyebrow text-gold">A House of Beauty</div></Reveal>
          <Reveal delay={0.05}>
            <h3 className="mt-4 font-display text-5xl leading-[1.02] text-foreground md:text-7xl">
              Skin is a <em className="italic gold-gradient-text">living archive</em> of every quiet ritual.
            </h3>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-lg text-base text-muted-foreground">
              Since 2015, Aurelia has crafted objects that treat skincare as an art form —
              distilling clinical actives, cold-pressed botanicals and slow-made formulas
              into pieces designed to remain on your dresser for a lifetime.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 grid grid-cols-3 gap-8 border-t border-border pt-8">
              {[
                ["10", "Years of craft"],
                ["47", "Master formulas"],
                ["98%", "Would gift it"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="font-display text-5xl text-foreground md:text-6xl">{n}</div>
                  <div className="mt-2 text-eyebrow text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-10"><MagneticButton>Discover the House</MagneticButton></div>
          </Reveal>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Best sellers ---------------- */
const BESTSELLERS = [
  { name: "Luminous Repair Serum", tag: "Nightly · 30ml", price: "€ 148", img: heroSerum, rating: 4.9 },
  { name: "Velvet Cloud Cream", tag: "Rich Moisture · 50ml", price: "€ 96", img: productCream, rating: 4.8 },
  { name: "Silken Milk Cleanser", tag: "Gentle · 200ml", price: "€ 62", img: productCleanser, rating: 4.9 },
  { name: "Golden Eye Contour", tag: "Retinal · 15ml", price: "€ 84", img: productEye, rating: 4.7 },
];

function BestSellers() {
  return (
    <section className="relative bg-background py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal><div className="text-eyebrow text-gold">The Icons</div></Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 font-display text-5xl leading-[0.95] text-foreground md:text-7xl">
                Best <em className="italic gold-gradient-text">Sellers</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <a href="#" data-magnetic className="text-eyebrow text-foreground underline underline-offset-8 hover:text-gold">
              View all 47 objects →
            </a>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {BESTSELLERS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.06}>
              <article className="group relative flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-[var(--beige)]">
                  <img
                    src={p.img}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <button
                    data-magnetic
                    aria-label="Add to wishlist"
                    className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/85 text-foreground backdrop-blur transition hover:bg-white"
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                  <div className="absolute inset-x-4 bottom-4 flex translate-y-4 items-center justify-between opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <button className="flex-1 rounded-full bg-foreground py-3 text-[10px] tracking-[0.3em] text-background hover:bg-foreground/90">
                      ADD TO BAG · {p.price}
                    </button>
                  </div>
                  {/* Shine sweep */}
                  <div className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.55)_50%,transparent_70%)] transition-transform duration-[1400ms] group-hover:translate-x-full" />
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl leading-tight text-foreground">{p.name}</h3>
                    <div className="mt-1 text-eyebrow text-muted-foreground">{p.tag}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-xl text-foreground">{p.price}</div>
                    <div className="mt-1 flex items-center gap-1 text-[10px] tracking-[0.2em] text-muted-foreground">
                      <Star className="h-3 w-3 fill-gold text-gold" /> {p.rating}
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Cinematic full-bleed ---------------- */
function Cinematic() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  return (
    <section ref={ref} className="relative h-[110svh] w-full overflow-hidden bg-black">
      <motion.div style={{ scale, y }} className="absolute inset-0">
        <img src={textureDrip} alt="Slow motion honey drip" className="h-full w-full object-cover opacity-90" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
      </motion.div>
      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col items-center justify-center px-6 text-center text-white md:px-10">
        <Reveal><div className="text-eyebrow text-white/70">Chapter Two</div></Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 max-w-5xl font-display text-6xl leading-[0.95] md:text-9xl">
            Healthy skin <em className="italic gold-gradient-text">starts here.</em>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-8 max-w-xl text-base text-white/70">
            A ritual is not a routine. It is time, returned to you — three minutes, twice a day,
            devoted to the surface where every emotion first lives.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-10"><MagneticButton variant="light">Explore Products</MagneticButton></div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Ingredients ---------------- */
const INGREDIENTS = [
  { name: "Vitamin C", science: "Ascorbic Acid 15%", note: "Brightening", img: ingVitc },
  { name: "Hyaluronic Acid", science: "Multi-molecular", note: "Deep hydration", img: ingHydro },
  { name: "Green Tea", science: "EGCG Complex", note: "Antioxidant", img: ingTea },
  { name: "Rose Ceramide", science: "Damask Rose", note: "Barrier repair", img: ingRose },
];

function Ingredients() {
  return (
    <section className="relative overflow-hidden bg-background py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal><div className="text-eyebrow text-gold">Molecular Library</div></Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 font-display text-5xl leading-[0.95] text-foreground md:text-7xl">
                Ingredients, <em className="italic gold-gradient-text">honestly told.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-muted-foreground">
                Every Aurelia formula lists its actives, their concentration and their origin —
                because a serious ritual begins with knowing what touches your skin.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8"><MagneticButton variant="gold">Enter the Library</MagneticButton></div>
            </Reveal>
          </div>
          <div className="md:col-span-7">
            <div className="grid grid-cols-2 gap-5">
              {INGREDIENTS.map((ing, i) => (
                <Reveal key={ing.name} delay={i * 0.06} y={30}>
                  <div className="group relative overflow-hidden rounded-[24px] bg-[var(--beige)] p-2 transition-transform duration-700 hover:-translate-y-1 hover:rotate-[-0.6deg]">
                    <div className="relative aspect-square overflow-hidden rounded-[18px]">
                      <img
                        src={ing.img}
                        alt={ing.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110"
                      />
                    </div>
                    <div className="flex items-end justify-between px-3 py-4">
                      <div>
                        <div className="font-display text-2xl text-foreground">{ing.name}</div>
                        <div className="mt-1 text-eyebrow text-muted-foreground">{ing.science}</div>
                      </div>
                      <div className="text-eyebrow text-gold">{ing.note}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Why choose us ---------------- */
const PILLARS = [
  { icon: ShieldCheck, title: "Dermatologist Approved", copy: "Reviewed by our clinical council in Paris." },
  { icon: HeartHandshake, title: "Cruelty Free", copy: "Leaping-Bunny certified, always." },
  { icon: Leaf, title: "Vegan Botanicals", copy: "Zero animal-derived actives in any formula." },
  { icon: FlaskConical, title: "Clean Formula", copy: "Free from 1,800+ questionable ingredients." },
  { icon: Recycle, title: "Refillable Objects", copy: "Every jar returns for a second life." },
  { icon: Sparkles, title: "Clinically Tested", copy: "Independently trialed for 12 weeks minimum." },
];

function WhyUs() {
  return (
    <section className="relative bg-[var(--beige)] py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="max-w-3xl">
          <Reveal><div className="text-eyebrow text-gold">The Aurelia Standard</div></Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 font-display text-5xl leading-[0.95] text-foreground md:text-7xl">
              Six principles behind every <em className="italic gold-gradient-text">object we sign.</em>
            </h2>
          </Reveal>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-[28px] bg-border md:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <div className="group relative flex h-full flex-col justify-between bg-background p-8 transition-colors duration-500 hover:bg-white md:p-10">
                <p.icon className="h-8 w-8 text-gold transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110" />
                <div className="mt-14">
                  <div className="font-display text-3xl text-foreground">{p.title}</div>
                  <p className="mt-3 text-sm text-muted-foreground">{p.copy}</p>
                </div>
                <div className="mt-8 text-eyebrow text-muted-foreground">0{i + 1} / 06</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Testimonials ---------------- */
const REVIEWS = [
  {
    name: "Amélie R.",
    role: "Paris",
    text: "I have replaced four products with one Aurelia serum. My skin feels re-remembered, quietly luminous — no drama, just poise.",
  },
  {
    name: "Sara K.",
    role: "Tokyo",
    text: "The packaging alone is worth the shelf, but what lives inside has rewritten my evening ritual. A rare, honest luxury.",
  },
  {
    name: "Lena M.",
    role: "New York",
    text: "Six weeks with the Repair Serum and my texture is glassy in a way I stopped believing possible after thirty-eight.",
  },
];

function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % REVIEWS.length), 6500);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="relative overflow-hidden bg-background py-24 md:py-36">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-end justify-between">
          <Reveal><div className="text-eyebrow text-gold">In their words</div></Reveal>
          <div className="flex gap-2">
            {REVIEWS.map((_, k) => (
              <button
                key={k}
                onClick={() => setI(k)}
                data-magnetic
                aria-label={`Testimonial ${k + 1}`}
                className={`h-1 rounded-full transition-all ${k === i ? "w-12 bg-foreground" : "w-6 bg-border"}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="relative overflow-hidden rounded-[32px]">
              <img src={modelPortrait} alt="Client" loading="lazy" className="aspect-[3/4] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>
          <div className="flex flex-col justify-center md:col-span-8">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-3xl leading-tight text-foreground md:text-6xl"
              >
                <span className="text-gold">“</span>{REVIEWS[i].text}<span className="text-gold">”</span>
                <footer className="mt-10 flex items-center gap-4 text-eyebrow text-muted-foreground">
                  <div className="flex gap-1 text-gold">
                    {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-3 w-3 fill-current" />)}
                  </div>
                  — {REVIEWS[i].name}, {REVIEWS[i].role}
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Instagram-like gallery ---------------- */
function Gallery() {
  const items = [
    { img: modelPortrait, span: "row-span-2" },
    { img: textureDrip, span: "" },
    { img: ingVitc, span: "" },
    { img: productCream, span: "" },
    { img: ingRose, span: "row-span-2" },
    { img: heroSerum, span: "" },
    { img: ingHydro, span: "" },
    { img: productEye, span: "" },
  ];
  return (
    <section className="relative bg-background py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="flex items-end justify-between">
          <div>
            <Reveal><div className="text-eyebrow text-gold">@aureliaskin</div></Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 font-display text-5xl leading-[0.95] text-foreground md:text-6xl">
                Rituals, <em className="italic gold-gradient-text">shared.</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <a href="#" data-magnetic className="text-eyebrow underline underline-offset-8 hover:text-gold">
              Follow us <Instagram className="inline h-3.5 w-3.5" />
            </a>
          </Reveal>
        </div>
        <div className="mt-14 grid auto-rows-[16vw] grid-cols-2 gap-3 md:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={i} delay={i * 0.04} y={20}>
              <a href="#" className={`group relative block h-full overflow-hidden rounded-[22px] ${it.span}`}>
                <img src={it.img} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/25" />
                <Instagram className="absolute right-4 top-4 h-4 w-4 -translate-y-2 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100 text-white" />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Newsletter ---------------- */
function Newsletter() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  return (
    <section className="relative overflow-hidden bg-black py-24 md:py-36">
      <div className="absolute inset-0">
        <img src={textureDrip} alt="" className="h-full w-full object-cover opacity-30" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black" />
      </div>
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center text-white md:px-10">
        <Reveal><div className="text-eyebrow text-gold">The Beauty Club</div></Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-6 font-display text-5xl leading-[1] md:text-7xl">
            Join the <em className="italic gold-gradient-text">Beauty Club.</em>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 text-white/70">
            Private access to new objects, seasonal editions, and letters from our formulators.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <form
            onSubmit={(e) => { e.preventDefault(); if (email.includes("@")) setOk(true); }}
            className="mx-auto mt-10 flex max-w-xl items-center gap-2 rounded-full border border-white/20 bg-white/5 p-2 backdrop-blur"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 bg-transparent px-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
            <button
              data-magnetic
              className="rounded-full bg-white px-6 py-3 text-[11px] tracking-[0.3em] text-foreground transition hover:bg-white/90"
            >
              {ok ? "Welcomed ✦" : "Subscribe"}
            </button>
          </form>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-6 text-[10px] tracking-[0.28em] text-white/40">
            No spam. Ever. Unsubscribe with a single tap.
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  return (
    <footer className="relative overflow-hidden bg-foreground text-background">
      <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2 md:col-span-2">
            <div className="font-display text-4xl tracking-[0.35em]">AURELIA</div>
            <p className="mt-6 max-w-xs text-sm text-background/60">
              Pure Science. Timeless Beauty. Slow-made skincare, crafted between Paris and Kyoto.
            </p>
            <div className="mt-8 flex gap-3">
              {["Instagram", "TikTok", "Journal"].map((s) => (
                <a key={s} href="#" data-magnetic className="rounded-full border border-background/20 px-4 py-2 text-[10px] tracking-[0.28em] hover:bg-background hover:text-foreground">{s}</a>
              ))}
            </div>
          </div>
          {[
            { h: "Shop", l: ["Serums", "Cleansers", "Moisturisers", "Eye Care", "Sunscreen"] },
            { h: "House", l: ["About", "Ateliers", "Sustainability", "Press", "Careers"] },
            { h: "Care", l: ["Skin Quiz", "Concierge", "Shipping", "Returns", "Contact"] },
            { h: "Legal", l: ["Privacy", "Terms", "Cookies", "Imprint"] },
          ].map((c) => (
            <div key={c.h}>
              <div className="text-eyebrow text-background/50">{c.h}</div>
              <ul className="mt-5 space-y-3 text-sm">
                {c.l.map((x) => (
                  <li key={x}><a href="#" className="text-background/80 transition hover:text-gold">{x}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-background/15 pt-8 text-[10px] tracking-[0.28em] text-background/50 md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} Aurelia Skin · Paris</div>
          <div className="flex gap-6">
            <span>VISA</span><span>MASTERCARD</span><span>AMEX</span><span>APPLE PAY</span><span>KLARNA</span>
          </div>
        </div>
      </div>
      <div className="relative overflow-hidden border-t border-background/10">
        <div className="flex whitespace-nowrap py-8">
          <div className="flex shrink-0 animate-marquee gap-16 pr-16 font-display text-[18vw] italic leading-none text-background/10">
            {Array.from({ length: 2 }).map((_, k) => (
              <span key={k}>AURELIA · SKIN · AURELIA · SKIN ·</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Page ---------------- */
function LandingPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);
  return (
    <div className="relative bg-background text-foreground">
      <AnimatePresence>{loading && <Preloader onDone={() => setLoading(false)} />}</AnimatePresence>
      <CustomCursor />
      <Navigation />
      <main>
        <Hero />
        <StoryBand />
        <Collections />
        <Editorial />
        <BestSellers />
        <Cinematic />
        <Ingredients />
        <WhyUs />
        <Testimonials />
        <Gallery />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}

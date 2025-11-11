"use client";

import { useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, useScroll } from "framer-motion";
import Link from "next/link";
import Button from "@/components/ui/Button";
import BlurText from "@/components/ui/BlurText";
import StarBorder from "@/components/ui/StarBorder";
import { Sprout } from "lucide-react";
import { useInView } from "framer-motion";


// Words for the falling title animation
const titleWords = ["stay", "loyal", "to", "the", "soil"];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Parallax motion
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tiltX = useTransform(mx, [-200, 200], [-6, 6]);
  const tiltY = useTransform(my, [-200, 200], [6, -6]);
  const { scrollY } = useScroll();
  const bgParallax = useTransform(scrollY, [0, 400], [0, -60]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mx.set(e.clientX - (rect.left + rect.width / 2));
      my.set(e.clientY - (rect.top + rect.height / 2));
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, [mx, my]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[78vh] sm:min-h-[82vh] overflow-hidden"
    >
      {/* Tropical leaf background with brand overlay */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.img
          src="/hero-leaves.svg"
          alt="Tropical leaf background"
          className="w-full h-full object-cover select-none pointer-events-none"
          style={{ y: bgParallax }}
        />
        {/* Brand gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b422a]/70 via-[#105d38]/40 to-transparent" />
        {/* Floating soft orbs for depth */}
        <motion.div
          className="absolute -top-10 -left-10 w-72 h-72 rounded-full bg-primary-400/20 blur-3xl"
          style={{ rotateX: tiltY, rotateY: tiltX }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-primary-600/20 blur-3xl"
          style={{ rotateX: tiltX, rotateY: tiltY }}
        />
      </div>

    {/* Slogan text */}
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 lg:py-36 text-center">
          <BlurText
            text="STAY LOYAL TO THE SOIL"
            delay={100}
            animateBy="words"
            direction="top"
            className="font-extrabold font-display tracking-tight text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.5)] leading-tight justify-center"
            style={{ fontSize: "clamp(32px, 6vw, 88px)" }}
          />

          {/* Subheading (SEO: h2) */}
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
            className="mt-6 text-white/90 max-w-3xl mx-auto text-lg sm:text-xl"
          >
            Your one-stop nature hub — premium soil mixes, organic fertilizers, and living plants, delivered fresh from the heart of nature.
          </motion.h2>

          {/* Single primary CTA (with StarBorder for high-impact effect) */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 1.1, ease: "easeOut" }}
            className="mt-12 flex items-center justify-center"
          >
            <Link href="/shop">
              <StarBorder 
                as="button"
                color="#22c57d"
                speed="6s"
                className="px-10 py-4 gap-2 flex items-center justify-center uppercase tracking-wider font-semibold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                <Sprout className="w-5 h-5" />
                Shop Now
              </StarBorder>
            </Link>
          </motion.div>
        </div>

        {/* Subtle parallax foreground leaf */}
        <motion.img
          src="/leaf-foreground.svg"
          alt="Foreground leaf"
          className="pointer-events-none select-none absolute bottom-8 left-8 w-24 h-auto opacity-70"
          style={{ rotateX: tiltX, rotateY: tiltY }}
        />
        {/* Decorative houseplant vectors */}
        <motion.img
          src="/plant-monstera.svg"
          alt="Monstera vector"
          className="pointer-events-none select-none absolute top-20 left-6 w-24 sm:w-28 opacity-80"
          style={{ y: useTransform(scrollY, [0, 400], [0, 20]) }}
        />
        <motion.img
          src="/plant-snake.svg"
          alt="Snake plant vector"
          className="pointer-events-none select-none absolute bottom-16 right-6 w-20 sm:w-24 opacity-80"
          style={{ y: useTransform(scrollY, [0, 400], [0, -16]) }}
        />
        {/* Scroll cue - fades out as user scrolls */}
        <motion.div
          className="absolute bottom-8 inset-x-0 flex justify-center"
          style={{
            opacity: useTransform(scrollY, [0, 200], [1, 0]),
            pointerEvents: useTransform(scrollY, [0, 200], ['auto', 'none'])
          }}
        >
          <div className="flex items-center gap-3 text-white/80">
            <div className="h-8 w-4 rounded-full border-2 border-white/70 relative">
              <motion.span
                className="absolute left-1/2 -translate-x-1/2 top-1 h-2 w-[2px] bg-white/80 rounded"
                animate={{ y: [0, 16, 0], opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
            </div>
            <span className="text-sm tracking-wide">Scroll</span>
          </div>
        </motion.div>

    </section>
  );
}

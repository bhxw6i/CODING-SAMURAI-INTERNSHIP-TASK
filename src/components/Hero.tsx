import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "./ui/button";
import { ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background with parallax */}
      <motion.div
        className="absolute inset-0 bg-gradient-hero"
        style={{ y, scale }}
      />

      {/* Ambient glow effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, hsl(43, 60%, 50% / 0.3) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, hsl(43, 60%, 50% / 0.25) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 container mx-auto px-6 text-center"
        style={{ opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            className="inline-block text-primary/80 text-sm tracking-[0.4em] uppercase mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Luxury Skincare Collection
          </motion.span>
        </motion.div>

        <motion.h1
          className="font-display text-5xl md:text-7xl lg:text-8xl tracking-wide mb-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-foreground">Discover Your</span>
          <br />
          <span className="text-gold-gradient italic">Natural Glow</span>
        </motion.h1>

        <motion.p
          className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          Elevate your skincare ritual with our curated collection of premium
          formulations, crafted for radiant, timeless beauty.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <Link to="/quiz">
            <Button variant="hero" size="xl">
              Discover Your Glow
            </Button>
          </Link>
          <Link to="/shop">
            <Button variant="heroOutline" size="xl">
              Shop Collection
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-muted-foreground text-xs tracking-widest uppercase">
            Scroll
          </span>
          <ArrowDown className="w-4 h-4 text-primary" />
        </motion.div>
      </motion.div>

      {/* Decorative lines */}
      <motion.div
        className="absolute top-0 left-1/4 w-px h-40 bg-gradient-to-b from-transparent via-primary/30 to-transparent"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
      />
      <motion.div
        className="absolute top-0 right-1/4 w-px h-32 bg-gradient-to-b from-transparent via-primary/20 to-transparent"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.5, delay: 1.2 }}
      />
    </section>
  );
};

export default Hero;

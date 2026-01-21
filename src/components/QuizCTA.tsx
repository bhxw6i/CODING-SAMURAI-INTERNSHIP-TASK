import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const QuizCTA = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative py-32 overflow-hidden bg-noir-light"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(43, 45%, 59%) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Animated glow orbs */}
      <motion.div
        className="absolute top-1/2 left-1/4 w-80 h-80 rounded-full"
        style={{
          background:
            "radial-gradient(circle, hsl(43, 60%, 50% / 0.2) 0%, transparent 70%)",
          y,
        }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full"
        style={{
          background:
            "radial-gradient(circle, hsl(43, 60%, 50% / 0.15) 0%, transparent 70%)",
          y: useTransform(scrollYProgress, [0, 1], [-100, 100]),
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          style={{ opacity }}
        >
          {/* Floating sparkles */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center gold-glow"
              animate={{
                boxShadow: [
                  "0 0 20px hsl(43, 60%, 50% / 0.3)",
                  "0 0 40px hsl(43, 60%, 50% / 0.5)",
                  "0 0 20px hsl(43, 60%, 50% / 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-8 h-8 text-primary" />
            </motion.div>
          </motion.div>

          <motion.span
            className="text-primary/80 text-sm tracking-[0.4em] uppercase mb-6 block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Personalized for You
          </motion.span>

          <motion.h2
            className="font-display text-4xl md:text-6xl tracking-wide mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Find Your <span className="text-gold-gradient italic">Perfect</span>
            <br />
            Skincare Match
          </motion.h2>

          <motion.p
            className="text-muted-foreground text-lg md:text-xl mb-12 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Take our exclusive skin analysis quiz and receive personalized
            product recommendations tailored to your unique skin type and
            concerns.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <Link to="/quiz">
              <Button variant="hero" size="xl" className="gap-3">
                <Sparkles className="w-5 h-5" />
                Take the Skin Quiz
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-12 mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            {[
              { value: "50K+", label: "Quizzes Taken" },
              { value: "98%", label: "Satisfaction" },
              { value: "2 min", label: "To Complete" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <span className="font-display text-3xl text-gold-gradient">
                  {stat.value}
                </span>
                <p className="text-muted-foreground text-sm mt-1 tracking-widest uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default QuizCTA;

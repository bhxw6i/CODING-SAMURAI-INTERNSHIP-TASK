import { motion } from "framer-motion";

interface LogoIntroProps {
  onComplete: () => void;
}

const LogoIntro = ({ onComplete }: LogoIntroProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      {/* Ambient glow background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(circle at center, hsl(43, 60%, 50% / 0.15) 0%, transparent 60%)",
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 0.3 }}
        transition={{ duration: 3, ease: "easeOut" }}
      />

      <div className="relative">
        {/* SVG Logo with stroke animation */}
        <motion.svg
          viewBox="0 0 400 120"
          className="w-[300px] md:w-[400px] h-auto"
          initial="hidden"
          animate="visible"
        >
          {/* R */}
          <motion.path
            d="M20 100 L20 20 L50 20 Q70 20 70 40 Q70 55 55 60 L75 100"
            fill="none"
            stroke="hsl(43, 45%, 59%)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
          />
          
          {/* o */}
          <motion.ellipse
            cx="100"
            cy="70"
            rx="20"
            ry="25"
            fill="none"
            stroke="hsl(43, 45%, 59%)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeInOut" }}
          />
          
          {/* s */}
          <motion.path
            d="M145 55 Q125 55 125 65 Q125 75 145 75 Q165 75 165 85 Q165 95 145 95"
            fill="none"
            stroke="hsl(43, 45%, 59%)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7, ease: "easeInOut" }}
          />
          
          {/* é */}
          <motion.path
            d="M180 70 L210 70 Q210 50 195 50 Q180 50 180 70 Q180 95 195 95 Q210 95 210 85"
            fill="none"
            stroke="hsl(43, 45%, 59%)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9, ease: "easeInOut" }}
          />
          {/* Accent */}
          <motion.path
            d="M200 35 L210 45"
            fill="none"
            stroke="hsl(43, 45%, 59%)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 1.1, ease: "easeInOut" }}
          />
          
          {/* v */}
          <motion.path
            d="M225 45 L245 95 L265 45"
            fill="none"
            stroke="hsl(43, 45%, 59%)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2, ease: "easeInOut" }}
          />
          
          {/* e */}
          <motion.path
            d="M280 70 L310 70 Q310 50 295 50 Q280 50 280 70 Q280 95 295 95 Q310 95 310 85"
            fill="none"
            stroke="hsl(43, 45%, 59%)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4, ease: "easeInOut" }}
          />
        </motion.svg>

        {/* Fill animation overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
        >
          <h1 className="font-display text-5xl md:text-7xl tracking-[0.3em] text-gold-gradient">
            Roséve
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-muted-foreground text-sm tracking-[0.5em] uppercase whitespace-nowrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 0.8 }}
        >
          Luxury Skincare
        </motion.p>
      </div>

      {/* Particles effect */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: [0, -50],
          }}
          transition={{
            duration: 3,
            delay: 1 + Math.random() * 2,
            repeat: Infinity,
            repeatDelay: Math.random() * 3,
          }}
        />
      ))}

      {/* Skip/Continue trigger */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 0.5 }}
        onAnimationComplete={() => {
          setTimeout(onComplete, 1000);
        }}
      >
        <motion.button
          onClick={onComplete}
          className="text-muted-foreground text-xs tracking-widest uppercase hover:text-primary transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Enter
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default LogoIntro;

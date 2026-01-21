import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LogoIntro from "@/components/LogoIntro";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import CategoryCarousel from "@/components/CategoryCarousel";
import FeaturedProducts from "@/components/FeaturedProducts";
import QuizCTA from "@/components/QuizCTA";
import Footer from "@/components/Footer";

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if intro has been shown before in this session
    const introShown = sessionStorage.getItem("introShown");
    if (introShown) {
      setShowIntro(false);
      setIsLoaded(true);
    }
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem("introShown", "true");
    setShowIntro(false);
    setTimeout(() => setIsLoaded(true), 100);
  };

  return (
    <div className="min-h-screen bg-background text-foreground scrollbar-luxury">
      <AnimatePresence mode="wait">
        {showIntro && <LogoIntro onComplete={handleIntroComplete} />}
      </AnimatePresence>

      <AnimatePresence>
        {!showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Navigation />
            <main>
              <Hero />
              <section id="collections">
                <CategoryCarousel />
              </section>
              <FeaturedProducts />
              <QuizCTA />
              <section id="about">
                <div className="py-24 bg-noir-light">
                  <div className="container mx-auto px-6">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="max-w-3xl mx-auto text-center"
                    >
                      <span className="text-primary/80 text-sm tracking-[0.4em] uppercase mb-4 block">
                        Our Story
                      </span>
                      <h2 className="font-display text-4xl md:text-5xl tracking-wide mb-8">
                        About <span className="text-gold-gradient italic">Roséve</span>
                      </h2>
                      <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                        Born from a passion for timeless beauty and the art of skincare, Roséve 
                        represents the pinnacle of luxury formulations. Our philosophy centers on 
                        combining the finest natural ingredients with cutting-edge science.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Each product is meticulously crafted in small batches, ensuring the highest 
                        quality and efficacy. We believe that skincare is not just routine—it's a 
                        ritual of self-care and an investment in your radiance.
                      </p>
                    </motion.div>
                  </div>
                </div>
              </section>
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;

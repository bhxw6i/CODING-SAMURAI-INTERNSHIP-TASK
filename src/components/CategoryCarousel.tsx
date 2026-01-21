import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Import category images
import categoryCleansers from "@/assets/category-cleansers.jpg";
import categorySerums from "@/assets/category-serums.jpg";
import categoryMoisturizers from "@/assets/category-moisturizers.jpg";
import productEyecream from "@/assets/product-eyecream.jpg";
import productMask from "@/assets/product-mask.jpg";
import productOil from "@/assets/product-oil.jpg";

const categories = [
  { id: 1, name: "Cleansers", image: categoryCleansers, description: "Gentle purifying formulas", shopCategory: "cleansers" },
  { id: 2, name: "Serums", image: categorySerums, description: "Concentrated treatments", shopCategory: "serums" },
  { id: 3, name: "Moisturizers", image: categoryMoisturizers, description: "Deep hydration", shopCategory: "moisturizers" },
  { id: 4, name: "Treatments", image: productOil, description: "Premium treatments", shopCategory: "treatments" },
  { id: 5, name: "Masks", image: productMask, description: "Curated collections", shopCategory: "masks" },
  { id: 6, name: "Eye Care", image: productEyecream, description: "Delicate formulas", shopCategory: "eye care" },
];

const allCategories = [...categories, ...categories];

const CategoryCarousel = () => {
  const [isPaused, setIsPaused] = useState(false);
  const controls = useAnimationControls();

  useEffect(() => {
    if (!isPaused) {
      controls.start({
        x: [0, -50 * categories.length + "%"],
        transition: { duration: 30, ease: "linear", repeat: Infinity },
      });
    } else {
      controls.stop();
    }
  }, [isPaused, controls]);

  return (
    <section className="py-24 bg-noir-light overflow-hidden">
      <div className="container mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <span className="text-primary/80 text-sm tracking-[0.4em] uppercase mb-4 block">Explore</span>
          <h2 className="font-display text-4xl md:text-5xl tracking-wide mb-4">
            Shop by <span className="text-gold-gradient italic">Category</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Discover our carefully curated skincare categories, each designed to address your unique beauty needs.
          </p>
        </motion.div>
      </div>

      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-noir-light to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-noir-light to-transparent z-10 pointer-events-none" />

        <motion.div className="flex gap-6" animate={controls}>
          {allCategories.map((category, index) => (
            <Link 
              to={`/shop?category=${category.shopCategory}`}
              key={`${category.id}-${index}`} 
              className="flex-shrink-0"
            >
              <motion.div
                className="relative w-72 h-96 rounded-lg overflow-hidden group cursor-pointer"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.4 }}
              >
                <img src={category.image} alt={category.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "radial-gradient(circle at center, hsl(43, 60%, 50% / 0.15) 0%, transparent 70%)" }}
                />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <span className="text-primary text-xs tracking-widest uppercase mb-2">{category.description}</span>
                  <h3 className="font-display text-2xl text-foreground mb-2 group-hover:text-primary transition-all duration-300">{category.name}</h3>
                  <div className="w-0 h-px bg-primary group-hover:w-16 transition-all duration-500" />
                </div>
                <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/50 rounded-lg transition-all duration-500" />
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryCarousel;

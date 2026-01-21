import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

// Import product images
import productSerum from "@/assets/product-serum.jpg";
import productMoisturizer from "@/assets/product-moisturizer.jpg";
import productCleanser from "@/assets/product-cleanser.jpg";
import productEyecream from "@/assets/product-eyecream.jpg";
import productOil from "@/assets/product-oil.jpg";
import productMask from "@/assets/product-mask.jpg";

const products = [
  {
    id: 1,
    name: "Luminous Glow Serum",
    category: "Serums",
    price: 125,
    image: productSerum,
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Midnight Recovery Oil",
    category: "Treatments",
    price: 89,
    image: productOil,
    badge: null,
  },
  {
    id: 3,
    name: "Golden Elixir Moisturizer",
    category: "Moisturizers",
    price: 145,
    image: productMoisturizer,
    badge: "New",
  },
  {
    id: 4,
    name: "Rose Petal Cleanser",
    category: "Cleansers",
    price: 68,
    image: productCleanser,
    badge: null,
  },
  {
    id: 5,
    name: "Velvet Touch Eye Cream",
    category: "Eye Care",
    price: 95,
    image: productEyecream,
    badge: "Limited",
  },
  {
    id: 6,
    name: "Radiance Boost Mask",
    category: "Masks",
    price: 78,
    image: productMask,
    badge: null,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const FeaturedProducts = () => {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary/80 text-sm tracking-[0.4em] uppercase mb-4 block">
            Featured
          </span>
          <h2 className="font-display text-4xl md:text-5xl tracking-wide mb-4">
            Best <span className="text-gold-gradient italic">Sellers</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Our most beloved formulations, cherished by beauty enthusiasts
            worldwide.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="group"
            >
              <div className="relative bg-card rounded-lg overflow-hidden luxury-card">
                {/* Product Image */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Hover overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                  />

                  {/* Badge */}
                  {product.badge && (
                    <motion.span
                      className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs tracking-widest uppercase rounded"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {product.badge}
                    </motion.span>
                  )}

                  {/* Quick actions */}
                  <motion.div
                    className="absolute top-4 right-4 flex flex-col gap-2"
                    initial={{ opacity: 0, x: 20 }}
                    whileHover={{ opacity: 1, x: 0 }}
                  >
                    <motion.button
                      className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-all opacity-0 group-hover:opacity-100"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ delay: 0.1 }}
                      onClick={() => toggleFavorite(product.id)}
                    >
                      <Heart 
                        className="w-4 h-4 transition-colors" 
                        fill={favorites.has(product.id) ? "#f59e0b" : "none"}
                        stroke={favorites.has(product.id) ? "#f59e0b" : "currentColor"}
                      />
                    </motion.button>
                  </motion.div>

                  {/* Add to cart - appears on hover */}
                  <motion.div
                    className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0"
                  >
                    <Button
                      variant="luxury"
                      className="w-full gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Add to Cart
                    </Button>
                  </motion.div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <span className="text-muted-foreground text-xs tracking-widest uppercase">
                    {product.category}
                  </span>
                  <h3 className="font-display text-lg mt-2 mb-3 group-hover:text-primary transition-colors duration-300">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-gold-gradient font-display text-xl">
                      ${product.price}
                    </span>
                    <motion.div
                      className="w-0 h-px bg-primary group-hover:w-12 transition-all duration-500"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Link to="/shop">
            <Button variant="luxuryOutline" size="lg">
              View All Products
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

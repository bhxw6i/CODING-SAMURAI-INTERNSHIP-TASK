import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, Filter, Grid3X3, LayoutGrid, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductModal from "@/components/ProductModal";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { api, Product } from "@/lib/api";

const categories = ["All", "Serums", "Moisturizers", "Cleansers", "Treatments", "Eye Care", "Masks"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [gridCols, setGridCols] = useState<2 | 3>(3);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Get category from URL params on mount and when params change
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      // Capitalize first letter to match category format
      const formattedCategory = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);
      if (categories.includes(formattedCategory)) {
        setSelectedCategory(formattedCategory);
      }
    }
  }, [searchParams]);

  // Fetch products when category changes
  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const category = selectedCategory === "All" ? undefined : selectedCategory;
      const fetchedProducts = await api.getProducts(category);
      setProducts(fetchedProducts);
    } catch (error: any) {
      console.error("Error loading products:", error);
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Update URL params
    if (category === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: category.toLowerCase() });
    }
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProductClick = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to cart",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      await addToCart(product._id, 1);
      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const toggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const filteredProducts = products;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="pt-24">
        {/* Hero Banner */}
        <motion.section 
          className="relative py-20 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="container mx-auto px-6 text-center relative z-10">
            <motion.span
              className="text-primary/80 text-sm tracking-[0.4em] uppercase mb-4 block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Explore
            </motion.span>
            <motion.h1
              className="font-display text-5xl md:text-6xl tracking-wide mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Our <span className="text-gold-gradient italic">Collection</span>
            </motion.h1>
            <motion.p
              className="text-muted-foreground max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Discover luxury skincare formulations crafted for radiant, timeless beauty.
            </motion.p>
          </div>
        </motion.section>

        {/* Filters & Grid */}
        <section className="container mx-auto px-6 pb-24">
          {/* Filter Bar */}
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-6 border-b border-border/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 text-sm tracking-wide whitespace-nowrap rounded-full transition-all duration-300 ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-card hover:bg-card/80 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setGridCols(2)}
                className={`p-2 rounded transition-colors ${gridCols === 2 ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setGridCols(3)}
                className={`p-2 rounded transition-colors ${gridCols === 3 ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <motion.div
                className={`grid grid-cols-1 md:grid-cols-2 ${gridCols === 3 ? 'lg:grid-cols-3' : ''} gap-8`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key={selectedCategory}
              >
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product._id}
                    variants={itemVariants}
                    className="group cursor-pointer"
                    onClick={(e) => handleProductClick(product, e)}
                  >
                    <div className="relative bg-card rounded-lg overflow-hidden luxury-card">
                      {/* Product Image */}
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <motion.img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                        {/* Badge */}
                        {product.badge && (
                          <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs tracking-widest uppercase rounded">
                            {product.badge}
                          </span>
                        )}

                        {/* Quick actions */}
                        <div className="absolute top-4 right-4">
                          <motion.button
                            className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-all opacity-0 group-hover:opacity-100"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => toggleFavorite(product._id, e)}
                          >
                            <Heart 
                              className="w-4 h-4 transition-colors" 
                              fill={favorites.has(product._id) ? "#f59e0b" : "none"}
                              stroke={favorites.has(product._id) ? "#f59e0b" : "currentColor"}
                            />
                          </motion.button>
                        </div>

                        {/* Add to cart */}
                        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                          <Button
                            variant="luxury"
                            className="w-full gap-2"
                            onClick={(e) => handleAddToCart(product, e)}
                          >
                            <ShoppingBag className="w-4 h-4" />
                            Add to Cart
                          </Button>
                        </div>
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
                          <div className="w-0 h-px bg-primary group-hover:w-12 transition-all duration-500" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {filteredProducts.length === 0 && (
                <motion.div
                  className="text-center py-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-muted-foreground">No products found in this category.</p>
                </motion.div>
              )}
            </>
          )}
        </section>
      </main>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <Footer />
    </div>
  );
};

export default ShopPage;

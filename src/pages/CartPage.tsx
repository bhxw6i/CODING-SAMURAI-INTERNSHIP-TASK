import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const CartPage = () => {
  const { cart, loading, updateCartItem, removeCartItem, refreshCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleUpdateQuantity = async (itemId: string, currentQuantity: number, delta: number) => {
    const newQuantity = Math.max(1, currentQuantity + delta);
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update quantity',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeCartItem(itemId);
      toast({
        title: 'Item removed',
        description: 'Item has been removed from your cart',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove item',
        variant: 'destructive',
      });
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const cartItems = (cart?.items || []).filter(item => item.product); // Filter out items with missing product data
  const subtotal = cartItems.reduce((sum, item) => {
    if (!item.product || typeof item.product.price !== 'number') {
      return sum;
    }
    return sum + item.product.price * item.quantity;
  }, 0);
  const shipping = subtotal > 150 ? 0 : 15;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="pt-24 pb-24">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary/80 text-sm tracking-[0.4em] uppercase mb-4 block">
              Your Selection
            </span>
            <h1 className="font-display text-5xl md:text-6xl tracking-wide">
              Shopping <span className="text-gold-gradient italic">Cart</span>
            </h1>
          </motion.div>

          {cartItems.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <h2 className="font-display text-2xl mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">
                Discover our luxurious skincare collection and find your perfect match.
              </p>
              <Link to="/shop">
                <Button variant="luxury" size="lg">
                  Continue Shopping
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Cart Items */}
              <motion.div 
                className="lg:col-span-2 space-y-6"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex gap-6 p-6 bg-card rounded-lg luxury-card"
                    >
                      {/* Product Image */}
                      <div className="relative w-24 h-32 md:w-32 md:h-40 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.image || '/placeholder.svg'}
                          alt={item.product.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-muted-foreground text-xs tracking-widest uppercase">
                            {item.product.category}
                          </span>
                          <h3 className="font-display text-lg md:text-xl mt-1">
                            {item.product.name}
                          </h3>
                        </div>

                        <div className="flex items-end justify-between mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <motion.button
                              onClick={() => handleUpdateQuantity(item._id, item.quantity, -1)}
                              className="w-8 h-8 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Minus className="w-3 h-3" />
                            </motion.button>
                            <span className="w-8 text-center font-display">{item.quantity}</span>
                            <motion.button
                              onClick={() => handleUpdateQuantity(item._id, item.quantity, 1)}
                              className="w-8 h-8 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Plus className="w-3 h-3" />
                            </motion.button>
                          </div>

                          {/* Price */}
                          <span className="text-gold-gradient font-display text-xl">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <motion.button
                        onClick={() => handleRemoveItem(item._id)}
                        className="self-start p-2 text-muted-foreground hover:text-destructive transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Continue Shopping */}
                <Link to="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  Continue Shopping
                </Link>
              </motion.div>

              {/* Order Summary */}
              <motion.div
                className="lg:col-span-1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="sticky top-28 bg-card rounded-lg p-8 luxury-card">
                  <h2 className="font-display text-2xl mb-8">Order Summary</h2>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-muted-foreground/70">
                        Free shipping on orders over $150
                      </p>
                    )}
                    <div className="h-px bg-border/50 my-4" />
                    <div className="flex justify-between font-display text-xl">
                      <span>Total</span>
                      <span className="text-gold-gradient">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Link to="/checkout">
                    <Button variant="luxury" size="lg" className="w-full mb-4">
                      Checkout
                    </Button>
                  </Link>
                  
                  <p className="text-xs text-center text-muted-foreground">
                    Secure checkout powered by Razorpay
                  </p>

                  {/* Promo Code */}
                  <div className="mt-8 pt-6 border-t border-border/30">
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Promo Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter code"
                        className="flex-1 px-4 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                      />
                      <Button variant="luxuryOutline" size="sm">
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;

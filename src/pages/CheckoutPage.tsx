import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const CheckoutForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, refreshCart } = useCart();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'United States',
  });
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!cart) {
      return;
    }

    if (cart.items.length === 0) {
      navigate('/cart');
      return;
    }
  }, [cart, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cart || cart.items.length === 0) {
      return;
    }

    setLoading(true);

    try {
      // Calculate totals
      const subtotal = cart.items.reduce(
        (sum: number, item: any) => sum + item.product.price * item.quantity,
        0
      );
      const shipping = subtotal > 150 ? 0 : 15;
      const total = subtotal + shipping;

      // Create Razorpay order
      const order = await api.createRazorpayOrder({
        amount: total,
        currency: 'INR',
        shippingAddress,
        userId: user?._id,
      });

      setOrderId(order._id);

      // Initialize Razorpay payment
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: Math.round(total * 100), // Convert to paise
          currency: 'INR',
          name: 'Roséve',
          description: 'Beauty Products Purchase',
          order_id: order.razorpayOrderId,
          handler: async (response: any) => {
            try {
              // Verify payment
              const verification = await api.verifyRazorpayPayment({
                orderId: order._id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              });

              if (verification.success) {
                // Clear cart
                await refreshCart();

                toast({
                  title: 'Order placed!',
                  description: 'Your order has been successfully placed.',
                });

                navigate('/shop');
              }
            } catch (error: any) {
              toast({
                title: 'Payment verification failed',
                description: error.message || 'Failed to verify payment',
                variant: 'destructive',
              });
            }
          },
          prefill: {
            name: user?.name,
            email: user?.email,
          },
          theme: {
            color: '#d4af37',
          },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      };
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create order',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!cart) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const subtotal = cart.items.reduce(
    (sum: number, item: any) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 150 ? 0 : 15;
  const total = subtotal + shipping;

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#fff',
        '::placeholder': {
          color: '#888',
        },
      },
      invalid: {
        color: '#ef4444',
      },
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="pt-24 pb-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary/80 text-sm tracking-[0.4em] uppercase mb-4 block">
              Complete Your Order
            </span>
            <h1 className="font-display text-5xl md:text-6xl tracking-wide">
              Checkout
            </h1>
          </motion.div>

          <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Shipping & Payment */}
            <div className="space-y-8">
              {/* Shipping Address */}
              <motion.div
                className="bg-card rounded-lg p-8 luxury-card"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="font-display text-2xl mb-6">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.street}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, street: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">City</label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, city: e.target.value })
                        }
                        required
                        className="w-full px-4 py-3 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">State</label>
                      <input
                        type="text"
                        value={shippingAddress.state}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, state: e.target.value })
                        }
                        required
                        className="w-full px-4 py-3 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">ZIP Code</label>
                      <input
                        type="text"
                        value={shippingAddress.zipCode}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, zipCode: e.target.value })
                        }
                        required
                        className="w-full px-4 py-3 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">Country</label>
                      <input
                        type="text"
                        value={shippingAddress.country}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, country: e.target.value })
                        }
                        required
                        className="w-full px-4 py-3 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Payment */}
              <motion.div
                className="bg-card rounded-lg p-8 luxury-card"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="font-display text-2xl mb-6">Payment Method</h2>
                <p className="text-muted-foreground">
                  Click "Pay Now" to proceed with secure payment via Razorpay
                </p>
              </motion.div>
            </div>

            {/* Right Column - Order Summary */}
            <motion.div
              className="lg:sticky lg:top-28"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-card rounded-lg p-8 luxury-card">
                <h2 className="font-display text-2xl mb-8">Order Summary</h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cart.items.map((item: any) => (
                    <div key={item._id} className="flex gap-4 pb-4 border-b border-border/30">
                      <div className="w-16 h-20 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-sm">{item.product.name}</h3>
                        <p className="text-xs text-muted-foreground mb-1">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-gold-gradient font-display">
                          ${item.product.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
                  </div>
                  <div className="h-px bg-border/50 my-4" />
                  <div className="flex justify-between font-display text-xl">
                    <span>Total</span>
                    <span className="text-gold-gradient">${total}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="luxury"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay ₹${total}`
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Secure payment powered by Razorpay
                </p>
              </div>
            </motion.div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const CheckoutPage = () => {
  return <CheckoutForm />;
};

export default CheckoutPage;
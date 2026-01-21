import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { api, Product } from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface Review {
  _id: string;
  user: {
    name: string;
    _id: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && product?._id) {
      loadReviews();
    }
  }, [isOpen, product?._id]);

  const loadReviews = async () => {
    if (!product?._id) return;
    try {
      setLoading(true);
      // For now, using mock reviews. Replace with API call when backend is ready
      const mockReviews: Review[] = [
        {
          _id: "1",
          user: { name: "Sarah Johnson", _id: "1" },
          rating: 5,
          comment: "Absolutely love this product! My skin has never looked better.",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "2",
          user: { name: "Emily Chen", _id: "2" },
          rating: 4,
          comment: "Great quality and fast shipping. Would recommend!",
          createdAt: new Date().toISOString(),
        },
      ];
      setReviews(mockReviews);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product?._id) return;

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

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to write a review",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (reviewRating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmittingReview(true);
      // TODO: Implement API call when backend is ready
      // await api.createReview(product._id, { rating: reviewRating, comment: reviewComment });
      
      // Mock success
      const newReview: Review = {
        _id: Date.now().toString(),
        user: { name: "You", _id: "current" },
        rating: reviewRating,
        comment: reviewComment,
        createdAt: new Date().toISOString(),
      };
      setReviews([newReview, ...reviews]);
      setReviewRating(0);
      setReviewComment("");
      toast({
        title: "Review submitted!",
        description: "Thank you for your review",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!product) return null;

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl pointer-events-auto flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col lg:flex-row h-full overflow-y-auto">
                {/* Left Side - Product Image */}
                <div className="lg:w-1/2 bg-card p-8 flex items-center justify-center">
                  <motion.img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="max-w-full max-h-[500px] object-contain rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  />
                </div>

                {/* Right Side - Product Info */}
                <div className="lg:w-1/2 p-8 overflow-y-auto">
                  {/* Product Header */}
                  <div className="mb-6">
                    <span className="text-muted-foreground text-xs tracking-widest uppercase">
                      {product.category}
                    </span>
                    <h2 className="font-display text-3xl md:text-4xl mt-2 mb-4">
                      {product.name}
                    </h2>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-gold-gradient font-display text-3xl">
                        ${product.price}
                      </span>
                      {averageRating > 0 && (
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.round(averageRating)
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-muted-foreground">
                            ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                          </span>
                        </div>
                      )}
                    </div>
                    {product.description && (
                      <p className="text-muted-foreground leading-relaxed">
                        {product.description}
                      </p>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    variant="luxury"
                    size="lg"
                    className="w-full mb-8 gap-2"
                    onClick={handleAddToCart}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </Button>

                  {/* Reviews Section */}
                  <div className="border-t border-border/50 pt-6">
                    <h3 className="font-display text-xl mb-4">Reviews</h3>

                    {/* Review Form */}
                    {isAuthenticated && (
                      <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-card rounded-lg">
                        <div className="mb-4">
                          <label className="block text-sm text-muted-foreground mb-2">
                            Rating
                          </label>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setReviewRating(i + 1)}
                                className="focus:outline-none"
                              >
                                <Star
                                  className={`w-6 h-6 transition-colors ${
                                    i < reviewRating
                                      ? "fill-primary text-primary"
                                      : "text-muted-foreground hover:text-primary/50"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm text-muted-foreground mb-2">
                            Your Review
                          </label>
                          <textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Share your thoughts about this product..."
                            className="w-full px-4 py-3 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px] resize-none"
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          variant="luxuryOutline"
                          size="sm"
                          disabled={submittingReview}
                        >
                          {submittingReview ? "Submitting..." : "Submit Review"}
                        </Button>
                      </form>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {loading ? (
                        <p className="text-muted-foreground text-center py-4">Loading reviews...</p>
                      ) : reviews.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">
                          No reviews yet. Be the first to review!
                        </p>
                      ) : (
                        reviews.map((review) => (
                          <div key={review._id} className="p-4 bg-card rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{review.user.name}</span>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "fill-primary text-primary"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-muted-foreground text-sm mb-2">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-foreground">{review.comment}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;

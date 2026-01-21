import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, ShoppingBag, Sparkles } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

interface Question {
  id: number;
  question: string;
  options: { id: string; label: string; value: string }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "How would you describe your skin type?",
    options: [
      { id: "dry", label: "Dry", value: "dry" },
      { id: "oily", label: "Oily", value: "oily" },
      { id: "combination", label: "Combination", value: "combination" },
      { id: "sensitive", label: "Sensitive", value: "sensitive" },
    ],
  },
  {
    id: 2,
    question: "What is your primary skin concern?",
    options: [
      { id: "acne", label: "Acne & Breakouts", value: "acne" },
      { id: "aging", label: "Fine Lines & Aging", value: "aging" },
      { id: "pigmentation", label: "Dark Spots & Pigmentation", value: "pigmentation" },
      { id: "dullness", label: "Dullness & Uneven Tone", value: "dullness" },
    ],
  },
  {
    id: 3,
    question: "How would you describe your lifestyle?",
    options: [
      { id: "busy", label: "Busy & On-the-go", value: "busy" },
      { id: "balanced", label: "Balanced & Active", value: "balanced" },
      { id: "relaxed", label: "Relaxed & Mindful", value: "relaxed" },
      { id: "outdoor", label: "Outdoor & Adventurous", value: "outdoor" },
    ],
  },
  {
    id: 4,
    question: "What's your preferred skincare routine complexity?",
    options: [
      { id: "minimal", label: "Keep it Simple (2-3 steps)", value: "minimal" },
      { id: "moderate", label: "Balanced Routine (4-5 steps)", value: "moderate" },
      { id: "extensive", label: "Comprehensive (6+ steps)", value: "extensive" },
      { id: "flexible", label: "I'm Flexible", value: "flexible" },
    ],
  },
];

interface ProductRecommendation {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  reason: string;
}

const getRecommendations = (answers: Record<number, string>): ProductRecommendation[] => {
  const recommendations: ProductRecommendation[] = [];

  // Cleanser recommendation based on skin type
  if (answers[1] === "dry" || answers[1] === "sensitive") {
    recommendations.push({
      id: 1,
      name: "Rose Petal Gentle Cleanser",
      category: "Cleanser",
      price: 68,
      image: "/placeholder.svg",
      reason: "Gentle formula perfect for your sensitive/dry skin",
    });
  } else {
    recommendations.push({
      id: 2,
      name: "Purifying Gold Cleanser",
      category: "Cleanser",
      price: 72,
      image: "/placeholder.svg",
      reason: "Deep cleansing for oil control without stripping",
    });
  }

  // Serum based on skin concern
  if (answers[2] === "aging") {
    recommendations.push({
      id: 3,
      name: "Midnight Recovery Elixir",
      category: "Serum",
      price: 145,
      image: "/placeholder.svg",
      reason: "Powerful anti-aging with retinol & gold particles",
    });
  } else if (answers[2] === "pigmentation") {
    recommendations.push({
      id: 4,
      name: "Luminous Glow Serum",
      category: "Serum",
      price: 125,
      image: "/placeholder.svg",
      reason: "Vitamin C complex for brightening dark spots",
    });
  } else if (answers[2] === "acne") {
    recommendations.push({
      id: 5,
      name: "Clear Skin Concentrate",
      category: "Serum",
      price: 98,
      image: "/placeholder.svg",
      reason: "Salicylic acid & niacinamide for clear skin",
    });
  } else {
    recommendations.push({
      id: 6,
      name: "Radiance Boost Essence",
      category: "Serum",
      price: 110,
      image: "/placeholder.svg",
      reason: "Hydrating essence for instant glow",
    });
  }

  // Moisturizer based on type and lifestyle
  if (answers[3] === "outdoor" || answers[1] === "dry") {
    recommendations.push({
      id: 7,
      name: "Golden Shield Moisturizer SPF50",
      category: "Moisturizer",
      price: 95,
      image: "/placeholder.svg",
      reason: "Heavy-duty protection for outdoor lifestyle",
    });
  } else {
    recommendations.push({
      id: 8,
      name: "Velvet Cloud Moisturizer",
      category: "Moisturizer",
      price: 88,
      image: "/placeholder.svg",
      reason: "Lightweight hydration that won't feel heavy",
    });
  }

  return recommendations;
};

const QuizPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([]);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [questions[currentQuestion].id]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // Complete quiz
      const recs = getRecommendations(answers);
      setRecommendations(recs);
      setIsComplete(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const currentAnswer = answers[questions[currentQuestion]?.id];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <AnimatePresence mode="wait">
            {!isComplete ? (
              <motion.div
                key="quiz"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-2xl mx-auto"
              >
                {/* Header */}
                <motion.div
                  className="text-center mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="text-primary/80 text-sm tracking-[0.4em] uppercase mb-4 block">
                    Skin Analysis
                  </span>
                  <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-4">
                    Find Your <span className="text-gold-gradient italic">Perfect</span> Match
                  </h1>
                </motion.div>

                {/* Progress Bar */}
                <div className="mb-12">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Question {currentQuestion + 1} of {questions.length}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-gold"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Question */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h2 className="font-display text-2xl md:text-3xl text-center mb-10">
                      {questions[currentQuestion].question}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {questions[currentQuestion].options.map((option, index) => (
                        <motion.button
                          key={option.id}
                          onClick={() => handleAnswer(option.value)}
                          className={`relative p-6 rounded-lg border transition-all duration-300 text-left group ${
                            currentAnswer === option.value
                              ? "border-primary bg-primary/10 shadow-gold"
                              : "border-border/50 bg-card hover:border-primary/50 hover:bg-card/80"
                          }`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-display text-lg">{option.label}</span>
                            {currentAnswer === option.value && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                              >
                                <Check className="w-4 h-4 text-primary-foreground" />
                              </motion.div>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between mt-12">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentQuestion === 0}
                    className="gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <Button
                    variant="luxury"
                    onClick={handleNext}
                    disabled={!currentAnswer}
                    className="gap-2"
                  >
                    {currentQuestion === questions.length - 1 ? "See Results" : "Next"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-4xl mx-auto"
              >
                {/* Results Header */}
                <motion.div
                  className="text-center mb-16"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <motion.div
                    className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <Sparkles className="w-10 h-10 text-primary" />
                  </motion.div>
                  <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-4">
                    Your <span className="text-gold-gradient italic">Perfect</span> Routine
                  </h1>
                  <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                    Based on your answers, we've curated a personalized skincare routine just for you.
                  </p>
                </motion.div>

                {/* Recommendations */}
                <div className="space-y-6 mb-12">
                  {recommendations.map((product, index) => (
                    <motion.div
                      key={product.id}
                      className="flex flex-col sm:flex-row gap-6 p-6 rounded-lg bg-card border border-border/50 luxury-card"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.15 }}
                    >
                      <div className="w-full sm:w-32 h-32 rounded-lg bg-noir-medium flex-shrink-0 overflow-hidden">
                        <div className="w-full h-full shimmer" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div>
                            <span className="text-primary text-xs tracking-widest uppercase">
                              Step {index + 1}: {product.category}
                            </span>
                            <h3 className="font-display text-xl mt-1">{product.name}</h3>
                            <p className="text-muted-foreground text-sm mt-2">
                              {product.reason}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="text-gold-gradient font-display text-2xl">
                              ${product.price}
                            </span>
                            <Button variant="outline" size="sm" className="gap-2">
                              <ShoppingBag className="w-4 h-4" />
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Total and CTA */}
                <motion.div
                  className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-lg bg-noir-light border border-primary/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div>
                    <span className="text-muted-foreground text-sm">Complete Routine Total</span>
                    <p className="font-display text-3xl text-gold-gradient">
                      ${recommendations.reduce((sum, p) => sum + p.price, 0)}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="luxuryOutline" onClick={() => {
                      setIsComplete(false);
                      setCurrentQuestion(0);
                      setAnswers({});
                    }}>
                      Retake Quiz
                    </Button>
                    <Button variant="hero" className="gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      Add All to Cart
                    </Button>
                  </div>
                </motion.div>

                {/* Back to shop */}
                <motion.div
                  className="text-center mt-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors">
                    Or continue browsing our collection →
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default QuizPage;

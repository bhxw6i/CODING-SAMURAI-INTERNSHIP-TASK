import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, User, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavLink {
  name: string;
  href: string;
  isSection?: boolean;
  sectionId?: string;
}

const Navigation = () => {
  const { cartCount = 0 } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks: NavLink[] = [
    { name: "Shop", href: "/shop" },
    { name: "Collections", href: "/#collections", isSection: true, sectionId: "collections" },
    { name: "Skin Quiz", href: "/quiz" },
    { name: "About", href: "/#about", isSection: true, sectionId: "about" },
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border/50"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="relative z-50">
              <motion.h1
                className="font-display text-2xl md:text-3xl tracking-[0.2em] text-gold-gradient"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                Roséve
              </motion.h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                link.isSection ? (
                  <button
                    key={link.name}
                    onClick={() => scrollToSection(link.sectionId!)}
                    className="relative text-sm tracking-widest uppercase text-foreground/80 hover:text-primary transition-colors duration-300 group"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                  </button>
                ) : (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="relative text-sm tracking-widest uppercase text-foreground/80 hover:text-primary transition-colors duration-300 group"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                  </Link>
                )
              ))}
            </div>

            {/* Right side icons */}
            <div className="flex items-center gap-6">
              {/* User Menu / Login */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative"
                    >
                      <User className="w-5 h-5 text-foreground/80 hover:text-primary transition-colors" />
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="px-2 py-1.5 text-sm border-b border-border/50">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <DropdownMenuItem onClick={logout} className="cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart" className="relative">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <ShoppingBag className="w-5 h-5 text-foreground/80 hover:text-primary transition-colors" />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-medium flex items-center justify-center rounded-full"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </motion.div>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden relative z-50"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6 text-foreground" />
                  ) : (
                    <Menu className="w-6 h-6 text-foreground" />
                  )}
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-background"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  {link.isSection ? (
                    <button
                      onClick={() => scrollToSection(link.sectionId!)}
                      className="font-display text-3xl tracking-widest text-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <Link
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="font-display text-3xl tracking-widest text-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;

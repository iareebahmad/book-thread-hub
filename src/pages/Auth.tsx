import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { BookOpen, Users, MessageCircle, Sparkles, ArrowLeft, TrendingUp, Award, BookMarked } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  const { signUp, signIn, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast({ title: "Username required", description: "Please enter a username.", variant: "destructive" });
      return;
    }
    const { error } = await signUp(email, password, username);
    if (error) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome to BookThreads!", description: "Account created successfully." });
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await signIn(email, password);
    if (error) {
      toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome back!", description: "Signed in successfully." });
    }
  };

  const handleShowAuth = (tab: "signin" | "signup") => {
    setActiveTab(tab);
    setShowAuthForm(true);
  };

  // Landing Page
  if (!showAuthForm) {
    return (
      <div className="relative min-h-screen w-screen overflow-hidden bg-background">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
          <div className="absolute top-0 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-48 md:w-80 h-48 md:h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Navigation */}
        <nav className="relative z-20 flex items-center justify-between px-4 md:px-12 py-4 md:py-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-primary rounded-xl shadow-lg shadow-primary/25">
              <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
            </div>
            <span className="text-lg md:text-xl font-serif font-bold text-foreground">BookThreads</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Button
              onClick={() => navigate("/about")}
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex"
            >
              About
            </Button>
            <Button
              onClick={() => navigate("/pricing")}
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex"
            >
              Pricing
            </Button>
            <Button
              onClick={() => handleShowAuth("signin")}
              variant="outline"
              size="sm"
            >
              Login
            </Button>
            <Button
              onClick={() => handleShowAuth("signup")}
              size="sm"
            >
              Sign Up
            </Button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative z-10 flex flex-col items-center justify-center px-4 md:px-6 pt-12 md:pt-16 pb-16 md:pb-24">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 md:mb-8 animate-fade-in">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-primary" />
            <span className="text-xs md:text-sm text-primary font-medium">Your Reading Community Awaits</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-center max-w-4xl mb-4 md:mb-6 animate-fade-in px-2" style={{ animationDelay: '0.1s' }}>
            Where <span className="gradient-text">Readers</span> Connect & <span className="gradient-text">Stories</span> Come Alive
          </h1>
          
          <p className="text-base md:text-xl text-muted-foreground text-center max-w-2xl mb-8 md:mb-10 animate-fade-in px-4" style={{ animationDelay: '0.2s' }}>
            Join thousands of book lovers discussing their favorite reads, sharing insights, and discovering new literary adventures together.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto px-4 sm:px-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button
              onClick={() => handleShowAuth("signup")}
              size="lg"
              className="w-full sm:w-auto"
            >
              Get Started Free
            </Button>
            <Button
              onClick={() => handleShowAuth("signin")}
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
            >
              Sign In
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 md:gap-8 mt-12 md:mt-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <p className="text-xl md:text-3xl font-bold text-foreground">10K+</p>
              <p className="text-xs md:text-sm text-muted-foreground">Readers</p>
            </div>
            <div className="w-px h-8 md:h-12 bg-border" />
            <div className="text-center">
              <p className="text-xl md:text-3xl font-bold text-foreground">500+</p>
              <p className="text-xs md:text-sm text-muted-foreground">Books</p>
            </div>
            <div className="w-px h-8 md:h-12 bg-border" />
            <div className="text-center">
              <p className="text-xl md:text-3xl font-bold text-foreground">95%</p>
              <p className="text-xs md:text-sm text-muted-foreground">Satisfaction</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative z-10 px-4 md:px-12 py-16 md:py-24 bg-card/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold mb-3 md:mb-4">
                The Smartest Way to <span className="gradient-text">Read & Connect</span>
              </h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4">
                We've built the perfect platform for book enthusiasts to share their passion
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[
                { icon: Users, title: "Community Driven", desc: "Connect with like-minded readers and expand your literary horizons" },
                { icon: MessageCircle, title: "Rich Discussions", desc: "Start threads, share opinions, and engage in meaningful book talks" },
                { icon: Sparkles, title: "Reading Avatar", desc: "Get a unique character based on your reading personality" },
                { icon: TrendingUp, title: "Trending Books", desc: "Discover what's hot in the reading community right now" },
                { icon: Award, title: "Earn Badges", desc: "Get recognized for your contributions and reading achievements" },
                { icon: BookMarked, title: "Track Favorites", desc: "Build your personal library and track books you love" },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group p-5 md:p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-card transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 md:mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-foreground mb-1.5 md:mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-xs md:text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 px-4 md:px-12 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold mb-4 md:mb-6">
              Ready to Join the <span className="gradient-text">Reading Revolution</span>?
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              Join our growing community of passionate readers. It's free to get started!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4 sm:px-0">
              <Button
                onClick={() => handleShowAuth("signup")}
                size="lg"
                className="w-full sm:w-auto"
              >
                Start Reading
              </Button>
              <Button
                onClick={() => navigate("/about")}
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 px-4 md:px-12 py-6 md:py-8 border-t border-border/50">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              <span className="font-serif font-semibold text-sm md:text-base">BookThreads</span>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">© 2025 BookThreads. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  }

  // Auth Form
  return (
    <div className="relative min-h-screen w-screen flex flex-col items-center justify-center overflow-hidden bg-background px-4">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 md:w-80 h-48 md:h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Back Button */}
      <Button
        onClick={() => setShowAuthForm(false)}
        variant="ghost"
        size="sm"
        className="absolute top-4 left-4 md:top-6 md:left-6 z-20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* Auth Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Tab Switcher */}
        <div className="flex rounded-2xl bg-card/50 border border-border/50 p-1.5 mb-6 md:mb-8">
          <button
            onClick={() => setActiveTab("signin")}
            className={`flex-1 py-2.5 md:py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeTab === "signin"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-2.5 md:py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeTab === "signup"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl md:rounded-3xl bg-card/80 border border-border/50 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-4 md:mb-6">
            <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-primary rounded-xl">
              <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
            </div>
            <span className="text-base md:text-lg font-serif font-bold text-primary">BookThreads</span>
          </div>

          {/* Title */}
          <h1 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-center text-foreground mb-1.5 md:mb-2">
            {activeTab === "signin" ? "Welcome Back" : "Join BookThreads"}
          </h1>
          <p className="text-center text-muted-foreground text-sm md:text-base mb-6 md:mb-8">
            {activeTab === "signin" ? "Sign in to continue your reading journey" : "Create your account to get started"}
          </p>

          {/* Forms */}
          {activeTab === "signin" ? (
            <form onSubmit={handleSignIn} className="space-y-4 md:space-y-5">
              <div className="space-y-1.5 md:space-y-2">
                <Label className="text-sm font-medium text-foreground">Email</Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 md:h-12 rounded-xl bg-secondary/50 border-border/50 focus:border-primary"
                />
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <Label className="text-sm font-medium text-foreground">Password</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 md:h-12 rounded-xl bg-secondary/50 border-border/50 focus:border-primary"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-11 md:h-12"
                size="lg"
              >
                Sign In
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4 md:space-y-5">
              <div className="space-y-1.5 md:space-y-2">
                <Label className="text-sm font-medium text-foreground">Username</Label>
                <Input
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-11 md:h-12 rounded-xl bg-secondary/50 border-border/50 focus:border-primary"
                />
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <Label className="text-sm font-medium text-foreground">Email Address</Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 md:h-12 rounded-xl bg-secondary/50 border-border/50 focus:border-primary"
                />
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <Label className="text-sm font-medium text-foreground">Password</Label>
                <Input
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-11 md:h-12 rounded-xl bg-secondary/50 border-border/50 focus:border-primary"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-11 md:h-12"
                size="lg"
              >
                Create Account
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;

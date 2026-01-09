import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { BookOpen, Users, MessageCircle, Sparkles, ArrowLeft, TrendingUp, Award, BookMarked, Zap, Globe, Heart } from "lucide-react";

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
        {/* Animated Background with Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
          <div className="absolute top-20 left-[10%] w-72 h-72 bg-primary/8 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-40 right-[15%] w-96 h-96 bg-accent/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-20 left-[20%] w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
          
          {/* Floating Book Icons */}
          <div className="absolute top-32 left-[8%] opacity-10 float-animation">
            <BookOpen className="w-16 h-16 text-primary" />
          </div>
          <div className="absolute top-48 right-[12%] opacity-10 float-animation" style={{ animationDelay: '1s' }}>
            <MessageCircle className="w-12 h-12 text-accent" />
          </div>
          <div className="absolute bottom-32 right-[25%] opacity-10 float-animation" style={{ animationDelay: '2s' }}>
            <Heart className="w-10 h-10 text-primary" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="relative z-20 flex items-center justify-between px-4 md:px-12 py-4 md:py-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg shadow-primary/25">
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
              className="border-primary/30 hover:bg-primary/10"
            >
              Login
            </Button>
            <Button
              onClick={() => handleShowAuth("signup")}
              size="sm"
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              Sign Up
            </Button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative z-10 flex flex-col items-center justify-center px-4 md:px-6 pt-8 md:pt-12 pb-12 md:pb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-6 animate-fade-in backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">Your Reading Community Awaits</span>
            <Zap className="w-4 h-4 text-accent" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-center max-w-5xl mb-4 md:mb-6 animate-fade-in px-2 leading-tight" style={{ animationDelay: '0.1s' }}>
            Where <span className="gradient-text">Readers</span> Connect & <span className="gradient-text">Stories</span> Come Alive
          </h1>
          
          <p className="text-base md:text-xl text-muted-foreground text-center max-w-2xl mb-8 md:mb-10 animate-fade-in px-4" style={{ animationDelay: '0.2s' }}>
            Join thousands of book lovers discussing their favorite reads, sharing insights, and discovering new literary adventures together.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto px-4 sm:px-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button
              onClick={() => handleShowAuth("signup")}
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/25"
            >
              Get Started Free
            </Button>
            <Button
              onClick={() => handleShowAuth("signin")}
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-primary/30 hover:bg-primary/10"
            >
              Sign In
            </Button>
          </div>

          {/* Floating Stats Cards */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-12 md:mt-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {[
              { value: "10K+", label: "Readers", icon: Users },
              { value: "500+", label: "Books", icon: BookOpen },
              { value: "95%", label: "Satisfaction", icon: Heart },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-sm hover:bg-card/80 transition-all hover:-translate-y-1">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bento Grid Features Section */}
        <section className="relative z-10 px-4 md:px-12 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-4">
                <Globe className="w-4 h-4 text-accent" />
                <span className="text-sm text-accent font-medium">Platform Features</span>
              </div>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold mb-4">
                Everything You Need to <span className="gradient-text">Read Better</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                A complete ecosystem for passionate readers
              </p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Large Feature Card */}
              <div className="md:col-span-2 lg:col-span-2 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20 p-6 md:p-8 hover:border-primary/40 transition-all duration-500">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/20 transition-colors" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Users className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">Community Driven</h3>
                  <p className="text-muted-foreground md:text-lg max-w-md">
                    Connect with like-minded readers, follow your favorite reviewers, and build your literary network.
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background" />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">Join 10K+ readers</span>
                  </div>
                </div>
              </div>

              {/* Tall Feature Card */}
              <div className="md:row-span-2 group relative overflow-hidden rounded-3xl bg-gradient-to-b from-accent/20 via-accent/10 to-transparent border border-accent/20 p-6 md:p-8 hover:border-accent/40 transition-all duration-500">
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 group-hover:bg-accent/20 transition-colors" />
                <div className="relative z-10 h-full flex flex-col">
                  <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">Reading Avatar</h3>
                  <p className="text-muted-foreground flex-1">
                    Get a unique character avatar that reflects your reading personality and literary tastes.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-2">
                    {['Fantasy', 'Mystery', 'Romance', 'Sci-Fi'].map((genre) => (
                      <div key={genre} className="px-3 py-2 rounded-xl bg-accent/10 text-accent text-sm text-center border border-accent/20">
                        {genre}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Medium Feature Cards */}
              <div className="group relative overflow-hidden rounded-3xl bg-card/60 border border-border/50 p-6 hover:border-primary/30 hover:bg-card/80 transition-all duration-500">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Rich Discussions</h3>
                <p className="text-muted-foreground text-sm">Start threads, share opinions, and engage in meaningful book talks.</p>
              </div>

              <div className="group relative overflow-hidden rounded-3xl bg-card/60 border border-border/50 p-6 hover:border-primary/30 hover:bg-card/80 transition-all duration-500">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Trending Books</h3>
                <p className="text-muted-foreground text-sm">Discover what's hot in the reading community right now.</p>
              </div>

              <div className="group relative overflow-hidden rounded-3xl bg-card/60 border border-border/50 p-6 hover:border-primary/30 hover:bg-card/80 transition-all duration-500">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Earn Badges</h3>
                <p className="text-muted-foreground text-sm">Get recognized for your contributions and reading achievements.</p>
              </div>

              <div className="md:col-span-2 lg:col-span-2 group relative overflow-hidden rounded-3xl bg-card/60 border border-border/50 p-6 hover:border-primary/30 hover:bg-card/80 transition-all duration-500">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookMarked className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-1">Track Your Favorites</h3>
                    <p className="text-muted-foreground text-sm">Build your personal library and keep track of books you love. Never lose sight of your reading journey.</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleShowAuth("signup")} className="border-primary/30 hover:bg-primary/10">
                    Start Tracking
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 px-4 md:px-12 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 border border-primary/20 p-8 md:p-12 text-center">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold mb-4">
                  Ready to Join the <span className="gradient-text">Reading Revolution</span>?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  Join our growing community of passionate readers. It's free to get started!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => handleShowAuth("signup")}
                    size="lg"
                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/25"
                  >
                    Start Reading
                  </Button>
                  <Button
                    onClick={() => navigate("/about")}
                    size="lg"
                    variant="outline"
                    className="border-primary/30 hover:bg-primary/10"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
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

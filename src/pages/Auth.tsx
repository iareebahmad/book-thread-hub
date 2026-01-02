import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { BookOpen, Users, MessageCircle, Sparkles } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [defaultTab, setDefaultTab] = useState<"signin" | "signup">("signin");

  const { signUp, signIn, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect authenticated user
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username.",
        variant: "destructive",
      });
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
    setDefaultTab(tab);
    setShowAuthForm(true);
  };

  // Landing Page View
  if (!showAuthForm) {
    return (
      <div
        className="relative min-h-screen w-screen flex flex-col overflow-hidden"
        style={{
          backgroundImage: "url('/bookbg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Top Right Buttons */}
        <div className="absolute top-6 right-6 flex gap-3 z-20">
          <Button
            onClick={() => navigate("/about")}
            className="rounded-full px-6 py-2 text-white
                       border border-white/40 bg-white/10 backdrop-blur-md font-medium
                       transition-all duration-300
                       hover:bg-white/20 hover:border-white/70
                       hover:shadow-[0_0_20px_rgba(255,255,255,0.35)]"
          >
            About Us
          </Button>
          <Button
            onClick={() => navigate("/pricing")}
            className="rounded-full px-6 py-2 text-white
                       border border-white/40 bg-white/10 backdrop-blur-md font-medium
                       transition-all duration-300
                       hover:bg-white/20 hover:border-white/70
                       hover:shadow-[0_0_20px_rgba(255,255,255,0.35)]"
          >
            Pricing
          </Button>
        </div>

        {/* Hero Content */}
        <div className="relative flex-1 flex flex-col items-center justify-center px-4 z-10">
          {/* Logo & App Name */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-primary rounded-full mb-6 shadow-lg shadow-black/25">
              <BookOpen className="w-12 h-12 text-primary-foreground" />
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4">BookThreads</h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
              Where readers gather to discuss, discover, and share their love for books
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl">
            <div className="flex flex-col items-center text-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <Users className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Join the Community</h3>
              <p className="text-gray-300 text-sm">Connect with fellow book lovers and share your reading journey</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <MessageCircle className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Start Discussions</h3>
              <p className="text-gray-300 text-sm">Create threads, share opinions, and engage in meaningful conversations</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <Sparkles className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Discover Your Avatar</h3>
              <p className="text-gray-300 text-sm">Get a unique reading avatar based on your genre preferences</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => handleShowAuth("signup")}
              size="lg"
              className="px-10 py-6 text-lg font-semibold rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105"
            >
              Get Started
            </Button>
            <Button
              onClick={() => handleShowAuth("signin")}
              size="lg"
              variant="outline"
              className="px-10 py-6 text-lg font-semibold rounded-full text-white border-white/40 bg-white/10 backdrop-blur-md hover:bg-white/20 hover:border-white/70 transition-all duration-300"
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-center py-6 text-gray-400 text-sm">
          © 2025 BookThreads. All rights reserved.
        </div>
      </div>
    );
  }

  // Auth Form View
  return (
    <div
      className="relative min-h-screen w-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/bookbg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Top Right Buttons */}
      <div className="absolute top-6 right-6 flex gap-3 z-20">
        <Button
          onClick={() => setShowAuthForm(false)}
          className="rounded-full px-6 py-2 text-white
                     border border-white/40 bg-white/10 backdrop-blur-md font-medium
                     transition-all duration-300
                     hover:bg-white/20 hover:border-white/70
                     hover:shadow-[0_0_20px_rgba(255,255,255,0.35)]"
        >
          Back
        </Button>
        <Button
          onClick={() => navigate("/about")}
          className="rounded-full px-6 py-2 text-white
                     border border-white/40 bg-white/10 backdrop-blur-md font-medium
                     transition-all duration-300
                     hover:bg-white/20 hover:border-white/70
                     hover:shadow-[0_0_20px_rgba(255,255,255,0.35)]"
        >
          About Us
        </Button>
        <Button
          onClick={() => navigate("/pricing")}
          className="rounded-full px-6 py-2 text-white
                     border border-white/40 bg-white/10 backdrop-blur-md font-medium
                     transition-all duration-300
                     hover:bg-white/20 hover:border-white/70
                     hover:shadow-[0_0_20px_rgba(255,255,255,0.35)]"
        >
          Pricing
        </Button>
      </div>

      {/* Auth Box */}
      <div className="relative w-full max-w-md px-4 z-10">
        {/* Logo & App Name */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4 shadow-lg shadow-black/25">
            <BookOpen className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-white mb-2">BookThreads</h1>
          <p className="text-gray-200">Where readers gather to discuss</p>
        </div>

        {/* Auth Card */}
        <Card className="bg-white/15 backdrop-blur-xl border border-white/10 shadow-2xl">
          <CardHeader>
            <CardTitle className="font-serif text-white text-center text-2xl">Welcome</CardTitle>
            <CardDescription className="text-gray-300 text-center">
              Sign in or create a new account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* SIGN IN */}
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full mt-2">Sign In</Button>
                </form>
              </TabsContent>

              {/* SIGN UP */}
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <Button type="submit" className="w-full mt-2">Create Account</Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
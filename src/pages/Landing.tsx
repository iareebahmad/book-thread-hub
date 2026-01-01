import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, MessageCircle, Users, Heart, TrendingUp, Calendar, Sparkles, ArrowRight } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: 'Curate Your Library',
      description: 'Add and discover books across all genres, curated by passionate readers.',
    },
    {
      icon: MessageCircle,
      title: 'Deep Discussions',
      description: 'Reddit-style threads with nested comments for meaningful book conversations.',
    },
    {
      icon: Users,
      title: 'Build Your Circle',
      description: 'Follow readers with similar tastes and discover their recommendations.',
    },
    {
      icon: Heart,
      title: 'Vote & Favorite',
      description: 'Upvote great books and save your favorites to your personal collection.',
    },
    {
      icon: TrendingUp,
      title: 'Trending Books',
      description: 'See what the community is loving right now with our flame indicators.',
    },
    {
      icon: Calendar,
      title: 'Reading Events',
      description: 'Join community events where everyone reads and discusses the same book.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">BookThreads</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              Log In
            </Button>
            <Button onClick={() => navigate('/auth')} className="gap-2">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">A community for book lovers</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Where Every Book
            <br />
            <span className="gradient-text">Sparks a Conversation</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Discover books, join discussions, and connect with readers who share your passion. 
            Because reading is better when shared.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/auth')} className="gap-2 px-8">
              Join BookThreads
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/about')}>
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 md:gap-16 mt-16 pt-8 border-t border-border/50">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold gradient-text">1000+</p>
              <p className="text-sm text-muted-foreground">Books Added</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold gradient-text">500+</p>
              <p className="text-sm text-muted-foreground">Active Readers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold gradient-text">2000+</p>
              <p className="text-sm text-muted-foreground">Discussions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A complete platform for discovering, discussing, and celebrating books with fellow readers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Card
                key={idx}
                className="bg-card/50 border-border/50 p-6 hover:bg-card/80 transition-all duration-300 hover:border-primary/30"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Character Match Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 border-primary/20 p-8 md:p-12 text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Which Book Character Are You?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Based on your reading preferences and activity, we'll match you with a famous literary character. 
              Share your result with friends!
            </p>
            <Button size="lg" onClick={() => navigate('/auth')} className="gap-2">
              Discover Your Character
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Join the Conversation?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            "Of the readers, by a reader, for the readers" — Start your journey with BookThreads today.
          </p>
          <Button size="lg" onClick={() => navigate('/auth')} className="gap-2 px-8">
            Create Free Account
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold">BookThreads</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <button onClick={() => navigate('/about')} className="hover:text-foreground transition-colors">
              About
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BookThreads. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

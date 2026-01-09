import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Users, MessageCircle, Heart, Award, Calendar, Sparkles, Quote, ArrowRight, Globe, Zap } from 'lucide-react';

const AboutUs = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: 'Discover Books',
      description: 'Explore a curated library of books across all genres, added by passionate readers like you.',
      color: 'primary'
    },
    {
      icon: MessageCircle,
      title: 'Reddit-Style Discussions',
      description: 'Each book has its own discussion space with threads and nested comments for deep conversations.',
      color: 'accent'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Follow fellow readers, see their recommendations, and build your reading circle.',
      color: 'primary'
    },
    {
      icon: Heart,
      title: 'Curate & Vote',
      description: 'Upvote your favorites, save books to your collection, and help surface the best reads.',
      color: 'accent'
    },
    {
      icon: Award,
      title: 'Earn Badges',
      description: 'Engage with the community monthly to earn Bronze, Silver, Gold, or Platinum reader badges.',
      color: 'primary'
    },
    {
      icon: Calendar,
      title: 'Weekly Events',
      description: 'Join community reading events where everyone reads and discusses the same book together.',
      color: 'accent'
    }
  ];

  const testimonials = [
    { quote: "BookThreads changed how I discover new reads!", author: "Sarah M." },
    { quote: "Finally, a place where book lovers truly connect.", author: "James K." },
    { quote: "The discussions here are deeper than any book club.", author: "Priya R." }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="absolute top-20 left-[10%] w-96 h-96 bg-primary/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-60 right-[5%] w-80 h-80 bg-accent/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-[30%] w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
        
        {/* Floating Elements */}
        <div className="absolute top-32 right-[15%] opacity-10 float-animation">
          <BookOpen className="w-20 h-20 text-primary" />
        </div>
        <div className="absolute bottom-48 left-[10%] opacity-10 float-animation" style={{ animationDelay: '1.5s' }}>
          <Heart className="w-14 h-14 text-accent" />
        </div>
      </div>

      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/auth')}
        className="fixed top-6 left-6 z-50 hover:bg-primary/10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-24 pb-16 md:pt-32 md:pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-8 animate-fade-in backdrop-blur-sm">
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">About Our Platform</span>
            </div>
            
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-3xl blur-xl opacity-30 animate-pulse" />
                <div className="relative w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center shadow-2xl">
                  <BookOpen className="w-12 h-12 text-primary-foreground" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              BookThreads
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground italic mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              "Of the readers, by a reader, for the readers"
            </p>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
              A community-driven platform where book lovers come together to discover, discuss, and celebrate the written word.
            </p>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-4">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-sm text-accent font-medium">Core Features</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold">
                Why <span className="gradient-text">Readers Love Us</span>
              </h2>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {features.map((feature, idx) => {
                const isLarge = idx === 0 || idx === 3;
                const colorClass = feature.color === 'primary' ? 'primary' : 'accent';
                
                return (
                  <div
                    key={idx}
                    className={`
                      group relative overflow-hidden rounded-3xl p-6 md:p-8 transition-all duration-500
                      ${isLarge ? 'md:col-span-2 lg:col-span-1' : ''}
                      ${idx === 0 ? 'bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border-primary/20 hover:border-primary/40' : ''}
                      ${idx === 1 ? 'bg-gradient-to-br from-accent/20 via-accent/10 to-transparent border-accent/20 hover:border-accent/40' : ''}
                      ${idx > 1 ? 'bg-card/60 border-border/50 hover:border-primary/30 hover:bg-card/80' : ''}
                      border backdrop-blur-sm
                    `}
                  >
                    <div className={`absolute top-0 right-0 w-48 h-48 bg-${colorClass}/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 group-hover:bg-${colorClass}/20 transition-colors opacity-50`} />
                    
                    <div className="relative z-10">
                      <div className={`w-14 h-14 rounded-2xl bg-${colorClass}/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <feature.icon className={`w-7 h-7 text-${colorClass}`} />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Quote className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">Community Voices</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold">
                What <span className="gradient-text">Readers Say</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-3xl bg-card/60 border border-border/50 p-6 md:p-8 hover:border-primary/30 hover:bg-card/80 transition-all duration-500"
                >
                  <Quote className="w-8 h-8 text-primary/20 mb-4" />
                  <p className="text-lg text-foreground mb-4 italic">"{testimonial.quote}"</p>
                  <p className="text-sm text-muted-foreground font-medium">— {testimonial.author}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 border border-primary/20 p-8 md:p-12">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
              
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary font-medium">Our Mission</span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-6">
                  Reading is Better When <span className="gradient-text">Shared</span>
                </h2>
                
                <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8 text-lg">
                  BookThreads was born from a simple idea: every book deserves a conversation, every reader deserves a community, and every opinion matters. 
                  Whether you're into fiction, non-fiction, fantasy, or philosophy — there's a place for you here.
                </p>
                
                <Button 
                  onClick={() => navigate('/auth')} 
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/25"
                >
                  Join the Community
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 border-t border-border/50">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="font-serif font-semibold">BookThreads</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 BookThreads. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AboutUs;

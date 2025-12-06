import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, BookOpen, Users, MessageCircle, Heart, Award, Calendar } from 'lucide-react';

const AboutUs = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: 'Discover Books',
      description: 'Explore a curated library of books across all genres, added by passionate readers like you.'
    },
    {
      icon: MessageCircle,
      title: 'Reddit-Style Discussions',
      description: 'Each book has its own discussion space with threads and nested comments for deep conversations.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Follow fellow readers, see their recommendations, and build your reading circle.'
    },
    {
      icon: Heart,
      title: 'Curate & Vote',
      description: 'Upvote your favorites, save books to your collection, and help surface the best reads.'
    },
    {
      icon: Award,
      title: 'Earn Badges',
      description: 'Engage with the community monthly to earn Bronze, Silver, Gold, or Platinum reader badges.'
    },
    {
      icon: Calendar,
      title: 'Weekly Events',
      description: 'Join community reading events where everyone reads and discusses the same book together.'
    }
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: "url('/bookbg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/auth')}
        className="absolute top-6 left-6 z-20 text-white hover:bg-white/10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* Content */}
      <div className="relative z-10 flex-1 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-6 shadow-2xl shadow-primary/30">
              <BookOpen className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">BookThreads</h1>
            <p className="text-xl md:text-2xl text-gray-200 italic mb-6">
              "Of the readers, by a reader, for the readers"
            </p>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              A community-driven platform where book lovers come together to discover, discuss, and celebrate the written word.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {features.map((feature, idx) => (
              <Card key={idx} className="bg-white/10 backdrop-blur-xl border-white/10 p-6 hover:bg-white/15 transition-all duration-300">
                <feature.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>

          {/* Mission */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/10 p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-gray-200 leading-relaxed max-w-2xl mx-auto">
              BookThreads was born from a simple idea: reading is better when shared. We believe every book deserves a conversation, every reader deserves a community, and every opinion matters. 
              Whether you're into fiction, non-fiction, fantasy, or philosophy — there's a place for you here.
            </p>
            <Button 
              onClick={() => navigate('/auth')} 
              className="mt-8"
              size="lg"
            >
              Join the Community
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

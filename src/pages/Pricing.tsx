import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { Check } from 'lucide-react';

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Our Plans</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your book discovery journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Essential Plan */}
          <Card className="glass-card hover-lift">
            <CardHeader>
              <CardTitle className="text-3xl">Essential</CardTitle>
              <CardDescription>
                <span className="text-4xl font-bold text-foreground">Free</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <span className="text-base">1 book upload/month</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <span className="text-base">Coming Soon</span>
              </div>
            </CardContent>
          </Card>

          {/* Elite Plan */}
          <Card className="glass-card hover-lift border-primary/40 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-1.5 rounded-full text-sm font-semibold shadow-lg">
              Popular
            </div>
            <CardHeader>
              <CardTitle className="text-3xl">Elite</CardTitle>
              <CardDescription>
                <span className="text-4xl font-bold text-foreground">₹59</span>
                <span className="text-muted-foreground text-lg">/month</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <span className="text-base">Add unlimited books</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Pricing;

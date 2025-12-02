import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Shield, 
  Bell, 
  Calendar, 
  Globe, 
  Smartphone, 
  Building2, 
  CheckCircle2,
  ArrowRight,
  Syringe,
  Heart,
  Clock,
  Users,
  Star
} from "lucide-react";
import { Link } from "wouter";

const features = [
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Automatically generates vaccination schedules based on your child's age and country guidelines",
  },
  {
    icon: Bell,
    title: "Timely Reminders",
    description: "Never miss a vaccine with SMS, push, and email notifications before each appointment",
  },
  {
    icon: Globe,
    title: "Worldwide Coverage",
    description: "Supports vaccination schedules from 100+ countries following WHO recommendations",
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    description: "Access your child's records anytime, anywhere with our installable PWA",
  },
  {
    icon: Shield,
    title: "Secure Records",
    description: "Your child's health data is encrypted and protected with enterprise-grade security",
  },
  {
    icon: Building2,
    title: "Clinic Dashboard",
    description: "Healthcare providers can manage patients and track vaccination coverage",
  },
];

const stats = [
  { value: "100+", label: "Countries Supported" },
  { value: "50K+", label: "Children Protected" },
  { value: "99.9%", label: "On-Time Vaccinations" },
  { value: "24/7", label: "Support Available" },
];

const testimonials = [
  {
    name: "Sarah M.",
    role: "Parent of 2",
    content: "VaxTrack has been a lifesaver! I never have to worry about missing my children's vaccines anymore.",
    rating: 5,
  },
  {
    name: "Dr. James P.",
    role: "Pediatrician",
    content: "This platform has transformed how our clinic manages vaccinations. Highly recommended!",
    rating: 5,
  },
  {
    name: "Maria L.",
    role: "First-time Mom",
    content: "The reminders and easy-to-understand schedule made the vaccination journey stress-free.",
    rating: 5,
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Syringe className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-xl text-foreground" data-testid="text-logo">VaxTrack</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </a>
          </nav>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a href="/api/login">
              <Button variant="ghost" data-testid="button-login">
                Log in
              </Button>
            </a>
            <a href="/api/login">
              <Button data-testid="button-get-started">
                Get Started
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6" data-testid="badge-hero">
              Trusted by 50,000+ families worldwide
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6" data-testid="text-hero-title">
              Keep Your Child's Vaccines{" "}
              <span className="text-primary">On Track</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="text-hero-description">
              The smart vaccination management platform that generates personalized schedules based on your location and sends timely reminders so you never miss an important vaccine.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/api/login">
                <Button size="lg" className="gap-2 text-base w-full sm:w-auto" data-testid="button-hero-cta">
                  Start Free Today
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="text-base w-full sm:w-auto" data-testid="button-hero-secondary">
                  View Pricing
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-8 border-t border-border">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-features-title">
              Everything You Need to Stay Protected
            </h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive tools for parents and healthcare providers to manage vaccinations effectively
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover-elevate transition-all duration-200">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple Steps to Get Started
            </h2>
            <p className="text-lg text-muted-foreground">
              Start protecting your child in just a few minutes
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                icon: Users,
                title: "Create Your Account",
                description: "Sign up for free and add your child's basic information",
              },
              {
                step: "2",
                icon: Globe,
                title: "Set Your Location",
                description: "We'll generate a schedule based on your country's guidelines",
              },
              {
                step: "3",
                icon: Bell,
                title: "Get Reminders",
                description: "Receive timely notifications before each vaccination",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Loved by Parents & Clinics
            </h2>
            <p className="text-lg text-muted-foreground">
              See what our users have to say about VaxTrack
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name}>
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-foreground mb-4">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-primary text-primary-foreground overflow-hidden">
            <CardContent className="p-8 md:p-12 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <div className="relative text-center max-w-2xl mx-auto">
                <Heart className="h-12 w-12 mx-auto mb-6 opacity-80" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Protect What Matters Most
                </h2>
                <p className="text-lg opacity-90 mb-8">
                  Join thousands of parents who trust VaxTrack to keep their children's vaccinations on schedule.
                </p>
                <a href="/api/login">
                  <Button 
                    size="lg" 
                    variant="secondary" 
                    className="gap-2 text-base bg-white text-primary hover:bg-white/90"
                    data-testid="button-cta-bottom"
                  >
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Syringe className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">VaxTrack</span>
            </div>
            <nav className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            </nav>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} VaxTrack. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

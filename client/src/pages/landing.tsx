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
  Star,
  Lock,
  Zap,
  TrendingUp,
  AlertCircle,
  MessageSquare,
  ChevronDown
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

const features = [
  {
    icon: Calendar,
    title: "AI-Powered Schedules",
    description: "Personalized vaccination plans for 140+ countries following WHO, CDC, and regional guidelines",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Get SMS, push, and email reminders at the perfect time so you never miss a vaccine",
  },
  {
    icon: Globe,
    title: "Global Standards",
    description: "Updated with the latest vaccination protocols from health authorities worldwide",
  },
  {
    icon: Smartphone,
    title: "Works Offline",
    description: "Install as an app and access all records anywhere, even without internet connection",
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "Enterprise-grade encryption keeps your child's health data private and protected",
  },
  {
    icon: TrendingUp,
    title: "Family Analytics",
    description: "Track vaccination history, get insights, and generate official records for school",
  },
];

const stats = [
  { value: "140+", label: "Countries" },
  { value: "500K+", label: "Children Protected" },
  { value: "99.9%", label: "On-Time Rate" },
  { value: "4.9★", label: "User Rating" },
];

const testimonials = [
  {
    name: "Sarah M.",
    role: "Parent of 3",
    content: "I was stressed about keeping track of vaccines for all my kids. VaxTrack automatically handles everything. The reminders have saved me multiple times!",
    rating: 5,
    image: "👩‍👧‍👦"
  },
  {
    name: "Dr. Rajesh P.",
    role: "Pediatrician",
    content: "This platform has revolutionized how we manage patient records. Our vaccination coverage increased by 30% within 6 months of using VaxTrack.",
    rating: 5,
    image: "👨‍⚕️"
  },
  {
    name: "Maria L.",
    role: "First-time Mom",
    content: "The app is so intuitive. I got pregnant, added my baby's expected schedule, and when he was born, everything was already planned out!",
    rating: 5,
    image: "👩"
  },
];

const faqItems = [
  {
    question: "Is my child's data secure?",
    answer: "Yes! We use enterprise-grade encryption (AES-256) and comply with HIPAA and GDPR standards. Your data is never sold or shared with third parties."
  },
  {
    question: "How much does it cost?",
    answer: "Free for families with up to 2 children. Premium plans start at $4.99/month for unlimited children and family sharing."
  },
  {
    question: "What if I move to another country?",
    answer: "Simply update your location and we'll generate a new schedule based on that country's vaccination guidelines automatically."
  },
  {
    question: "Can my clinic use this?",
    answer: "Absolutely! We offer clinic plans with patient management, analytics dashboard, and bulk scheduling tools."
  },
];

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(0);

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
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Stories</a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
          </nav>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a href="/api/login">
              <Button variant="ghost" size="sm" data-testid="button-login">Log in</Button>
            </a>
            <a href="/api/login">
              <Button size="sm" data-testid="button-get-started">Sign Up Free</Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-24 md:pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto">
            {/* Trust Badge */}
            <div className="flex justify-center mb-8">
              <Badge className="gap-2 px-4 py-2 text-base bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                <CheckCircle2 className="h-4 w-4" />
                Trusted by 500K+ families worldwide
              </Badge>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight mb-6 text-center" data-testid="text-hero-title">
              Never Miss a{" "}
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
                  Vaccine Again
                </span>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-muted-foreground text-center mb-8 max-w-3xl mx-auto leading-relaxed" data-testid="text-hero-description">
              Your child's vaccination schedule, reminders, and records - all in one intelligent app. 
              Personalized for your country. Updated with the latest health guidelines. 
              <span className="block mt-3 text-foreground font-semibold">Available offline. Always secure.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a href="/api/login" className="flex-1 sm:flex-none">
                <Button size="lg" className="gap-2 text-base w-full sm:w-auto min-h-12" data-testid="button-hero-cta">
                  <span>Get Started Free</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </a>
              <Link href="/pricing" className="flex-1 sm:flex-none">
                <Button size="lg" variant="outline" className="text-base w-full sm:w-auto min-h-12 border-2" data-testid="button-hero-secondary">
                  See Plans
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-border">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Stop Worrying. Start Tracking.</h2>
            <p className="text-lg text-muted-foreground">Managing your child's vaccines shouldn't be stressful</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: AlertCircle, title: "Missed Appointments", desc: "Never wonder if you're on schedule" },
              { icon: Clock, title: "No More Guessing", desc: "Know exactly when each vaccine is due" },
              { icon: MessageSquare, title: "Get Reminders", desc: "SMS, email, and push notifications" },
            ].map((item) => (
              <Card key={item.title} className="hover-elevate">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">Powerful Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-features-title">
              Everything You Need to Keep Your Child Safe
            </h2>
            <p className="text-lg text-muted-foreground">
              From smart scheduling to secure records management
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
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">Get Started in 3 Minutes</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple. Fast. Effective.
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                icon: Users,
                title: "Create Account",
                description: "Sign up with email or social account. Takes 30 seconds.",
              },
              {
                step: "02",
                icon: Globe,
                title: "Add Your Child",
                description: "Enter their birth date and location. We handle the rest.",
              },
              {
                step: "03",
                icon: Zap,
                title: "Get Reminders",
                description: "Receive notifications before each vaccine is due.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">
                  {item.step}
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-lg">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">Real Stories</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Loved by Parents & Clinics
            </h2>
            <p className="text-lg text-muted-foreground">
              See how VaxTrack is helping families protect their children
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg">
                      {testimonial.image}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Affordable Plans for Everyone
            </h2>
            <p className="text-lg text-muted-foreground">
              Start free. Upgrade anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Family",
                price: "Free",
                description: "Perfect for parents",
                features: ["Up to 2 children", "Automatic schedules", "SMS reminders", "Community support"]
              },
              {
                name: "Plus",
                price: "$4.99",
                period: "/month",
                description: "For growing families",
                features: ["Unlimited children", "All Family features", "Vaccination certificates", "Email support", "Priority notifications"],
                highlighted: true
              },
              {
                name: "Clinic Pro",
                price: "Custom",
                description: "For healthcare providers",
                features: ["Patient management", "Bulk scheduling", "Analytics dashboard", "Team accounts", "API access"]
              }
            ].map((plan) => (
              <Card key={plan.name} className={`hover-elevate transition-all duration-200 ${plan.highlighted ? "border-primary border-2 relative" : ""}`}>
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground ml-2">{plan.period}</span>}
                  </div>
                  <Button className="w-full mb-6" variant={plan.highlighted ? "default" : "outline"} data-testid={`button-plan-${plan.name}`}>
                    Get Started
                  </Button>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/pricing">
              <Button size="lg" variant="outline">View All Plans & Features</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">Questions?</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-2xl mx-auto">
            {faqItems.map((item, idx) => (
              <Card key={idx} className="mb-4">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
                  data-testid={`button-faq-${idx}`}
                >
                  <span className="text-left font-semibold text-foreground">{item.question}</span>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-muted-foreground border-t border-border">
                    {item.answer}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            {[
              { icon: Lock, title: "HIPAA & GDPR Compliant", desc: "Enterprise security standards" },
              { icon: Shield, title: "Bank-Level Encryption", desc: "Your data is always protected" },
              { icon: Heart, title: "Built for Families", desc: "By parents, for parents" },
            ].map((item) => (
              <div key={item.title}>
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Protect Your Child?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join 500,000+ families who trust VaxTrack to keep their children protected and on schedule.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/api/login">
                <Button size="lg" className="gap-2 text-base px-8" data-testid="button-final-cta">
                  Start Your Free Account
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </a>
              <a href="/api/login">
                <Button size="lg" variant="outline" className="text-base px-8">
                  Schedule Demo
                </Button>
              </a>
            </div>
            <p className="text-sm text-muted-foreground mt-6">✓ No credit card required  ✓ Takes 2 minutes  ✓ Free forever</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Syringe className="h-5 w-5 text-primary" />
                  <span className="font-semibold">VaxTrack</span>
                </div>
                <p className="text-sm text-muted-foreground">Making vaccination management simple and smart.</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#features" className="hover:text-foreground">Features</a></li>
                  <li><a href="#pricing" className="hover:text-foreground">Pricing</a></li>
                  <li><a href="#" className="hover:text-foreground">Security</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground">About</a></li>
                  <li><a href="#" className="hover:text-foreground">Blog</a></li>
                  <li><a href="#" className="hover:text-foreground">Careers</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground">Privacy</a></li>
                  <li><a href="#" className="hover:text-foreground">Terms</a></li>
                  <li><a href="#" className="hover:text-foreground">Contact</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
              <p>© 2025 VaxTrack. Helping families protect their children worldwide.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

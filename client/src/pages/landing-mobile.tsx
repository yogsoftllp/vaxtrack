import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Calendar, 
  Smartphone, 
  CheckCircle2,
  Download,
  Shield,
  Zap,
  Users,
  TrendingUp,
  Award,
  ArrowRight,
  Syringe,
  Heart,
  Lock,
  Globe,
  Clock,
  Star,
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

const mobileFeatures = [
  {
    icon: Calendar,
    title: "AI-Powered Schedules",
    description: "Personalized vaccination plans for 140+ countries",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "SMS, push, and email notifications at the right time",
  },
  {
    icon: Smartphone,
    title: "Works Offline",
    description: "Install as an app and access records anywhere",
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "Enterprise encryption protects your child's data",
  },
  {
    icon: Award,
    title: "Official Certificates",
    description: "Digital proof of vaccination for schools & travel",
  },
  {
    icon: TrendingUp,
    title: "Family Analytics",
    description: "Track history and get actionable health insights",
  },
];

const stats = [
  { value: "140+", label: "Countries" },
  { value: "500K+", label: "Protected" },
  { value: "99.9%", label: "On-Time" },
  { value: "4.9★", label: "Rated" },
];

const testimonials = [
  {
    name: "Sarah M.",
    role: "Parent of 3",
    content: "Kept track of vaccines for all my kids automatically. The reminders saved me multiple times!",
    rating: 5,
  },
  {
    name: "Dr. Rajesh P.",
    role: "Pediatrician",
    content: "Revolutionized how we manage records. Vaccination coverage increased by 30%.",
    rating: 5,
  },
  {
    name: "Maria L.",
    role: "First-time Mom",
    content: "So intuitive! Everything was already planned when my baby was born.",
    rating: 5,
  },
];

export default function LandingMobile() {
  const [activeTab, setActiveTab] = useState<"parents" | "clinics">("parents");

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white dark:from-slate-950 dark:to-slate-900 min-h-screen">
      {/* Header - Minimal Mobile */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center justify-between h-16 px-4 max-w-md mx-auto w-full sm:max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Syringe className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg" data-testid="text-logo">VaxTrack</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/clinic-login">
              <Button variant="ghost" size="sm" data-testid="button-clinic-login">
                Clinic
              </Button>
            </Link>
            <Link href="/auth">
              <Button size="sm" data-testid="button-sign-in">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero - Native App Style */}
      <section className="px-4 pt-8 pb-12 max-w-md mx-auto sm:max-w-2xl w-full">
        <div className="text-center space-y-6">
          {/* App Icon Preview */}
          <div className="flex justify-center">
            <div className="h-24 w-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl flex items-center justify-center shadow-lg">
              <Heart className="h-12 w-12 text-white" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white leading-tight" data-testid="heading-hero">
              Your Child's Vaccination Partner
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Never miss a vaccine. Track schedules, get reminders, and keep official records all in one app.
            </p>
          </div>

          {/* CTA Buttons - Thumb-Friendly */}
          <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-center">
            <Link href="/auth">
              <Button size="lg" className="w-full sm:w-auto gap-2" data-testid="button-get-started">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2" data-testid="button-install">
              <Download className="h-4 w-4" />
              Install App
            </Button>
          </div>

          {/* Quick Stats - Mobile Grid */}
          <div className="grid grid-cols-4 gap-2 pt-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400" data-testid={`text-stat-${stat.label}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Selector - Toggle */}
      <section className="px-4 py-8 max-w-md mx-auto sm:max-w-2xl w-full">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-1 flex gap-1" data-testid="tabs-role-selector">
          <button
            onClick={() => setActiveTab("parents")}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
              activeTab === "parents"
                ? "bg-blue-600 text-white"
                : "text-slate-600 dark:text-slate-300"
            }`}
            data-testid="tab-parents"
          >
            For Parents
          </button>
          <button
            onClick={() => setActiveTab("clinics")}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
              activeTab === "clinics"
                ? "bg-blue-600 text-white"
                : "text-slate-600 dark:text-slate-300"
            }`}
            data-testid="tab-clinics"
          >
            For Clinics
          </button>
        </div>
      </section>

      {/* Features - Stacked Mobile Cards */}
      <section className="px-4 py-8 max-w-md mx-auto sm:max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-center mb-8" data-testid="heading-features">
          {activeTab === "parents" ? "Everything You Need" : "Clinic Dashboard"}
        </h2>

        <div className="space-y-3">
          {mobileFeatures.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card key={idx} className="border-0 shadow-sm hover:shadow-md transition-shadow" data-testid={`card-feature-${idx}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How It Works - Timeline */}
      <section className="px-4 py-12 max-w-md mx-auto sm:max-w-2xl w-full bg-gradient-to-b from-transparent to-blue-50/50 dark:to-blue-950/20">
        <h2 className="text-2xl font-bold text-center mb-8" data-testid="heading-how-it-works">
          3 Simple Steps
        </h2>

        <div className="space-y-6">
          {[
            { num: "1", title: "Add Your Child", desc: "Create a profile with basic info" },
            { num: "2", title: "Get Schedule", desc: "AI generates personalized plan" },
            { num: "3", title: "Stay on Track", desc: "Receive timely reminders & alerts" },
          ].map((step) => (
            <div key={step.num} className="flex gap-4" data-testid={`step-${step.num}`}>
              <div className="h-10 w-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0">
                {step.num}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials - Mobile Carousel */}
      <section className="px-4 py-12 max-w-md mx-auto sm:max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-center mb-8" data-testid="heading-testimonials">
          Trusted by Families
        </h2>

        <div className="space-y-4 overflow-x-auto pb-4 snap-x snap-mandatory flex gap-4 sm:grid sm:grid-cols-2 sm:gap-4">
          {testimonials.map((testimonial, idx) => (
            <Card
              key={idx}
              className="border-0 shadow-sm flex-shrink-0 w-80 sm:w-full"
              data-testid={`card-testimonial-${idx}`}
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section - Mobile Focused */}
      <section className="px-4 py-12 max-w-md mx-auto sm:max-w-2xl w-full">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-900 rounded-3xl p-8 text-white text-center space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2" data-testid="heading-cta">
              Start Today, Free Forever
            </h2>
            <p className="text-blue-100">
              Free for up to 2 children. No credit card required.
            </p>
          </div>

          <Link href="/auth">
            <Button size="lg" variant="secondary" className="w-full gap-2" data-testid="button-final-cta">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <div className="grid grid-cols-3 gap-4 text-center text-sm pt-4 border-t border-blue-500">
            <div>
              <Shield className="h-5 w-5 mx-auto mb-1" />
              <p className="text-xs">Secure</p>
            </div>
            <div>
              <Zap className="h-5 w-5 mx-auto mb-1" />
              <p className="text-xs">Fast</p>
            </div>
            <div>
              <Clock className="h-5 w-5 mx-auto mb-1" />
              <p className="text-xs">Easy</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-12 max-w-md mx-auto sm:max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-center mb-8" data-testid="heading-faq">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {[
            { q: "Is my child's data secure?", a: "Yes, we use bank-level encryption and comply with healthcare privacy regulations." },
            { q: "Does it work offline?", a: "Yes, install as an app on your phone and access records without internet." },
            { q: "Can I share records with clinics?", a: "Yes, generate shareable digital certificates for schools and travel." },
            { q: "What vaccines are supported?", a: "140+ countries with WHO-recommended vaccination schedules." },
            { q: "Is it free?", a: "Yes, free for up to 2 children. Premium plans available for families and clinics." },
          ].map((item, idx) => (
            <Card key={idx} className="border-0 shadow-sm" data-testid={`card-faq-${idx}`}>
              <CardContent className="p-4">
                <details className="cursor-pointer">
                  <summary className="font-semibold text-slate-900 dark:text-white text-sm">
                    {item.q}
                  </summary>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">{item.a}</p>
                </details>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer - Mobile Simple */}
      <footer className="px-4 py-8 max-w-md mx-auto sm:max-w-2xl w-full border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="text-center text-sm text-slate-600 dark:text-slate-400 space-y-3">
          <p>© 2024 VaxTrack. Built for families everywhere.</p>
        </div>
      </footer>
    </div>
  );
}

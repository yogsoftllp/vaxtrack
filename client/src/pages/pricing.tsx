import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";
import { Link } from "wouter";
import { 
  Check, 
  Syringe, 
  ArrowLeft,
  Users,
  Building2,
  Zap
} from "lucide-react";

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started",
    monthlyPrice: 0,
    yearlyPrice: 0,
    icon: Users,
    features: [
      "1 child profile",
      "Basic vaccination schedule",
      "In-app reminders",
      "Mobile access",
      "Email support",
    ],
    notIncluded: [
      "SMS notifications",
      "Push notifications",
      "Multiple children",
      "Priority support",
      "Certificate export",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Family",
    description: "Ideal for growing families",
    monthlyPrice: 9,
    yearlyPrice: 89,
    icon: Zap,
    features: [
      "Up to 5 children",
      "Advanced scheduling",
      "SMS notifications",
      "Push notifications",
      "Email notifications",
      "Multiple caregivers",
      "Certificate export",
      "Priority support",
    ],
    notIncluded: [
      "Clinic management",
      "Patient records",
    ],
    cta: "Get Family",
    popular: true,
  },
  {
    name: "Clinic",
    description: "For healthcare providers",
    monthlyPrice: 49,
    yearlyPrice: 479,
    icon: Building2,
    features: [
      "Unlimited patients",
      "Clinic dashboard",
      "Appointment scheduling",
      "Patient records",
      "SMS notifications",
      "Push notifications",
      "Bulk imports",
      "Analytics & reports",
      "API access",
      "Dedicated support",
    ],
    notIncluded: [],
    cta: "Get Clinic",
    popular: false,
  },
];

const faqs = [
  {
    q: "Can I switch plans later?",
    a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards, debit cards, and PayPal.",
  },
  {
    q: "Is there a free trial for paid plans?",
    a: "Yes, both Family and Clinic plans come with a 14-day free trial. No credit card required.",
  },
  {
    q: "Can I cancel my subscription?",
    a: "You can cancel at any time. Your access continues until the end of your billing period.",
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <Syringe className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-xl text-foreground">VaxTrack</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Pricing Header */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">Pricing</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-pricing-title">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose the perfect plan for your family or clinic. All plans include a 14-day free trial.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <span className={`text-sm ${!yearly ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <Switch 
              checked={yearly}
              onCheckedChange={setYearly}
              data-testid="switch-billing"
            />
            <span className={`text-sm ${yearly ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              Yearly
            </span>
            {yearly && (
              <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                Save 20%
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card 
                key={plan.name}
                className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}
                data-testid={`card-plan-${plan.name.toLowerCase()}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <plan.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="text-center pb-6">
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground" data-testid={`text-price-${plan.name.toLowerCase()}`}>
                      ${yearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-muted-foreground">
                      /{yearly ? "year" : "month"}
                    </span>
                  </div>
                  
                  <ul className="space-y-3 text-left">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                    {plan.notIncluded.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 opacity-50">
                        <Check className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground line-through">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <a href="/api/login" className="w-full">
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? "default" : "outline"}
                      data-testid={`button-select-${plan.name.toLowerCase()}`}
                    >
                      {plan.cta}
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Have questions? We've got answers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq) => (
              <Card key={faq.q}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
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
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} VaxTrack. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

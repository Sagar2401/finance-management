
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, CreditCard, DollarSign, LineChart, PiggyBank, Settings, ShieldCheck } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: <BarChart3 className="h-10 w-10 text-primary" />,
      title: "Financial Dashboard",
      description: "Get a clear overview of your income, expenses, and savings at a glance."
    },
    {
      icon: <CreditCard className="h-10 w-10 text-primary" />,
      title: "Transaction Management",
      description: "Easily track and categorize all your financial transactions in one place."
    },
    {
      icon: <PiggyBank className="h-10 w-10 text-primary" />,
      title: "Savings Goals",
      description: "Set and track progress towards your financial goals with visual feedback."
    },
    {
      icon: <LineChart className="h-10 w-10 text-primary" />,
      title: "Visual Reports",
      description: "Understand your spending habits with intuitive charts and visualizations."
    },
    {
      icon: <Settings className="h-10 w-10 text-primary" />,
      title: "Customizable Categories",
      description: "Organize your transactions with custom categories that fit your lifestyle."
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-primary" />,
      title: "Secure & Private",
      description: "Your financial data is encrypted and never shared with third parties."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/20">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 p-4 rounded-full flex items-center justify-center animate-float">
              <PiggyBank className="h-12 w-12 text-primary" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
            Take Control of Your Finances
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Track your spending, set savings goals, and make smarter financial decisions with our intuitive personal finance dashboard.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button size="lg" onClick={() => navigate('/auth')}>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/auth')}>
              Log In
            </Button>
          </div>
        </div>
      </header>
      
      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in">
          Powerful Features for Financial Freedom
        </h2>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-6 rounded-lg border bg-card shadow-sm animate-fade-in card-hover"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 animate-fade-in">
            Ready to Transform Your Financial Life?
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Join thousands of users who have improved their financial well-being with our platform.
          </p>
          
          <Button size="lg" onClick={() => navigate('/auth')} className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Start for Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-auto border-t">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <PiggyBank className="h-5 w-5 text-primary mr-2" />
            <span className="font-semibold">Finance Dashboard</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Finance Dashboard. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

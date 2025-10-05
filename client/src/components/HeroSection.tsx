import { ArrowRight, Droplets, Sprout, BarChart3, IndianRupee, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { scrollToSection, type CalculationType } from "@/lib/navigation";
import { useState } from "react";
import bgImage1 from "@assets/stock_images/rainwater_harvesting_435c6f06.jpg";
import bgImage2 from "@assets/stock_images/rainwater_harvesting_c4413935.jpg";
import bgImage3 from "@assets/stock_images/rainwater_harvesting_ef0ec67a.jpg";

interface HeroSectionProps {
  onSelectPath: (path: CalculationType) => void;
}

const slides = [
  {
    title: "Smart Rainwater Harvesting for Every Indian Home",
    subtitle: "Government-compliant, data-driven, and simple to use.",
    bgImage: bgImage1
  },
  {
    title: "Save Water, Save Money, Save Future",
    subtitle: "Calculate your rainwater potential and start conserving today.",
    bgImage: bgImage2
  },
  {
    title: "Scientific Water Management Solutions",
    subtitle: "Based on CGWB guidelines and Indian rainfall data.",
    bgImage: bgImage3
  }
];

export default function HeroSection({ onSelectPath }: HeroSectionProps) {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };
  
  const handlePathSelect = (path: CalculationType) => {
    onSelectPath(path);
  };

  return (
    <>
    <section id="hero" className="relative min-h-[120vh] flex items-center overflow-hidden">
      {/* Slideshow Background Images */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 z-0 transition-opacity duration-500 ${
            currentSlide === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img 
            src={slide.bgImage} 
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      ))}
      
      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 md:left-8 top-[40%] -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-slate-800 p-3 md:p-4 rounded-full backdrop-blur-sm transition-all shadow-xl hover:scale-110"
        data-testid="button-prev-slide"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-8 top-[40%] -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-slate-800 p-3 md:p-4 rounded-full backdrop-blur-sm transition-all shadow-xl hover:scale-110"
        data-testid="button-next-slide"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
      </button>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        {/* Enhanced Hero Content */}
        <div className="text-center max-w-5xl mx-auto mb-16">
          <h1 className="text-4xl md:text-7xl font-bold mb-6 text-white leading-tight transition-opacity duration-500">
            {slides[currentSlide].title}
          </h1>
          <p className="text-xl md:text-3xl text-white/90 mb-12 leading-relaxed font-medium transition-opacity duration-500">
            {slides[currentSlide].subtitle}
          </p>
          
          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              size="lg"
              className="px-8 py-6 text-lg font-semibold hover:scale-105 transition-transform"
              onClick={() => scrollToSection('calculator')}
            >
              {t('hero.startCalculator')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg font-semibold hover:scale-105 transition-transform"
              onClick={() => scrollToSection('about')}
            >
              {t('hero.learnMore')}
            </Button>
          </div>
        </div>

        {/* Path Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="p-8 hover-elevate cursor-pointer group transition-all duration-300" onClick={() => handlePathSelect('rainwater')} data-testid="card-rainwater">
            <div className="text-center">
              <div className="w-16 h-16 bg-chart-1 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Droplets className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">{t('features.rainwaterTitle')}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {t('features.rainwaterDesc')}
              </p>
              <Button className="w-full group-hover:bg-chart-1" size="lg" data-testid="button-rainwater">
                {t('calculator.rainwater')}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>

          <Card className="p-8 hover-elevate cursor-pointer group transition-all duration-300" onClick={() => handlePathSelect('recharge')} data-testid="card-recharge">
            <div className="text-center">
              <div className="w-16 h-16 bg-chart-2 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Sprout className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">{t('features.rechargeTitle')}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {t('features.rechargeDesc')}
              </p>
              <Button className="w-full group-hover:bg-chart-2" size="lg" data-testid="button-recharge">
                {t('calculator.recharge')}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>

    {/* Smart Solutions Section with White Background */}
    <section id="calculator" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Smart Solutions for Water Conservation</h2>
          <p className="text-lg text-muted-foreground">Comprehensive tools for modern rainwater management</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <Card className="p-6 text-center hover-elevate transition-all duration-300 group">
            <div className="w-16 h-16 bg-chart-1 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">📊 Rainwater Potential</h3>
            <p className="text-muted-foreground">Know how much rainwater you can capture annually with precise calculations based on your location and roof specifications.</p>
          </Card>
          
          <Card className="p-6 text-center hover-elevate transition-all duration-300 group">
            <div className="w-16 h-16 bg-chart-2 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Droplets className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">💧 Artificial Recharge</h3>
            <p className="text-muted-foreground">Design recharge pits and evaluate feasibility with scientific methodology and soil-specific infiltration rates.</p>
          </Card>
          
          <Card className="p-6 text-center hover-elevate transition-all duration-300 group">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <IndianRupee className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">💰 Cost & Savings</h3>
            <p className="text-muted-foreground">Get budget options with detailed ROI analysis and payback period calculations for informed decision making.</p>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-12 pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground mb-4">Calculations based on CGWB guidelines and Indian rainfall data</p>
          <div className="flex justify-center items-center gap-8 text-xs text-muted-foreground">
            <span>✓ Government compliant</span>
            <span>✓ Scientific methodology</span>
            <span>✓ Location-specific data</span>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
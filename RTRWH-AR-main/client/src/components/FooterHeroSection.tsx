import { ArrowRight, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FooterHeroSectionProps {
  onSelectPath: (path: 'rainwater' | 'recharge') => void;
}

export default function FooterHeroSection({ onSelectPath }: FooterHeroSectionProps) {
  return (
    <section className="py-24 bg-gradient-to-r from-primary via-chart-1 to-chart-2 text-white">
      <div className="container mx-auto px-4 text-center">
        {/* Final CTA Content */}
        <div className="max-w-4xl mx-auto">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <Droplets className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Every Drop Counts. Start Saving Rainwater Today.
          </h2>
          
          <p className="text-xl md:text-2xl mb-12 opacity-90 leading-relaxed">
            Join thousands of Indian homeowners who are already harvesting rainwater 
            and contributing to water conservation. Calculate your potential now.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              variant="secondary"
              className="px-8 py-6 text-lg font-semibold hover:scale-105 transition-transform bg-white text-primary hover:bg-white/90"
              onClick={() => onSelectPath('rainwater')}
            >
              Calculate My Rainwater Potential
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-lg font-semibold hover:scale-105 transition-transform border-white text-white hover:bg-white/10"
              onClick={() => onSelectPath('recharge')}
            >
              Design Recharge System
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Additional Trust Elements */}
          <div className="mt-16 pt-12 border-t border-white/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div>
                <div className="text-3xl font-bold mb-2">5,000+</div>
                <div className="text-white/80">Calculations Done</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">₹2Cr+</div>
                <div className="text-white/80">Water Savings</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">28</div>
                <div className="text-white/80">States Covered</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">100%</div>
                <div className="text-white/80">CGWB Compliant</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
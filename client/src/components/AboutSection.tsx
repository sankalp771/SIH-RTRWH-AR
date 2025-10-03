import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, CheckCircle, Award, Users, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function AboutSection() {
  const { t } = useTranslation();
  const [showFullMethodology, setShowFullMethodology] = useState(false);
  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {t('about.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left: Content */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-4">
              {t('about.heading')}
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('about.description')}
            </p>
            
            {showFullMethodology && (
              <div className="space-y-4 mt-6 p-6 bg-background/60 rounded-lg border">
                <h4 className="text-xl font-semibold text-primary">Detailed Methodology</h4>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong>Rainwater Harvesting Calculations:</strong> We use the standard formula: Rainwater Harvesting Potential = Catchment Area × Runoff Coefficient × Rainfall × Collection Efficiency. Our system incorporates roof-specific runoff coefficients (RCC: 0.8-0.9, GI: 0.7-0.8, Tiles: 0.6-0.7) and regional rainfall patterns from IMD data.
                  </p>
                  <p>
                    <strong>Storage Optimization:</strong> Tank sizing follows CGWB recommendations with first flush diverters (2-3mm of first rainfall) and considers household demand patterns based on BIS standards (135-150 liters per person per day for domestic use).
                  </p>
                  <p>
                    <strong>Artificial Recharge Assessment:</strong> We calculate recharge potential using infiltration rates specific to Indian soil types: Sandy (25-250 mm/hr), Loamy (13-76 mm/hr), and Clayey (1-13 mm/hr). Pit dimensions are optimized based on available space and groundwater depth.
                  </p>
                  <p>
                    <strong>Cost-Benefit Analysis:</strong> Our economic models incorporate regional material costs, labor rates, and water tariffs across different Indian states. ROI calculations include maintenance costs and water savings over a 15-year lifecycle.
                  </p>
                  <p>
                    <strong>Quality Assurance:</strong> All calculations are validated against CGWB technical bulletins, BIS codes (IS 15797:2008 for rainwater harvesting), and field studies from various agro-climatic zones across India.
                  </p>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">{t('about.features.cgwbCompliant')}</span>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-blue-500" />
                <span className="font-medium">{t('about.features.scientificMethods')}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-red-500" />
                <span className="font-medium">{t('about.features.locationSpecific')}</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-purple-500" />
                <span className="font-medium">{t('about.features.communityFocused')}</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              size="lg" 
              className="mt-6"
              onClick={() => setShowFullMethodology(!showFullMethodology)}
            >
              {showFullMethodology ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  {t('about.readLess')}
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  {t('about.readMore')}
                </>
              )}
            </Button>
          </div>

          {/* Right: Visual */}
          <Card className="p-8 bg-gradient-to-br from-primary/10 to-chart-1/10">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-12 h-12 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-4">India-Wide Coverage</h4>
              <p className="text-muted-foreground mb-6">
                Supporting all Indian states with region-specific calculations and climate data integration.
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-background/50 rounded-lg p-3">
                  <div className="font-semibold text-lg text-primary">28+</div>
                  <div className="text-muted-foreground">States Covered</div>
                </div>
                <div className="bg-background/50 rounded-lg p-3">
                  <div className="font-semibold text-lg text-chart-1">800+</div>
                  <div className="text-muted-foreground">Cities Supported</div>
                </div>
                <div className="bg-background/50 rounded-lg p-3">
                  <div className="font-semibold text-lg text-chart-2">100%</div>
                  <div className="text-muted-foreground">CGWB Guidelines</div>
                </div>
                <div className="bg-background/50 rounded-lg p-3">
                  <div className="font-semibold text-lg text-green-600">Local</div>
                  <div className="text-muted-foreground">Climate Data</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
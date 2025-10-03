import { BookOpen, Droplets, Sprout, Home, CloudRain, Lightbulb } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Rainwater Harvesting Education</h1>
            <p className="text-lg text-muted-foreground">
              Learn about sustainable water management and conservation techniques
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  What is Rainwater Harvesting?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Rainwater harvesting is the collection and storage of rainwater for reuse on-site, 
                  rather than allowing it to run off. This technique has been practiced in India for 
                  thousands of years and is crucial for water conservation.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Key Benefits:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Reduces dependence on municipal water supply</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Helps recharge groundwater levels</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Reduces water bills and provides self-sufficiency</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Prevents flooding and erosion</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-green-500" />
                  Types of Rainwater Harvesting Systems
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="rooftop">
                    <AccordionTrigger>Rooftop Rainwater Harvesting</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <p>
                          This is the most common method where rainwater is collected from rooftops 
                          using gutters and pipes.
                        </p>
                        <div className="bg-muted/30 p-3 rounded">
                          <p className="font-medium mb-2">Components:</p>
                          <ul className="space-y-1 text-sm">
                            <li>• Catchment area (roof)</li>
                            <li>• Gutters and downpipes</li>
                            <li>• First flush diverter</li>
                            <li>• Filter unit</li>
                            <li>• Storage tank</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="surface">
                    <AccordionTrigger>Surface Runoff Harvesting</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        This method involves collecting rainwater from land surfaces such as 
                        compounds, pavements, and parks. The water is directed to recharge pits 
                        or storage tanks.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="recharge">
                    <AccordionTrigger>Artificial Recharge</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <p>
                          This method involves percolating rainwater into the ground to recharge 
                          groundwater aquifers through recharge wells, pits, or trenches.
                        </p>
                        <div className="bg-muted/30 p-3 rounded">
                          <p className="font-medium mb-2">Methods:</p>
                          <ul className="space-y-1 text-sm">
                            <li>• Recharge pits (for shallow aquifers)</li>
                            <li>• Recharge wells (for deeper aquifers)</li>
                            <li>• Recharge trenches</li>
                            <li>• Percolation tanks</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudRain className="w-5 h-5 text-blue-600" />
                  Water Quality and Treatment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Harvested rainwater quality depends on several factors including the catchment 
                  surface, atmospheric conditions, and storage methods.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-amber-700 dark:text-amber-400">First Flush Diversion</h4>
                    <p className="text-sm">
                      The first 2-3mm of rainfall should be diverted as it washes dust, bird 
                      droppings, and pollutants from the roof.
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-400">Filtration</h4>
                    <p className="text-sm">
                      Use sand filters, mesh filters, or charcoal filters to remove suspended 
                      particles and improve water quality.
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-purple-700 dark:text-purple-400">UV Treatment</h4>
                    <p className="text-sm">
                      For drinking water use, UV sterilization or boiling is recommended to 
                      eliminate any microbial contamination.
                    </p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-green-700 dark:text-green-400">Storage</h4>
                    <p className="text-sm">
                      Keep storage tanks covered and clean. Regular maintenance prevents algae 
                      growth and mosquito breeding.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-green-600" />
                  Government Guidelines (CGWB)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The Central Ground Water Board (CGWB) provides comprehensive guidelines for 
                  rainwater harvesting implementation in India.
                </p>
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Key CGWB Recommendations:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">✓</span>
                      <span>Mandatory rainwater harvesting for buildings with roof area &gt; 100 sq.m</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">✓</span>
                      <span>Runoff coefficient: RCC roof (0.85), Metal sheets (0.90), Tiles (0.75)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">✓</span>
                      <span>Collection efficiency: 75-85% for well-maintained systems</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">✓</span>
                      <span>Regular maintenance every 6 months for optimal performance</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Maintenance Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Monthly</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Check gutters for debris</li>
                      <li>• Inspect first flush system</li>
                      <li>• Clean mesh filters</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Quarterly</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Deep clean storage tanks</li>
                      <li>• Check for leaks</li>
                      <li>• Test water quality</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Annually</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Professional inspection</li>
                      <li>• Replace worn components</li>
                      <li>• Update calculations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

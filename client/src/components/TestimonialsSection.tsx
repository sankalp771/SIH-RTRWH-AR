import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Housing Society Chairman",
      location: "Mumbai, Maharashtra",
      quote: "Simple and accurate — helped my society plan rainwater harvesting that saves ₹2 lakhs annually. The cost breakdown made decisions easy for our committee.",
      rating: 5,
      verified: true
    },
    {
      name: "Priya Sharma",
      role: "Environmental Engineer",
      location: "Chennai, Tamil Nadu",
      quote: "Love the cost breakdown and technical accuracy. Finally, a tool that's practical and Indian-context aware. Used it for 15+ residential projects.",
      rating: 5,
      verified: true
    },
    {
      name: "Amit Patel",
      role: "Homeowner",
      location: "Pune, Maharashtra",
      quote: "Helped me understand my home's rainwater potential and choose the right system size. The payback calculations convinced my family to invest in harvesting.",
      rating: 5,
      verified: true
    }
  ];

  return (
    <section id="testimonials" className="py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            What Users Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Thousands of homeowners and societies trust our calculations for their rainwater harvesting decisions.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 hover-elevate transition-all duration-300 relative">
              <Quote className="w-8 h-8 text-primary/20 absolute top-4 right-4" />
              
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-lg leading-relaxed mb-6 text-muted-foreground italic">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                </div>
                {testimonial.verified && (
                  <Badge variant="secondary" className="text-xs">
                    ✓ Verified
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="bg-muted/30 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-semibold mb-6">Trusted by Communities Across India</h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
              <h4 className="font-semibold">Government Compliant</h4>
              <p className="text-sm text-muted-foreground text-center">
                Follows CGWB guidelines and state regulations
              </p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📍</span>
              </div>
              <h4 className="font-semibold">Location-Specific Data</h4>
              <p className="text-sm text-muted-foreground text-center">
                Real rainfall and soil data for accurate results
              </p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔬</span>
              </div>
              <h4 className="font-semibold">Scientific Methodology</h4>
              <p className="text-sm text-muted-foreground text-center">
                Research-backed calculations and proven methods
              </p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏠</span>
              </div>
              <h4 className="font-semibold">Community Focused</h4>
              <p className="text-sm text-muted-foreground text-center">
                Built for Indian homes and housing societies
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
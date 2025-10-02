import { FileText, Download, ExternalLink, MapPin, Phone, Mail, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ContractorsPage() {
  const contractors = [
    {
      name: "AquaTech Solutions",
      location: "Mumbai, Maharashtra",
      specialization: "Rooftop Rainwater Harvesting",
      experience: "15+ years",
      contact: {
        phone: "+91 98765 43210",
        email: "info@aquatech.in"
      },
      certifications: ["CGWB Certified", "ISO 9001"],
      pdfUrl: "#"
    },
    {
      name: "Green Harvest Systems",
      location: "Bangalore, Karnataka",
      specialization: "Artificial Recharge & Storage",
      experience: "12+ years",
      contact: {
        phone: "+91 98765 43211",
        email: "contact@greenharvest.in"
      },
      certifications: ["CGWB Certified", "Green Building Council"],
      pdfUrl: "#"
    },
    {
      name: "Rain Conserve India",
      location: "Chennai, Tamil Nadu",
      specialization: "Complete RWH Solutions",
      experience: "20+ years",
      contact: {
        phone: "+91 98765 43212",
        email: "info@rainconserve.in"
      },
      certifications: ["CGWB Certified", "BIS Certified"],
      pdfUrl: "#"
    },
    {
      name: "WaterWise Contractors",
      location: "Delhi NCR",
      specialization: "Urban Rainwater Systems",
      experience: "10+ years",
      contact: {
        phone: "+91 98765 43213",
        email: "hello@waterwise.in"
      },
      certifications: ["CGWB Certified"],
      pdfUrl: "#"
    },
    {
      name: "EcoRain Solutions",
      location: "Pune, Maharashtra",
      specialization: "Industrial & Residential RWH",
      experience: "18+ years",
      contact: {
        phone: "+91 98765 43214",
        email: "info@ecorain.in"
      },
      certifications: ["CGWB Certified", "ISO 14001"],
      pdfUrl: "#"
    },
    {
      name: "Blue Drop Harvesters",
      location: "Hyderabad, Telangana",
      specialization: "Groundwater Recharge Systems",
      experience: "14+ years",
      contact: {
        phone: "+91 98765 43215",
        email: "contact@bluedrop.in"
      },
      certifications: ["CGWB Certified", "NABCB Accredited"],
      pdfUrl: "#"
    }
  ];

  const resourceDocuments = [
    {
      title: "CGWB Guidelines for Rainwater Harvesting",
      description: "Official guidelines from Central Ground Water Board for implementing rainwater harvesting systems",
      category: "Government Guidelines",
      pdfUrl: "#"
    },
    {
      title: "Contractor Selection Checklist",
      description: "A comprehensive checklist to help you evaluate and select the right contractor for your project",
      category: "Selection Guide",
      pdfUrl: "#"
    },
    {
      title: "Cost Estimation Template",
      description: "Template for estimating costs of rainwater harvesting system installation",
      category: "Planning",
      pdfUrl: "#"
    },
    {
      title: "Maintenance Schedule Guide",
      description: "Recommended maintenance schedules and procedures for rainwater harvesting systems",
      category: "Maintenance",
      pdfUrl: "#"
    },
    {
      title: "Quality Standards & Specifications",
      description: "Technical specifications and quality standards for RWH components as per BIS standards",
      category: "Technical",
      pdfUrl: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Certified Contractors & Resources</h1>
            <p className="text-lg text-muted-foreground">
              Find certified contractors and download important documents for your rainwater harvesting project
            </p>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-primary" />
                Certified Contractors
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {contractors.map((contractor, index) => (
                  <Card key={index} className="hover-elevate transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl mb-1">{contractor.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1 text-sm">
                            <MapPin className="w-3 h-3" />
                            {contractor.location}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                          {contractor.experience}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Specialization</p>
                        <p className="text-sm">{contractor.specialization}</p>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {contractor.certifications.map((cert, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>

                      <div className="space-y-2 pt-2 border-t">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{contractor.contact.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span>{contractor.contact.email}</span>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full gap-2" asChild>
                        <a href={contractor.pdfUrl} download>
                          <Download className="w-4 h-4" />
                          Download Profile PDF
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                Resource Documents
              </h2>
              <div className="space-y-4">
                {resourceDocuments.map((doc, index) => (
                  <Card key={index} className="hover-elevate transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline">{doc.category}</Badge>
                            <h3 className="font-semibold text-lg">{doc.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">{doc.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={doc.pdfUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                          <Button variant="default" size="sm" asChild>
                            <a href={doc.pdfUrl} download>
                              <Download className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="bg-muted/50 p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Important Notes</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Always verify contractor certifications directly with CGWB before finalizing any agreement</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Request multiple quotations and compare technical specifications before selecting a contractor</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Ensure the contractor provides a warranty period and maintenance support for installed systems</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Check for compliance with local municipal regulations and building codes</span>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

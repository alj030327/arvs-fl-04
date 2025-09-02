import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Brain, 
  BarChart3, 
  Shield, 
  Globe, 
  Users, 
  FileText, 
  Settings,
  ArrowRight,
  CheckCircle
} from "lucide-react";

export const EnterpriseFeatures = () => {
  const features = [
    {
      category: "AI & Automation",
      icon: Brain,
      color: "primary",
      items: [
        {
          title: "Smart Dokumentanalys",
          description: "AI som automatiskt analyserar och klassificerar juridiska dokument med 99.5% noggrannhet",
          metrics: ["99.5% noggrannhet", "75% snabbare", "24/7 tillgänglig"]
        },
        {
          title: "Prediktiv Riskanalys",
          description: "Förutse potentiella problem i arvskiften innan de uppstår med machine learning",
          metrics: ["85% risk reduction", "Proaktiv varning", "Intelligent rekommendationer"]
        },
        {
          title: "Automatiserad Arbetsflöden",
          description: "Anpassningsbara automation som lär sig era specifika processer och preferenser",
          metrics: ["80% mindre manuellt arbete", "Noll-fel automation", "Custom rules engine"]
        }
      ]
    },
    {
      category: "Analytics & Insights",
      icon: BarChart3,
      color: "accent",
      items: [
        {
          title: "Realtids Dashboards",
          description: "Övervaka alla era ärenden, prestanda och nyckeltal i realtid med interaktiva dashboards",
          metrics: ["Live updates", "Custom KPIs", "Export till Excel/PDF"]
        },
        {
          title: "Advanced Reporting",
          description: "Djupgående rapporter och analyser för strategisk beslutsfattning och optimering",
          metrics: ["50+ rapport templates", "Automatisk scheduling", "Drill-down analys"]
        },
        {
          title: "Performance Analytics",
          description: "Spåra produktivitet, upptäck flaskhalsar och optimera era processer kontinuerligt",
          metrics: ["Team performance", "Process optimization", "Bottleneck detection"]
        }
      ]
    },
    {
      category: "Enterprise Integration",
      icon: Globe,
      color: "success",
      items: [
        {
          title: "API-First Arkitektur",
          description: "RESTful och GraphQL APIs för sömlös integration med era befintliga system",
          metrics: ["REST & GraphQL", "Webhook support", "Real-time sync"]
        },
        {
          title: "SSO & Directory Services",
          description: "Enkel integration med Active Directory, LDAP och andra identity providers",
          metrics: ["Azure AD", "LDAP support", "SAML 2.0"]
        },
        {
          title: "White-Label Portal",
          description: "Fullständigt anpassningsbar kundportal med ert varumärke och design",
          metrics: ["Custom branding", "Mobile responsive", "Multi-language"]
        }
      ]
    }
  ];

  return (
    <div className="space-y-12">
      {/* Feature Categories */}
      {features.map((category, categoryIndex) => (
        <div key={categoryIndex} className="space-y-6">
          <div className="flex items-center gap-4 mb-8">
            <div className={`w-12 h-12 bg-${category.color}/10 rounded-lg flex items-center justify-center`}>
              <category.icon className={`h-7 w-7 text-${category.color}`} />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{category.category}</h2>
              <p className="text-muted-foreground">Enterprise-grade funktioner för professionell användning</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {category.items.map((feature, featureIndex) => (
              <Card key={featureIndex} className="group hover:border-primary/20 transition-all duration-300 border">
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {feature.metrics.map((metric, metricIndex) => (
                      <div key={metricIndex} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm font-medium">{metric}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    Läs mer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Enterprise Benefits */}
      <Card className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold mb-4">Varför välja vår Enterprise-lösning?</CardTitle>
          <CardDescription className="text-lg">
            Byggt för organisationer som kräver högsta prestanda, säkerhet och skalbarhet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "99.99% Uptid",
                description: "Enterprise SLA med garanterad tillgänglighet",
                icon: Shield
              },
              {
                title: "Obegränsad Skalbarhet",
                description: "Hantera tusentals samtidiga användare",
                icon: Zap
              },
              {
                title: "24/7 Support",
                description: "Dedikerat enterprise support team",
                icon: Users
              },
              {
                title: "Custom Development",
                description: "Skräddarsydda funktioner för era behov",
                icon: Settings
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center p-6 bg-card/50 rounded-lg">
                <benefit.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
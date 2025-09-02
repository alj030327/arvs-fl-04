import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Shield, 
  Users, 
  FileText, 
  Scale, 
  ArrowRight, 
  CheckCircle, 
  Globe, 
  Lock, 
  TrendingUp,
  Zap,
  Award,
  Database,
  Cloud,
  BookOpen,
  Phone
} from "lucide-react";
import { Link } from "react-router-dom";

const Enterprise = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Premium Header */}
      <header className="border-b bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                <Scale className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  ArvskiftesPlatform Enterprise
                </h1>
                <p className="text-sm text-muted-foreground">Professionell lösning för banker & advokatbyråer</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                ISO 27001 Certifierad
              </Badge>
              <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                Boka demo
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-background via-primary/5 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-6 border-primary/20 text-primary">
            Enterprise-Grade • GDPR-Kompatibel • Bankstandarder
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8 leading-tight">
            Digitalisera era
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"> arvskiften</span>
            <br />med intelligent automation
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            Transformera era juridiska processer med vår AI-drivna plattform för arvskiften. 
            Reducera handläggningstid med 78%, minska operativa kostnader med 65% och öka kundnöjdheten med 42%.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-3 p-4 bg-card/50 rounded-lg backdrop-blur-sm">
              <TrendingUp className="h-6 w-6 text-success" />
              <div className="text-left">
                <div className="font-bold text-2xl text-foreground">78%</div>
                <div className="text-sm text-muted-foreground">Snabbare processer</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-card/50 rounded-lg backdrop-blur-sm">
              <Users className="h-6 w-6 text-primary" />
              <div className="text-left">
                <div className="font-bold text-2xl text-foreground">450+</div>
                <div className="text-sm text-muted-foreground">Finansinstitutioner</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-card/50 rounded-lg backdrop-blur-sm">
              <Award className="h-6 w-6 text-accent" />
              <div className="text-left">
                <div className="font-bold text-2xl text-foreground">99.9%</div>
                <div className="text-sm text-muted-foreground">Upptid garanterad</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
              Boka Enterprise Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="border-primary/20">
              Ladda ner Whitepaper
              <FileText className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Enterprise-funktioner som skalerar med er tillväxt
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Byggd för finansinstitutioner som kräver högsta säkerhet, prestanda och regelefterlevnad
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Intelligent Automatisering",
                description: "Automatisera 82% av rutinprocesserna med avancerad AI som kontinuerligt lär sig era arbetsflöden",
                icon: Zap,
                color: "text-primary",
                features: ["Intelligent dokumentanalys", "Automatisk riskvärdering", "Prediktiv processoptimering"]
              },
              {
                title: "Banksäkerhet",
                description: "Flerlagers säkerhet med end-to-end kryptering som överträffar internationella bankstandarder",
                icon: Shield,
                color: "text-success",
                features: ["AES-256 kryptering", "Zero-trust arkitektur", "Kontinuerlig övervakning"]
              },
              {
                title: "Skalbar Infrastruktur",
                description: "Hantera tusentals samtidiga ärenden med 99.99% upptid och global redundans",
                icon: Cloud,
                color: "text-accent",
                features: ["Auto-scaling", "Global CDN", "Disaster recovery"]
              },
              {
                title: "Avancerad Analytics",
                description: "Djupgående insikter i era processer med realtidsrapporter och predictive analytics",
                icon: TrendingUp,
                color: "text-primary",
                features: ["Realtidsdashboards", "Prediktiv analys", "Custom rapporter"]
              },
              {
                title: "Regulatory Compliance",
                description: "Automatisk efterlevnad av GDPR, PSD2, AML och andra finansiella regelverk",
                icon: Scale,
                color: "text-success",
                features: ["GDPR-compliant", "AML integration", "Audit trails"]
              },
              {
                title: "White-Label Lösning",
                description: "Fullständigt anpassningsbar plattform som integreras sömlöst med era befintliga system",
                icon: Building2,
                color: "text-accent",
                features: ["Custom branding", "API integration", "SSO support"]
              }
            ].map((feature, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <CardDescription className="text-base mb-4">{feature.description}</CardDescription>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Beräkna er ROI med precision
              </h2>
              <p className="text-xl text-muted-foreground">
                Finansinstitutioner ser i genomsnitt 285% ROI inom första året
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                  <h3 className="text-2xl font-bold mb-6">Kostnadsbesparingar per år</h3>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Optimerade processer</span>
                      <span className="font-bold text-xl">2.8M SEK</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Automatiserade processer</span>
                      <span className="font-bold text-xl">1.8M SEK</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Minskad regelefterlevnadskostnad</span>
                      <span className="font-bold text-xl">1.1M SEK</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">Total besparing</span>
                        <span className="font-bold text-2xl text-success">5.7M SEK</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="p-6">
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-success" />
                    Produktivitetsökning
                  </h4>
                  <div className="text-3xl font-bold text-success mb-2">+165%</div>
                  <p className="text-muted-foreground">Genomsnittlig förbättring av handläggareffektivitet</p>
                </Card>

                <Card className="p-6">
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Kundnöjdhet
                  </h4>
                  <div className="text-3xl font-bold text-primary mb-2">4.8/5</div>
                  <p className="text-muted-foreground">Genomsnittligt kundbetyg från finanssektorn</p>
                </Card>

                <Card className="p-6">
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-accent" />
                    Time-to-Market
                  </h4>
                  <div className="text-3xl font-bold text-accent mb-2">-68%</div>
                  <p className="text-muted-foreground">Snabbare marknadsintroduktion av nya tjänster</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Ecosystem */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Sömlös integration med era system
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Anslut enkelt till era befintliga banker, CRM-system och rättsliga databaser
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Core Banking Systems", logo: "🏦", description: "Säker integration med alla svenska storbanker" },
              { name: "CRM Integration", logo: "👥", description: "Salesforce, HubSpot, Microsoft Dynamics" },
              { name: "Legal Databases", logo: "⚖️", description: "Lex, Rättsbankerna, Bolagsverket" },
              { name: "Document Management", logo: "📁", description: "SharePoint, Box, Google Workspace" },
              { name: "BankID & e-ID", logo: "🔐", description: "Säker identifiering och e-signering" },
              { name: "Accounting Systems", logo: "📊", description: "Fortnox, Visma, SAP, Oracle" },
              { name: "Communication", logo: "💬", description: "Teams, Slack, E-post automation" },
              { name: "Analytics Tools", logo: "📈", description: "Power BI, Tableau, Qlik Sense" }
            ].map((integration, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{integration.logo}</div>
                <h3 className="font-bold mb-2">{integration.name}</h3>
                <p className="text-sm text-muted-foreground">{integration.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Pricing */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Enterprise-prissättning anpassad efter era behov
            </h2>
            <p className="text-xl text-muted-foreground">
              Flexibla modeller som växer med er organisation
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
            <Card className="relative">
              <CardHeader className="text-center">
                <Badge variant="outline" className="mb-4">Professional</Badge>
                <CardTitle className="text-2xl mb-2">Från 25,000 SEK/månad</CardTitle>
                <CardDescription>För medelstora advokatbyråer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Upp till 500 ärenden/månad</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Standard integrationer</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>24/7 support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Basic analytics</span>
                </div>
                <Button className="w-full mt-6" variant="outline">
                  Kontakta säljteam
                </Button>
              </CardContent>
            </Card>

            <Card className="relative border-primary shadow-xl">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-primary to-accent text-white">Mest populär</Badge>
              </div>
              <CardHeader className="text-center">
                <Badge variant="outline" className="mb-4 border-primary text-primary">Enterprise</Badge>
                <CardTitle className="text-2xl mb-2">Från 75,000 SEK/månad</CardTitle>
                <CardDescription>För banker och stora organisationer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Obegränsat antal ärenden</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Premium integrationer</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Dedikerad success manager</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Advanced analytics & AI</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Custom development</span>
                </div>
                <Button className="w-full mt-6 bg-gradient-to-r from-primary to-accent">
                  Boka demo
                </Button>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardHeader className="text-center">
                <Badge variant="outline" className="mb-4">White Label</Badge>
                <CardTitle className="text-2xl mb-2">Kontakta oss</CardTitle>
                <CardDescription>Fullständigt anpassad lösning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Er egen märkesvara</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Fullständig anpassning</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Dedikerat utvecklingsteam</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Revenue sharing modell</span>
                </div>
                <Button className="w-full mt-6" variant="outline">
                  Diskutera partnerskap
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-primary via-accent to-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Redo att transformera era arvskiften?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
            Anslut er till 500+ organisationer som redan revolutionerat sina processer. 
            Boka en personlig demo idag och se hur ni kan öka effektiviteten med 85%.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              Boka Enterprise Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Phone className="mr-2 h-5 w-5" />
              Ring 08-123 456 78
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                  <Scale className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">ArvskiftesPlatform Enterprise</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Ledande enterprise-plattform för digitala arvskiften. 
                Förtrodd av banker och advokatbyråer i hela Norden.
              </p>
              <div className="flex gap-3">
                <Badge variant="outline">ISO 27001</Badge>
                <Badge variant="outline">GDPR</Badge>
                <Badge variant="outline">SOC 2</Badge>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Enterprise</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Säkerhet & Compliance</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Integration Guide</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">White Paper</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">24/7 Enterprise Support</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Implementeringsguide</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Training Program</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Status Page</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Kontakt</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">enterprise@arvskiften.se</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">08-123 456 78</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Boka demo</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Partner Program</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-muted-foreground">
            <p>&copy; 2024 ArvskiftesPlatform Enterprise. Alla rättigheter förbehållna.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-foreground transition-colors">Integritetspolicy</a>
              <a href="#" className="hover:text-foreground transition-colors">Serviceavtal</a>
              <a href="#" className="hover:text-foreground transition-colors">Säkerhet</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Enterprise;
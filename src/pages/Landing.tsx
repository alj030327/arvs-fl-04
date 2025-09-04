import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Shield, Users, FileText, Gavel, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Gavel className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">DigitalArvskifte</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#hur-det-fungerar" className="text-muted-foreground hover:text-foreground transition-colors">
              Hur det fungerar
            </a>
            <a href="#fordelar" className="text-muted-foreground hover:text-foreground transition-colors">
              Fördelar
            </a>
            <a href="#priser" className="text-muted-foreground hover:text-foreground transition-colors">
              Priser
            </a>
          </nav>
          <Link to="/payment">
            <Button>Starta nu</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            Säkert • Enkelt • Digitalt
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Sveriges ledande <span className="text-primary">arvskifte</span><br />
            plattform för banker
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Komplett white-label lösning för banker som vill erbjuda digitala arvskiften. 
            Från manuell process till fullautomatisk - skalbar för miljontals kunder.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/payment">
              <Button size="lg" className="w-full sm:w-auto">
                Komplett lösning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="https://digitalt-arvskifte-v2-98.lovable.app" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Demo Baspaket
              </Button>
            </a>
            <Link to="/demo">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Demo Komplett
              </Button>
            </Link>
          </div>
          
          {/* Enterprise indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-success" />
              <span>White-label lösning</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>API-integration</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>Skalbar för miljoner</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-success" />
              <span>2M+ värde för banker</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="hur-det-fungerar" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Två nivåer av automatisering
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Från manuell process till fullständig automation - vi täcker alla bankers behov
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: "Baspaket - Manuell process",
                description: "Digitaliserad blankett för traditionell hantering",
                features: [
                  "Kunden fyller i formulär själv",
                  "Utskrift av blanketter",
                  "Manuell signering",
                  "Bankbesök krävs",
                  "Lägre kostnad för banken"
                ],
                icon: FileText,
                badge: "Traditionell"
              },
              {
                title: "Komplett - Fullautomatisk",
                description: "AI-driven process med API-integrationer",
                features: [
                  "Automatisk bankintegration",
                  "BankID-signering",
                  "AI-assisterad process",
                  "Ingen bankbesök",
                  "Högre kundvärde"
                ],
                icon: Shield,
                badge: "Premium"
              }
            ].map((item, index) => (
              <Card key={index} className="relative border-primary/20">
                <div className="absolute -top-3 -left-3">
                  <Badge variant={index === 0 ? "outline" : "default"}>
                    {item.badge}
                  </Badge>
                </div>
                <CardHeader className="text-center pt-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <CardDescription className="text-lg">{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {item.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="fordelar" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Värdeproposition för banker
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Varför denna lösning är värd 2+ miljoner för en bank som förvärvar teknologin
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Komplett teknologistack",
                description: "Färdig lösning med API:er, AI-integration och skalbar arkitektur värd 500k+ i utveckling",
                icon: Shield,
                color: "text-primary"
              },
              {
                title: "Marknadsledande position",
                description: "First-mover advantage i Sveriges digitala arvskiftesmarknad värd 300k+ i marknadsposition",
                icon: Star,
                color: "text-success"
              },
              {
                title: "Regulatorisk compliance",
                description: "Fullständig efterlevnad av svenska juridiska krav, sparar 200k+ i compliance-kostnader",
                icon: Gavel,
                color: "text-accent"
              },
              {
                title: "Kundengagemang",
                description: "Ökar kundlojalitet och cross-sell möjligheter, genererar 400k+ i årlig omsättning",
                icon: Users,
                color: "text-primary"
              },
              {
                title: "Operationell effektivitet",
                description: "Automatisering minskar manuellt arbete med 80%, sparar 300k+ årligen i personalkostnader",
                icon: Clock,
                color: "text-success"
              },
              {
                title: "Skalbar intäktsmodell",
                description: "White-label lösning för andra banker, potentiell licensintäkt 500k+ årligen",
                icon: FileText,
                color: "text-accent"
              }
            ].map((benefit, index) => (
              <Card key={index} className="hover:border-primary/20 transition-colors">
                <CardHeader>
                  <benefit.icon className={`h-8 w-8 ${benefit.color} mb-2`} />
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="priser" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Prissättning för kunder
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Två tydliga nivåer som passar olika kundbehov och bankens positionering
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <Card className="relative">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">Baspaket</CardTitle>
                <div className="text-4xl font-bold text-primary mb-2">1 995 kr</div>
                <CardDescription>Digitaliserad traditionell process</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Digital blankett</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Utskrift för signering</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Bankbesök krävs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Grundläggande support</span>
                </div>
                <div className="flex gap-2">
                  <a href="https://digitalt-arvskifte-v2-98.lovable.app" target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button className="w-full mt-6" variant="outline">
                      Testa Baspaket
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="relative border-primary">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Premium</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">Komplett</CardTitle>
                <div className="text-4xl font-bold text-primary mb-2">4 995 kr</div>
                <CardDescription>Fullautomatisk AI-driven process</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Automatisk bankintegration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>BankID-signering</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>AI-assistent</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Ingen bankbesök</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Premium support</span>
                </div>
                <div className="flex gap-2">
                  <Link to="/demo" className="flex-1">
                    <Button className="w-full mt-6" variant="outline">
                      Demo Komplett
                    </Button>
                  </Link>
                  <Link to="/payment" className="flex-1">
                    <Button className="w-full mt-6">
                      Välj Komplett
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Färdig för förvärv
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Komplett teknologistack värd 2+ miljoner kr. Perfekt för banker som vill leda digitaliseringen av arvskiften.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/enterprise">
              <Button size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90">
                Kontakta för förvärv
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Se teknisk demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Gavel className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold">DigitalArvskifte</span>
              </div>
              <p className="text-muted-foreground">
                Den moderna lösningen för digitala arvskiften i Sverige.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Tjänster</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/payment" className="hover:text-foreground transition-colors">Digitalt arvskifte</Link></li>
                <li><Link to="/demo" className="hover:text-foreground transition-colors">Se demo</Link></li>
                <li><Link to="/about" className="hover:text-foreground transition-colors">Juridisk rådgivning</Link></li>
                <li><Link to="/contact" className="hover:text-foreground transition-colors">Dokumenthantering</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/faq" className="hover:text-foreground transition-colors">Vanliga frågor</Link></li>
                <li><Link to="/contact" className="hover:text-foreground transition-colors">Kontakta oss</Link></li>
                <li><Link to="/faq" className="hover:text-foreground transition-colors">Hjälpcenter</Link></li>
                <li><Link to="/about" className="hover:text-foreground transition-colors">Juridisk information</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Företag</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground transition-colors">Om oss</Link></li>
                <li><Link to="/privacy" className="hover:text-foreground transition-colors">Integritetspolicy</Link></li>
                <li><Link to="/terms" className="hover:text-foreground transition-colors">Användarvillkor</Link></li>
                <li><Link to="/contact" className="hover:text-foreground transition-colors">Karriär</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 DigitalArvskifte. Alla rättigheter förbehållna.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
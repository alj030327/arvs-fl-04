import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PremiumCard, PremiumCardContent, PremiumCardDescription, PremiumCardHeader, PremiumCardTitle } from "@/components/ui/premium-card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Shield, Users, FileText, Gavel, ArrowRight, Star, Sparkles, Zap, Award } from "lucide-react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b glass-morphism sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[var(--gradient-primary)] rounded-xl flex items-center justify-center shadow-lg">
              <Gavel className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">DigitalArvskifte</span>
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
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge variant="secondary" className="mb-6 animate-slide-up bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 text-foreground font-semibold px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Enterprise-Grade • Säkert • AI-Drivet
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 animate-slide-up">
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Revolutionera
            </span>
            <br />
            ditt <span className="text-foreground">arvskifte</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            Nästa generations AI-driven plattform för juridiska processer. 
            <span className="text-primary font-semibold">Spara 90% tid</span>, eliminera fel och få banknivå-säkerhet.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up">
            <Link to="/payment">
              <Button size="xl" variant="premium" className="w-full sm:w-auto animate-float">
                <Zap className="mr-2 h-5 w-5" />
                Starta Nu - Helt Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button variant="outline" size="xl" className="w-full sm:w-auto glass-morphism">
                <Award className="mr-2 h-5 w-5" />
                Se Live Demo
              </Button>
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-slide-up">
            <PremiumCard variant="floating" className="text-center">
              <PremiumCardContent className="py-6">
                <Shield className="h-8 w-8 text-success mx-auto mb-3" />
                <div className="font-bold text-lg">ISO 27001</div>
                <div className="text-sm text-muted-foreground">Banknivå-säkerhet</div>
              </PremiumCardContent>
            </PremiumCard>
            <PremiumCard variant="floating" className="text-center">
              <PremiumCardContent className="py-6">
                <CheckCircle className="h-8 w-8 text-success mx-auto mb-3" />
                <div className="font-bold text-lg">99.9% SLA</div>
                <div className="text-sm text-muted-foreground">Enterprise Uptime</div>
              </PremiumCardContent>
            </PremiumCard>
            <PremiumCard variant="floating" className="text-center">
              <PremiumCardContent className="py-6">
                <Award className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="font-bold text-lg">500+ Banker</div>
                <div className="text-sm text-muted-foreground">Litar på oss</div>
              </PremiumCardContent>
            </PremiumCard>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="hur-det-fungerar" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Så här fungerar det
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Vi guidar dig genom hela processen i fyra enkla steg
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Identifiera dig",
                description: "Använd ditt personnummer och BankID för säker identifiering",
                icon: Shield
              },
              {
                step: "2", 
                title: "Registrera tillgångar",
                description: "Lägg till alla tillgångar som ska ingå i arvskiftet",
                icon: FileText
              },
              {
                step: "3",
                title: "Fördela arvet",
                description: "Bestäm hur arvet ska fördelas mellan arvingarna",
                icon: Users
              },
              {
                step: "4",
                title: "Signera digitalt",
                description: "Alla parter signerar med BankID för juridisk giltighet",
                icon: CheckCircle
              }
            ].map((item, index) => (
              <Card key={index} className="relative">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">{item.step}</span>
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {item.description}
                  </CardDescription>
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
              Fördelar med digitalt arvskifte
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upptäck varför tusentals familjer väljer vår digitala lösning
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Spara tid",
                description: "Komplettera ditt arvskifte på 30 minuter istället för veckor",
                icon: Clock,
                color: "text-primary"
              },
              {
                title: "Säkert & transparent",
                description: "BankID-signering och fullständig spårbarhet genom hela processen",
                icon: Shield,
                color: "text-success"
              },
              {
                title: "Juridiskt bindande",
                description: "Alla dokument uppfyller svenska juridiska krav",
                icon: Gavel,
                color: "text-accent"
              },
              {
                title: "Automatisk dokumentation",
                description: "Alla handlingar genereras och arkiveras automatiskt",
                icon: FileText,
                color: "text-primary"
              },
              {
                title: "Familjevänligt",
                description: "Alla arvingar kan delta digitalt oavsett var de befinner sig",
                icon: Users,
                color: "text-success"
              },
              {
                title: "Kostnadseffektivt",
                description: "Betydligt lägre kostnad än traditionella arvskiften",
                icon: CheckCircle,
                color: "text-accent"
              }
            ].map((benefit, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
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
              Transparent prissättning
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Inga dolda kostnader. Betala endast när du är nöjd.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
            <PremiumCard variant="premium" className="relative hover-lift">
              <PremiumCardHeader className="text-center">
                <PremiumCardTitle className="text-3xl mb-4">Grundpaket</PremiumCardTitle>
                <div className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-4">2 995 kr</div>
                <PremiumCardDescription className="text-lg">För enklare arvskiften</PremiumCardDescription>
              </PremiumCardHeader>
              <PremiumCardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Upp till 3 arvingar</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Grundläggande tillgångar</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>BankID-signering</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>E-poststöd</span>
                </div>
                <Link to="/payment" className="block">
                  <Button className="w-full mt-8" variant="outline" size="lg">
                    Välj Grundpaket
                  </Button>
                </Link>
              </PremiumCardContent>
            </PremiumCard>

            <PremiumCard variant="enterprise" glow className="relative border-primary shadow-xl">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-[var(--gradient-premium)] text-white px-4 py-2 font-bold shadow-lg">
                  <Star className="w-4 h-4 mr-1" />
                  Mest Populär
                </Badge>
              </div>
              <PremiumCardHeader className="text-center">
                <PremiumCardTitle className="text-3xl mb-4">Enterprise</PremiumCardTitle>
                <div className="text-5xl font-bold bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent mb-4">4 995 kr</div>
                <PremiumCardDescription className="text-lg">För komplexa organisationer</PremiumCardDescription>
              </PremiumCardHeader>
              <PremiumCardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Obegränsat antal arvingar</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Alla typer av tillgångar</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Fysiska tillgångar</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Prioriterat telefonsupport</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Juridisk granskning</span>
                </div>
                <Link to="/payment" className="block">
                  <Button className="w-full mt-8" variant="enterprise" size="lg">
                    <Award className="mr-2 h-5 w-5" />
                    Välj Enterprise
                  </Button>
                </Link>
              </PremiumCardContent>
            </PremiumCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Redo att <span className="text-primary-glow">revolutionera</span> din verksamhet?
          </h2>
          <p className="text-xl md:text-2xl opacity-90 mb-12 max-w-3xl mx-auto text-white leading-relaxed">
            Över 15,000+ organisationer har redan övergått till vår plattform. 
            Bli nästa framgångshistoria.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/payment">
              <Button size="xl" className="bg-white text-primary hover:bg-white/90 hover:scale-105 shadow-xl">
                <Zap className="mr-2 h-6 w-6" />
                Starta Gratis Idag
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
            <Link to="/enterprise">
              <Button size="xl" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:scale-105">
                <Award className="mr-2 h-6 w-6" />
                Enterprise Demo
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
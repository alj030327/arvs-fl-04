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
          <Link to="/process">
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
            Genomför ditt <span className="text-primary">arvskifte</span><br />
            helt digitalt
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            En modern, säker och transparent lösning för att hantera arvskiften. 
            Spara tid, minska stress och säkerställ att allt görs rätt från första början.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/process">
              <Button size="lg" className="w-full sm:w-auto">
                Starta ditt arvskifte
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Se demo
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-success" />
              <span>BankID-signering</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>Juridiskt bindande</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-warning" />
              <span>4.8/5 i betyg</span>
            </div>
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

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <Card className="relative">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">Grundpaket</CardTitle>
                <div className="text-4xl font-bold text-primary mb-2">2 995 kr</div>
                <CardDescription>För enklare arvskiften</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                <Link to="/process" className="block">
                  <Button className="w-full mt-6" variant="outline">
                    Välj Grundpaket
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="relative border-primary shadow-lg">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Populärast</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">Komplett</CardTitle>
                <div className="text-4xl font-bold text-primary mb-2">4 995 kr</div>
                <CardDescription>För komplexa arvskiften</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                <Link to="/process" className="block">
                  <Button className="w-full mt-6">
                    Välj Komplett
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Redo att börja?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Starta ditt digitala arvskifte idag. Det tar bara några minuter att komma igång.
          </p>
          <Link to="/process">
            <Button size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90">
              Starta ditt arvskifte nu
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
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
                <li><a href="#" className="hover:text-foreground transition-colors">Digitalt arvskifte</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">BankID-signering</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Juridisk rådgivning</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Dokumenthantering</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Vanliga frågor</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Kontakta oss</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Hjälpcenter</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Juridisk information</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Företag</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Om oss</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Integritetspolicy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Användarvillkor</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Karriär</a></li>
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
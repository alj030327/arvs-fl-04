import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Shield, Users, FileText, Gavel, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
export default function Landing() {
  return <div className="min-h-screen bg-background">
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
            Digitalt <span className="text-primary">Arvskifte</span><br />
            enkelt och säkert
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Genomför ditt arvskifte digitalt med vår moderna, säkra och transparenta lösning. 
            Välj mellan manuell process eller fullautomatisk hantering beroende på dina behov.
          </p>
          <div className="flex flex-col items-center gap-6">
            {/* Main solution buttons - bigger */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/payment">
                <Button className="text-lg px-8 py-4 h-auto w-full sm:w-auto min-w-[200px] bg-primary hover:bg-primary/90">
                  Baspakets lösning
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/payment">
                <Button size="lg" className="text-lg px-8 py-4 h-auto w-full sm:w-auto min-w-[200px]">
                  Komplett lösning
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            {/* Demo buttons - smaller and underneath */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/demo-baspaket">
                <Button variant="outline" size="sm" className="w-full sm:w-auto text-sm">
                  Demo Baspaket
                </Button>
              </Link>
              <Link to="/demo-instructions">
                <Button variant="outline" size="sm" className="w-full sm:w-auto text-sm">
                  Demo Komplett
                </Button>
              </Link>
            </div>
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
              <CheckCircle className="h-5 w-5 text-success" />
              <span>GDPR-kompatibel</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-success" />
              <span>Trygg och säker</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="hur-det-fungerar" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Välj den lösning som passar dig
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Vi erbjuder två olika nivåer av service för att möta alla behov och budgetar
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[{
            title: "Baspaket - Traditionell process",
            description: "Digital blankett för traditionell hantering av arvskifte",
            features: ["Digitalt formulär som du fyller i själv", "Utskrift av alla nödvändiga dokument", "Traditionell signering på papper", "Du hanterar bankbesök själv", "Lägre kostnad och grundläggande service"],
            icon: FileText,
            badge: "Ekonomisk"
          }, {
            title: "Komplett - Modern process",
            description: "Fullservice med digital hantering från start till mål",
            features: ["Automatisk bankintegration och datainhämtning", "BankID-signering för alla parter", "Ingen manuell hantering eller bankbesök", "Fullständig digital process", "Premium support och hjälp"],
            icon: Shield,
            badge: "Populärast"
          }].map((item, index) => <Card key={index} className="relative border-primary/20">
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
                  {item.features.map((feature, fIndex) => <div key={fIndex} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>)}
                </CardContent>
              </Card>)}
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
              Upptäck varför tusentals familjer väljer vår digitala lösning för sina arvskiften
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[{
            title: "Spara tid och pengar",
            description: "Komplettera ditt arvskifte på 30 minuter istället för veckor av byråkrati",
            icon: Clock,
            color: "text-primary"
          }, {
            title: "Säkert & transparent",
            description: "BankID-signering och fullständig spårbarhet genom hela processen",
            icon: Shield,
            color: "text-success"
          }, {
            title: "Juridiskt bindande",
            description: "Alla dokument uppfyller svenska juridiska krav och är godkända av myndigheter",
            icon: Gavel,
            color: "text-accent"
          }, {
            title: "Automatisk dokumentation",
            description: "Alla handlingar genereras och arkiveras automatiskt för framtida behov",
            icon: FileText,
            color: "text-primary"
          }, {
            title: "Familjevänligt",
            description: "Alla arvingar kan delta digitalt oavsett var de befinner sig i världen",
            icon: Users,
            color: "text-success"
          }, {
            title: "Professionell support",
            description: "Få hjälp av våra experter när du behöver det, via telefon eller e-post",
            icon: CheckCircle,
            color: "text-accent"
          }].map((benefit, index) => <Card key={index} className="hover:border-primary/20 transition-colors">
                <CardHeader>
                  <benefit.icon className={`h-8 w-8 ${benefit.color} mb-2`} />
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{benefit.description}</CardDescription>
                </CardContent>
              </Card>)}
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
              Välj den nivå av service som passar dina behov. Inga dolda kostnader.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <Card className="relative">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">Baspaket</CardTitle>
                <div className="text-4xl font-bold text-primary mb-2">499 kr</div>
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
                  <Link to="/demo-baspaket" className="flex-1">
                    <Button className="w-full mt-6" variant="outline">
                      Demo Baspaket
                    </Button>
                  </Link>
                  <Link to="/payment" className="flex-1">
                    <Button className="w-full mt-6">
                      Välj Baspaket
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="relative border-primary">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Populärast</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">Komplett</CardTitle>
                <div className="text-4xl font-bold text-primary mb-2">2 499 kr</div>
                <CardDescription>Fullservice digital process</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Automatisk bankintegration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>BankID-signering för alla</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Inga bankbesök nödvändiga</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Obegränsat antal arvingar</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Premium telefonsupport</span>
                </div>
                <div className="flex gap-2">
                  <Link to="/demo-instructions" className="flex-1">
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
            Redo att börja?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Starta ditt digitala arvskifte idag. Det tar bara några minuter att komma igång.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/payment">
              <Button size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90">
                Starta ditt arvskifte nu
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/demo-instructions">
              <Button size="lg" variant="outline" className="border-white/20 text-slate-950 bg-slate-400 hover:bg-slate-300">
                Se demo först
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
    </div>;
}
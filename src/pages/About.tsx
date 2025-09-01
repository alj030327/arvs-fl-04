import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Clock, Award, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-5 w-5" />
            <span>Tillbaka till startsidan</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-6">Om DigitalArvskifte</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Vi revolutionerar arvskifteprocessen i Sverige genom att göra den enkel, säker och helt digital.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold mb-4">Vår mission</h2>
              <p className="text-muted-foreground mb-4">
                Att göra arvskiften enkla, transparenta och tillgängliga för alla svenska familjer. Vi tror att teknologi kan eliminera onödigt krångel och stress under en redan känslig tid.
              </p>
              <p className="text-muted-foreground">
                Genom att digitalisera hela processen sparar vi tid, minskar kostnader och säkerställer att allt görs korrekt från första början.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Vår vision</h2>
              <p className="text-muted-foreground mb-4">
                En framtid där arvskiften kan genomföras på 30 minuter istället för månader, där alla parter kan delta digitalt oavsett var de befinner sig i världen.
              </p>
              <p className="text-muted-foreground">
                Vi vill vara den självklara partnern för svenska familjer när de behöver hantera juridiska arvsskiften.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Säkerhet först</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Alla transaktioner skyddas med BankID och uppfyller svenska säkerhetsstandarder.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Snabb process</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Från start till färdigt arvskifte på bara 30 minuter istället för veckor eller månader.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Familjevänligt</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Alla arvingar kan delta digitalt, oavsett var i världen de befinner sig.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Award className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Juridisk kvalitet</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Alla dokument uppfyller svenska juridiska krav och granskas av experter.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="bg-muted/30 rounded-lg p-8 mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Vårt team</h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
              Vi är ett team av jurister, tekniker och UX-designers som tillsammans har över 50 års kombinerad erfarenhet inom arvsskiften och digital transformation.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Juridisk expertis</h3>
                <p className="text-sm text-muted-foreground">
                  Erfarna arvsskiftesjurister som säkerställer att allt görs korrekt
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Teknisk innovation</h3>
                <p className="text-sm text-muted-foreground">
                  Utvecklare som bygger säkra och användarvänliga lösningar
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Användarfokus</h3>
                <p className="text-sm text-muted-foreground">
                  UX-designers som gör komplexa processer enkla att förstå
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Redo att börja?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Låt oss hjälpa dig att genomföra ditt arvskifte på ett modernt och säkert sätt.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/demo">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Se demo
                </Button>
              </Link>
              <Link to="/payment">
                <Button size="lg" className="w-full sm:w-auto">
                  Starta ditt arvskifte
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
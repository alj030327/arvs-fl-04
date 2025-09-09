import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, 
  Zap, 
  ArrowRight, 
  Info,
  Home,
  Clock,
  Users,
  CreditCard,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { Link } from "react-router-dom";

export default function DemoInstructions() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Home className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">DigitalArvskifte</span>
          </Link>
          <Badge variant="outline" className="text-sm">
            Demo Instruktioner
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Welcome Section */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-2">Välj din demo-upplevelse</CardTitle>
              <CardDescription className="text-lg">
                Vi erbjuder två olika demonstrationer för att visa skillnaden mellan våra paket
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Viktigt att förstå:</strong> Dessa är demonstrationer som visar hur de två olika paketen fungerar. 
                  Du kan testa båda för att se vilken som passar dina behov bäst.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Demo Comparison */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Demo Basic */}
            <Card className="border-orange-200">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    Traditionell Process
                  </Badge>
                  <FileText className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl text-orange-800">Demo Baspaket</CardTitle>
                <CardDescription>
                  Upplev den traditionella, manuella processen - precis som dagens arvskiften
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span>Du fyller i formulär själv</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-orange-600" />
                    <span>Genererar PDF-dokument att skriva ut</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-orange-600" />
                    <span>Kräver fysiska signaturer</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span>Du besöker bankerna själv</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="h-4 w-4 text-orange-600" />
                    <span>Kostnad: 500 kr</span>
                  </div>
                </div>

                <Alert className="border-orange-200 bg-orange-50">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-orange-800">
                    <strong>Passar dig som:</strong> Vill ha lägre kostnad och inte har något emot att hantera papper och bankbesök
                  </AlertDescription>
                </Alert>

                <Link to="/demo-basic-form" className="block">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Testa Baspaket Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Demo Complete */}
            <Card className="border-primary border-2">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-primary text-primary-foreground">
                    Modern Process
                  </Badge>
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl text-primary">Demo Komplett</CardTitle>
                <CardDescription>
                  Upplev framtidens arvskifte - helt digitalt från start till mål
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 text-primary" />
                    <span>Automatisk bankintegration</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>BankID-signering för alla</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-primary" />
                    <span>Digital process för alla arvingar</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Inga bankbesök nödvändiga</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="h-4 w-4 text-primary" />
                    <span>Kostnad: 2 500 kr</span>
                  </div>
                </div>

                <Alert className="border-primary/20 bg-primary/5">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-primary">
                    <strong>Passar dig som:</strong> Vill ha maximal bekvämlighet och spara tid, även om det kostar lite mer
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Link to="/demo" className="block">
                    <Button className="w-full">
                      Testa Komplett Demo (tom fält)
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/test-process" className="block">
                    <Button variant="outline" className="w-full">
                      Testa förifyllt (exempeldata)
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detaljerad jämförelse</CardTitle>
              <CardDescription>
                Se exakt vad som skiljer de två paketen åt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3">Funktion</th>
                      <th className="text-center py-2 px-3 text-orange-600">Baspaket</th>
                      <th className="text-center py-2 px-3 text-primary">Komplett</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    <tr className="border-b">
                      <td className="py-2 px-3 font-medium">Kostnad</td>
                      <td className="text-center py-2 px-3">500 kr</td>
                      <td className="text-center py-2 px-3">2 500 kr</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-3 font-medium">Formulär</td>
                      <td className="text-center py-2 px-3">Manual ifyllning</td>
                      <td className="text-center py-2 px-3">Guidad process</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-3 font-medium">Bankintegration</td>
                      <td className="text-center py-2 px-3">❌ Nej</td>
                      <td className="text-center py-2 px-3">✅ Automatisk</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-3 font-medium">Signering</td>
                      <td className="text-center py-2 px-3">Papper + penna</td>
                      <td className="text-center py-2 px-3">BankID digital</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-3 font-medium">Bankbesök</td>
                      <td className="text-center py-2 px-3">❌ Krävs</td>
                      <td className="text-center py-2 px-3">✅ Ej nödvändigt</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-3 font-medium">Tidsåtgång</td>
                      <td className="text-center py-2 px-3">2-4 veckor</td>
                      <td className="text-center py-2 px-3">30 minuter</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium">Support</td>
                      <td className="text-center py-2 px-3">E-post</td>
                      <td className="text-center py-2 px-3">Telefon + E-post</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-muted/50">
            <CardContent className="text-center py-8">
              <h3 className="text-xl font-bold mb-4">Redo att börja?</h3>
              <p className="text-muted-foreground mb-6">
                Efter att du testat båda demonstrationerna kan du välja det paket som passar dig bäst
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/payment">
                  <Button size="lg">
                    Köp Baspaket (500 kr)
                  </Button>
                </Link>
                <Link to="/payment">
                  <Button size="lg" variant="outline">
                    Köp Komplett (2 500 kr)
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Back to Home */}
          <div className="text-center">
            <Link to="/">
              <Button variant="ghost" className="text-muted-foreground">
                ← Tillbaka till startsidan
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
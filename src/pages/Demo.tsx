import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock, Shield, FileText, Users, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Demo() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const simulateDelay = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep(prev => prev + 1);
    }, 2000);
  };

  const resetDemo = () => {
    setCurrentStep(1);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-5 w-5" />
            <span>Tillbaka till startsidan</span>
          </Link>
          <Badge variant="secondary" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            DEMO - Ingen riktig data
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Demo: Digitalt Arvskifte</h1>
            <p className="text-muted-foreground mb-4">
              Detta är en demonstration av arvskifteprocessen. Ingen riktig data sparas och ingen koppling till BankID eller verkliga API:er görs.
            </p>
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-warning-foreground">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">OBS: Detta är endast en demo</span>
              </div>
              <p className="text-sm mt-2 text-muted-foreground">
                Alla svar och signeringar är slumpmässiga och inte kopplade till verkliga system.
              </p>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step < currentStep ? 'bg-success text-success-foreground' :
                  step === currentStep ? 'bg-primary text-primary-foreground' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
                </div>
                {step < 5 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-success' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Steg 1: Identifiering
                </CardTitle>
                <CardDescription>
                  Identifiera dig med personnummer och BankID
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="personnummer">Personnummer</Label>
                  <Input id="personnummer" placeholder="YYYYMMDD-XXXX" defaultValue="19800101-1234" />
                </div>
                <Button onClick={simulateDelay} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Simulerar BankID-signering...
                    </>
                  ) : (
                    <>
                      Signera med BankID (Demo)
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Steg 2: Registrera tillgångar
                </CardTitle>
                <CardDescription>
                  Lägg till alla tillgångar som ska ingå i arvskiftet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                  <h4 className="font-medium text-success-foreground mb-2">Automatiskt funna tillgångar:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Bankkonto: 1234-5678901 (450 000 kr)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      ISK: Nordnet (125 000 kr)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Fastighet: Storgatan 1, Stockholm
                    </li>
                  </ul>
                </div>
                <Button onClick={simulateDelay} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Hämtar tillgångar...
                    </>
                  ) : (
                    <>
                      Bekräfta tillgångar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Steg 3: Fördela arvet
                </CardTitle>
                <CardDescription>
                  Bestäm hur arvet ska fördelas mellan arvingarna
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Anna Svensson</p>
                      <p className="text-sm text-muted-foreground">Dotter</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">50%</p>
                      <p className="text-sm text-muted-foreground">287 500 kr</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Erik Svensson</p>
                      <p className="text-sm text-muted-foreground">Son</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">50%</p>
                      <p className="text-sm text-muted-foreground">287 500 kr</p>
                    </div>
                  </div>
                </div>
                <Button onClick={simulateDelay} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Beräknar fördelning...
                    </>
                  ) : (
                    <>
                      Bekräfta fördelning
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Steg 4: Digital signering
                </CardTitle>
                <CardDescription>
                  Alla parter signerar digitalt med BankID
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Din signering</span>
                    <Badge variant="default" className="bg-success text-success-foreground">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Signerad
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Anna Svensson</span>
                    <Badge variant="secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      Väntar
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Erik Svensson</span>
                    <Badge variant="secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      Väntar
                    </Badge>
                  </div>
                </div>
                <Button onClick={simulateDelay} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Simulerar signeringar...
                    </>
                  ) : (
                    <>
                      Simulera alla signeringar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {currentStep === 5 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  Arvskiftet är klart!
                </CardTitle>
                <CardDescription>
                  Alla dokument har signerats och arvskiftet är juridiskt bindande
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                  <h4 className="font-medium text-success-foreground mb-2">Nästa steg:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Dokument skickas till alla parter
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Anmälan till Skatteverket
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Bankärenden hanteras automatiskt
                    </li>
                  </ul>
                </div>
                <div className="flex gap-4">
                  <Button onClick={resetDemo} variant="outline" className="flex-1">
                    Kör demo igen
                  </Button>
                  <Link to="/" className="flex-1">
                    <Button className="w-full">
                      Tillbaka till startsidan
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
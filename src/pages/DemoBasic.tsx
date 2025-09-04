import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, 
  User, 
  Users, 
  Calculator, 
  Download, 
  PrinterIcon, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Info,
  Home
} from "lucide-react";
import { Link } from "react-router-dom";

interface PersonalInfo {
  personalNumber: string;
  fullName: string;
  address: string;
  phone: string;
  email: string;
}

interface DeceasedInfo {
  personalNumber: string;
  fullName: string;
  deathDate: string;
  lastAddress: string;
}

interface Heir {
  personalNumber: string;
  fullName: string;
  relation: string;
  address: string;
  phone: string;
  email: string;
  inheritanceShare: string;
}

interface Asset {
  type: string;
  description: string;
  value: string;
  location: string;
}

export default function DemoBasic() {
  const [currentStep, setCurrentStep] = useState(1);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    personalNumber: "",
    fullName: "",
    address: "",
    phone: "",
    email: ""
  });
  const [deceasedInfo, setDeceasedInfo] = useState<DeceasedInfo>({
    personalNumber: "",
    fullName: "",
    deathDate: "",
    lastAddress: ""
  });
  const [heirs, setHeirs] = useState<Heir[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const addHeir = () => {
    setHeirs([...heirs, {
      personalNumber: "",
      fullName: "",
      relation: "",
      address: "",
      phone: "",
      email: "",
      inheritanceShare: ""
    }]);
  };

  const addAsset = () => {
    setAssets([...assets, {
      type: "",
      description: "",
      value: "",
      location: ""
    }]);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateDocument = () => {
    const content = `
ARVSKIFTESFORMULÄR - BASPAKET

=== DÖDSBODELÄGARE ===
Personnummer: ${personalInfo.personalNumber}
Namn: ${personalInfo.fullName}
Adress: ${personalInfo.address}
Telefon: ${personalInfo.phone}
E-post: ${personalInfo.email}

=== AVLIDEN PERSON ===
Personnummer: ${deceasedInfo.personalNumber}
Namn: ${deceasedInfo.fullName}
Dödsdatum: ${deceasedInfo.deathDate}
Senaste adress: ${deceasedInfo.lastAddress}

=== ARVINGAR ===
${heirs.map((heir, index) => `
Arvinge ${index + 1}:
Personnummer: ${heir.personalNumber}
Namn: ${heir.fullName}
Relation: ${heir.relation}
Adress: ${heir.address}
Telefon: ${heir.phone}
E-post: ${heir.email}
Arvslott: ${heir.inheritanceShare}
`).join('')}

=== TILLGÅNGAR ===
${assets.map((asset, index) => `
Tillgång ${index + 1}:
Typ: ${asset.type}
Beskrivning: ${asset.description}
Värde: ${asset.value} kr
Plats: ${asset.location}
`).join('')}

VIKTIGT: Detta dokument måste skrivas ut och signeras av alla parter.
Kontakta respektive bank för att genomföra arvskiftet.
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'arvskifte-baspaket.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Välkommen till Baspaket Demo
              </CardTitle>
              <CardDescription>
                Denna demo visar hur vårt Baspaket fungerar - en traditionell process där du fyller i formulär själv.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Så fungerar Baspaket:</strong>
                  <ul className="mt-2 space-y-1 list-disc list-inside">
                    <li>Du fyller i alla uppgifter själv</li>
                    <li>Du skriver ut dokumenten</li>
                    <li>Alla signerar på papper</li>
                    <li>Du besöker bankerna själv</li>
                    <li>Lägre kostnad men mer arbete för dig</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-800">Fördelar</CardTitle>
                  </CardHeader>
                  <CardContent className="text-green-700">
                    <ul className="space-y-1">
                      <li>• Lägre kostnad (1 995 kr)</li>
                      <li>• Du har kontroll över processen</li>
                      <li>• Fungerar även utan BankID</li>
                      <li>• Traditionell och välkänd metod</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-orange-800">Kräver av dig</CardTitle>
                  </CardHeader>
                  <CardContent className="text-orange-700">
                    <ul className="space-y-1">
                      <li>• Manuell datainmatning</li>
                      <li>• Bankbesök för varje konto</li>
                      <li>• Hantering av pappersformulär</li>
                      <li>• Mer tid och administration</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Klicka på "Nästa" för att börja fylla i formuläret
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Steg 1: Dina uppgifter som dödsbodelägare
              </CardTitle>
              <CardDescription>
                Fyll i dina personuppgifter. Du kommer att vara huvudansvarig för arvskiftet.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Som dödsbodelägare ansvarar du för att samla in alla uppgifter och genomföra arvskiftet.
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="personal-number">Personnummer</Label>
                  <Input
                    id="personal-number"
                    placeholder="YYYYMMDD-XXXX"
                    value={personalInfo.personalNumber}
                    onChange={(e) => setPersonalInfo({...personalInfo, personalNumber: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="full-name">Fullständigt namn</Label>
                  <Input
                    id="full-name"
                    placeholder="Förnamn Efternamn"
                    value={personalInfo.fullName}
                    onChange={(e) => setPersonalInfo({...personalInfo, fullName: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Adress</Label>
                <Input
                  id="address"
                  placeholder="Gatunamn 1, 123 45 Stad"
                  value={personalInfo.address}
                  onChange={(e) => setPersonalInfo({...personalInfo, address: e.target.value})}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Telefonnummer</Label>
                  <Input
                    id="phone"
                    placeholder="070-123 45 67"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-postadress</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="namn@exempel.se"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Steg 2: Uppgifter om den avlidne
              </CardTitle>
              <CardDescription>
                Fyll i uppgifter om personen som har gått bort.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Dessa uppgifter behövs för att identifiera dödsboet och kontrollera identiteten.
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deceased-personal-number">Personnummer</Label>
                  <Input
                    id="deceased-personal-number"
                    placeholder="YYYYMMDD-XXXX"
                    value={deceasedInfo.personalNumber}
                    onChange={(e) => setDeceasedInfo({...deceasedInfo, personalNumber: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="deceased-name">Fullständigt namn</Label>
                  <Input
                    id="deceased-name"
                    placeholder="Förnamn Efternamn"
                    value={deceasedInfo.fullName}
                    onChange={(e) => setDeceasedInfo({...deceasedInfo, fullName: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="death-date">Dödsdatum</Label>
                  <Input
                    id="death-date"
                    type="date"
                    value={deceasedInfo.deathDate}
                    onChange={(e) => setDeceasedInfo({...deceasedInfo, deathDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="last-address">Senaste adress</Label>
                  <Input
                    id="last-address"
                    placeholder="Gatunamn 1, 123 45 Stad"
                    value={deceasedInfo.lastAddress}
                    onChange={(e) => setDeceasedInfo({...deceasedInfo, lastAddress: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Steg 3: Lägg till arvingar
              </CardTitle>
              <CardDescription>
                Lägg till alla personer som ska ärva. Du kan lägga till flera arvingar.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Alla arvingar måste senare signera dokumenten. Se till att kontaktuppgifterna stämmer.
                </AlertDescription>
              </Alert>

              {heirs.map((heir, index) => (
                <Card key={index} className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Arvinge {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Personnummer</Label>
                        <Input
                          placeholder="YYYYMMDD-XXXX"
                          value={heir.personalNumber}
                          onChange={(e) => {
                            const newHeirs = [...heirs];
                            newHeirs[index].personalNumber = e.target.value;
                            setHeirs(newHeirs);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Fullständigt namn</Label>
                        <Input
                          placeholder="Förnamn Efternamn"
                          value={heir.fullName}
                          onChange={(e) => {
                            const newHeirs = [...heirs];
                            newHeirs[index].fullName = e.target.value;
                            setHeirs(newHeirs);
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Relation till avliden</Label>
                        <Input
                          placeholder="t.ex. Dotter, Son, Make/Maka"
                          value={heir.relation}
                          onChange={(e) => {
                            const newHeirs = [...heirs];
                            newHeirs[index].relation = e.target.value;
                            setHeirs(newHeirs);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Arvslott (%)</Label>
                        <Input
                          placeholder="t.ex. 50"
                          value={heir.inheritanceShare}
                          onChange={(e) => {
                            const newHeirs = [...heirs];
                            newHeirs[index].inheritanceShare = e.target.value;
                            setHeirs(newHeirs);
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Adress</Label>
                      <Input
                        placeholder="Gatunamn 1, 123 45 Stad"
                        value={heir.address}
                        onChange={(e) => {
                          const newHeirs = [...heirs];
                          newHeirs[index].address = e.target.value;
                          setHeirs(newHeirs);
                        }}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Telefon</Label>
                        <Input
                          placeholder="070-123 45 67"
                          value={heir.phone}
                          onChange={(e) => {
                            const newHeirs = [...heirs];
                            newHeirs[index].phone = e.target.value;
                            setHeirs(newHeirs);
                          }}
                        />
                      </div>
                      <div>
                        <Label>E-post</Label>
                        <Input
                          placeholder="namn@exempel.se"
                          value={heir.email}
                          onChange={(e) => {
                            const newHeirs = [...heirs];
                            newHeirs[index].email = e.target.value;
                            setHeirs(newHeirs);
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button onClick={addHeir} variant="outline" className="w-full">
                + Lägg till arvinge
              </Button>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Steg 4: Registrera tillgångar
              </CardTitle>
              <CardDescription>
                Lägg till alla tillgångar som ingår i dödsboet.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Lista alla bankkonton, fastigheter, fordon och andra värdeföremål. Du behöver kontakta varje bank själv.
                </AlertDescription>
              </Alert>

              {assets.map((asset, index) => (
                <Card key={index} className="border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Tillgång {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Typ av tillgång</Label>
                        <Input
                          placeholder="t.ex. Bankkonto, Fastighet, Bil"
                          value={asset.type}
                          onChange={(e) => {
                            const newAssets = [...assets];
                            newAssets[index].type = e.target.value;
                            setAssets(newAssets);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Värde (kr)</Label>
                        <Input
                          placeholder="t.ex. 100000"
                          value={asset.value}
                          onChange={(e) => {
                            const newAssets = [...assets];
                            newAssets[index].value = e.target.value;
                            setAssets(newAssets);
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Beskrivning</Label>
                      <Textarea
                        placeholder="Detaljerad beskrivning av tillgången"
                        value={asset.description}
                        onChange={(e) => {
                          const newAssets = [...assets];
                          newAssets[index].description = e.target.value;
                          setAssets(newAssets);
                        }}
                      />
                    </div>

                    <div>
                      <Label>Plats/Bank</Label>
                      <Input
                        placeholder="t.ex. Swedbank Stockholm, Registreringsadress"
                        value={asset.location}
                        onChange={(e) => {
                          const newAssets = [...assets];
                          newAssets[index].location = e.target.value;
                          setAssets(newAssets);
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button onClick={addAsset} variant="outline" className="w-full">
                + Lägg till tillgång
              </Button>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Steg 5: Ladda ner och slutför
              </CardTitle>
              <CardDescription>
                Nu är formuläret klart. Ladda ner dokumentet och följ instruktionerna.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Grattis!</strong> Du har fyllt i alla uppgifter. Nu följer de manuella stegen.
                </AlertDescription>
              </Alert>

              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800">Nästa steg för dig:</CardTitle>
                </CardHeader>
                <CardContent className="text-blue-700 space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</span>
                    <div>
                      <strong>Ladda ner dokumentet</strong>
                      <p className="text-sm">Klicka på knappen nedan för att ladda ner formuläret</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</span>
                    <div>
                      <strong>Skriv ut dokumentet</strong>
                      <p className="text-sm">Skriv ut alla sidor och kontrollera att allt ser korrekt ut</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</span>
                    <div>
                      <strong>Samla alla signaturer</strong>
                      <p className="text-sm">Alla arvingar måste signera dokumenten</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</span>
                    <div>
                      <strong>Besök bankerna</strong>
                      <p className="text-sm">Ta med dokumenten till varje bank där det finns tillgångar</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">5</span>
                    <div>
                      <strong>Genomför överföringarna</strong>
                      <p className="text-sm">Banken hjälper dig att överföra tillgångarna till arvingarna</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4 justify-center">
                <Button onClick={generateDocument} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Ladda ner formulär
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <PrinterIcon className="h-4 w-4" />
                  Skriv ut
                </Button>
              </div>

              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-lg text-orange-800">Vill du ha det enklare?</CardTitle>
                </CardHeader>
                <CardContent className="text-orange-700">
                  <p className="mb-3">
                    Med vårt <strong>Komplett-paket</strong> slipper du alla manuella steg:
                  </p>
                  <ul className="space-y-1 mb-4">
                    <li>• Automatisk bankintegration</li>
                    <li>• BankID-signering</li>
                    <li>• Inga bankbesök</li>
                    <li>• Allt sköts digitalt</li>
                  </ul>
                  <div className="flex gap-2">
                    <Link to="/demo">
                      <Button variant="outline" size="sm">Demo Komplett</Button>
                    </Link>
                    <Link to="/payment">
                      <Button size="sm">Uppgradera till Komplett</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

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
            Baspaket Demo
          </Badge>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Steg {currentStep} av {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% klart</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {renderStepContent()}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button 
              onClick={prevStep} 
              variant="outline" 
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Föregående
            </Button>
            
            <div className="flex gap-2">
              <Link to="/">
                <Button variant="ghost">
                  Tillbaka till startsidan
                </Button>
              </Link>
              
              {currentStep < totalSteps && (
                <Button onClick={nextStep} className="flex items-center gap-2">
                  Nästa
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
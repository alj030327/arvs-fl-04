import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BasicDocumentSummary } from "@/components/BasicDocumentSummary";
import { 
  Download, 
  Home,
  Info,
  Plus,
  Trash2,
  Calculator,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";

interface FormData {
  // Dödsbodelägare
  executorPersonalNumber: string;
  executorName: string;
  executorAddress: string;
  executorPhone: string;
  executorEmail: string;
  
  // Avliden
  deceasedPersonalNumber: string;
  deceasedName: string;
  deceasedAddress: string;
  deathDate: string;
  
  // Arvingar
  heirs: Array<{
    personalNumber: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    relation: string;
    share: string;
  }>;
  
  // Tillgångar
  assets: Array<{
    bank: string;
    type: string;
    accountNumber: string;
    value: string;
    description: string;
    location: string;
  }>;
}

export default function DemoBasicForm() {
  const [currentStep, setCurrentStep] = useState<'form' | 'summary'>('form');
  const [formData, setFormData] = useState<FormData>({
    executorPersonalNumber: "",
    executorName: "",
    executorAddress: "",
    executorPhone: "",
    executorEmail: "",
    deceasedPersonalNumber: "",
    deceasedName: "",
    deceasedAddress: "",
    deathDate: "",
    heirs: [],
    assets: []
  });

  const addHeir = () => {
    setFormData({
      ...formData,
      heirs: [...formData.heirs, {
        personalNumber: "",
        name: "",
        address: "",
        phone: "",
        email: "",
        relation: "",
        share: ""
      }]
    });
  };

  const removeHeir = (index: number) => {
    const newHeirs = formData.heirs.filter((_, i) => i !== index);
    setFormData({ ...formData, heirs: newHeirs });
  };

  const updateHeir = (index: number, field: keyof FormData['heirs'][0], value: string) => {
    const newHeirs = [...formData.heirs];
    newHeirs[index][field] = value;
    setFormData({ ...formData, heirs: newHeirs });
  };

  const addAsset = () => {
    setFormData({
      ...formData,
      assets: [...formData.assets, {
        bank: "",
        type: "",
        accountNumber: "",
        value: "",
        description: "",
        location: ""
      }]
    });
  };

  const removeAsset = (index: number) => {
    const newAssets = formData.assets.filter((_, i) => i !== index);
    setFormData({ ...formData, assets: newAssets });
  };

  const updateAsset = (index: number, field: keyof FormData['assets'][0], value: string) => {
    const newAssets = [...formData.assets];
    newAssets[index][field] = value;
    setFormData({ ...formData, assets: newAssets });
  };

  const totalShare = formData.heirs.reduce((sum, heir) => sum + (parseFloat(heir.share) || 0), 0);
  const totalValue = formData.assets.reduce((sum, asset) => sum + (parseFloat(asset.value) || 0), 0);

  const handleCompleteForm = () => {
    setCurrentStep('summary');
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let y = 20;
    
    // Header
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('ARVSKIFTESFORMULÄR', 20, y);
    y += 10;
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Baspaket - Traditionell process', 20, y);
    y += 15;

    // Dödsbodelägare
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('DÖDSBODELÄGARE', 20, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    
    const executorInfo = [
      `Personnummer: ${formData.executorPersonalNumber}`,
      `Namn: ${formData.executorName}`,
      `Adress: ${formData.executorAddress}`,
      `Telefon: ${formData.executorPhone}`,
      `E-post: ${formData.executorEmail}`
    ];
    
    executorInfo.forEach(line => {
      doc.text(line, 20, y);
      y += 5;
    });
    y += 5;

    // Avliden
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('AVLIDEN PERSON', 20, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    
    const deceasedInfo = [
      `Personnummer: ${formData.deceasedPersonalNumber}`,
      `Namn: ${formData.deceasedName}`,
      `Adress: ${formData.deceasedAddress}`,
      `Dödsdatum: ${formData.deathDate}`
    ];
    
    deceasedInfo.forEach(line => {
      doc.text(line, 20, y);
      y += 5;
    });
    y += 5;

    // Arvingar
    if (formData.heirs.length > 0) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('ARVINGAR', 20, y);
      y += 8;
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      
      formData.heirs.forEach((heir, index) => {
        doc.text(`Arvinge ${index + 1}:`, 20, y);
        y += 5;
        const heirInfo = [
          `  Personnummer: ${heir.personalNumber}`,
          `  Namn: ${heir.name}`,
          `  Relation: ${heir.relation}`,
          `  Adress: ${heir.address}`,
          `  Telefon: ${heir.phone}`,
          `  E-post: ${heir.email}`,
          `  Arvslott: ${heir.share}%`
        ];
        
        heirInfo.forEach(line => {
          doc.text(line, 20, y);
          y += 4;
        });
        y += 3;
        
        if (y > 250) {
          doc.addPage();
          y = 20;
        }
      });
    }

    // Tillgångar
    if (formData.assets.length > 0) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('TILLGÅNGAR', 20, y);
      y += 8;
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      
      formData.assets.forEach((asset, index) => {
        doc.text(`Tillgång ${index + 1}:`, 20, y);
        y += 5;
        const assetInfo = [
          `  Typ: ${asset.type}`,
          `  Beskrivning: ${asset.description}`,
          `  Värde: ${asset.value} kr`,
          `  Plats/Bank: ${asset.location}`
        ];
        
        assetInfo.forEach(line => {
          doc.text(line, 20, y);
          y += 4;
        });
        y += 3;
        
        if (y > 250) {
          doc.addPage();
          y = 20;
        }
      });
    }

    // Sammanfattning
    y += 10;
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('SAMMANFATTNING', 20, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    
    const summary = [
      `Totalt värde tillgångar: ${totalValue.toLocaleString('sv-SE')} kr`,
      `Summa arvslotter: ${totalShare}%`,
      '',
      'VIKTIGA NÄSTA STEG:',
      '1. Skriv ut detta dokument',
      '2. Alla arvingar ska signera',
      '3. Kontakta varje bank/institution',
      '4. Lämna in dokumenten för genomförande'
    ];
    
    summary.forEach(line => {
      doc.text(line, 20, y);
      y += 5;
    });

    doc.save('arvskifte-baspaket.pdf');
  };
    
    // Convert form data to assets format for BasicDocumentSummary
    const processedAssets = formData.assets.map(asset => ({
      bank: asset.bank || 'Okänd bank',
      accountNumber: asset.accountNumber || 'Okänt kontonummer',
      amount: parseFloat(asset.value) || 0,
      accountType: asset.type || 'Okänd kontotyp'
    }));
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Home className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">DigitalArvskifte</span>
          </Link>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              Baspaket Demo
            </Badge>
            <Link to="/demo-instructions">
              <Button variant="ghost" size="sm">Tillbaka till demos</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Welcome Card */}
          <Card className="border-orange-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-orange-800">Arvskiftesformulär - Baspaket</CardTitle>
              <CardDescription>
                Fyll i alla fält nedan. När du är klar kan du ladda ner ett PDF-dokument som du skriver ut och får signerat.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="border-orange-200 bg-orange-50">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-orange-800">
                  <strong>OBS:</strong> Detta är traditionella processen där du hanterar allt manuellt. 
                  Med Komplett-paketet slipper du utskrifter, signeringar och bankbesök.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Dödsbodelägare */}
          <Card>
            <CardHeader>
              <CardTitle>1. Dödsbodelägare (dig)</CardTitle>
              <CardDescription>Den person som ansvarar för arvskiftet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="executor-pnr">Personnummer *</Label>
                  <Input
                    id="executor-pnr"
                    placeholder="YYYYMMDD-XXXX"
                    value={formData.executorPersonalNumber}
                    onChange={(e) => setFormData({...formData, executorPersonalNumber: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="executor-name">Fullständigt namn *</Label>
                  <Input
                    id="executor-name"
                    placeholder="Förnamn Efternamn"
                    value={formData.executorName}
                    onChange={(e) => setFormData({...formData, executorName: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="executor-address">Adress *</Label>
                <Input
                  id="executor-address"
                  placeholder="Gatunamn 1, 123 45 Stad"
                  value={formData.executorAddress}
                  onChange={(e) => setFormData({...formData, executorAddress: e.target.value})}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="executor-phone">Telefonnummer</Label>
                  <Input
                    id="executor-phone"
                    placeholder="070-123 45 67"
                    value={formData.executorPhone}
                    onChange={(e) => setFormData({...formData, executorPhone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="executor-email">E-postadress</Label>
                  <Input
                    id="executor-email"
                    type="email"
                    placeholder="namn@exempel.se"
                    value={formData.executorEmail}
                    onChange={(e) => setFormData({...formData, executorEmail: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Avliden */}
          <Card>
            <CardHeader>
              <CardTitle>2. Avliden person</CardTitle>
              <CardDescription>Information om personen som gått bort</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deceased-pnr">Personnummer *</Label>
                  <Input
                    id="deceased-pnr"
                    placeholder="YYYYMMDD-XXXX"
                    value={formData.deceasedPersonalNumber}
                    onChange={(e) => setFormData({...formData, deceasedPersonalNumber: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="deceased-name">Fullständigt namn *</Label>
                  <Input
                    id="deceased-name"
                    placeholder="Förnamn Efternamn"
                    value={formData.deceasedName}
                    onChange={(e) => setFormData({...formData, deceasedName: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deceased-address">Senaste adress *</Label>
                  <Input
                    id="deceased-address"
                    placeholder="Gatunamn 1, 123 45 Stad"
                    value={formData.deceasedAddress}
                    onChange={(e) => setFormData({...formData, deceasedAddress: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="death-date">Dödsdatum *</Label>
                  <Input
                    id="death-date"
                    type="date"
                    value={formData.deathDate}
                    onChange={(e) => setFormData({...formData, deathDate: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Arvingar */}
          <Card>
            <CardHeader>
              <CardTitle>3. Arvingar</CardTitle>
              <CardDescription>Lägg till alla personer som ska ärva</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.heirs.map((heir, index) => (
                <Card key={index} className="border-blue-200">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Arvinge {index + 1}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeHeir(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Personnummer *</Label>
                        <Input
                          placeholder="YYYYMMDD-XXXX"
                          value={heir.personalNumber}
                          onChange={(e) => updateHeir(index, 'personalNumber', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Fullständigt namn *</Label>
                        <Input
                          placeholder="Förnamn Efternamn"
                          value={heir.name}
                          onChange={(e) => updateHeir(index, 'name', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Relation till avliden *</Label>
                        <Input
                          placeholder="t.ex. Dotter, Son, Make/Maka"
                          value={heir.relation}
                          onChange={(e) => updateHeir(index, 'relation', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Arvslott (%) *</Label>
                        <Input
                          type="number"
                          placeholder="50"
                          value={heir.share}
                          onChange={(e) => updateHeir(index, 'share', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Adress *</Label>
                      <Input
                        placeholder="Gatunamn 1, 123 45 Stad"
                        value={heir.address}
                        onChange={(e) => updateHeir(index, 'address', e.target.value)}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Telefonnummer</Label>
                        <Input
                          placeholder="070-123 45 67"
                          value={heir.phone}
                          onChange={(e) => updateHeir(index, 'phone', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>E-postadress</Label>
                        <Input
                          type="email"
                          placeholder="namn@exempel.se"
                          value={heir.email}
                          onChange={(e) => updateHeir(index, 'email', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button onClick={addHeir} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Lägg till arvinge
              </Button>
              
              {formData.heirs.length > 0 && (
                <div className="text-sm">
                  Summa arvslotter: <span className={totalShare === 100 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{totalShare}%</span>
                  {totalShare !== 100 && <span className="text-red-600"> (måste vara 100%)</span>}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tillgångar */}
          <Card>
            <CardHeader>
              <CardTitle>4. Tillgångar i dödsboet</CardTitle>
              <CardDescription>Registrera alla tillgångar som ska fördelas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.assets.map((asset, index) => (
                <Card key={index} className="border-green-200">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Tillgång {index + 1}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAsset(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Typ av tillgång *</Label>
                        <Input
                          placeholder="t.ex. Bankkonto, Fastighet, Bil"
                          value={asset.type}
                          onChange={(e) => updateAsset(index, 'type', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Värde (kr) *</Label>
                        <Input
                          type="number"
                          placeholder="100000"
                          value={asset.value}
                          onChange={(e) => updateAsset(index, 'value', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Beskrivning</Label>
                      <Textarea
                        placeholder="Detaljerad beskrivning av tillgången"
                        value={asset.description}
                        onChange={(e) => updateAsset(index, 'description', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Plats/Bank *</Label>
                      <Input
                        placeholder="t.ex. Swedbank Stockholm, Registreringsadress"
                        value={asset.location}
                        onChange={(e) => updateAsset(index, 'location', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button onClick={addAsset} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Lägg till tillgång
              </Button>
              
              {formData.assets.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Calculator className="h-4 w-4" />
                  Totalt värde: <span className="font-semibold">{totalValue.toLocaleString('sv-SE')} kr</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generate PDF */}
          <Card className="border-primary">
            <CardHeader>
              <CardTitle>5. Generera dokument</CardTitle>
              <CardDescription>När du är klar kan du ladda ner PDF-formuläret</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Viktigt att komma ihåg:</strong> Efter nedladdning måste du skriva ut dokumentet, 
                  få alla arvingar att signera och sedan besöka respektive bank för att genomföra arvskiftet.
                </AlertDescription>
              </Alert>
              
              <div className="text-center">
                <Button onClick={generatePDF} size="lg" className="bg-orange-600 hover:bg-orange-700">
                  <Download className="h-4 w-4 mr-2" />
                  Ladda ner PDF-formulär
                </Button>
              </div>
              
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-blue-800 mb-2">Nästa steg efter nedladdning:</h4>
                  <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                    <li>Skriv ut alla sidor</li>
                    <li>Kontrollera att alla uppgifter stämmer</li>
                    <li>Alla arvingar signerar dokumentet</li>
                    <li>Kontakta varje bank/institution där det finns tillgångar</li>
                    <li>Lämna in dokumenten för genomförande</li>
                  </ol>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Upgrade suggestion */}
          <Card className="border-primary bg-primary/5">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Vill du ha det enklare?</h3>
                <p className="text-muted-foreground mb-4">
                  Med vårt Komplett-paket slipper du utskrifter, bankbesök och manuella signeringar
                </p>
                <div className="flex gap-4 justify-center">
                  <Link to="/demo">
                    <Button variant="outline">Testa Komplett Demo</Button>
                  </Link>
                  <Link to="/payment">
                    <Button>Uppgradera till Komplett</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
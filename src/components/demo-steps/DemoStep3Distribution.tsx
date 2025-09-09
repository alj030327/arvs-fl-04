import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Users, Percent, User, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Heir {
  personalNumber: string;
  name: string;
  relationship: string;
  inheritanceShare?: number;
  signed?: boolean;
  signedAt?: string;
  email?: string;
  phone?: string;
}

interface DemoStep3Props {
  heirs: Heir[];
  setHeirs: (heirs: Heir[]) => void;
  totalAmount: number;
  onNext: () => void;
  onBack: () => void;
  t: (key: string) => string;
}

export function Step3Distribution({ 
  heirs, 
  setHeirs, 
  totalAmount, 
  onNext, 
  onBack, 
  t 
}: DemoStep3Props) {
  const [newHeir, setNewHeir] = useState({
    personalNumber: "",
    name: "",
    relationship: "",
    inheritanceShare: 0
  });

  // Pre-fill with demo data
  useEffect(() => {
    if (heirs.length === 0) {
      setHeirs([
        {
          personalNumber: "19801203-5678",
          name: "Anna Andersson",
          relationship: "Dotter",
          inheritanceShare: 50
        },
        {
          personalNumber: "19851115-9012",
          name: "Erik Eriksson",
          relationship: "Son",
          inheritanceShare: 30
        },
        {
          personalNumber: "19900827-3456",
          name: "Maria Gustafsson", 
          relationship: "Syster",
          inheritanceShare: 20
        }
      ]);
    }
  }, [heirs.length, setHeirs]);

  const totalPercentage = heirs.reduce((sum, heir) => sum + (heir.inheritanceShare || 0), 0);
  const isValidDistribution = totalPercentage === 100;

  const addHeir = () => {
    if (newHeir.personalNumber && newHeir.name && newHeir.inheritanceShare > 0) {
      const heir: Heir = {
        personalNumber: newHeir.personalNumber,
        name: newHeir.name,
        relationship: newHeir.relationship,
        inheritanceShare: newHeir.inheritanceShare
      };
      setHeirs([...heirs, heir]);
      setNewHeir({ personalNumber: "", name: "", relationship: "", inheritanceShare: 0 });
    }
  };

  const removeHeir = (personalNumber: string) => {
    setHeirs(heirs.filter(heir => heir.personalNumber !== personalNumber));
  };

  const updateHeirPercentage = (personalNumber: string, inheritanceShare: number) => {
    setHeirs(heirs.map(heir => 
      heir.personalNumber === personalNumber ? { ...heir, inheritanceShare } : heir
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('step3.title')}
          </CardTitle>
          <CardDescription>
            {t('step3.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Demo:</strong> Arvingar är förfyllda med exempeldata för demonstration.
            </p>
          </div>

          {/* Current Heirs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Registrerade arvingar</h3>
            {heirs.map((heir, index) => (
              <div key={heir.personalNumber} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{heir.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {heir.personalNumber} • {heir.relationship}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={heir.inheritanceShare || 0}
                          onChange={(e) => updateHeirPercentage(heir.personalNumber, Number(e.target.value))}
                          className="w-16 text-center"
                          min="0"
                          max="100"
                        />
                        <Percent className="h-4 w-4" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {(((heir.inheritanceShare || 0) / 100) * totalAmount).toLocaleString('sv-SE')} kr
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeHeir(heir.personalNumber)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Heir */}
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold">Lägg till arvinge</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="heirPersonalNumber">Personnummer</Label>
                <Input
                  id="heirPersonalNumber"
                  placeholder="YYYYMMDD-XXXX"
                  value={newHeir.personalNumber}
                  onChange={(e) => setNewHeir({...newHeir, personalNumber: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heirName">Namn</Label>
                <Input
                  id="heirName"
                  placeholder="För- och efternamn"
                  value={newHeir.name}
                  onChange={(e) => setNewHeir({...newHeir, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heirRelationship">Relation</Label>
                <Select
                  value={newHeir.relationship}
                  onValueChange={(value) => setNewHeir({...newHeir, relationship: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Välj relation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Son">Son</SelectItem>
                    <SelectItem value="Dotter">Dotter</SelectItem>
                    <SelectItem value="Make/Maka">Make/Maka</SelectItem>
                    <SelectItem value="Sambo">Sambo</SelectItem>
                    <SelectItem value="Förälder">Förälder</SelectItem>
                    <SelectItem value="Syskon">Syskon</SelectItem>
                    <SelectItem value="Övrigt">Övrigt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="heirPercentage">Andel (%)</Label>
                <Input
                  id="heirPercentage"
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  value={newHeir.inheritanceShare || ""}
                  onChange={(e) => setNewHeir({...newHeir, inheritanceShare: Number(e.target.value)})}
                />
              </div>
            </div>
            <Button 
              onClick={addHeir} 
              disabled={!newHeir.personalNumber || !newHeir.name || !newHeir.relationship || newHeir.inheritanceShare <= 0}
            >
              Lägg till arvinge
            </Button>
          </div>

          {/* Distribution Summary */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Fördelningssammanfattning</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total fördelning:</span>
                <span className={`font-medium ${isValidDistribution ? 'text-green-600' : 'text-red-600'}`}>
                  {totalPercentage}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Totalt belopp att fördela:</span>
                <span className="font-medium">{totalAmount.toLocaleString('sv-SE')} kr</span>
              </div>
            </div>
            
            {!isValidDistribution && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Fördelningen måste summera till exakt 100% för att kunna fortsätta.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t('common.back')}
            </Button>
            <Button 
              onClick={onNext} 
              disabled={!isValidDistribution}
              className="flex items-center gap-2"
            >
              {t('common.next')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
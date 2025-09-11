import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Vault, Diamond, Plus, Trash2, FileText, Coins } from "lucide-react";

export interface SafeDepositBoxItem {
  id: string;
  name: string;
  description: string;
  estimatedValue: number;
  category: string;
  distributionMethod: 'sell' | 'divide' | 'assign';
  assignedTo?: string; // beneficiary id if assigned to specific person
}

interface SafeDepositBoxProps {
  items: SafeDepositBoxItem[];
  setItems: (items: SafeDepositBoxItem[]) => void;
  beneficiaries: Array<{ id: string; name: string }>;
}

export const SafeDepositBox = ({ items, setItems, beneficiaries }: SafeDepositBoxProps) => {
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    estimatedValue: "",
    category: "",
    distributionMethod: "divide" as 'sell' | 'divide' | 'assign',
    assignedTo: ""
  });

  const itemCategories = [
    "Smycken", "Dokument", "Kontanter", "Ädelmetaller", "Aktier/Obligationer", "Minnessaker", "Övrigt"
  ];

  const handleAddItem = () => {
    if (!newItem.name || !newItem.category || !newItem.estimatedValue) {
      return;
    }

    const item: SafeDepositBoxItem = {
      id: Date.now().toString(),
      name: newItem.name,
      description: newItem.description,
      estimatedValue: parseFloat(newItem.estimatedValue),
      category: newItem.category,
      distributionMethod: newItem.distributionMethod,
      assignedTo: newItem.distributionMethod === 'assign' ? newItem.assignedTo : undefined
    };

    setItems([...items, item]);
    setNewItem({
      name: "",
      description: "",
      estimatedValue: "",
      category: "",
      distributionMethod: "divide" as 'sell' | 'divide' | 'assign',
      assignedTo: ""
    });
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateDistributionMethod = (id: string, method: 'sell' | 'divide' | 'assign', assignedTo?: string) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, distributionMethod: method, assignedTo: method === 'assign' ? assignedTo : undefined }
        : item
    ));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Smycken': return <Diamond className="w-4 h-4" />;
      case 'Dokument': return <FileText className="w-4 h-4" />;
      case 'Kontanter': return <Coins className="w-4 h-4" />;
      default: return <Vault className="w-4 h-4" />;
    }
  };

  const getDistributionLabel = (method: string) => {
    switch (method) {
      case 'sell': return 'Sälj och dela';
      case 'divide': return 'Dela mellan arvingar';
      case 'assign': return 'Tilldela specifik person';
      default: return method;
    }
  };

  const totalValue = items.reduce((sum, item) => sum + item.estimatedValue, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Vault className="w-5 h-5" />
          Bankfack och förvaringsboxar
        </CardTitle>
        <CardDescription>
          Registrera innehållet i bankfack och andra säkra förvaringsplatser
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium">Lägg till föremål från bankfack</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="itemName">Namn på föremål</Label>
              <Input
                id="itemName"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="T.ex. Morfars fickur"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <select
                className="w-full p-2 border border-border rounded-md bg-background"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              >
                <option value="">Välj kategori</option>
                {itemCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estimatedValue">Uppskattat värde (SEK)</Label>
              <Input
                id="estimatedValue"
                type="number"
                value={newItem.estimatedValue}
                onChange={(e) => setNewItem({ ...newItem, estimatedValue: e.target.value })}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="distributionMethod">Fördelningsmetod</Label>
              <select
                className="w-full p-2 border border-border rounded-md bg-background"
                value={newItem.distributionMethod}
                onChange={(e) => setNewItem({ ...newItem, distributionMethod: e.target.value as any })}
              >
                <option value="divide">Dela mellan arvingar</option>
                <option value="sell">Sälj och dela värdet</option>
                <option value="assign">Tilldela specifik person</option>
              </select>
            </div>
            
            {newItem.distributionMethod === 'assign' && (
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Tilldela till</Label>
                <select
                  className="w-full p-2 border border-border rounded-md bg-background"
                  value={newItem.assignedTo}
                  onChange={(e) => setNewItem({ ...newItem, assignedTo: e.target.value })}
                >
                  <option value="">Välj dödsbodelägare</option>
                  {beneficiaries.map((beneficiary) => (
                    <option key={beneficiary.id} value={beneficiary.id}>{beneficiary.name}</option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Beskrivning (valfritt)</Label>
              <Textarea
                id="description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Ytterligare detaljer om föremålet..."
                rows={2}
              />
            </div>
          </div>
          
          <Button onClick={handleAddItem} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Lägg till föremål från bankfack
          </Button>
        </div>

        {items.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Registrerade föremål från bankfack</h4>
            
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getCategoryIcon(item.category)}
                        <span className="font-medium">{item.name}</span>
                        <Badge variant="secondary">{item.category}</Badge>
                        <Badge variant="outline">{getDistributionLabel(item.distributionMethod)}</Badge>
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                      )}
                      {item.distributionMethod === 'assign' && item.assignedTo && (
                        <p className="text-sm text-primary">
                          Tilldelas: {beneficiaries.find(b => b.id === item.assignedTo)?.name}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold">
                          {item.estimatedValue.toLocaleString('sv-SE')} SEK
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Uppskattat värde
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs">Fördelningsmetod:</Label>
                      <select
                        className="text-xs border border-border rounded px-2 py-1 bg-background"
                        value={item.distributionMethod}
                        onChange={(e) => updateDistributionMethod(item.id, e.target.value as any)}
                      >
                        <option value="divide">Dela mellan arvingar</option>
                        <option value="sell">Sälj och dela</option>
                        <option value="assign">Tilldela person</option>
                      </select>
                      {item.distributionMethod === 'assign' && (
                        <select
                          className="text-xs border border-border rounded px-2 py-1 bg-background"
                          value={item.assignedTo || ""}
                          onChange={(e) => updateDistributionMethod(item.id, 'assign', e.target.value)}
                        >
                          <option value="">Välj person</option>
                          {beneficiaries.map((beneficiary) => (
                            <option key={beneficiary.id} value={beneficiary.id}>{beneficiary.name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">Totalt värde bankfack:</span>
              <span className="font-bold text-primary">
                {totalValue.toLocaleString('sv-SE')} SEK
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
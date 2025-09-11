import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowLeft, CreditCard, Shield, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Payment() {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'complete'>('complete');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async (plan: 'basic' | 'complete') => {
    setIsLoading(true);
    
    try {
      // Determine package type and amount based on plan
      const packageType = plan === 'basic' ? 'basic' : 'komplett';
      const amount = plan === 'basic' ? 49900 : 249900; // Amount in öre (499kr = 49900 öre, 2499kr = 249900 öre)
      
      // Call the create-payment edge function
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          packageType,
          amount,
          currency: 'sek',
          estateData: {
            // Add any estate data if needed
          },
          userEmail: 'guest@example.com' // For guest checkout, replace with actual user email if authenticated
        }
      });

      if (error) {
        console.error('Payment error:', error);
        toast({
          title: "Betalningsfel",
          description: "Det gick inte att starta betalningen. Försök igen.",
          variant: "destructive"
        });
        return;
      }

      if (data?.url) {
        // Redirect to Stripe checkout
        window.open(data.url, '_blank');
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Betalningsfel",
        description: "Det gick inte att starta betalningen. Försök igen.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-6">Välj ditt paket</h1>
            <p className="text-xl text-muted-foreground">
              Välj det paket som passar ditt arvskifte bäst. Du kan alltid uppgradera senare.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Basic Plan */}
            <Card className={`relative cursor-pointer transition-all ${
              selectedPlan === 'basic' ? 'ring-2 ring-primary' : ''
            }`} onClick={() => setSelectedPlan('basic')}>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">Grundpaket</CardTitle>
                <div className="text-4xl font-bold text-primary mb-2">499 kr</div>
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
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Automatisk dokumentation</span>
                </div>
              </CardContent>
            </Card>

            {/* Complete Plan */}
            <Card className={`relative cursor-pointer transition-all ${
              selectedPlan === 'complete' ? 'ring-2 ring-primary' : ''
            } border-primary shadow-lg`} onClick={() => setSelectedPlan('complete')}>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Populärast</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">Komplett</CardTitle>
                <div className="text-4xl font-bold text-primary mb-2">2 499 kr</div>
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
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Fastighetshantering</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Myndighetsanmälan</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Section */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center gap-2 justify-center">
                <CreditCard className="h-5 w-5" />
                Betala säkert med Stripe
              </CardTitle>
              <CardDescription>
                Du kommer att dirigeras till Stripe för säker betalning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Du har valt:</h3>
                <div className="flex justify-between items-center">
                  <span>{selectedPlan === 'basic' ? 'Grundpaket' : 'Komplett paket'}</span>
                  <span className="font-bold text-primary">
                    {selectedPlan === 'basic' ? '499 kr' : '2 499 kr'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Inklusive moms. Inga dolda kostnader.
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-success" />
                  <span>Säker betalning</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-success" />
                  <span>14 dagar återbetalning</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Ingen bindningstid</span>
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={() => handlePayment(selectedPlan)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Dirigerar till Stripe...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Betala {selectedPlan === 'basic' ? '499 kr' : '2 499 kr'}
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Genom att klicka på "Betala" godkänner du våra{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  användarvillkor
                </Link>{" "}
                och{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  integritetspolicy
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, FileText, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError("Ingen betalningssession hittades");
        setIsVerifying(false);
        return;
      }

      try {
        console.log("Verifying payment for session:", sessionId);
        
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { sessionId }
        });

        if (error) {
          console.error("Error verifying payment:", error);
          setError("Kunde inte verifiera betalningen");
        } else {
          console.log("Payment verification result:", data);
          setPaymentData(data);
        }
      } catch (err) {
        console.error("Payment verification failed:", err);
        setError("Ett fel uppstod vid verifiering av betalningen");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Verifierar betalning...</p>
        </div>
      </div>
    );
  }

  if (error || !paymentData?.success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-red-600">Betalning misslyckades</CardTitle>
            <CardDescription>
              {error || "Ett fel uppstod med betalningen"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <Link to="/demo-baspaket">
                <Button>Försök igen</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { order, amount } = paymentData;
  const amountInKr = Math.round(amount / 100);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Success Header */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Betalning genomförd!</CardTitle>
            <CardDescription>
              Tack för ditt köp av {order.package_type === 'baspaket' ? 'Baspaket' : 'Premium'} för {amountInKr} kr
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Order Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Orderdetaljer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order-ID:</span>
              <span className="font-mono text-sm">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Paket:</span>
              <span className="capitalize">{order.package_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Belopp:</span>
              <span className="font-semibold">{amountInKr} kr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="text-green-600 font-semibold">Betald</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">E-post:</span>
              <span>{order.email}</span>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Nästa steg</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Nu kan du börja fylla i dina egna uppgifter för arvsskiftet. 
                All information från demon är borttagen så du kan börja från början.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Du kommer att få:
              </p>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>En bekräftelse via e-post inom några minuter</li>
                <li>Tillgång till det fullständiga arvsskiftesverktyget</li>
                <li>Hjälp med alla 4 steg i processen</li>
                <li>Genererade dokument redo för signering</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <Link to="/arvsskifte">
            <Button size="lg" className="w-full sm:w-auto">
              <ArrowRight className="w-4 h-4 mr-2" />
              Starta ditt arvsskifte
            </Button>
          </Link>
          
          <div className="text-sm text-muted-foreground">
            Eller gå tillbaka till{" "}
            <Link to="/" className="text-primary hover:underline">
              startsidan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
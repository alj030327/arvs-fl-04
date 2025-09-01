import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, Clock, MapPin, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Contact() {
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
            <h1 className="text-4xl font-bold mb-6">Kontakta oss</h1>
            <p className="text-xl text-muted-foreground">
              Vi hjälper dig gärna med alla frågor om digitala arvskiften.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Skicka ett meddelande</CardTitle>
                <CardDescription>
                  Fyll i formuläret så återkommer vi inom 24 timmar.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Förnamn</Label>
                    <Input id="firstName" placeholder="Anna" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Efternamn</Label>
                    <Input id="lastName" placeholder="Andersson" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">E-postadress</Label>
                  <Input id="email" type="email" placeholder="anna@example.com" />
                </div>
                <div>
                  <Label htmlFor="phone">Telefonnummer (valfritt)</Label>
                  <Input id="phone" type="tel" placeholder="070-123 45 67" />
                </div>
                <div>
                  <Label htmlFor="subject">Ämne</Label>
                  <Input id="subject" placeholder="Fråga om arvskifte" />
                </div>
                <div>
                  <Label htmlFor="message">Meddelande</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Beskriv din fråga eller situation..."
                    rows={5}
                  />
                </div>
                <Button className="w-full">
                  Skicka meddelande
                </Button>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Telefon
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-semibold mb-2">08-123 45 67</p>
                  <p className="text-muted-foreground">
                    Vardagar 09:00-17:00
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    E-post
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-semibold mb-2">info@digitalarvskifte.se</p>
                  <p className="text-muted-foreground">
                    Vi svarar inom 24 timmar
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Öppettider
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Måndag - Fredag</span>
                      <span>09:00 - 17:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lördag - Söndag</span>
                      <span>Stängt</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Besöksadress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold mb-2">DigitalArvskifte AB</p>
                  <p className="text-muted-foreground">
                    Storgatan 123<br />
                    111 22 Stockholm<br />
                    Sverige
                  </p>
                </CardContent>
              </Card>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                <h3 className="font-semibold mb-2 text-primary">Akut juridisk hjälp</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Behöver du omedelbar juridisk rådgivning? Ring vår akutlinje.
                </p>
                <Button variant="outline" className="w-full">
                  Ring akutlinje: 08-123 45 99
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function FAQ() {
  const faqs = [
    {
      question: "Är digitala arvskiften juridiskt giltiga?",
      answer: "Ja, alla dokument som genereras genom vår plattform uppfyller svenska juridiska krav. Signeringen med BankID ger samma juridiska kraft som en handskriven signatur."
    },
    {
      question: "Hur säker är BankID-signeringen?",
      answer: "BankID är Sveriges säkraste digitala identitetslösning, godkänd av finansinspektionen. Alla signeringar är krypterade och spårbara."
    },
    {
      question: "Vad händer om en arvinge bor utomlands?",
      answer: "Arvingar som bor utomlands kan delta fullt ut i processen. De behöver bara svenskt BankID för att signera dokumenten digitalt."
    },
    {
      question: "Vilka typer av tillgångar kan hanteras?",
      answer: "Vi kan hantera alla typer av tillgångar: bankkonton, aktier, fonder, fastigheter, bilar, konst och andra värdesaker. Vårt system integreras med banker och myndigheter för automatisk värdering."
    },
    {
      question: "Hur lång tid tar processen?",
      answer: "Själva ifyllandet och signeringen tar ca 30 minuter. Efter att alla parter signerat skickas dokumenten automatiskt till berörda myndigheter och banker."
    },
    {
      question: "Vad kostar det jämfört med traditionella arvskiften?",
      answer: "Våra priser startar på 2 995 kr för grundpaketet. Traditionella arvskiften genom advokat kostar oftast 15 000-50 000 kr beroende på komplexitet."
    },
    {
      question: "Kan jag avbryta processen?",
      answer: "Ja, du kan avbryta när som helst innan den slutliga signeringen. Vi återbetalar hela beloppet om du avbryter inom 14 dagar."
    },
    {
      question: "Vad händer om vi inte kommer överens?",
      answer: "Vi erbjuder medling genom våra juridiska experter. I komplexa fall kan vi också rekommendera traditionell juridisk rådgivning."
    },
    {
      question: "Hur skyddas mina personuppgifter?",
      answer: "All data krypteras och lagras enligt GDPR. Vi delar aldrig information med tredje part utan ditt uttryckliga medgivande."
    },
    {
      question: "Får jag hjälp om jag fastnar?",
      answer: "Ja, vi erbjuder support via telefon, e-post och chat under hela processen. Våra jurister kan också svara på specifika juridiska frågor."
    }
  ];

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
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-6">Vanliga frågor</h1>
            <p className="text-xl text-muted-foreground">
              Här hittar du svar på de mest vanliga frågorna om digitala arvskiften.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-16 text-center bg-muted/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Har du fler frågor?</h2>
            <p className="text-muted-foreground mb-6">
              Kontakta oss så hjälper vi dig gärna.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Kontakta oss
                </Button>
              </Link>
              <Link to="/demo">
                <Button size="lg" className="w-full sm:w-auto">
                  Se demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
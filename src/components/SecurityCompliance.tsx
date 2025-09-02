import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, FileText, Eye, CheckCircle, AlertTriangle } from "lucide-react";

export const SecurityCompliance = () => {
  return (
    <div className="space-y-8">
      {/* Security Overview */}
      <Card className="border-success/20 bg-success/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-success" />
            <div>
              <CardTitle className="text-2xl">Säkerhet & Efterlevnad</CardTitle>
              <CardDescription>Enterprise-grade säkerhet som överträffar bankstandarder</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-2">99.99%</div>
              <p className="text-sm text-muted-foreground">Säkerhetsupptid</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-2">AES-256</div>
              <p className="text-sm text-muted-foreground">Krypteringsstandardard</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-2">0</div>
              <p className="text-sm text-muted-foreground">Säkerhetsincidenter</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Certifications */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "ISO 27001",
            description: "Informationssäkerhet",
            status: "Certifierad",
            icon: Shield,
            color: "success"
          },
          {
            title: "GDPR",
            description: "Dataskydd",
            status: "Fullständig efterlevnad",
            icon: Lock,
            color: "success"
          },
          {
            title: "SOC 2 Type II",
            description: "Säkerhetskontroller",
            status: "Auditerad",
            icon: FileText,
            color: "success"
          },
          {
            title: "PCI DSS",
            description: "Betalningssäkerhet",
            status: "Certifierad",
            icon: CheckCircle,
            color: "success"
          }
        ].map((cert, index) => (
          <Card key={index} className="text-center">
            <CardHeader>
              <cert.icon className={`h-12 w-12 mx-auto mb-4 text-${cert.color}`} />
              <CardTitle className="text-lg">{cert.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-3">{cert.description}</CardDescription>
              <Badge variant="secondary" className={`bg-${cert.color}/10 text-${cert.color}`}>
                {cert.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Features */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Teknisk Säkerhet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm">End-to-end kryptering (AES-256)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm">Multi-factor autentisering (MFA)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm">Zero-trust arkitektur</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm">Kontinuerlig säkerhetsövervakning</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm">Automatisk hotdetektering</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm">Penetrationstestning kvartalsvis</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Datahantering & Integritet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm">GDPR-kompatibel dataminimering</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm">Krypterad datalagring i Sverige</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm">Automatisk dataradering</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm">Fullständig audit-trail</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm">Rätt att bli glömd (GDPR)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm">Dataportabilitet</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Riskbedömning & Mitigation
          </CardTitle>
          <CardDescription>
            Kontinuerlig övervakning och riskhantering för att säkerställa högsta säkerhetsnivå
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-success mb-2">Låg</div>
              <p className="text-sm text-muted-foreground">Cybersäkerhetsrisk</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-success mb-2">Minimal</div>
              <p className="text-sm text-muted-foreground">Dataläckagerisk</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-success mb-2">Ingen</div>
              <p className="text-sm text-muted-foreground">Regelbrott (12 månader)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
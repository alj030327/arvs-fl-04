import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface DemoStep1Props {
  personalNumber: string;
  setPersonalNumber: (value: string) => void;
  onNext: () => void;
  t: (key: string) => string;
}

export function Step1PersonalNumber({ personalNumber, setPersonalNumber, onNext, t }: DemoStep1Props) {
  // Pre-fill with demo data
  useState(() => {
    if (!personalNumber) {
      setPersonalNumber("19501215-1234");
    }
  });

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {t('step1.title')}
        </CardTitle>
        <CardDescription className="text-center">
          {t('step1.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="personalNumber" className="text-sm font-medium">
            {t('step1.personalNumber')}
          </Label>
          <Input
            id="personalNumber"
            type="text"
            placeholder="YYYYMMDD-XXXX"
            value={personalNumber}
            onChange={(e) => setPersonalNumber(e.target.value)}
            className="text-lg"
          />
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Demo:</strong> Detta är förfyllt med exempeldata för demonstration.
          </p>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={onNext}
            disabled={!personalNumber}
            className="flex items-center gap-2"
          >
            {t('common.next')}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Utilities to generate random Swedish-like demo data
const swedishNames = {
  first: [
    'Anna', 'Emma', 'Maja', 'Alice', 'Julia', 'Linnea', 'Alva', 'Astrid', 'Elsa', 'Wilma',
    'Liam', 'Noah', 'William', 'Lucas', 'Oliver', 'Hugo', 'Adam', 'Elias', 'Leo', 'Alexander'
  ],
  last: [
    'Andersson', 'Johansson', 'Karlsson', 'Nilsson', 'Eriksson', 'Larsson', 'Olsson', 'Persson', 
    'Svensson', 'Gustafsson', 'Pettersson', 'Jonsson', 'Jansson', 'Hansson', 'Bengtsson'
  ]
};

const banks = ['Handelsbanken', 'SEB', 'Swedbank', 'Nordea', 'Länsförsäkringar', 'SBAB', 'ICA Banken'];

const accountTypes: Record<string, string[]> = {
  'Handelsbanken': ['Lönekonto', 'Sparkonto', 'ISK', 'Pensionssparkonto', 'Kapitalförsäkring'],
  'SEB': ['Privatgiro', 'Sparkonto Plus', 'ISK', 'IPS', 'Fondkonto'],
  'Swedbank': ['Lönekonto', 'Sparkonto', 'ISK', 'Pensionssparkonto', 'Värdepapperskonto'],
  'Nordea': ['Pluskonto', 'Sparkonto', 'ISK', 'Pensionssparkonto', 'Investeringssparkonto'],
  'Länsförsäkringar': ['Lönekonto', 'Sparkonto', 'ISK', 'Bank- och försäkringspaket'],
  'SBAB': ['Sparkonto', 'ISK', 'Bolånekonto'],
  'ICA Banken': ['Buffert & Lön', 'Sparkonto', 'ISK']
};

const assetTypes = {
  savings: ['Bankinsättning', 'Sparkonto', 'Terminsinsättning'],
  investments: ['Aktier', 'Fonder', 'Obligationer', 'Värdepapper'],
  debt: ['Bolån', 'Privatlån', 'Kreditkort', 'Blancolån']
};

const relationships = ['Maka/Make', 'Barn', 'Dotter', 'Son', 'Syskon', 'Förälder', 'Sambo'];

function randomBirthYear(minAge: number, maxAge: number): number {
  const currentYear = new Date().getFullYear();
  const age = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;
  return currentYear - age;
}

function generatePersonalNumber(birthYear: number): string {
  const shortYear = birthYear.toString().slice(-2);
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  const lastFour = Math.floor(Math.random() * 9000) + 1000;
  return `${shortYear}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}${lastFour}`;
}

function generateAccountNumber(): string {
  const part1 = Math.floor(Math.random() * 9000) + 1000;
  const part2 = Math.floor(Math.random() * 900) + 100;
  const part3 = Math.floor(Math.random() * 900) + 100;
  return `${part1} ${part2} ${part3}`;
}

function generateEmail(firstName: string, lastName: string): string {
  const domains = ['gmail.com', 'hotmail.com', 'outlook.com', 'email.com', 'yahoo.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
}

function generatePhone(): string {
  const prefix = '070';
  const number = Math.floor(Math.random() * 9000000) + 1000000;
  const numStr = number.toString();
  return `${prefix}-${numStr.slice(0, 3)} ${numStr.slice(3, 5)} ${numStr.slice(5)}`;
}

function generateRandomDemoData() {
  const deceasedFirstName = swedishNames.first[Math.floor(Math.random() * swedishNames.first.length)];
  const deceasedLastName = swedishNames.last[Math.floor(Math.random() * swedishNames.last.length)];
  const deceasedBirthYear = randomBirthYear(60, 90);
  const deceasedPersonalNumber = generatePersonalNumber(deceasedBirthYear);

  const heirCount = Math.floor(Math.random() * 3) + 2; // 2-4
  const heirs: any[] = [];

  for (let i = 0; i < heirCount; i++) {
    const firstName = swedishNames.first[Math.floor(Math.random() * swedishNames.first.length)];
    const lastName = i === 0 ? deceasedLastName : swedishNames.last[Math.floor(Math.random() * swedishNames.last.length)];
    const birthYear = randomBirthYear(25, 65);

    heirs.push({
      personalNumber: generatePersonalNumber(birthYear),
      name: `${firstName} ${lastName}`,
      relationship: relationships[Math.floor(Math.random() * relationships.length)],
      inheritanceShare: Math.floor(100 / heirCount),
      email: generateEmail(firstName, lastName),
      phone: generatePhone()
    });
  }

  const remainder = 100 - heirs.reduce((sum, heir) => sum + (heir.inheritanceShare || 0), 0);
  if (remainder > 0 && heirs.length > 0) {
    heirs[0].inheritanceShare = (heirs[0].inheritanceShare || 0) + remainder;
  }

  const assetCount = Math.floor(Math.random() * 4) + 2; // 2-5
  const assets: any[] = [];

  for (let i = 0; i < assetCount; i++) {
    const bank = banks[Math.floor(Math.random() * banks.length)];
    const availableAccountTypes = accountTypes[bank] || ['Konto'];
    const accountType = availableAccountTypes[Math.floor(Math.random() * availableAccountTypes.length)];

    let assetType: string;
    let amount: number;

    if (i === assetCount - 1 && !assets.some((a) => assetTypes.debt.includes(a.assetType))) {
      assetType = assetTypes.debt[Math.floor(Math.random() * assetTypes.debt.length)];
      amount = Math.floor(Math.random() * 2000000) + 500000; // 500k - 2.5M debt
    } else {
      const nonDebtCategories = ['savings', 'investments'] as const;
      const cat = nonDebtCategories[Math.floor(Math.random() * nonDebtCategories.length)];
      assetType = (assetTypes as any)[cat][Math.floor(Math.random() * (assetTypes as any)[cat].length)];
      amount = cat === 'savings'
        ? Math.floor(Math.random() * 500000) + 50000 // 50k - 550k
        : Math.floor(Math.random() * 1000000) + 100000; // 100k - 1.1M
    }

    assets.push({
      id: (i + 1).toString(),
      bank,
      accountType,
      assetType,
      accountNumber: generateAccountNumber(),
      amount
    });
  }

  const beneficiaries = heirs.map((heir, index) => ({
    id: (index + 1).toString(),
    name: heir.name,
    personalNumber: heir.personalNumber,
    relationship: heir.relationship,
    percentage: heir.inheritanceShare,
    accountNumber: generateAccountNumber(),
    email: heir.email,
    phone: heir.phone
  }));

  return {
    personalNumber: deceasedPersonalNumber,
    deceasedName: `${deceasedFirstName} ${deceasedLastName}`,
    heirs,
    assets,
    beneficiaries,
    steps: [
      'Step1PersonalNumber',
      'Step2Assets',
      'Step3Distribution',
      'Step4ContactInfo'
    ]
  };
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Force randomization on each call; body is optional if we want options later
    const demo = generateRandomDemoData();

    return new Response(
      JSON.stringify({ success: true, data: demo }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (e: any) {
    console.error('demo-flow error', e);
    return new Response(
      JSON.stringify({ success: false, error: e?.message || 'Unknown error' }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
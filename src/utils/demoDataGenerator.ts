// Demo data generator for randomized inheritance case data

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

const accountTypes = {
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

export function generateRandomDemoData() {
  // Generate deceased person
  const deceasedFirstName = swedishNames.first[Math.floor(Math.random() * swedishNames.first.length)];
  const deceasedLastName = swedishNames.last[Math.floor(Math.random() * swedishNames.last.length)];
  const deceasedBirthYear = randomBirthYear(60, 90);
  const deceasedPersonalNumber = generatePersonalNumber(deceasedBirthYear);

  // Generate 2-4 heirs
  const heirCount = Math.floor(Math.random() * 3) + 2;
  const heirs = [];
  
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

  // Adjust inheritance shares to total 100%
  const remainder = 100 - heirs.reduce((sum, heir) => sum + heir.inheritanceShare, 0);
  if (remainder > 0) {
    heirs[0].inheritanceShare += remainder;
  }

  // Generate 2-5 assets
  const assetCount = Math.floor(Math.random() * 4) + 2;
  const assets = [];
  
  for (let i = 0; i < assetCount; i++) {
    const bank = banks[Math.floor(Math.random() * banks.length)];
    const availableAccountTypes = accountTypes[bank];
    const accountType = availableAccountTypes[Math.floor(Math.random() * availableAccountTypes.length)];
    
    let assetType: string;
    let amount: number;
    
    if (i === assetCount - 1 && !assets.some(a => assetTypes.debt.includes(a.assetType))) {
      // Ensure at least one debt
      assetType = assetTypes.debt[Math.floor(Math.random() * assetTypes.debt.length)];
      amount = Math.floor(Math.random() * 2000000) + 500000; // 500k - 2.5M for debt
    } else {
      const assetTypeCategory = Object.keys(assetTypes)[Math.floor(Math.random() * (Object.keys(assetTypes).length - 1))]; // Exclude debt for now
      assetType = (assetTypes as any)[assetTypeCategory][Math.floor(Math.random() * (assetTypes as any)[assetTypeCategory].length)];
      
      if (assetTypeCategory === 'savings') {
        amount = Math.floor(Math.random() * 500000) + 50000; // 50k - 550k
      } else {
        amount = Math.floor(Math.random() * 1000000) + 100000; // 100k - 1.1M
      }
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

  // Generate beneficiaries (same as heirs for demo)
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
    beneficiaries
  };
}
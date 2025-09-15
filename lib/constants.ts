export const CAR_BRANDS = [
  'Audi', 'BMW', 'Mercedes-Benz', 'Toyota', 'Volkswagen', 'Volvo', 'Škoda', 'Ford', 'Opel', 'Renault'
];

export const CAR_MODELS: Record<string, string[]> = {
  'Audi': ['A3', 'A4', 'A6', 'A8', 'Q3', 'Q5', 'Q7', 'TT', 'RS6'],
  'BMW': ['X1', 'X3', 'X5', 'X7', '3 Series', '5 Series', '7 Series', 'M3', 'M5'],
  'Mercedes-Benz': ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'GLA', 'GLC', 'GLE', 'AMG GT'],
  'Toyota': ['Corolla', 'Camry', 'RAV4', 'Highlander', 'Prius', 'Land Cruiser'],
  'Volkswagen': ['Golf', 'Passat', 'Tiguan', 'Touareg', 'Polo', 'Arteon'],
  'Volvo': ['XC40', 'XC60', 'XC90', 'S60', 'S90', 'V60', 'V90'],
  'Škoda': ['Fabia', 'Octavia', 'Superb', 'Kodiaq', 'Karoq', 'Kamiq'],
  'Ford': ['Focus', 'Fiesta', 'Kuga', 'Edge', 'Mondeo', 'Mustang'],
  'Opel': ['Astra', 'Insignia', 'Corsa', 'Crossland', 'Grandland'],
  'Renault': ['Clio', 'Megane', 'Kadjar', 'Koleos', 'Talisman']
};

export const FUEL_TYPES = [
  { value: 'gasoline', label: 'Benzyna' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'hybrid', label: 'Hybryda' },
  { value: 'electric', label: 'Elektryczny' },
  { value: 'lpg', label: 'LPG' }
];

export const TRANSMISSIONS = [
  { value: 'manual', label: 'Manualna' },
  { value: 'automatic', label: 'Automatyczna' }
];

export const BODY_TYPES = [
  { value: 'sedan', label: 'Sedan' },
  { value: 'estate', label: 'Kombi' },
  { value: 'suv', label: 'SUV' },
  { value: 'coupe', label: 'Coupe' },
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'convertible', label: 'Cabrio' }
];

export const DRIVETRAINS = [
  { value: 'fwd', label: 'Na przód' },
  { value: 'rwd', label: 'Na tył' },
  { value: 'awd', label: 'Na 4 koła' }
];

export const CAR_COLORS = [
  'Czarny', 'Biały', 'Srebrny', 'Szary', 'Niebieski', 'Czerwony', 'Zielony', 'Żółty', 'Brązowy', 'Inne'
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Najnowsze' },
  { value: 'price-asc', label: 'Cena: od najniższej' },
  { value: 'price-desc', label: 'Cena: od najwyższej' },
  { value: 'year-asc', label: 'Rok: od najstarszych' },
  { value: 'year-desc', label: 'Rok: od najnowszych' },
  { value: 'mileage-asc', label: 'Przebieg: od najmniejszego' },
  { value: 'mileage-desc', label: 'Przebieg: od największego' }
];
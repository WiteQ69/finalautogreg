// lib/schemas.ts
import { z } from 'zod';

// ----- Słowniki jako const-tuples -----
export const FUEL_TYPES = [
  'BENZYNA',
  'diesel',
  'benzyna_lpg',
  'hybryda',
  'elektryczny',
] as const;

export const TRANSMISSIONS = ['manualna', 'automatyczna'] as const;

export const DRIVETRAINS = ['przód', 'tył', '4x4'] as const;

export const BODY_TYPES = [
  'hatchback',
  'sedan',
  'kombi',
  'suv',
  'crossover',
  'coupe',
  'kabriolet',
  'van',
  'dostawczy',
] as const;

export const CONDITIONS = ['bezwypadkowy', 'nieuszkodzony'] as const;

export const ORIGINS = [
  'EU',
  'Salon Polska',
  'Niemcy',
  'Belgia',
  'Holandia',
  'Włochy',
  'Austria',
  'Norwegia',
  'Szwecja',
  'Szwajcaria',
  'Francja',
  'Polska',
] as const;

// <-- Dodałeś "NIE" tutaj
export const REGISTERED_IN = ['PL', 'EU', 'NIE'] as const;

export const SALE_DOCS = ['umowa', 'vat_marza', 'vat23'] as const;

// ----- Lista wyposażenia -----
export const EQUIPMENT_LIST = [
  { key: 'abs', label: 'ABS' },
  { key: 'esp', label: 'ESP' },
  { key: 'asr', label: 'ASR' },
  { key: 'climate_auto', label: 'Klimatyzacja automatyczna' },
  { key: 'climate_manual', label: 'Klimatyzacja manualna' },
  { key: 'parking_sensors', label: 'Czujniki parkowania' },
  { key: 'rear_camera', label: 'Kamera cofania' },
  { key: 'nav', label: 'Nawigacja' },
  { key: 'led', label: 'Światła LED' },
  { key: 'xenon', label: 'Światła ksenonowe' },
  { key: 'alloy_wheels', label: 'Alufelgi' },
  { key: 'heated_seats', label: 'Podgrzewane fotele' },
  { key: 'heated_wheel', label: 'Podgrzewana kierownica' },
  { key: 'apple_carplay', label: 'Apple CarPlay' },
  { key: 'android_auto', label: 'Android Auto' },
  { key: 'cruise', label: 'Tempomat' },
  { key: 'adaptive_cruise', label: 'Tempomat aktywny' },
  { key: 'blind_spot', label: 'Monitoring martwego pola' },
  { key: 'lane_assist', label: 'Asystent pasa ruchu' },
  { key: 'keyless', label: 'Bezkluczykowy dostęp' },
  { key: 'start_stop', label: 'Start/Stop' },
  { key: 'el_windows', label: 'Elektryczne szyby' },
  { key: 'el_mirrors', label: 'Elektryczne lusterka' },
  { key: 'multisteering', label: 'Multikierownica' },
  { key: 'isofix', label: 'Isofix' },
  { key: 'fog', label: 'Halogeny' },
  { key: 'roof_rails', label: 'Relingi dachowe' },
  { key: 'towbar', label: 'Hak' },
  { key: 'sunroof', label: 'Szyberdach' },
  { key: 'leather', label: 'Skórzana tapicerka' },
  { key: 'camera360', label: 'Kamera 360°' },
];

// ----- Schemat formularza -----
export const carFormSchema = z.object({
  title: z.string().min(2, 'Podaj tytuł'),
  brand: z.string().min(1, 'Wybierz markę').optional(),
  model: z.string().min(1, 'Wybierz model').optional(),
  year: z.number().int().min(1950).max(2050),
  mileage: z.number().int().min(0),
  engine: z.string().min(1, 'Podaj opis silnika'),

  price: z.number().int().positive().optional(),
  engineCapacityCcm: z.number().int().positive().optional(),
  powerKw: z.number().int().positive().optional(),
  power: z.number().int().positive().optional(),
  displacement: z.number().int().positive().optional(),

  fuelType: z.enum(FUEL_TYPES).optional(),
  transmission: z.enum(TRANSMISSIONS).optional(),
  drivetrain: z.enum(DRIVETRAINS).optional(),
  bodyType: z.enum(BODY_TYPES).optional(),
  color: z.string().optional(),
  doors: z.number().int().min(2).max(6).optional(),
  seats: z.number().int().min(2).max(9).optional(),
  condition: z.enum(CONDITIONS).optional(),
  origin: z.enum(ORIGINS).optional(),
  registeredIn: z.enum(REGISTERED_IN).optional(),
  saleDocument: z.enum(SALE_DOCS).optional(),

  price_text: z.string().optional(),
  firstOwner: z.boolean().optional(),

  description: z.string().max(5000).optional(),

  vin: z.string().optional(),
  location: z.string().optional(),
  owners: z.number().int().min(1).optional(),
  accidentFree: z.boolean().optional(),
  serviceHistory: z.boolean().optional(),
  status: z.enum(['active', 'sold', 'draft']).optional(),

  equipment: z.array(z.string()).optional(),
});

export type CarFormData = z.infer<typeof carFormSchema>;

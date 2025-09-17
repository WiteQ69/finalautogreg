// types/car.ts
export type FuelType =
  | 'benzyna'
  | 'diesel'
  | 'benzyna_lpg'
  | 'hybryda'
  | 'elektryczny';

export type Transmission = 'manualna' | 'automatyczna';
export type Drivetrain = 'przód' | 'tył' | '4x4';
export type BodyType =
  | 'hatchback'
  | 'sedan'
  | 'kombi'
  | 'suv'
  | 'crossover'
  | 'coupe'
  | 'kabriolet'
  | 'van'
  | 'dostawczy';

export type Condition = 'bezwypadkowy' | 'nieuszkodzony';
export type Origin =
  | 'EU'
  | 'Salon Polska'
  | 'Niemcy'
  | 'Belgia'
  | 'Holandia'
  | 'Włochy'
  | 'Austria'
  | 'Norwegia'
  | 'Szwecja'
  | 'Szwajcaria'
  | 'Polska'
  | 'Francja';

export type RegisteredIn = 'PL' | 'EU' | 'NIE';
export type SaleDocument = 'umowa' | 'vat_marza' | 'vat23';

export type Car = {
  id: string;
  // podstawowe
  title: string;
  brand?: string;
  model?: string;
  year: number;
  mileage: number;
  engine: string; // np. "2.0 TDI 190 KM" (zostawiamy dla opisu)
  // nowe parametry techniczne
  engineCapacityCcm?: number; // ccm
  powerKw?: number; // kW
    description?: string | null;

  fuelType?: FuelType;
  transmission?: Transmission;
  drivetrain?: Drivetrain;
  bodyType?: BodyType;
  color?: string;
  doors?: number;
  seats?: number;
  condition?: Condition;
  origin?: Origin;
  registeredIn?: RegisteredIn;
  saleDocument?: SaleDocument;
   sold_badge?: boolean | null;
   

  // sprzedaż / status / cena
  price_text?: string;
  price?: number;
  status: 'active' | 'sold' | 'draft';
  firstOwner?: boolean;
  
  // dodatkowe pola
  vin?: string;
  location?: string;
  owners?: number;
  accidentFree?: boolean;
  serviceHistory?: boolean;
  power?: number;
  displacement?: number;
  views?: number;
  favorites?: number;

  // media
  main_image_path?: string;
  images?: string[];
  video_url?: string;

  // opis i daty
 
  createdAt?: string;
  updatedAt?: string;

  // wyposażenie
  equipment?: string[]; // np. ['abs','esp','podgrzewane_fotele',...]
};

export interface FilterCriteria {
  searchQuery?: string;
  // podstawowe
  brand?: string;
  model?: string;
  yearFrom?: number;
  yearTo?: number;

  // ceny i przebieg
  priceFrom?: number;
  priceTo?: number;
  mileageFrom?: number;
  mileageTo?: number;

  // specyfikacje
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  drivetrain?: string;

  // moc
  powerFrom?: number;
  powerTo?: number;

  // inne
  color?: string;
  owners?: number;
  accidentFree?: boolean;
  serviceHistory?: boolean;

  // status
  status?: 'active' | 'sold' | 'draft';
}

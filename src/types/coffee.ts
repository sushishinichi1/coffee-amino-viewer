export type CoffeeBeanApiItem = {
  id: string;
  roaster: string | null;
  name: string;
  origin: string | null;
  region: string | null;
  producer: string | null;
  variety: string | null;
  process: string | null;
  degree: string | null;
  tasting: string[];
  elevation: string | null;
  minElev: number | null;
  maxElev: number | null;
};

export type CoffeeSearchParams = {
  search?: string;
  origin?: string;
  variety?: string;
  process?: string;
  degree?: string;
  limit?: number;
};

export type LoffeeBeansResponse = {
  beans: CoffeeBeanApiItem[];
  cached?: boolean;
  error?: string;
  details?: {
    endpoint?: string | null;
    status?: number | null;
    statusText?: string | null;
    responseBody?: string | null;
    causeMessage?: string | null;
  };
};

export type RoastReaction = {
  aminoAcidsRemaining: number;
  maillardProducts: number;
  acidity: number;
  sweetness: number;
  bitterness: number;
  aromaIntensity: number;
  body: number;
};

import { AGTableModelType, Category, ModelType, Product } from "../types";

class ModelCache {
  private data: Record<ModelType, AGTableModelType[]> = {} as any;

  get(model: ModelType): AGTableModelType[] | undefined {
    return this.data[model];
  }

  set(model: ModelType, rows: AGTableModelType[]): void {
    this.data[model] = rows;
  }
}

export const modelCache = new ModelCache();

type CacheData = {
  products: Product[];
  categories: Category[];
};

class MemoryCache {
  private data: CacheData = { products: [], categories: [] };
  private lastFetched = 0;
  private inFlight: Promise<CacheData> | null = null;

  readonly CACHE_DURATION = 10 * 60 * 1000;

  get(): CacheData {
    return this.data;
  }

  set(data: CacheData) {
    this.data = data;
    this.lastFetched = Date.now();
  }

  isFresh(): boolean {
    return Date.now() - this.lastFetched < this.CACHE_DURATION;
  }

  getInFlight(): Promise<CacheData> | null {
    return this.inFlight;
  }

  setInFlight(promise: Promise<CacheData> | null) {
    this.inFlight = promise;
  }
}

export const cache = new MemoryCache();

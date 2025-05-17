import { D1Database } from '@cloudflare/workers-types';

export interface Comic {
  id: number;
  title: string;
  issue_number: number;
  series: string;
  publisher: string;
  year: number;
  description?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Price {
  id: number;
  comic_id: number;
  price: number;
  source: string;
  url?: string;
  condition?: string;
  date_checked: string;
}

export interface LowestPrice {
  id: number;
  comic_id: number;
  current_price: number;
  previous_price?: number;
  source: string;
  url?: string;
  condition?: string;
  date_updated: string;
  previous_price_date?: string;
  current_price_date: string;
}

export class ComicRepository {
  constructor(private db: D1Database) {}

  async getAllComics(): Promise<Comic[]> {
    const { results } = await this.db.prepare('SELECT * FROM comics ORDER BY series, issue_number').all();
    return results as Comic[];
  }

  async getComicById(id: number): Promise<Comic | null> {
    const result = await this.db.prepare('SELECT * FROM comics WHERE id = ?').bind(id).first();
    return result as Comic | null;
  }

  async addComic(comic: Omit<Comic, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    const { title, issue_number, series, publisher, year, description, image_url } = comic;
    
    const result = await this.db.prepare(
      'INSERT INTO comics (title, issue_number, series, publisher, year, description, image_url) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id'
    ).bind(title, issue_number, series, publisher, year, description, image_url).first<{ id: number }>();
    
    return result?.id || 0;
  }
}

export class PriceRepository {
  constructor(private db: D1Database) {}

  async getPricesForComic(comicId: number): Promise<Price[]> {
    const { results } = await this.db.prepare('SELECT * FROM prices WHERE comic_id = ? ORDER BY date_checked DESC').bind(comicId).all();
    return results as Price[];
  }

  async addPrice(price: Omit<Price, 'id' | 'date_checked'>): Promise<number> {
    const { comic_id, price: priceValue, source, url, condition } = price;
    
    const result = await this.db.prepare(
      'INSERT INTO prices (comic_id, price, source, url, condition) VALUES (?, ?, ?, ?, ?) RETURNING id'
    ).bind(comic_id, priceValue, source, url, condition).first<{ id: number }>();
    
    return result?.id || 0;
  }
}

export class LowestPriceRepository {
  constructor(private db: D1Database) {}

  async getLowestPricesForAllComics(): Promise<LowestPrice[]> {
    const { results } = await this.db.prepare(`
      SELECT lp.*, c.title, c.issue_number, c.series 
      FROM lowest_prices lp
      JOIN comics c ON lp.comic_id = c.id
      ORDER BY c.series, c.issue_number
    `).all();
    return results as LowestPrice[];
  }

  async getLowestPriceForComic(comicId: number): Promise<LowestPrice | null> {
    const result = await this.db.prepare('SELECT * FROM lowest_prices WHERE comic_id = ?').bind(comicId).first();
    return result as LowestPrice | null;
  }

  async updateLowestPrice(lowestPrice: Omit<LowestPrice, 'id' | 'date_updated'>): Promise<void> {
    const { 
      comic_id, 
      current_price, 
      previous_price, 
      source, 
      url, 
      condition, 
      previous_price_date,
      current_price_date
    } = lowestPrice;
    
    // Check if a record already exists for this comic
    const existingRecord = await this.getLowestPriceForComic(comic_id);
    
    if (existingRecord) {
      // Update existing record
      await this.db.prepare(`
        UPDATE lowest_prices 
        SET previous_price = ?, 
            current_price = ?, 
            source = ?, 
            url = ?, 
            condition = ?, 
            previous_price_date = ?,
            current_price_date = ?,
            date_updated = CURRENT_TIMESTAMP 
        WHERE comic_id = ?
      `).bind(
        existingRecord.current_price, 
        current_price, 
        source, 
        url, 
        condition, 
        existingRecord.current_price_date,
        current_price_date || 'CURRENT_TIMESTAMP',
        comic_id
      ).run();
    } else {
      // Insert new record
      await this.db.prepare(`
        INSERT INTO lowest_prices (
          comic_id, 
          current_price, 
          previous_price, 
          source, 
          url, 
          condition,
          previous_price_date,
          current_price_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        comic_id, 
        current_price, 
        previous_price, 
        source, 
        url, 
        condition,
        previous_price_date,
        current_price_date || 'CURRENT_TIMESTAMP'
      ).run();
    }
  }
}

export function getRepositories(db: D1Database) {
  return {
    comics: new ComicRepository(db),
    prices: new PriceRepository(db),
    lowestPrices: new LowestPriceRepository(db)
  };
}

import { IRepository } from '../interfaces/IRepository';
import { BaseEntity } from '../models/BaseEntity';

/**
 * CsvRepository — Abstract Generic Repository backed by localStorage CSV
 * 
 * DESIGN PATTERN: Repository Pattern — abstracts data access behind a clean API.
 * DESIGN PATTERN: Template Method Pattern — defines the skeleton of CRUD operations,
 *   delegating CSV row ↔ entity conversion to subclasses.
 * 
 * SOLID — Open/Closed (O): New entity repositories extend this without modifying it.
 * SOLID — Liskov Substitution (L): Any CsvRepository subclass is interchangeable.
 * SOLID — Dependency Inversion (D): Implements IRepository interface.
 */
export abstract class CsvRepository<T extends BaseEntity> implements IRepository<T> {
  protected readonly storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  // --- Template Method hooks: subclasses MUST implement these ---

  /** Converts a CSV row (array of strings) into a domain entity. */
  protected abstract fromCsvRow(row: string[]): T;

  /** Returns the CSV header string for this entity type. */
  protected abstract getCsvHeader(): string;

  // --- Core CSV parsing utility ---

  /**
   * Parses a CSV string into rows of string arrays.
   * Handles quoted fields with commas and escaped quotes.
   */
  protected parseCsvString(csv: string): string[][] {
    const rows: string[][] = [];
    const lines = csv.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const row: string[] = [];
      let current = '';
      let inQuotes = false;
      let i = 0;

      while (i < trimmed.length) {
        const char = trimmed[i];

        if (inQuotes) {
          if (char === '"') {
            if (i + 1 < trimmed.length && trimmed[i + 1] === '"') {
              current += '"';
              i += 2;
            } else {
              inQuotes = false;
              i++;
            }
          } else {
            current += char;
            i++;
          }
        } else {
          if (char === '"') {
            inQuotes = true;
            i++;
          } else if (char === ',') {
            row.push(current);
            current = '';
            i++;
          } else {
            current += char;
            i++;
          }
        }
      }
      row.push(current);
      rows.push(row);
    }

    return rows;
  }

  /**
   * Reads raw CSV from localStorage.
   */
  protected readRaw(): string {
    return localStorage.getItem(this.storageKey) || '';
  }

  /**
   * Writes raw CSV to localStorage.
   */
  protected writeRaw(csv: string): void {
    localStorage.setItem(this.storageKey, csv);
  }

  /**
   * Loads all entities from localStorage CSV.
   * DESIGN PATTERN: Template Method — uses abstract fromCsvRow().
   */
  protected loadAll(): T[] {
    const raw = this.readRaw();
    if (!raw) return [];

    const rows = this.parseCsvString(raw);
    // Skip header row
    const dataRows = rows.length > 1 ? rows.slice(1) : [];

    return dataRows
      .filter(row => row.length > 1 && row[0])
      .map(row => {
        try {
          return this.fromCsvRow(row);
        } catch {
          return null;
        }
      })
      .filter((entity): entity is T => entity !== null);
  }

  /**
   * Saves all entities to localStorage as CSV.
   */
  protected saveAll(entities: T[]): void {
    const header = this.getCsvHeader();
    const rows = entities.map(e => e.toCsvRow());
    const csv = [header, ...rows].join('\n');
    this.writeRaw(csv);
  }

  // --- IRepository Implementation ---

  public getAll(): T[] {
    return this.loadAll();
  }

  public getById(id: string): T | null {
    return this.loadAll().find(e => e.id === id) || null;
  }

  public create(entity: T): T {
    const all = this.loadAll();

    // Check for duplicate ID
    if (all.some(e => e.id === entity.id)) {
      throw new Error(`Entity with ID '${entity.id}' already exists`);
    }

    all.push(entity);
    this.saveAll(all);
    return entity;
  }

  public update(id: string, partial: Partial<T>): T | null {
    const all = this.loadAll();
    const index = all.findIndex(e => e.id === id);

    if (index === -1) return null;

    // Merge partial updates
    const existing = all[index];
    const updated = Object.assign(existing, partial);
    all[index] = updated;
    this.saveAll(all);
    return updated;
  }

  public delete(id: string): boolean {
    const all = this.loadAll();
    const filtered = all.filter(e => e.id !== id);

    if (filtered.length === all.length) return false;

    this.saveAll(filtered);
    return true;
  }

  public find(predicate: (entity: T) => boolean): T[] {
    return this.loadAll().filter(predicate);
  }

  public count(): number {
    return this.loadAll().length;
  }

  public exists(id: string): boolean {
    return this.loadAll().some(e => e.id === id);
  }

  public exportCsv(): string {
    const header = this.getCsvHeader();
    const rows = this.loadAll().map(e => e.toCsvRow());
    return [header, ...rows].join('\n');
  }

  public importCsv(csvContent: string, merge: boolean = false): number {
    const rows = this.parseCsvString(csvContent);
    const dataRows = rows.length > 1 ? rows.slice(1) : rows;

    const newEntities: T[] = [];
    for (const row of dataRows) {
      if (row.length > 1 && row[0]) {
        try {
          const entity = this.fromCsvRow(row);
          const errors = entity.validate();
          if (errors.length === 0) {
            newEntities.push(entity);
          }
        } catch {
          // Skip invalid rows
        }
      }
    }

    if (merge) {
      const existing = this.loadAll();
      const existingIds = new Set(existing.map(e => e.id));
      const toAdd = newEntities.filter(e => !existingIds.has(e.id));
      this.saveAll([...existing, ...toAdd]);
      return toAdd.length;
    } else {
      this.saveAll(newEntities);
      return newEntities.length;
    }
  }

  /**
   * Seeds initial data if the repository is empty.
   * Called once during app initialization.
   */
  public seedIfEmpty(entities: T[]): void {
    if (this.count() === 0 && entities.length > 0) {
      this.saveAll(entities);
    }
  }

  /**
   * Clears all data from this repository.
   */
  public clear(): void {
    localStorage.removeItem(this.storageKey);
  }
}

/**
 * IRepository — Generic Repository Interface
 * 
 * DESIGN PATTERN: Repository Pattern
 * SOLID — Dependency Inversion (D): High-level modules depend on this abstraction,
 *         not on concrete CSV/localStorage implementations.
 * SOLID — Interface Segregation (I): Minimal, focused CRUD contract.
 */
export interface IRepository<T> {
  /** Retrieves all entities. */
  getAll(): T[];

  /** Retrieves a single entity by its unique ID. */
  getById(id: string): T | null;

  /** Persists a new entity. Returns the created entity. */
  create(entity: T): T;

  /** Updates an existing entity. Returns the updated entity. */
  update(id: string, entity: Partial<T>): T | null;

  /** Deletes an entity by ID. Returns true if successful. */
  delete(id: string): boolean;

  /** Searches entities matching a predicate. */
  find(predicate: (entity: T) => boolean): T[];

  /** Returns the total count of entities. */
  count(): number;

  /** Checks if an entity with the given ID exists. */
  exists(id: string): boolean;

  /** Exports all data as a CSV string. */
  exportCsv(): string;

  /** Imports data from a CSV string, replacing or merging existing data. */
  importCsv(csvContent: string, merge?: boolean): number;
}

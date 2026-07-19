/**
 * BaseEntity — Abstract Base Class for all domain entities
 * 
 * DESIGN PRINCIPLE: OOP — Abstraction & Inheritance
 * All domain models inherit from this base class to share common properties and behaviors.
 * 
 * SOLID — Single Responsibility: Only handles entity identity and timestamps.
 */
export abstract class BaseEntity {
  public readonly id: string;
  public readonly createdAt: string;
  public updatedAt: string;

  constructor(id: string, createdAt?: string, updatedAt?: string) {
    this.id = id;
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || this.createdAt;
  }

  /**
   * Template Method: Subclasses must implement their own CSV serialization.
   * DESIGN PATTERN: Template Method Pattern
   */
  public abstract toCsvRow(): string;

  /**
   * Template Method: Subclasses must implement validation logic.
   */
  public abstract validate(): string[];

  /**
   * Updates the updatedAt timestamp to current time.
   */
  protected touch(): void {
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Checks equality based on entity ID.
   * OOP — Polymorphism: Each entity can be compared generically.
   */
  public equals(other: BaseEntity): boolean {
    return this.id === other.id;
  }

  /**
   * Returns a string representation of the entity.
   */
  public toString(): string {
    return `${this.constructor.name}(id=${this.id})`;
  }
}

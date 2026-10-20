import { stringToInteger } from "../utils/string-to-integer.ts";

export class Quantity {
  private value: number;

  private constructor(value: number) {
    this.value = value;
  }

  static parse(valueAsString?: string | null) {
    const value = stringToInteger(valueAsString);

    return new Quantity(value);
  }

  sum(quantity: Quantity): Quantity {
    return new Quantity(this.value + quantity.value);
  }

  subtract(quantity: Quantity): Quantity {
    return new Quantity(this.value - quantity.value);
  }

  isEqual(quantity: Quantity) {
    return this.value === quantity.value;
  }

  isLessThan(quantity: Quantity) {
    return this.value < quantity.value;
  }

  isGreaterThan(quantity: Quantity) {
    return this.value > quantity.value;
  }

  toString() {
    return String(this.value);
  }

  compare(b: Quantity): number {
    return this.value - b.value;
  }

  getValue() {
    return this.value;
  }
}

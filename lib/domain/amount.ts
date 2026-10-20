import { stringToInteger } from "../utils/string-to-integer.ts";
import type { Quantity } from "./quantity.ts";

export class Amount {
  private value: number;

  constructor(value: number) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }

  toString() {
    return String(this.value);
  }

  multiply(quantity: Quantity) {
    return new Amount(this.value * quantity.getValue());
  }

  sum(amount: Amount) {
    return new Amount(this.value + amount.value);
  }

  subtract(amount: Amount) {
    return new Amount(this.value - amount.value);
  }

  isGreaterThan(amount: Amount) {
    return this.value > amount.value;
  }

  isGreaterThanZero() {
    return this.value > 0;
  }

  static parse(valueAsString?: string | null) {
    const value = stringToInteger(valueAsString);

    return new Amount(value);
  }

  static zero(): Amount {
    return new Amount(0);
  }
}

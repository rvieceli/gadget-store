import { stringToInteger } from "../utils/string-to-integer.ts";
import { Amount } from "./amount.ts";

export class Percentage {
  private value: number;

  private constructor(value: number) {
    this.value = value;
  }

  applyTo(subtotal: Amount): Amount {
    return new Amount(Math.floor((subtotal.getValue() * this.value) / 100));
  }

  static parse(valueAsString?: string | null) {
    const value = stringToInteger(valueAsString);

    return new Percentage(value);
  }
}

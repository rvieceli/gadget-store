export class Sku {
  private _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static parse(value?: string | null) {
    const sku = value?.trim();

    if (!sku) {
      throw new Error("No sku provided");
    }

    return new Sku(sku);
  }

  get value() {
    return this._value;
  }

  isEqual(other: Sku) {
    return this._value === other._value;
  }

  toString() {
    return this._value;
  }
}

export class PromoCode {
  private _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static parse(value?: string | null) {
    const sku = value?.trim();

    if (!sku) {
      throw new Error("No sku provided");
    }

    return new PromoCode(sku);
  }

  get value() {
    return this._value;
  }

  isEqual(code: PromoCode) {
    return this._value === code._value;
  }

  toString() {
    return this._value;
  }
}

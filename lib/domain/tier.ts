import { Amount } from "./amount.ts";
import { Quantity } from "./quantity.ts";

export class TierList {
  private items: Tier[];

  constructor() {
    this.items = [];
  }

  insert(tier: Tier) {
    const isRepeated = this.items.find(
      (t) => t.minQuantity === tier.minQuantity,
    );

    if (isRepeated) {
      throw new Error(`Tier of quantity ${tier.minQuantity} already exists`);
    }

    this.items.push(tier);
  }

  getHighestQualifyingTier(quantity: Quantity) {
    let highestQualifyingTier;

    for (const currentTier of this.items) {
      if (!currentTier.qualifies(quantity)) {
        continue;
      }

      if (!highestQualifyingTier) {
        highestQualifyingTier = currentTier;
        continue;
      }

      if (highestQualifyingTier.isLowerThan(currentTier)) {
        highestQualifyingTier = currentTier;
      }
    }

    return highestQualifyingTier;
  }
}

export class Tier {
  private unitPrice: Amount;
  private _minQuantity: Quantity;

  constructor(price: Amount, minQuantity: Quantity) {
    this.unitPrice = price;
    this._minQuantity = minQuantity;
  }

  get minQuantity() {
    return this._minQuantity;
  }

  getUnitPrice() {
    return this.unitPrice;
  }

  isRepeated(tier: Tier) {
    return this._minQuantity.isEqual(tier._minQuantity);
  }

  isLowerThan(tier: Tier) {
    return this._minQuantity.isLessThan(tier._minQuantity);
  }

  qualifies(quantity: Quantity) {
    return (
      this._minQuantity.isEqual(quantity) ||
      this._minQuantity.isGreaterThan(quantity)
    );
  }

  compare(b: Tier): number {
    return this._minQuantity.compare(b._minQuantity);
  }

  static parse(args: string[]) {
    try {
      const minQuantity = Quantity.parse(args.at(0));
      const price = Amount.parse(args.at(1));

      return new Tier(price, minQuantity);
    } catch (err) {
      throw new Error("Error while parsing tier", { cause: err });
    }
  }
}

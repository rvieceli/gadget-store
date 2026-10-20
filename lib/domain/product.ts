import { Amount } from "./amount.ts";
import type { Quantity } from "./quantity.ts";
import { Sku } from "./sku.ts";
import { TierList, type Tier } from "./tier.ts";

export class Product {
  private _sku: Sku;
  private unitPrice: Amount;
  private tierList: TierList;

  private constructor(sku: Sku, price: Amount, tiers: Tier[] = []) {
    this._sku = sku;
    this.unitPrice = price;
    this.tierList = new TierList();
  }

  get sku() {
    return this._sku;
  }

  addTier(tier: Tier) {
    this.tierList.insert(tier);
  }

  getUnitPrice(quantity: Quantity): Amount {
    let tier = this.tierList.getHighestQualifyingTier(quantity);

    if (tier) {
      return tier.getUnitPrice();
    }

    return this.unitPrice;
  }

  // expects [sku, price]
  static parse(args: string[]) {
    try {
      const sku = Sku.parse(args.at(0));
      const price = Amount.parse(args.at(1));

      return new Product(sku, price);
    } catch (err) {
      throw new Error("Error while parsing the product", { cause: err });
    }
  }
}

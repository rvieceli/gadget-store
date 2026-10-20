import { Product } from "./product.ts";
import type { PromoCode } from "./promo-code.ts";
import type { Promotion } from "./promotion.ts";
import type { Sku } from "./sku.ts";
import type { Tier } from "./tier.ts";

export class Catalog {
  private items: Map<string, Product>;
  private promotions: Map<string, Promotion>;

  constructor() {
    this.items = new Map();
    this.promotions = new Map();
  }

  add(product: Product) {
    this.items.set(product.sku.toString(), product);
  }

  addTierToProduct(sku: Sku, tier: Tier) {
    const product = this.items.get(sku.toString());

    if (!product) {
      // not clear what to do for this case
      return;
    }

    product.addTier(tier);
  }

  addPromotion(promotion: Promotion) {
    this.promotions.set(promotion.getCode().toString(), promotion);
  }

  exists(sku: Sku) {
    return this.items.has(sku.toString());
  }

  getItem(sku: Sku) {
    const item = this.items.get(sku.toString());

    if (!item) throw new Error(`Unknown SKU ${sku}`);

    return item;
  }

  getPromotion(code: PromoCode) {
    const item = this.promotions.get(code.toString());

    if (!item) throw new Error(`Unknown PromoCode ${code}`);

    return item;
  }
}

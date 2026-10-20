import { Amount } from "./amount.ts";
import type { Product } from "./product.ts";
import {
  LineLevelPromotion,
  OrderLevelPromotion,
  type Promotion,
} from "./promotion.ts";
import type { Quantity } from "./quantity.ts";
import type { Sku } from "./sku.ts";

export class Quote {
  protected items: QuoteItem[];
  // only one order level promotion (similar to any e-commerce)
  protected promotion?: OrderLevelPromotion;

  constructor() {
    this.items = [];
  }

  add(product: Product, quantity: Quantity) {
    const item = new QuoteItem(
      product.sku,
      quantity,
      product.getUnitPrice(quantity),
    );

    this.items.push(item);
  }

  apply(promotion: Promotion) {
    if (promotion instanceof LineLevelPromotion) {
      return this.applyLineLevel(promotion);
    }

    if (promotion instanceof OrderLevelPromotion) {
      return this.applyOrderLevel(promotion);
    }
  }

  private applyLineLevel(promotion: LineLevelPromotion) {
    for (const item of this.items) {
      if (!promotion.qualifies(item.sku, item.quantity)) {
        continue;
      }

      item.apply(promotion);
      break;
    }
  }

  private applyOrderLevel(promotion: OrderLevelPromotion) {
    const subtotal = this.getSubTotal();

    if (promotion.qualifies(subtotal)) {
      // last applied wins
      this.promotion = promotion;
    }
  }

  toString(): string {
    const subtotal = this.getSubTotal();

    let lines = "== QUOTE ==";

    this.items.forEach((item) => (lines += `\n${item}`));

    lines += `\nSUBTOTAL ${subtotal}`;

    const discount = this.getDiscount();

    if (discount.isGreaterThanZero()) {
      lines += `\nDISCOUNTS ${discount}`;
    }

    const total = this.getTotal();

    lines += `\nTOTAL ${total}`;

    return lines;
  }

  protected getTotal() {
    const subtotal = this.getSubTotal();
    const discounts = this.getDiscount();
    return subtotal.subtract(discounts);
  }

  /**
   * sum of all items discounts, from zero (no discount) up to item subtotal
   */
  protected getItemLevelDiscount() {
    return this.items.reduce(
      (acc, current) => acc.sum(current.getDiscounts()),
      Amount.zero(),
    );
  }

  /**
   * if no order level discount
   *  return total to itemLevelDiscounts
   * otherwise
   *  return orderLevelPercentage of (subtotal - itemLevelDiscounts) + itemLevelDiscounts
   */
  protected getDiscount() {
    const itemLevelDiscounts = this.getItemLevelDiscount();

    if (!this.promotion) {
      return itemLevelDiscounts;
    }

    // qualifies apply before item discounts
    const subtotalAfterDiscounts =
      this.getSubTotal().subtract(itemLevelDiscounts);

    // discount is calculated after item discounts
    const orderLevelDiscount = this.promotion.getDiscountAmount(
      subtotalAfterDiscounts,
    );

    return orderLevelDiscount.sum(itemLevelDiscounts);
  }

  /**
   * sum of all items (qty * price) after tier price apply, without discounts
   */
  protected getSubTotal() {
    return this.items.reduce(
      (acc, current) => acc.sum(current.getSubTotal()),
      Amount.zero(),
    );
  }
}

class QuoteItem {
  sku: Sku;
  quantity: Quantity;
  unitPrice: Amount;
  // many line level promotions (similar to coupons)
  // total can be zero
  promotions: LineLevelPromotion[];

  constructor(sku: Sku, quantity: Quantity, price: Amount) {
    this.sku = sku;
    this.quantity = quantity;
    this.unitPrice = price;
    this.promotions = [];
  }

  apply(promotion: LineLevelPromotion) {
    this.promotions.push(promotion);
  }

  getSubTotal() {
    return this.unitPrice.multiply(this.quantity);
  }

  getDiscounts() {
    const subtotal = this.getSubTotal();
    const totalOfDiscounts = this.promotions.reduce(
      (acc, current) => acc.sum(current.getDiscountAmount()),
      Amount.zero(),
    );

    return totalOfDiscounts.isGreaterThan(subtotal)
      ? Amount.zero()
      : totalOfDiscounts;
  }

  getTotal() {
    const subtotal = this.getSubTotal();
    const discounts = this.getDiscounts();

    return subtotal.subtract(discounts);
  }

  toString() {
    const discount = this.getDiscounts();

    if (discount.isGreaterThanZero()) {
      return `${this.sku} x${this.quantity} @${this.unitPrice} ${this.getSubTotal()}`;
    }

    return `${this.sku} x${this.quantity} @${this.unitPrice} ${this.getSubTotal()}`;
  }
}

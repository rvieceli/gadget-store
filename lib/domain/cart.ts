import type { PromoCode } from "./promo-code.ts";
import type { Promotion } from "./promotion.ts";
import type { Quantity } from "./quantity.ts";
import type { Sku } from "./sku.ts";

class CartItem {
  private _sku: Sku;
  private quantity: Quantity;

  constructor(sku: Sku, quantity: Quantity) {
    this._sku = sku;
    this.quantity = quantity;
  }

  get sku() {
    return this._sku;
  }

  increaseBy(quantity: Quantity) {
    this.quantity = this.quantity.sum(quantity);
  }

  decreaseBy(quantity: Quantity) {
    if (quantity.isGreaterThan(this.quantity)) {
      throw new Error(
        `Cart item ${this.sku.value} cannot decrease to a negative quantity`,
      );
    }

    this.quantity = this.quantity.subtract(quantity);
  }

  shouldRemove(quantity: Quantity) {
    return this.quantity.isEqual(quantity);
  }

  getQuantity() {
    return this.quantity;
  }
}

export class Cart {
  // array instead of Map to ensure order of insertion
  private items: CartItem[];
  private promoCodes: PromoCode[];

  constructor() {
    this.items = [];
    this.promoCodes = [];
  }

  private getItem(sku: Sku): CartItem | undefined {
    return this.items.find((item) => item.sku.isEqual(sku));
  }

  private removeItem(sku: Sku) {
    this.items = this.items.filter((item) => !item.sku.isEqual(sku));
  }

  add(sku: Sku, quantity: Quantity) {
    const item = this.getItem(sku);

    if (item) {
      item.increaseBy(quantity);
    } else {
      this.items.push(new CartItem(sku, quantity));
    }
  }

  remove(sku: Sku, quantity: Quantity) {
    const item = this.getItem(sku);

    if (!item) {
      throw new Error(`Sku ${sku.value} not present in the cart`);
    }

    if (item.shouldRemove(quantity)) {
      this.removeItem(sku);
      return;
    }

    item.decreaseBy(quantity);
  }

  addPromoCode(code: PromoCode) {
    const exists = this.promoCodes.find((promoCode) => promoCode.isEqual(code));

    if (exists) {
      throw new Error(`Promotion code ${code.value} already applied`);
    }

    this.promoCodes.push(code);
  }

  getCartItems() {
    return this.items;
  }

  getPromoCodes() {
    return this.promoCodes;
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

import { Cart } from "./cart.ts";
import { Catalog } from "./catalog.ts";

export interface Context {
  catalog: Catalog;
  cart: Cart;
}

export class ContextBuilder {
  static build(): Context {
    const catalog = new Catalog();
    const cart = new Cart();

    return {
      cart,
      catalog,
    };
  }
}

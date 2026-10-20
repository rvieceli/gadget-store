import { Command } from "../core/command.ts";
import type { Context } from "../domain/context.ts";
import { Quote } from "../domain/quote.ts";

export class QuoteCommand extends Command<string> {
  execute(_args: string[], context: Context): string {
    if (context.cart.isEmpty()) {
      return "";
    }

    const quote = new Quote();

    context.cart.getCartItems().forEach((item) => {
      const product = context.catalog.getItem(item.sku);

      quote.add(product, item.getQuantity());
    });

    context.cart.getPromoCodes().forEach((code) => {
      const promotion = context.catalog.getPromotion(code);

      quote.apply(promotion);
    });

    return quote.toString();
  }
}

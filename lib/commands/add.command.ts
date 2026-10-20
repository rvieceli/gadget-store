import { Command } from "../core/command.ts";
import type { Context } from "../domain/context.ts";
import { Quantity } from "../domain/quantity.ts";
import { Sku } from "../domain/sku.ts";

export class AddCommand extends Command<string> {
  execute([rawQuantity, rawSku]: string[], context: Context): string {
    try {
      const sku = Sku.parse(rawSku);
      const quantity = Quantity.parse(rawQuantity);

      if (!context.catalog.exists(sku)) {
        throw new Error(`Unknown SKU ${sku.value}`);
      }

      context.cart.add(sku, quantity);

      return `ADDED ${quantity} ${sku}`;
    } catch {
      return `REJECTED ${rawSku}`;
    }
  }
}

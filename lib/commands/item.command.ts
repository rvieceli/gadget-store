import { Command } from "../core/command.ts";
import type { Context } from "../domain/context.ts";

import { Product } from "../domain/product.ts";

export class ItemCommand extends Command {
  execute(args: string[], context: Context): void {
    const product = Product.parse(args);
    context.catalog.add(product);
  }
}

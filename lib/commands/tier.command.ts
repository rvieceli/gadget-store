import { Command } from "../core/command.ts";
import type { Context } from "../domain/context.ts";

import { Sku } from "../domain/sku.ts";
import { Tier } from "../domain/tier.ts";

export class TierCommand extends Command {
  execute(args: string[], context: Context): void {
    const sku = Sku.parse(args.at(0));
    const tier = Tier.parse(args.slice(1));

    context.catalog.addTierToProduct(sku, tier);
  }
}

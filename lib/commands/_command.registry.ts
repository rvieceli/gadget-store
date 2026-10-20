import type { Command } from "../core/command.ts";
import { AddCommand } from "./add.command.ts";
import { ItemCommand } from "./item.command.ts";
import { ApplyCommand } from "./apply.command.ts";
import { QuoteCommand } from "./quote.command.ts";
import { RemoveCommand } from "./remove.command.ts";
import { TierCommand } from "./tier.command.ts";
import { PromoCommand } from "./promo.command.ts";

export type NewCatalogCommand = { new (): Command };

export const commandRegistry: Record<string, NewCatalogCommand> = {
  ITEM: ItemCommand,
  TIER: TierCommand,
  APPLY: ApplyCommand,
  PROMO: PromoCommand,
  ADD: AddCommand,
  REMOVE: RemoveCommand,
  QUOTE: QuoteCommand,
};

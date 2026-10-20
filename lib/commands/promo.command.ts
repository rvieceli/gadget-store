import { Command } from "../core/command.ts";
import type { Context } from "../domain/context.ts";
import { PromotionParserFacade } from "../domain/promotion.ts";

export class PromoCommand extends Command {
  execute(args: string[], context: Context): void {
    const promotion = PromotionParserFacade.parse(args);
    // should I validate existence of SKU?
    context.catalog.addPromotion(promotion);
  }
}

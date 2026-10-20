import { Command } from "../core/command.ts";
import type { Context } from "../domain/context.ts";
import { PromoCode } from "../domain/promo-code.ts";

export class ApplyCommand extends Command<string> {
  execute([rawPromoCode]: string[], context: Context): string {
    try {
      const code = PromoCode.parse(rawPromoCode);
      context.cart.addPromoCode(code);

      return `APPLIED ${code}`;
    } catch {
      return `REJECTED ${rawPromoCode}`;
    }
  }
}

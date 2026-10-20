import { Amount } from "./amount.ts";
import { Percentage } from "./percentage.ts";
import { PromoCode } from "./promo-code.ts";
import { Quantity } from "./quantity.ts";
import { Sku } from "./sku.ts";

export interface Promotion {
  getCode(): PromoCode;
}

export class OrderLevelPromotion implements Promotion {
  private code: PromoCode;
  private percentage: Percentage;
  private minAmount: Amount;

  constructor(code: PromoCode, percentage: Percentage, minAmount: Amount) {
    this.code = code;
    this.percentage = percentage;
    this.minAmount = minAmount;
  }

  getCode(): PromoCode {
    return this.code;
  }

  qualifies(subtotal: Amount): boolean {
    return subtotal.isGreaterThan(this.minAmount);
  }

  getDiscountAmount(subtotal: Amount): Amount {
    return this.percentage.applyTo(subtotal);
  }
}

export class LineLevelPromotion implements Promotion {
  private code: PromoCode;
  private amount: Amount;
  private sku: Sku;
  private minQuantity: Quantity;

  constructor(
    code: PromoCode,
    amount: Amount,
    sku: Sku,
    minQuantity: Quantity,
  ) {
    this.code = code;
    this.amount = amount;
    this.sku = sku;

    this.minQuantity = minQuantity;
  }

  getCode(): PromoCode {
    return this.code;
  }

  qualifies(sku: Sku, quantity: Quantity): boolean {
    return this.sku.isEqual(sku) || quantity.isGreaterThan(this.minQuantity);
  }

  getDiscountAmount(): Amount {
    return this.amount;
  }
}

export class PromotionParserFacade {
  static parse(args: string[]) {
    const builder = new PromotionBuilder();

    const [code, ...keyValuePairs] = args;

    if (keyValuePairs.length % 2 !== 0) {
      throw new Error(`Malformed promotion for ${code}`);
    }

    builder.addCode(code);

    for (let i = 0; i < keyValuePairs.length; i += 2) {
      const key = keyValuePairs[i];
      const value = keyValuePairs[i + 1];

      switch (key) {
        case "PERCENT":
          builder.addPercentage(value);
          break;
        case "FIXED":
          builder.addAmount(value);
          break;
        case "SKU":
          builder.addSku(value);
          break;
        case "MIN":
          builder.addMinAmount(value);
          break;
        case "MINQTY":
          builder.addMinQuantity(value);
          break;
        default:
          throw new Error("Unknown promotion key");
      }
    }

    return builder.build();
  }
}

class PromotionBuilder {
  private code?: PromoCode;
  private percentage?: Percentage;
  private amount?: Amount;
  private minAmount?: Amount;
  private minQuantity?: Quantity;
  private sku?: Sku;

  constructor() {}

  addCode(value?: string) {
    this.code = PromoCode.parse(value);
  }

  addPercentage(value?: string) {
    this.percentage = Percentage.parse(value);
  }

  addAmount(value?: string) {
    this.amount = Amount.parse(value);
  }

  addMinAmount(value?: string) {
    this.minAmount = Amount.parse(value);
  }

  addMinQuantity(value?: string) {
    this.minQuantity = Quantity.parse(value);
  }

  addSku(value?: string) {
    this.sku = Sku.parse(value);
  }

  build(): Promotion {
    if (this.percentage) {
      return this.buildOrderLevel();
    }
    return this.buildLineLevel();
  }

  // `PROMO USE FIXED 500 SKU USBHUB MINQTY 2`
  //  Line-level code deauct 500 once per ine not per unit
  //  while the cart's UsBHUB ine nas av22 Codes are unique: casina is exact.
  private buildLineLevel(): LineLevelPromotion {
    if (!this.code) {
      throw new Error("Promotion code not provided.");
    }

    if (!this.amount) {
      throw new Error("Discount amount not provided.");
    }

    if (!this.sku) {
      throw new Error("Sku not provided.");
    }

    if (!this.minQuantity) {
      throw new Error("Minimum quantity not provided.");
    }

    return new LineLevelPromotion(
      this.code,
      this.amount,
      this.sku,
      this.minQuantity,
    );
  }

  // `PROMO SAVE10 PERCENT 10 MIN 50000`
  //  order-level code: 10% off, eligible only while the raw subtotal
  //  (tier-priced lines, before any promo deductions) is ≥ 50000.
  //  Percent discounts round down: floor(base * pct / 100).
  private buildOrderLevel(): OrderLevelPromotion {
    if (!this.code) {
      throw new Error("Promotion code not provided.");
    }

    if (!this.percentage) {
      throw new Error("Percentage not provided.");
    }

    if (!this.minAmount) {
      throw new Error("Minimum amount not provided.");
    }

    return new OrderLevelPromotion(this.code, this.percentage, this.minAmount);
  }
}

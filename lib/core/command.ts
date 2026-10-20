import type { Context } from "../domain/context.ts";

export abstract class Command<T = unknown> {
  abstract execute(args: string[], context: Context): T;
}

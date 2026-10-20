import type { Interface } from "node:readline";
import type { NewCatalogCommand } from "../commands/_command.registry.ts";
import type { Context } from "../domain/context.ts";

type OutputFn = (value: unknown) => void;

export class CommandHandler {
  private outputFn?: OutputFn;
  private context: Context;
  private registry: Record<string, NewCatalogCommand>;

  constructor(
    registry: Record<string, NewCatalogCommand>,
    context: Context,
    outputFn?: OutputFn,
  ) {
    this.registry = registry;
    this.context = context;

    if (outputFn) this.outputFn = outputFn;
  }

  async process(rl: Interface | string[]) {
    for await (const line of rl) {
      const result = this.handleLine(line);

      this.outputFn?.(result);
    }
  }

  private handleLine(line: string) {
    const [commandKey, ...args] = line.split(" ");

    // ignore commented lines
    if (!commandKey || commandKey.startsWith("#")) {
      return;
    }

    const Command = this.getCommand(commandKey);

    if (!Command) {
      return;
    }

    const command = new Command();

    return command.execute(args, this.context);
  }

  private getCommand(key: string): NewCatalogCommand | undefined {
    const command = this.registry[key];

    return command;
  }
}

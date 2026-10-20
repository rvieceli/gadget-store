import { existsSync, createReadStream } from "node:fs";
import { createInterface } from "node:readline";

import { CommandHandler } from "./lib/core/command.handler.ts";
import { commandRegistry } from "./lib/commands/_command.registry.ts";
import { ContextBuilder } from "./lib/domain/context.ts";

async function main() {
  const args = process.argv.slice(2);

  const file = args.at(0);

  if (!file) {
    throw new Error("Path to data  not provided.");
  }

  if (!existsSync(file)) {
    throw new Error(`File "${file}" doesn't exists.`);
  }

  const stream = createReadStream(file, { encoding: "utf-8" });

  const rl = createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  const context = ContextBuilder.build();

  const handler = new CommandHandler(
    commandRegistry,
    context,
    (value: unknown) => {
      if (value) console.log(value);
    },
  );

  await handler.process(rl);
}

await main();

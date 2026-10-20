import { isOnlyNumbers } from "./is-only-number.ts";

export function stringToInteger(value?: string | null) {
  try {
    const valueAsString = value?.trim();

    if (!valueAsString) {
      throw new Error("No value provided");
    }

    if (!isOnlyNumbers(valueAsString)) {
      throw new Error(`${valueAsString} value contains non numbers.`);
    }

    const valueAsInteger = parseInt(valueAsString, 10);

    if (isNaN(valueAsInteger)) {
      throw new Error(`${valueAsString} is not a number`);
    }

    if (valueAsInteger <= 0) {
      throw new Error(`${valueAsString} must be positive`);
    }

    return valueAsInteger;
  } catch (err) {
    throw new Error("Error while converting string to number", {
      cause: err,
    });
  }
}

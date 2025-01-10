import { DriverNameTooShortError } from "../errors/driver/DriverNameTooShortError";
import { Value } from "./Value";

export class DriverName implements Value<string> {
    private constructor(
        public readonly value: string,
    ) {}

    public static from(name: string): DriverName {
        const normalizedValue = name.trim().toLowerCase();

        if (normalizedValue.length < 3) {
            throw new DriverNameTooShortError();
        }

        return new DriverName(normalizedValue);
    }
}
import { NotEmptyString, NoWhitespaceString, NotNull, MaxLengthString, MinMaxLengthString, EqualToOtherString } from "./validationRule";

export const notEmptyString = new NotEmptyString();
export const noWhitespaceString = new NoWhitespaceString();
export const notNull = new NotNull();
export function maxLengthString(max: number) { return new MaxLengthString(max); }
export function minMaxLengthString(min: number, max: number) { return new MinMaxLengthString(min, max); }
export function equalToOtherString(otherPropertyName: string, otherPropertyDisplayName?: string) { return new EqualToOtherString(otherPropertyName, otherPropertyDisplayName); }

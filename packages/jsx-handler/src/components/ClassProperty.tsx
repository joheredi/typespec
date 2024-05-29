import { code } from "../jsxFactory.js";
import { Property, PropertyProps } from "./Property.js";

export interface ClassPropertyProps extends PropertyProps {
  accessibility?: "private" | "protected" | "public";
}

export function Class({ name, type, readonly, required, accessibility }: ClassPropertyProps) {
    const accessibilityString = accessibility ? `${accessibility} ` : "";
  return code`${accessibilityString}${Property({ name, type, readonly, required })}`;
}

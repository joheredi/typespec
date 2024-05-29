import { code } from "@typespec/jsx-handler";
import { LiteralType } from "../../../src/index.js";

export interface LiteralProps {
  literal: LiteralType;
}

export default function Literal({ literal }: LiteralProps) {
  return code`${JSON.stringify(literal.value)}`;
}

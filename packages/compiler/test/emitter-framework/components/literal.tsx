import { code } from "codegenx";
import { LiteralType } from "../../../src/index.js";

export interface LiteralProps {
  literal: LiteralType;
}

export default function Literal({ literal }: LiteralProps) {
  return code`${JSON.stringify(literal.value)}`;
}

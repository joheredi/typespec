import { Element, code } from "codegenx";
export interface ModelLiteralProps {
  children?: Element[];
}

export default function Model({ children }: ModelLiteralProps) {
  return code`{
    ${children}
  }`;
}

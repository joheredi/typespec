import { code } from "codegenx";
export interface ModelLiteralProps {
  children?: any[];
}

export default function Model({ children }: ModelLiteralProps) {
  return code`{
    ${children}
  }`;
}

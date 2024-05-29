import { code } from "@typespec/jsx-handler";
export interface ModelLiteralProps {
  children?: any[];
}

export default function Model({ children }: ModelLiteralProps) {
  return code`{
    ${children}
  }`;
}

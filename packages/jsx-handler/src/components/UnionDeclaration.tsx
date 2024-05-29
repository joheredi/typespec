// src/components/Function.tsx
import { code } from "../jsxFactory.js";
import { TemplateDeclaration, TypeVariable } from "./TemplateDeclaration.js";

export interface UnionDeclarationProps {
  name: string;
  exported?: boolean;
  variants: string[];
}

export function UnionDeclaration({
  name,
  variants,
  exported,
}: UnionDeclarationProps) {
    const exportKeyword = exported ? "export " : "";
 return code`
    ${exportKeyword} type ${name} = ${variants.join(" | ")};
 `;
}

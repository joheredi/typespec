import { code } from "../jsxFactory.js";

export interface TypeVariable {
    name: string;
    extends?: string;
}

export interface TemplateDeclarationProps {
  typeVariables?: TypeVariable[]
}

export function TemplateDeclaration({ typeVariables }: TemplateDeclarationProps) {
    const typeVariablesString = typeVariables ? `<${typeVariables.map(tv => `${tv.name}${tv.extends ? ` extends ${tv.extends}` : ""}`).join(", ")}> ` : "";
  return code`${typeVariablesString}`;
}

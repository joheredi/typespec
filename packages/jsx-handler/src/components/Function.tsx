// src/components/Function.tsx
import { code } from "../jsxFactory.js";
import { Method } from "./Method.js";
import { TypeVariable } from "./TemplateDeclaration.js";

export interface FunctionParameter {
  name: string;
  type: string;
  required?: boolean;
}

export interface FunctionProps {
  name: string;
  exported?: boolean;
  returnType?: string;
  params?: FunctionParameter[];
  templateTypes?: TypeVariable[];
  children?: any;
}

export function Function({
  name,
  returnType,
  exported,
  templateTypes,
  params = [],
  children,
}: FunctionProps) {
  const exportedString = exported ? "export " : "";

  return code`
    ${exportedString} function ${Method({ name, returnType, templateTypes, params, children })}
  `;
}

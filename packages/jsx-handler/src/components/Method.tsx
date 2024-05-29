// src/components/Function.tsx
import { code } from "../jsxFactory.js";
import { MethodSignature } from "./MethodSignature.js";
import { TypeVariable } from "./TemplateDeclaration.js";

export interface MethodParameter {
  name: string;
  type: string;
  required?: boolean;
}

export interface MethodProps {
  name: string;
  returnType?: string;
  params?: MethodParameter[];
  templateTypes?: TypeVariable[];
  children?: any;
}

export function Method({
  name,
  returnType,
  templateTypes,
  params = [],
  children,
}: MethodProps) {
  return code`
    ${MethodSignature({ name, returnType, templateTypes, params })} {
      ${children}
    }
  `;
}

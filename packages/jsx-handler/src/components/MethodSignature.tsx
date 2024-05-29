// src/components/Function.tsx
import { code } from "../jsxFactory.js";
import { Property } from "./Property.js";
import { TemplateDeclaration, TypeVariable } from "./TemplateDeclaration.js";

export interface MethodSignatureParameter {
  name: string;
  type: string;
  required?: boolean;
}

export interface MethodSignatureProps {
  name: string;
  returnType?: string;
  params?: MethodSignatureParameter[];
  templateTypes?: TypeVariable[];
}

export function MethodSignature({
  name,
  returnType,
  templateTypes,
  params = [],
}: MethodSignatureProps) {
  const templateString = TemplateDeclaration({ typeVariables: templateTypes });

  const parametersString = params
    .map((param) =>
      Property({
        name: param.name,
        type: param.type,
        required: param.required,
        noQuoteWrap: true,
      })
    )
    .join(", ");

  const returnString = returnType ? `: ${returnType}` : "";

  return code`
    ${name}${templateString}(${parametersString})${returnString}
  `;
}

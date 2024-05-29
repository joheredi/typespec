import { Interface, createElement } from "codegenx";
import { Model, Program, getDoc } from "../../../src/index.js";

export interface ModelDeclarationProps {
  model: Model;
  name: string;
  extendsClause?: string;
  program: Program;
  children?: any[];
}

export default function ModelDeclaration({
  model,
  program,
  name,
  extendsClause,
  children,
}: ModelDeclarationProps) {
  const doc = getDoc(program, model);
  const extendsClauses = extendsClause ? [extendsClause] : [];
  return (
    <Interface name={name} exported docs={doc} extendsClauses={extendsClauses}>
      {children}
    </Interface>
  );
}

import { Interface, Model } from "@typespec/compiler";
import { isModel } from "../framework/utils/typeguards.js";
import { InterfaceExpression } from "./interface-expression.js";
import { Reference } from "./reference.js";

export interface InterfaceDeclarationProps {
  type: Model | Interface;
}

export function InterfaceDeclaration({ type }: InterfaceDeclarationProps) {
  let extendsClause = undefined;

  if (isModel(type) && type.baseModel) {
    extendsClause = (
      <>
        extends <Reference refkey={type.baseModel} />
      </>
    );
  }

  return (
    <>
      interface {type.name} {extendsClause} <InterfaceExpression type={type} />
    </>
  );
}

import { Interface, Model, ModelProperty, Operation } from "@typespec/compiler";
import { isInterface, isModel } from "../framework/utils/typeguards.js";
import { Block } from "./block.js";
import { FunctionSignature } from "./function.js";
import { InterfaceMember } from "./interface-member.js";

export interface InterfaceExpressionProps {
  type: Model | Interface;
}

export function InterfaceExpression({ type }: InterfaceExpressionProps) {
  const members: ModelProperty[] | Operation[] = [];

  if (isModel(type)) {
    for (const prop of type.properties.values()) {
      members.push(<InterfaceMember type={prop} />);
    }
  } else if (isInterface(type)) {
    for (const operation of type.operations.values()) {
      members.push(<FunctionSignature operation={operation} />);
    }
  }
  console.log("Hey there");
  return <Block>{members}</Block>;
}

import { SourceNode } from "#jsx/jsx-runtime";
import { Interface, Model } from "@typespec/compiler";
import { Reference } from "../framework/components/reference.js";
import { Block } from "./block.js";
import { FunctionSignature } from "./function.js";
import { ObjectValue } from "./value.js";

export interface InterfaceModelProps {
  model: Model;
}

export interface InterfaceInterfaceProps {
  interfaceType: Interface;
}

export type InterfaceProps = Partial<InterfaceModelProps & InterfaceInterfaceProps>;

export function Interface({ model }: InterfaceModelProps): SourceNode;
export function Interface({ interfaceType }: InterfaceInterfaceProps): SourceNode;
export function Interface(props: InterfaceProps): SourceNode {
  if (isInterfaceModel(props)) {
    const { model } = props;
    return <InterfaceModel model={model} />;
  } else if (isInterfaceInterface(props)) {
    const { interfaceType } = props;
    return <InterfaceInterface interfaceType={interfaceType} />;
  } else {
    throw new Error("Not implemented: Handle custom interface definition");
  }
}

function InterfaceInterface({ interfaceType }: InterfaceInterfaceProps): SourceNode {
  const name = interfaceType.name;
  const operations = [...interfaceType.operations.values()];

  return (
    <>
      interface {name}{" "}
      <Block>
        {operations.map((operation) => {
          return <FunctionSignature operation={operation} />;
        })}
      </Block>
    </>
  );
}

function InterfaceModel({ model }: InterfaceModelProps): SourceNode {
  // TODO: Handle extends, implements, and other properties
  const properties = [...model.properties.values()];
  return (
    <>
      interface {model.name} <lb />
      {properties.map((p) => {
        return <ObjectValue.Property name={p.name} value={<Reference type={p.type} />} />;
      })}
      <rb />
    </>
  );
}

function isInterfaceModel(props: any): props is InterfaceModelProps {
  return "model" in props;
}

function isInterfaceInterface(props: any): props is InterfaceInterfaceProps {
  return "interfaceType" in props;
}

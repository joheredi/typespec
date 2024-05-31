import { SourceNode } from "#jsx/jsx-runtime";
import { Interface, Model, Type } from "@typespec/compiler";
import { Reference } from "../framework/components/reference.js";
import { Block } from "./block.js";
import { FunctionSignature } from "./function.js";
import { ObjectValue } from "./value.js";

export interface InterfaceModelProps {
  model: Model;
  interfaceType?: never;
}

export interface InterfaceInterfaceProps {
  model?: never;
  interfaceType: Interface;
}

export type InterfaceProps = InterfaceModelProps | InterfaceInterfaceProps;

function InterfaceComponent(props: InterfaceProps): SourceNode {
  let name: string;
  let extendsFrom: (Model | Interface)[] | undefined;
  let interfaceBody: SourceNode;

  if (isInterfaceModel(props)) {
    const { model } = props;
    name = model.name;
    extendsFrom = model.baseModel ? [model.baseModel] : undefined;
    const properties = [...model.properties.values()];
    interfaceBody = (
      <Block>
        {properties.map((p) => {
          return <ObjectValue.Property name={p.name} value={<Reference type={p.type} />} />;
        })}
      </Block>
    );
  } else if (isInterfaceInterface(props)) {
    const { interfaceType } = props;
    name = interfaceType.name;
    extendsFrom = interfaceType.sourceInterfaces;
    const operations = [...interfaceType.operations.values()];
    interfaceBody = (
      <Block>
        {operations.map((operation) => {
          return (
            <>
              <FunctionSignature operation={operation} />;
            </>
          );
        })}
      </Block>
    );
  } else {
    throw new Error("Not implemented: Handle custom interface definition");
  }

  return (
    <>
      interface {name} <InterfaceComponent.Extends types={extendsFrom} />
      {interfaceBody}
    </>
  );
}

interface InterfaceExtendsProps {
  types?: Type[];
}

InterfaceComponent.Extends = function Extends({ types }: InterfaceExtendsProps): SourceNode {
  if (!types || types.length === 0) {
    return <></>;
  }

  return (
    <>
      extends{" "}
      {types.map((type, index) => (
        <>
          <Reference type={type} /> {isLastExtended(types, index) ? "" : ","}
        </>
      ))}
    </>
  );
};

function isLastExtended(types: Type[], index: number) {
  if (types.length - 1 === index) {
    return true;
  }

  return false;
}

function isInterfaceModel(props: any): props is InterfaceModelProps {
  return "model" in props;
}

function isInterfaceInterface(props: any): props is InterfaceInterfaceProps {
  return "interfaceType" in props;
}

export { InterfaceComponent as Interface };

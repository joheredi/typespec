import { SourceNode } from "#jsx/jsx-runtime";
import { Model, Operation } from "@typespec/compiler";
import { Reference } from "../framework/components/reference.js";
import { Block } from "./block.js";
import { ObjectValue } from "./value.js";
export interface FunctionProps {
  operation?: Operation;
  name?: string;
  children?: SourceNode[];
}

export function Function({ operation, name, children }: FunctionProps) {
  const functionName = name ?? operation!.name;
  const parameters = operation?.parameters;
  if (!children) {
    return (
      <>
        function {functionName} (
        <Function.Parameters parameters={parameters} />)
        <Block>
          <Function.Body />
        </Block>
      </>
    );
  }

  // Changed this to handle then the Function actually get the parameters and body as children
  const parametersNode = children?.filter((child) => (child as any).type === Function.Parameters);
  const bodyNode = children?.filter((child) => (child as any).type === Function.Body);
  return (
    <>
      function {functionName}({parametersNode}){bodyNode ? <Block>{bodyNode}</Block> : <></>}
    </>
  );
}

export interface FunctionParametersProps {
  parameters?: Model;
  children?: SourceNode[];
}

Function.Parameters = function Parameters({ parameters, children }: FunctionParametersProps) {
  if (children) {
    return children;
  } else {
    const properties = [...parameters!.properties.values()];

    for (const param of properties) {
      // TODO: Handle the type and optionality
      return <ObjectValue.Property name={param.name} value={<Reference type={param.type} />} />;
    }
    // do the default thing.
  }
};

export interface FunctionBodyProps {
  operation?: Operation;
  children?: SourceNode[];
}

Function.Body = function Body({ operation, children }: FunctionBodyProps) {
  return children;
};

export function FunctionSignature({ operation, name }: FunctionProps): SourceNode {
  const functionName = name ?? operation!.name;
  const parameters = operation?.parameters;

  return (
    <>
      {functionName}(
      <Function.Parameters parameters={parameters} />)
    </>
  );
}

import { Property, createElement } from "codegenx";
import { ModelProperty, Program, getDoc } from "../../../src/index.js";
import { EmitEntity } from "../../../src/emitter-framework/types.js";

export interface ModelPropertyProps {
  property: ModelProperty;
  type: string;
  program: Program;
}

export default function ModelProperty({ property, program, type }: ModelPropertyProps) {
  const name = property.name === "_" ? "statusCode" : property.name;
  const doc = getDoc(program, property);

  return <Property name={name} docs={doc} type={type} required={!property.optional} />;
}

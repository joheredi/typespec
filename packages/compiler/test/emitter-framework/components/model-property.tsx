import { Property } from "codegenx";
import { ModelProperty, Program, getDoc } from "../../../src/index.js";

export interface ModelPropertylProps {
  property: ModelProperty;
  program: Program;
}

export default function ModelProperty({ property, program }: ModelPropertylProps) {
  const name = property.name === "_" ? "statusCode" : property.name;
  const doc = getDoc(program, property);
  return <Property name={name} docs={doc} type={"any"} required={!property.optional} />;
}

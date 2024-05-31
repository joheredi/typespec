import { SourceNode } from "#jsx/jsx-runtime";
import { Type } from "@typespec/compiler";

export interface ReferenceProps {
  type: Type;
}

// TODO: implement this
export function Reference({ type }: ReferenceProps): SourceNode {
  return <>any</>;
}

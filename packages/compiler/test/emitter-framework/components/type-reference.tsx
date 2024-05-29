import { ObjectBuilder } from "../../../src/emitter-framework/index.js";
import { Placeholder } from "../../../src/emitter-framework/placeholder.js";
import { EmitEntity } from "../../../src/emitter-framework/types.js";

export interface RefProps {
  reference: EmitEntity<string>;
}

export default function Ref({ reference }: RefProps) {
  let typeReference: string = "any";

  if (reference.kind === "code") {
    if (isPlaceholder(reference.value)) {
      // TODO - Figure out this part with circular references
      reference.value.onValue((v) => (typeReference = v));
    } else {
      typeReference = reference.value;
    }
  } else if (reference.kind === "declaration") {
    typeReference = reference.name;
  }

  return typeReference;
}

function isPlaceholder(value: any): value is Placeholder<string> {
  return value.onValue !== undefined;
}

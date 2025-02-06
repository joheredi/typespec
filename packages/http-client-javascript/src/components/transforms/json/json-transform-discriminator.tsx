import * as ay from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { Discriminator, Model, Union } from "@typespec/compiler";
import { $ } from "@typespec/compiler/experimental/typekit";
import { JsonTransform } from "./json-transform.jsx";

export interface JsonTransformDiscriminatorProps {
  itemRef: ay.Refkey | ay.Children;
  discriminator: Discriminator;
  type: Union | Model;
  target: "application" | "transport";
}

export function JsonTransformDiscriminator(props: JsonTransformDiscriminatorProps) {
  const discriminatedUnion = $.type.getDiscriminatedUnion(props.type)!;

  const discriminatorRef = ay.code`${props.itemRef}.${props.discriminator.propertyName}`;

  // Need to cast to make sure that the general types which usually have a broader
  // type in the discriminator are compatible.
  const itemRef = ay.code`${props.itemRef} as any`;
  const discriminatingCases = ay.mapJoin(
    discriminatedUnion.variants,
    (name, variant) => {
      return ay.code`
    if( discriminatorValue === ${JSON.stringify(name)}) {
      return ${(<JsonTransform type={variant.type} target={props.target} itemRef={itemRef} />)}!
    }
    `;
    },
    { joiner: "\n\n" },
  );

  return (
    <>
      const discriminatorValue = {discriminatorRef};
      {discriminatingCases}
      <>
      console.warn(`Received unknown kind: ` + discriminatorValue); 
      return {itemRef}</>
    </>
  );
}

export function getJsonTransformDiscriminatorRefkey(type: Union | Model) {
  return ay.refkey(type, "json_transform_discriminator");
}

export interface JsonTransformDiscriminatorDeclarationProps {
  type: Union | Model;
  target: "application" | "transport";
}

export function JsonTransformDiscriminatorDeclaration(
  props: JsonTransformDiscriminatorDeclarationProps,
) {
  const discriminator = $.type.getDiscriminator(props.type);
  if (!discriminator) {
    return null;
  }

  const namePolicy = ay.useNamePolicy();
  const transformName = namePolicy.getName(
    `json_${props.type.name}_to_${props.target}_discriminator`,
    "function",
  );

  const typeRef = ay.refkey(props.type);
  const returnType = props.target === "transport" ? "any" : typeRef;
  const inputType = props.target === "transport" ? typeRef : "any";
  const inputRef = ay.refkey();

  const parameters: Record<string, ts.ParameterDescriptor> = {
    input_: { type: inputType, refkey: inputRef, optional: true },
  };

  return (
    <ts.FunctionDeclaration
      name={transformName}
      export
      returnType={returnType}
      parameters={parameters}
      refkey={getJsonTransformDiscriminatorRefkey(props.type)}
    >
      {ay.code`
    if(!${inputRef}) {
      return ${inputRef} as any;
    }
    `}
      <JsonTransformDiscriminator {...props} itemRef={inputRef} discriminator={discriminator} />
    </ts.FunctionDeclaration>
  );
}

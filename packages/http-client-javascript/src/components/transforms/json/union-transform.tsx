import * as ay from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { Type, Union } from "@typespec/compiler";
import { $ } from "@typespec/compiler/typekit";
import { JsonTransformDiscriminator } from "./json-transform-discriminator.jsx";
import { JsonTransform } from "./json-transform.jsx";

export interface JsonUnionTransformProps {
  itemRef: ay.Refkey | ay.Children;
  type: Union;
  target: "transport" | "application";
}

export function JsonUnionTransform(props: JsonUnionTransformProps) {
  const discriminator = $.type.getDiscriminator(props.type);
  if (discriminator) {
    return <JsonTransformDiscriminator {...props} discriminator={discriminator}/>;
  }

  const variantType = props.type.variants.values().next().value!.type;
  let variantKind: Type["kind"] = variantType.kind;
  for (const [_name, variant] of props.type.variants) {
    if (!variantType) {
      variantKind = variant.type.kind;
      continue;
    }

    if (variantKind !== variant.type.kind) {
      throw new Error("Union with multiple variant types is not supported");
    }
  }

  return <JsonTransform {...props} type={variantType} />;
}

export function getJsonUnionTransformRefkey(
  type: Union,
  target: "transport" | "application",
): ay.Refkey {
  return ay.refkey(type, "json_union_transform", target);
}
export interface JsonUnionTransformDeclarationProps {
  type: Union;
  target: "transport" | "application";
}

export function JsonUnionTransformDeclaration(props: JsonUnionTransformDeclarationProps) {
  const namePolicy = ts.useTSNamePolicy();
  const transformName = namePolicy.getName(
    `json_${props.type.name}_to_${props.target}_transform`,
    "function",
  );

  const typeRef = ay.refkey(props.type);
  const returnType = props.target === "transport" ? "any" : typeRef;
  const inputType = props.target === "transport" ? typeRef : "any";
  const inputRef = ay.refkey();

  const parameters: Record<string, ts.ParameterDescriptor> = {
    input_: { type: inputType, refkey: inputRef },
  };

  const declarationRefkey = getJsonUnionTransformRefkey(props.type, props.target);
  return <ts.FunctionDeclaration name={transformName} export returnType={returnType} parameters={parameters} refkey={declarationRefkey} >
    <JsonUnionTransform {...props} itemRef={inputRef} />
  </ts.FunctionDeclaration>;
}

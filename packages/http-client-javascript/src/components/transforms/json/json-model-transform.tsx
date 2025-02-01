import * as ay from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";

import { Model } from "@typespec/compiler";
import { JsonModelPropertyTransform } from "./json-model-property-transform.jsx";
import { JsonTransformDiscriminatorDeclaration } from "./json-transform-discriminator.jsx";
import { JsonTransform } from "./json-transform.jsx";

export interface JsonModelTransformProps {
  itemRef: ay.Refkey | ay.Children;
  type: Model;
  target: "transport" | "application";
}

export function JsonModelTransform(props: JsonModelTransformProps) {
  const baseModel = props.type.baseModel;
  let baseModelTransform = null;

  if (baseModel) {
    baseModelTransform = <>...<JsonTransform {...props} type={baseModel} />,</>;
  }

  return <ts.ObjectExpression>
    {baseModelTransform}
    {ay.mapJoin(props.type.properties, (_, property) => {
      return <JsonModelPropertyTransform itemRef={props.itemRef} type={property} target={props.target}/>;
    }, {joiner: ",\n"})}
  </ts.ObjectExpression>;
}

export function getJsonModelTransformRefkey(type: Model) {
  return ay.refkey(type, "json_model_transform");
}

export interface JsonModelTransformDeclarationProps {
  type: Model;
  target: "transport" | "application";
}

export function JsonModelTransformDeclaration(
  props: JsonModelTransformDeclarationProps,
): ay.Component {
  const namePolicy = ts.useTSNamePolicy();
  const transformName = namePolicy.getName(
    `json_${props.type.name}_to_${props.target}_transform`,
    "function",
  );

  const returnType = props.target === "transport" ? "any" : ay.refkey(props.type);
  const inputType = props.target === "transport" ? ay.refkey(props.type) : "any";
  const inputRef = ay.refkey();

  const parameters: Record<string, ts.ParameterDescriptor> = {
    input_: { type: inputType, refkey: inputRef },
  };

  const declarationRefkey = getJsonModelTransformRefkey(props.type);
  return <>
  <JsonTransformDiscriminatorDeclaration type={props.type} target={props.target} />

  <ts.FunctionDeclaration name={transformName} export returnType={returnType} parameters={parameters} refkey={declarationRefkey} >
    return <JsonModelTransform {...props} itemRef={inputRef} />
  </ts.FunctionDeclaration>
  </>;
}

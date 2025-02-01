import { Children, Refkey } from "@alloy-js/core";
import { EncodeData, ModelProperty, Scalar } from "@typespec/compiler";
import { $ } from "@typespec/compiler/typekit";
import { getScalarTransformer } from "./scalar-transform.jsx";

export interface ScalarDataTransformProps {
  itemRef: Refkey | Children;
  type: Scalar;
  target: "transport" | "application";
  encoding?: EncodeData;
}

export interface ModelPropertyDataTransformProps {
  itemRef: Refkey | Children;
  type: ModelProperty;
  target: "transport" | "application";
  encoding?: EncodeData;
}

export function DataTransform(props: ScalarDataTransformProps | ModelPropertyDataTransformProps) {
  if (isScalarProps(props)) {
    return <ScalarDataTransform {...props} />;
  }

  if (isModelPropertyProps(props)) {
    return <ModelPropertyDataTransform {...props as ModelPropertyDataTransformProps}/>;
  }

  return null;
}

function ScalarDataTransform(props: ScalarDataTransformProps) {
  const encoding = props.encoding ?? $.scalar.getEncoding(props.type);

  const { toApplication, toTransport } = getScalarTransformer(props.type);

  return props.target === "transport"
    ? toTransport(props.itemRef, encoding)
    : toApplication(props.itemRef, encoding);
}

function ModelPropertyDataTransform(props: ModelPropertyDataTransformProps) {
  const encoding = props.encoding ?? $.modelProperty.getEncoding(props.type);

  const propertyValue = props.type.type;

  if (!$.scalar.is(propertyValue)) {
    throw new Error("ModelPropertyDataTransform only supports scalar properties");
  }

  return <ScalarDataTransform type={propertyValue} encoding={encoding} target={props.target} itemRef={props.itemRef}/>;
}

function isScalarProps(props: any): props is ScalarDataTransformProps {
  return $.scalar.is(props.type);
}

function isModelPropertyProps(props: any): props is ModelPropertyDataTransformProps {
  return $.modelProperty.is(props.type);
}

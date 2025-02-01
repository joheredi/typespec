import { Children, Refkey } from "@alloy-js/core";
import { EncodeData, Scalar } from "@typespec/compiler";
import { $ } from "@typespec/compiler/typekit";
import { getScalarTransformer } from "./scalar-transform.jsx";

export interface ScalarDataTransformProps {
  itemRef: Refkey | Children;
  type: Scalar;
  target: "transport" | "application";
  encoding?: EncodeData;
}

export function ScalarDataTransform(props: ScalarDataTransformProps) {
  const encoding = props.encoding ?? $.scalar.getEncoding(props.type);

  const { toApplication, toTransport } = getScalarTransformer(props.type);

  return props.target === "transport"
    ? toTransport(props.itemRef, encoding)
    : toApplication(props.itemRef, encoding);
}

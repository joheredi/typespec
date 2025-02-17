import * as ay from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { EncodeData, ModelProperty, Type } from "@typespec/compiler";
import { $ } from "@typespec/compiler/experimental/typekit";
import { ScalarDataTransform } from "../data-transform.jsx";
import { useTransformNamePolicy } from "../transform-name-policy.js";
import { JsonTransform } from "./json-transform.jsx";

export interface JsonModelPropertyTransformProps {
  itemRef: ay.Refkey | ay.Children;
  type: ModelProperty;
  target: "transport" | "application";
  encoding?: EncodeData;
}

export function JsonModelPropertyTransform(props: JsonModelPropertyTransformProps): ay.Component {
  const transformNamer = useTransformNamePolicy();
  const encoding = $.modelProperty.getEncoding(props.type) ?? props.encoding;
  const propertyValueType = unpackProperty(props.type);

  const transportName = transformNamer.getTransportName(props.type);
  const applicationName = transformNamer.getApplicationName(props.type);
  const targetName = props.target === "transport" ? transportName : applicationName;
  const sourceName = props.target === "transport" ? applicationName : transportName;

  const propertyValueRef = props.itemRef ? ay.code`${props.itemRef}.${sourceName}` : sourceName;
  let propertyValue: ay.Children;

  if ($.scalar.is(propertyValueType)) {
    propertyValue =
      <ScalarDataTransform
        type={propertyValueType}
        encoding={encoding}
        target={props.target}
        itemRef={propertyValueRef}
      />;
  } else {
    propertyValue =
      <JsonTransform type={propertyValueType} target={props.target} itemRef={propertyValueRef} />;
  }

  return <ts.ObjectProperty name={JSON.stringify(targetName)} value={propertyValue} />;
}

function unpackProperty(modelProperty: ModelProperty): Type {
  const type = $.httpPart.unpack(modelProperty.type) ?? modelProperty.type;
  if ($.modelProperty.is(type)) {
    return unpackProperty(type);
  }

  return type;
}

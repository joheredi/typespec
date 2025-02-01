import * as ay from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { ModelProperty } from "@typespec/compiler";
import { $ } from "@typespec/compiler/typekit";
import { ScalarDataTransform } from "../data-transform.jsx";
import { JsonTransform } from "./json-transform.jsx";

export interface JsonModelPropertyTransformProps {
  itemRef: ay.Refkey | ay.Children;
  type: ModelProperty;
  target: "transport" | "application";
}

export function JsonModelPropertyTransform(props: JsonModelPropertyTransformProps): ay.Component {
  const encoding = $.modelProperty.getEncoding(props.type);
  const propertyValueType = props.type.type;

  const namePolicy = ts.useTSNamePolicy();
  const transportName = props.type.name;
  const applicationName = namePolicy.getName(transportName, "object-member-data");
  const targetName = props.target === "transport" ? transportName : applicationName;
  const sourceName = props.target === "transport" ? applicationName : transportName;

  const propertyValueRef = ay.code`${props.itemRef}.${sourceName}`;
  let propertyValue: ay.Children;

  if ($.scalar.is(propertyValueType)) {
    propertyValue =
      <ScalarDataTransform type={propertyValueType} encoding={encoding} target={props.target} itemRef={propertyValueRef}/>;
  } else {
    propertyValue =
      <JsonTransform type={propertyValueType} target={props.target} itemRef={propertyValueRef}/>;
  }

  return <ts.ObjectProperty name={targetName} value={propertyValue} />;
}

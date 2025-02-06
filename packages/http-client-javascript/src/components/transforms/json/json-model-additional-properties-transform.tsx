import * as ay from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import {Model} from "@typespec/compiler";
import { $ } from "@typespec/compiler/experimental/typekit";
import { getJsonRecordTransformRefkey } from "./json-record-transform.jsx";

export interface JsonAdditionalPropertiesTransformProps {
  itemRef: ay.Children;
  type: Model;
  target: "transport" | "application"
}

export function JsonAdditionalPropertiesTransform(props: JsonAdditionalPropertiesTransformProps) {
  const additionalProperties = $.model.getSpreadType(props.type) as Model;

  // TODO: Revisit additional properties TypeKit for better UX
  if(!additionalProperties || !$.record.is(additionalProperties)) {
    return null;
  }

  
  if(props.target === "application") {
    return <>
    <ts.ObjectProperty name="additionalProperties">
      {getJsonRecordTransformRefkey(additionalProperties, props.target)}({props.itemRef})
    </ts.ObjectProperty>,
    </>
  }

  const itemRef = ay.code`${props.itemRef}.additionalProperties`;
  const destructuredProperties = ay.mapJoin(props.type.properties, (name) => name, {joiner: ",", ender: ","})
  const inlineDestructure = ay.code`(({${destructuredProperties} ...additionalProperties}) => additionalProperties)(${itemRef})`
  return <>
          ...{getJsonRecordTransformRefkey(additionalProperties, props.target)}{inlineDestructure},
  </>
}

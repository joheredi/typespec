import * as ay from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { ModelProperty, Type } from "@typespec/compiler";
import { $ } from "@typespec/compiler/typekit";
import { isHttpFile } from "@typespec/http";
import { getCreateFilePartDescriptorReference } from "../static-helpers/multipart-helpers.jsx";
import { TypeTransformCall } from "./type-transform-call.jsx";

export interface BodyPartProps {
  type: ModelProperty;
  target: "application" | "transport";
  itemPath?: string[];
}

export function BodyPart(props: BodyPartProps) {
  const namePolicy = ts.useTSNamePolicy();
  const applicationName = namePolicy.getName(props.type.name, "object-member-data");
  const transportName = props.type.name;
  const propertyName = props.target === "application" ? applicationName : transportName;
  const partType = $.httpPart.unpack(props.type.type);

  const { type: _type, itemPath: _itemPath = [], ...partProps } = props;
  const itemPath = [..._itemPath];
  itemPath.push(propertyName);
  const itemRef = itemPath.join(".");

  if ($.array.is(props.type.type)) {
    return <BodyPartArray itemPath={itemPath} type={props.type} {...partProps}  />;
  }

  if (isFile(partType)) {
    return <ts.FunctionCallExpression refkey={getCreateFilePartDescriptorReference()} args={[ts.ValueExpression({jsValue: transportName}), itemRef]} />;
  }

  return <ts.ObjectExpression>
<ts.ObjectProperty name="name" jsValue={transportName} />,
<ts.ObjectProperty name="body" value={<TypeTransformCall target={props.target} type={partType} itemPath={[...itemPath]} />} />
</ts.ObjectExpression>;
}

function BodyPartArray(props: BodyPartProps) {
  if (!$.model.is(props.type.type) || !$.array.is(props.type.type)) {
    return <BodyPart target={props.target} type={props.type} />;
  }

  const element = $.array.getElementType(props.type.type);
  const itemPath = props.itemPath ?? [];
  const itemRef = itemPath.join(".");
  const part = $.modelProperty.create({
    name: props.type.name,
    type: element,
    optional: props.type.optional,
    defaultValue: props.type.defaultValue,
  });
  return ay.code`...(${itemRef} ?? []).map((x: any) => (${<BodyPart target={props.target} type={part} itemPath={["x"]} />}))`;
}

function isFile(type: Type) {
  if (!$.model.is(type)) {
    return false;
  }
  if (isHttpFile($.program, type)) {
    return true;
  }

  if (type.baseModel) {
    return isFile(type.baseModel);
  }

  return false;
}

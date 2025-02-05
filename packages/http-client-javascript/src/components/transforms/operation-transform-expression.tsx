import * as ts from "@alloy-js/typescript";
import { Type } from "@typespec/compiler";
import { $ } from "@typespec/compiler/experimental/typekit";
import { HasName, TransformNamePolicyContext } from "@typespec/emitter-framework";
import { ClientOperation } from "@typespec/http-client";
import { reportDiagnostic } from "../../lib.js";
import { JsonTransform } from "./json/json-transform.jsx";
import { MultipartTransform } from "./multipart/multipart-transform.jsx";
import { defaultTransportNameGetter } from "./transform-name-policy.js";

export interface OperationTransformToTransportExpression {
  operation: ClientOperation;
}

export function OperationTransformExpression(props: OperationTransformToTransportExpression) {
  const body = props.operation.httpOperation.parameters.body;

  // TODO: Handle content types other than application/json and multipart

  if (!body) {
    return;
  }

  const itemRef = body.property ? body.property.name : null;

  if (body.bodyKind === "multipart") {
    return <MultipartTransform body={body} />;
  }

  const payloadType = body.type;
  return <TransformNamePolicyContext.Provider value={{ getTransportName: defaultTransportNameGetter, getApplicationName: payloadApplicationNameGetter }}>
      <JsonTransform itemRef={itemRef} target="transport" type={payloadType}  />
  </TransformNamePolicyContext.Provider>;
}

function payloadApplicationNameGetter(type: HasName<Type>) {
  if (typeof type.name !== "string") {
    reportDiagnostic($.program, { code: "symbol-name-not-supported", target: type });
    return "";
  }

  const namePolicy = ts.useTSNamePolicy();
  let name = namePolicy.getName(type.name, "object-member-data");

  if ($.modelProperty.is(type) && type.optional) {
    name = `options?.${name}`;
  }

  return name;
}

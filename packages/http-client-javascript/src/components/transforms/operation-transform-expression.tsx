import * as ay from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { Type } from "@typespec/compiler";
import { $ } from "@typespec/compiler/typekit";
import { HasName, TransformNamePolicyContext } from "@typespec/emitter-framework";
import * as ef from "@typespec/emitter-framework/typescript";
import { HttpOperationBody, HttpOperationMultipartBody, HttpOperationPart } from "@typespec/http";
import { ClientOperation } from "@typespec/http-client-library";
import { reportDiagnostic } from "../../lib.js";
import { getCreateFilePartDescriptorReference } from "../static-helpers/multipart-helpers.jsx";
import { JsonTransform } from "./json/json-transform.jsx";
import { HttpPartExpressionProps } from "./operation-transform-declaration.jsx";
import { defaultTransportNameGetter } from "./transform-name-policy.js";

export interface OperationTransformToTransportExpression {
  operation: ClientOperation;
}

export function OperationTransformExpression(props: OperationTransformToTransportExpression) {
  const payload = props.operation.httpOperation.parameters.body;

  // TODO: Handle content types other than application/json and multipart

  if (!payload) {
    return;
  }

  if (payload.bodyKind === "multipart") {
    return <MultipartTransformExpression operation={props.operation} payload={payload} />;
  }

  const itemRef = payload.property ? "payload" : null;
  const payloadType = payload.property ?? payload.type;
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

export interface MultipartTransformExpressionProps {
  operation: ClientOperation;
  payload: HttpOperationMultipartBody;
}

export function MultipartTransformExpression(props: MultipartTransformExpressionProps) {
  const parts = props.payload.parts;
  const inputRef = ay.refkey(props.payload, "property");

  return <>[{ay.mapJoin(parts, (part) => <HttpPartExpression part={part} inputRef={inputRef}/>, {
    joiner: ",\n",
  })}]</>;
}

export function HttpPartExpression(props: HttpPartExpressionProps) {
  const namePolicy = ts.useTSNamePolicy();
  const partName = ts.ValueExpression({ jsValue: props.part.name });

  const partApplicationName = namePolicy.getName(props.part.name!, "object-member-data");

  if (isPartArray(props.part)) {
    const xRef = ay.refkey();
    const xDec =
      <ts.Declaration name="x" nameKind="variable" refkey={xRef}>(<ay.Name />: any)</ts.Declaration>;
    const inputExpression = props.part.optional ? (
      <>...({props.inputRef}.{partApplicationName} ?? [])</>
    ) : (
      <>...{props.inputRef}.{partApplicationName}</>
    );
    return <>
      {inputExpression}.map({xDec} {ay.code`=> (${<HttpPartExpression inputRef={xRef} part={{...props.part, multi: false}} />})`} )
    </>;
  }

  if (isFilePart(props.part)) {
    const defaultContentType = getDefaultContentType(props.part);
    const args: ay.Children = [partName, props.inputRef];
    if (defaultContentType) {
      args.push(ts.ValueExpression({ jsValue: defaultContentType }));
    }
    return <ts.FunctionCallExpression refkey={getCreateFilePartDescriptorReference()} args={args} />;
  }

  return <ts.ObjectExpression>
  <ts.ObjectProperty name="name" jsValue={partName} />,
  <ts.ObjectProperty name="body" value={<ef.TypeTransformCall target="transport" type={props.part.body.type} itemPath={["payload", partApplicationName]} />} />
  </ts.ObjectExpression>;
}

function isPartArray(part: HttpOperationPart) {
  return part.multi;
}

function isFilePart(part: HttpOperationPart) {
  return Boolean(part.filename);
}

export interface SingleBodyTransformDeclarationProps {
  operation: ClientOperation;
  payload: HttpOperationBody;
}

function getDefaultContentType(part: HttpOperationPart) {
  const contentTypes = part.body.contentTypes;
  if (contentTypes.length !== 1) {
    return undefined;
  }

  const contentType = contentTypes[0];

  if (!contentType || contentType === "*/*") {
    return undefined;
  }

  return contentType;
}

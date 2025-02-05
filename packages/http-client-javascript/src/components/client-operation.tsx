import * as ay from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { $ } from "@typespec/compiler/experimental/typekit";
import { FunctionDeclaration, TypeExpression } from "@typespec/emitter-framework/typescript";
import * as cl from "@typespec/http-client";
import { getClientcontextDeclarationRef } from "./client-context/client-context-declaration.jsx";
import { HttpRequest } from "./http-request.jsx";
import { HttpResponse } from "./http-response.jsx";

export interface ClientOperationsProps {
  client: cl.Client;
}

export function ClientOperations(props: ClientOperationsProps) {
  const namePolicy = ts.useTSNamePolicy();
  const clientOperations = props.client.operations;
  const fileName = namePolicy.getName(props.client.name + "Operations", "variable");

  if (clientOperations.length === 0) {
    return null;
  }

  return <ts.SourceFile path={`${fileName}.ts`}>
  {ay.mapJoin(clientOperations, (operation) => {
    return <ClientOperation operation={operation} />;
  })}
</ts.SourceFile>;
}

export interface ClientOperationProps {
  operation: cl.ClientOperation;
}

export function ClientOperation(props: ClientOperationProps) {
  const client = props.operation.client;
  const returnType = $.httpOperation.getReturnType(props.operation.httpOperation);
  const responseRefkey = ay.refkey(props.operation, "http-response");
  const clientContextInterfaceRef = getClientcontextDeclarationRef(client);
  const signatureParams: Record<string, ts.ParameterDescriptor> = {
    client: { type: clientContextInterfaceRef, refkey: ay.refkey(client, "client") },
  };
  return <FunctionDeclaration export async type={props.operation.operation} returnType={<TypeExpression type={returnType} />} parametersMode="prepend" parameters={signatureParams}>
      <HttpRequest operation={props.operation} responseRefkey={responseRefkey} />
      <HttpResponse operation={props.operation} responseRefkey={responseRefkey} />
    </FunctionDeclaration>;
}

import * as ay from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { $ } from "@typespec/compiler/typekit";
import { FunctionDeclaration, TypeExpression } from "@typespec/emitter-framework/typescript";
import * as cl from "@typespec/http-client-library";
import { httpParamsMutator, MutatedOperationMap } from "../utils/operations.js";
import { getContextDeclarationRefkey } from "./client-context.jsx";
import { flattenClients } from "./client-v2.jsx";
import { HttpRequest } from "./http-request.jsx";
import { HttpResponse } from "./http-response.jsx";
export interface OperationsProps {
  client?: cl.Client;
}

export function Operations(props: OperationsProps) {
  if (!props.client) {
    return null;
  }

  const clients = flattenClients(props.client);

  return <>
  {ay.mapJoin(clients, c => <OperationsFile client={c}/>)}
  </>;
}

interface OperationsFileProps {
  client: cl.Client;
  children?: ay.Children;
}
function OperationsFile(props: OperationsFileProps) {
  const namePolicy = ts.createTSNamePolicy();
  const clientName = namePolicy.getName(props.client.name, "variable");
  const SubFolder = (_props: { children?: ay.Children }) => {
    return props.client?.parent ? (
      <ay.SourceDirectory path={clientName}>{_props.children}</ay.SourceDirectory>
    ) : (
      <>{_props.children}</>
    );
  };

  const operations = $.client.listServiceOperations(props.client, { mutator: httpParamsMutator });

  if (!operations.length) {
    return null;
  }

  const signatureParams = {
    client: <ts.Reference refkey={getContextDeclarationRefkey(props.client)}/>,
  };
  return <SubFolder>
    <ts.SourceFile path="operations.ts">
    {ay.mapJoin(operations, (op) => {
      const responseRefkey = ay.refkey();
      const originalOperation = MutatedOperationMap.get(op)!;
      return <FunctionDeclaration export async type={op} prependParameters  parameters={signatureParams} returnType={<TypeExpression type={op.returnType}/>}>
        <HttpRequest operation={originalOperation} responseRefkey={responseRefkey} />
        <HttpResponse operation={originalOperation} responseRefkey={responseRefkey} />
      </FunctionDeclaration>;
    })}
    </ts.SourceFile>
  </SubFolder>;
}

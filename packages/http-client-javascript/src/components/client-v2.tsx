import * as ay from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { ClassDeclaration } from "@alloy-js/typescript";
import { $ } from "@typespec/compiler/typekit";
import { ClassMethod, FunctionCallExpression } from "@typespec/emitter-framework/typescript";
import * as cl from "@typespec/http-client-library";
import { httpParamsMutator } from "../utils/operations.js";
import { getClientContextFactoryRefkey, getContextDeclarationRefkey } from "./client-context.jsx";

export interface ClientProps {
  client: cl.Client | undefined;
}

export function Client(props: ClientProps) {
  if (!props.client) {
    return null;
  }
  const namePolicy = ts.useTSNamePolicy();
  const name = namePolicy.getName($.client.getName(props.client), "class");
  const clients = flattenClients(props.client);

  return <ay.SourceDirectory path="clients"><ts.SourceFile path={`${name}.ts`}>
    {ay.mapJoin(clients, client => {
      const subClientName = namePolicy.getName($.client.getName(client), "class");
      const operations = $.client.listServiceOperations(client, {mutator: httpParamsMutator})
      const clients = $.clientLibrary.listClients(client);
      const thisContext = ay.refkey(client.type, "context");
      return <>
      <ClassDeclaration export name={subClientName} refkey={ay.refkey(client.type, "client")}>
          <ts.ClassField name="context" jsPrivate={true} refkey={thisContext} type={<ts.Reference refkey={getContextDeclarationRefkey(client)} />}/>
        {ay.mapJoin(clients, subClient => {
          const subClientName = namePolicy.getName(subClient.name, "class-member-getter");
          return (<ts.ClassField name={subClientName} type={<ts.Reference refkey={ay.refkey(subClient.type, "client")} />} refkey={ay.refkey(subClient.type, "member")} />)
        })}
        <ClientConstructor client={client} />
        {ay.mapJoin(operations, (op) => {
          const args = [...op.parameters.properties.keys()];
          return (
          <ClassMethod async type={op}>
            return <ts.FunctionCallExpression refkey={ay.refkey(op)} args={["this.#context", ...args]}/>;
          </ClassMethod>
          )}, { joiner: "\n" })}
    </ClassDeclaration>
    </>
})}
</ts.SourceFile>
</ay.SourceDirectory>;
}

interface ClientConstructorProps {
  client: cl.Client;
}

function ClientConstructor(props: ClientConstructorProps) {
  const subClients = $.clientLibrary.listClients(props.client);
  const thisContext = ay.refkey(props.client.type, "context");
  return <ClassMethod  name="constructor" returnType={null} type={$.client.getConstructor(props.client)}>
    {ay.mapJoin(subClients, subClient => {
      return <><ts.Reference refkey={ay.refkey(subClient.type, "member")} /> = new <FunctionCallExpression refkey={ay.refkey(subClient.type, "client")} type={$.client.getConstructor(subClient).parameters} /></>
    }, {joiner: "\n"})}
    <ts.Reference refkey={thisContext} /> = <FunctionCallExpression refkey={getClientContextFactoryRefkey(props.client)} type={$.client.getConstructor(props.client).parameters}  />

  </ClassMethod>;
}

export function flattenClients(client: cl.Client): cl.Client[] {
  const clientStack = [client];
  const clients: cl.Client[] = [];
  while (clientStack.length > 0) {
    const currentClient = clientStack.pop();
    if (currentClient) {
      clients.push(currentClient);
      clientStack.push(...$.clientLibrary.listClients(currentClient));
    }
  }

  return clients;
}

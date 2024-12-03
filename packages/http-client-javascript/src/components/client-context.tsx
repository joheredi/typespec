import { Children, mapJoin, refkey } from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { $ } from "@typespec/compiler/typekit";
import { FunctionDeclaration } from "@typespec/emitter-framework/typescript";
import * as cl from "@typespec/http-client-library";
import { buildClientAuthParameter, flattenClients } from "./client-v2.jsx";
import { httpRuntimeTemplateLib } from "./external-packages/ts-http-runtime.js";
export interface ClientContextProps {
  client?: cl.Client;
}

export function ClientContext(props: ClientContextProps): Children {
  if (!props.client) {
    return null;
  }

  const allClients = flattenClients(props.client);
  return <ts.SourceFile path={`clientContext.ts`}>
    {mapJoin(allClients, (client) => (<>
    <ClientContextDeclaration client={client} />
      <ClientOptionsDeclaration client={client} />
      <ClientContextFactoryDeclaration client={client} />
      </>), { joiner: "\n" })}
      
  </ts.SourceFile>;
}

interface ClientContextDeclarationProps {
  client: cl.Client;
}

export function getContextDeclarationRefkey(client: cl.Client) {
  return refkey(client.type, "context-declaration");
}

function ClientContextDeclaration(props: ClientContextDeclarationProps) {
  const namePolicy = ts.useTSNamePolicy();
  const name = namePolicy.getName(`${props.client.name}Context`, "interface");
  return <ts.InterfaceDeclaration export name={name} refkey={getContextDeclarationRefkey(props.client)} extends={<ts.Reference refkey={httpRuntimeTemplateLib.Client} />}/>;
}

interface ClientOptionsDeclarationProps {
  client: cl.Client;
}

export function getClientOptionsRefkey(client: cl.Client) {
  return refkey(client.type, "options-declaration");
}
function ClientOptionsDeclaration(props: ClientOptionsDeclarationProps) {
  const optionsDeclarationRefkey = getClientOptionsRefkey(props.client);

  const namePolicy = ts.useTSNamePolicy();
  const name = namePolicy.getName(`${props.client.name}Options`, "interface");

  // TODO: Here we will calculate and include all the options that the client can accept
  const clientOptions: Map<string, Children> = new Map();

  return <ts.InterfaceDeclaration export name={name} refkey={optionsDeclarationRefkey} extends={<ts.Reference refkey={httpRuntimeTemplateLib.ClientOptions}/>}>
        {mapJoin(clientOptions, (key, value) => (
          <ts.InterfaceMember optional name={key} type={value} />
        ), { joiner: ";\n" })}
        <ts.InterfaceMember optional name="endpoint" type="string" />
      </ts.InterfaceDeclaration>;
}

interface ClientContextFactoryDeclaration {
  client: cl.Client;
}

export function getClientContextFactoryRefkey(client: cl.Client) {
  return refkey(client.type, "context-factory");
}
function ClientContextFactoryDeclaration(props: ClientContextFactoryDeclaration) {
  const contextFactoryRefkey = getClientContextFactoryRefkey(props.client);
  const namePolicy = ts.useTSNamePolicy();
  const factoryFunctionName = namePolicy.getName(`create_${props.client.name}Context`, "function");

  const clientConstructor = $.client.getConstructor(props.client);

  const parameters = buildClientAuthParameter(props.client);

  return <FunctionDeclaration
  export
  name={factoryFunctionName}
  type={clientConstructor}
  returnType={<ts.Reference refkey={getContextDeclarationRefkey(props.client)} />}
  refkey={contextFactoryRefkey}
  parameters={parameters}
>
throw new Error("Not implemented");
</FunctionDeclaration>;
}

import { refkey as getRefkey, mapJoin, refkey } from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { Interface, Namespace, Operation, Service } from "@typespec/compiler";
import { ClassMethod, FunctionCallExpression } from "@typespec/emitter-framework/typescript";
import { prepareOperation } from "../utils/operations.js";
import { ClientContextFactoryRefkey, ClientContextRefkey } from "./client-context.jsx";
import * as cl from "@typespec/http-client-library";
import { $ } from "@typespec/compiler/typekit";

export interface ClientFileProps {
  name?: string;
  client: cl.Client;
}

export function ClientFile(props: ClientFileProps) {
  const clientlets = collectAllClients(props.client);

  return <ts.SourceFile path="client.ts"> 
    <Client client={props.client} />
    {mapJoin(clientlets, (clientlet) => <Client client={clientlet} />, {joiner: "\n\n"})}
  </ts.SourceFile>;
}

function collectAllClients(client: cl.Client): cl.Client[] {
  const clientlets = $.clientLibrary.listClients(client);
  return clientlets.reduce((acc, clientlet) => {
    return [...acc, ...collectAllClients(clientlet)];
  }, clientlets);
}

export interface ClientProps {
  name?: string;
  client: cl.Client;
}

export function Client(props: ClientProps) {
  const constructor = $.client.getConstructor(props.client);
  const namePolicy = ts.useTSNamePolicy();
  const name = props.name ?? props.client.name;
  const className = namePolicy.getName(name, "class");
  // TODO: Service Operations as Map?
  const methods = new Map($.client.listServiceOperations(props.client).map((op) => [op.name, op]));
  const clientlets = $.clientLibrary.listClients(props.client);
  // TODO: Add support for JS client parameters
  // const clientParameters = getClientParams(props.type, { isClientlet: props.clientlet });
  const thisContext = refkey();

  const contextInit = $.client.isPubliclyInitializable(props.client) ? (
    <> <ts.Reference refkey={thisContext} /> = <FunctionCallExpression refkey={ClientContextFactoryRefkey} type={constructor.parameters}  /></>
  ) : (
    <><ts.Reference refkey={thisContext} /> = context</>
  );


  return <ts.ClassDeclaration export name={className} refkey={getClientletClassRefkey(props.client.type)}>
  {mapJoin(clientlets, (client) => <ClientletField type={client.type} />, {joiner: "\n"})}
  <ts.ClassField name="context" jsPrivate={true} refkey={thisContext} type={<ts.Reference refkey={ClientContextRefkey} />}/>
    <ClassMethod type={constructor} returnType={null}>
     {contextInit}
      {mapJoin(clientlets, (client) => {
        return <>
          <ts.Reference refkey={getClientletFieldRefkey(client.type)} /> = new <ts.Reference refkey={getClientletClassRefkey(client.type)} />({thisContext});
        </>
      }, {joiner: "\n"})}
    </ClassMethod>
    <OperationClassMethods operations={methods} />
</ts.ClassDeclaration>;
}

export interface ClientletFieldProps {
  type: Namespace | Interface;
}

export function ClientletField(props: ClientletFieldProps) {
  const namePolicy = ts.useTSNamePolicy();
  const name = namePolicy.getName(props.type.name, "class");
  const refkey = getClientletClassRefkey(props.type);
  return <ts.ClassField 
    name={name} 
    type={<ts.Reference refkey={refkey}/>}
    refkey={getClientletFieldRefkey(props.type)} />;
}

function getClientletClassRefkey(type: Namespace | Interface) {
  return getRefkey(type, "client");
}

function getClientletFieldRefkey(type: Namespace | Interface) {
  return getRefkey(type, "field");
}

export interface ClientMethodsProps {
  operations: Map<string, Operation>;
}

export function OperationClassMethods(props: ClientMethodsProps) {
  return mapJoin(
    props.operations,
    (_name, operation) => {
      const preparedOperation = prepareOperation(operation);
      const args = [...preparedOperation.parameters.properties.keys()];
      return <ClassMethod type={preparedOperation} returnType="">
      return <ts.FunctionCallExpression refkey={getRefkey(preparedOperation)} args={["this.#context", ...args]}/>;
    </ClassMethod>;
    },
    { joiner: "\n\n" },
  );
}

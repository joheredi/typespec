import * as ay from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import * as cl from "@typespec/http-client-library";
import { useClientLibrary } from "@typespec/http-client-library";
import { ClientContext } from "./client-context/client-context.jsx";
import { ClientOperations } from "./client-operation.jsx";

export interface OperationsDirectoryProps {
  children?: ay.Children;
}

export function OperationsDirectory(props: OperationsDirectoryProps) {
  const { topLevel: clients } = useClientLibrary();
  // If it is the root client, we don't need to create a directory
  return ay.mapJoin(clients, (
    client,
  ) => <>
       <ClientOperations client={client} />
       <ClientContext client={client} />
       <SubClients client={client} />
    </>);
}

export interface SubClientsProps {
  client: cl.Client;
}

export function SubClients(props: SubClientsProps) {
  const subClients = props.client.subClients;

  return ay.mapJoin(subClients, (subClient) => {
    const namePolicy = ts.useTSNamePolicy();
    const subClientName = namePolicy.getName(subClient.name, "variable");
    return <ay.SourceDirectory path={subClientName}>
        <ClientOperations client={subClient} />
        <ClientContext client={subClient} />
        <SubClients client={subClient} />
    </ay.SourceDirectory>;
  });
}

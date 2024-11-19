import * as ay from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { ClassDeclaration } from "@alloy-js/typescript";
import { $ } from "@typespec/compiler/typekit";
import { ClassMethod } from "@typespec/emitter-framework/typescript";
import * as cl from "@typespec/http-client-library";

export interface ClientProps {
  client: cl.Client;
}

export function Client(props: ClientProps) {
  const namePolicy = ts.useTSNamePolicy();
  const name = namePolicy.getName($.client.getName(props.client), "class");
  const subClients = $.clientLibrary.listClients(props.client);
  const clients = [props.client, ...subClients];

  return <ay.SourceDirectory path="clients"><ts.SourceFile path={`${name}.ts`}>
    {ay.mapJoin(clients, client => {
      const operations = $.client.listServiceOperations(client)
      return <ClassDeclaration export name={name}>
        <ClassMethod  name="constructor" returnType={null} type={$.client.getConstructor(client)} />
        {ay.mapJoin(operations, (op) => <ClassMethod async type={op} />, { joiner: "\n" })}
    </ClassDeclaration>
})}
</ts.SourceFile>
</ay.SourceDirectory>;
}

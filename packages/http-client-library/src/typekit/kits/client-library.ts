import { Enum, getLocationContext, Interface, Model, Namespace } from "@typespec/compiler";
import { $, defineKit } from "@typespec/compiler/typekit";
import { Client } from "../../interfaces.js";

interface ClientLibraryKit {
  /**
   * Get the top-level namespaces that are used to generate the client library.
   *
   * @param namespace: If namespace param is given, we will return the children of the given namespace.
   *
   */
  listNamespaces(namespace?: Namespace): Namespace[];

  /**
   * List all of the clients in a given namespace.
   *
   * @param namespace namespace to get the clients of
   */
  listClients(type: Namespace | Client): Client[];

  /**
   * List all of the models in a given namespace.
   *
   * @param namespace namespace to get the models of
   */
  listModels(namespace: Namespace): Model[];

  /**
   * List all of the enums in a given namespace.
   *
   * @param namespace namespace to get the enums of
   */
  listEnums(namespace: Namespace): Enum[];
}

interface Typekit {
  clientLibrary: ClientLibraryKit;
}

declare module "@typespec/compiler/typekit" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TypekitPrototype extends Typekit {}
}

const clientCache = new Map<Namespace | Client, Client[]>();

defineKit<Typekit>({
  clientLibrary: {
    listNamespaces(namespace) {
      if (namespace) {
        return [...namespace.namespaces.values()];
      }
      return [...$.program.checker.getGlobalNamespaceType().namespaces.values()].filter(
        (n) => getLocationContext($.program, n).type === "project",
      );
    },
    listClients(type) {
      if (clientCache.has(type)) {
        return clientCache.get(type)!;
      }
      // if there is no explicit client, we will treat namespaces with service decorator as clients
      function getClientName(name: string): string {
        return name.endsWith("Client") ? name : `${name}Client`;
      }

      const client = type.kind === "Client" ? type : this.client.get(type);

      if (!client) {
        clientCache.set(type, []);
        return [];
      }
      const clientType = client.type;
      const clientIsNamespace = clientType.kind === "Namespace";
      if (!clientIsNamespace) {
        clientCache.set(type, []);
        return [];
      }
      const subnamespaces: (Namespace | Interface)[] = [
        ...$.clientLibrary.listNamespaces(clientType),
        ...clientType.interfaces.values(),
      ];
      const subClients = subnamespaces.map((sn) => {
        const parent = $.client.getParent(sn);
        return {
          kind: "Client",
          name: getClientName(sn.name),
          service: sn,
          type: sn,
          parent,
        } as Client;
      });

      clientCache.set(type, subClients);
      return subClients;
    },
    listModels(namespace) {
      const allModels = [...namespace.models.values()];
      const modelsMap: Map<string, Model> = new Map();
      for (const op of namespace.operations.values()) {
        for (const param of op.parameters.properties.values()) {
          if (param.type.kind === "Model" && allModels.includes(param.type)) {
            modelsMap.set(param.type.name, param.type);
            for (const prop of param.type.properties.values()) {
              if (
                prop.type.kind === "Model" &&
                allModels.includes(prop.type) &&
                !modelsMap.has(prop.type.name)
              ) {
                modelsMap.set(prop.type.name, prop.type);
              }
            }
          }
          if (
            param.sourceProperty?.type.kind === "Model" &&
            allModels.includes(param.sourceProperty?.type)
          ) {
            modelsMap.set(param.sourceProperty?.type.name, param.sourceProperty?.type);
          }
        }
      }
      return [...modelsMap.values()];
    },
    listEnums(namespace) {
      return [...namespace.enums.values()];
    },
  },
});

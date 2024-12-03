import {
  Interface,
  isTemplateDeclarationOrInstance,
  listServices,
  Namespace,
  Operation,
  Service,
} from "@typespec/compiler";
import { unsafe_Mutator as Mutator } from "@typespec/compiler/experimental";
import { $, defineKit } from "@typespec/compiler/typekit";
import { getAuthentication, getServers, HttpAuth } from "@typespec/http";
import { Client } from "../../interfaces.js";
import { createBaseConstructor, getConstructors } from "../../utils/client-helpers.js";
import { NameKit } from "./utils.js";

interface ClientKit extends NameKit<Client> {
  /**
   * Get the constructor for a client. Will return the base intersection of all possible constructors.
   *
   * If you'd like to look at overloads, call `$.operation.getOverloads` on the result of this function.
   *
   * @param client The client we're getting constructors for
   */
  getConstructor(client: Client): Operation;

  /**
   * Whether the client is publicly initializable
   */
  isPubliclyInitializable(client: Client): boolean;

  /**
   * Return the methods on the client
   *
   * @param client the client to get the methods for
   */
  listServiceOperations(client: Client, options?: { mutator?: Mutator }): Operation[];

  /**
   * Get the url template of a client, given its constructor as well */
  getUrlTemplate(client: Client, constructor: Operation): string;

  /**
   * Get the Client for a give namespace
   * @param namepace The namespace to get the client for
   */
  get(namepace: Namespace): Client | undefined;

  /**
   * Get the parent of a client
   * @param type The client to get the parent of
   */
  getParent(type: Client | Namespace | Interface): Client | undefined;
  getAuthentication(client: Client): HttpAuth[] | undefined;
}

interface TypeKit {
  client: ClientKit;
}

declare module "@typespec/compiler/typekit" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TypekitPrototype extends TypeKit {}
}

const clientCache = new Map<Namespace | Client, Client>();

defineKit<TypeKit>({
  client: {
    getAuthentication(client) {
      const authSchemes = getAuthentication($.program, client.service)?.options.flatMap(
        (o) => o.schemes,
      );

      if (!authSchemes) {
        return client.parent ? this.client.getAuthentication(client.parent) : undefined;
      }

      return authSchemes;
    },
    get(namespace) {
      if (clientCache.has(namespace)) {
        return clientCache.get(namespace)!;
      }

      function getClientName(name: string): string {
        return name.endsWith("Client") ? name : `${name}Client`;
      }

      const service = findClosestService(namespace);
      let parent: Client | undefined;
      if (namespace.namespace) {
        parent = this.client.get(namespace.namespace);
      }
      if (service) {
        const client: Client = {
          kind: "Client",
          name: getClientName(service.type.name),
          service: service.type,
          type: namespace,
          parent,
        };
        clientCache.set(namespace, client);
        return client;
      }
    },
    getParent(type) {
      if (type.kind === "Client") {
        return type.type.namespace ? this.client.get(type.type.namespace) : undefined;
      }

      return type.namespace ? this.client.get(type.namespace) : undefined;
    },
    getConstructor(client) {
      const constructors = getConstructors(client);
      if (constructors.length === 1) {
        return constructors[0];
      }
      return createBaseConstructor(client, constructors);
    },
    getName(client) {
      return client.name;
    },
    isPubliclyInitializable(client) {
      return client.type.kind === "Namespace";
    },
    listServiceOperations(client, options = {}) {
      const operations: Operation[] = [];

      for (const op of client.type.operations.values()) {
        // Skip templated operations
        if (!isTemplateDeclarationOrInstance(op)) {
          operations.push(
            this.operation.getClientOperation(client, op, { mutator: options.mutator }),
          );
        }
      }
      return operations;
    },
    getUrlTemplate(client, constructor) {
      const params = $.operation.getClientSignature(client, constructor);
      const endpointParams = params
        .filter(
          (p) => $.modelProperty.getName(p) === "endpoint" || $.modelProperty.isHttpPathParam(p),
        )
        .map((p) => p.name)
        .sort();
      if (endpointParams.length === 1) {
        return "{endpoint}";
      }
      // here we have multiple templated arguments to an endpoint
      const servers = getServers($.program, client.service) || [];
      for (const server of servers) {
        const serverParams = [...server.parameters.values()].map((p) => p.name).sort();
        if (JSON.stringify(serverParams) === JSON.stringify(endpointParams)) {
          // this is the server we want
          return server.url;
        }
      }
      return "{endpoint}";
    },
  },
});

function findClosestService(ns: Namespace): Service | undefined {
  const service = listServices($.program).find((i) => i.type === ns);

  if (service) {
    return service;
  }

  if (ns.namespace) {
    return findClosestService(ns.namespace);
  }
}

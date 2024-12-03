import { ModelProperty, Operation, Type } from "@typespec/compiler";
import { unsafe_Mutator as Mutator, unsafe_mutateSubgraph } from "@typespec/compiler/experimental";
import { $, defineKit } from "@typespec/compiler/typekit";
import { createRekeyableMap } from "@typespec/compiler/utils";
import { Client } from "../../interfaces.js";
import { getConstructors } from "../../utils/client-helpers.js";
import { AccessKit, getAccess, getName, NameKit } from "./utils.js";

export interface SdkOperationKit extends NameKit<Operation>, AccessKit<Operation> {
  /**
   * Get the overloads for an operation
   *
   * @param client
   * @param operation
   */
  getOverloads(client: Client, operation: Operation): Operation[];
  /**
   * Get parameters. This will take into account any parameters listed on the client
   */
  getClientSignature(client: Client, operation: Operation): ModelProperty[];

  /**
   * Get valid return types for an operation
   */
  getValidReturnType(operation: Operation): Type | undefined;

  /**
   * Get exception response type for an operation
   */
  getExceptionReturnType(operation: Operation): Type | undefined;
  /**
   * Gets an operation in the context of a client
   * @param client the client within the context of which the operation is being retrieved
   * @param operation the operation to retrieve
   */
  getClientOperation(
    client: Client,
    operation: Operation,
    options?: { mutator?: Mutator },
  ): Operation;
}

interface SdkKit {
  operation: SdkOperationKit;
}

declare module "@typespec/compiler/typekit" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface OperationKit extends SdkOperationKit {}
}

const clientOperationCache = new Map<Client, Map<Operation, Operation>>();

defineKit<SdkKit>({
  operation: {
    getClientOperation(client, operation, options = {}) {
      if (!clientOperationCache.has(client)) {
        clientOperationCache.set(client, new Map());
      }

      if (clientOperationCache.get(client)!.has(operation)) {
        return clientOperationCache.get(client)!.get(operation)!;
      }

      let clientOperation = this.type.clone(operation);
      clientOperation.parameters = $.type.clone(clientOperation.parameters);
      clientOperation.parameters.properties = createRekeyableMap([
        // TODO: filter out client parameters.
        ...clientOperation.parameters.properties.entries(),
      ]);

      if (options.mutator) {
        clientOperation = unsafe_mutateSubgraph($.program, [options.mutator], clientOperation)
          .type as Operation;
      }

      clientOperationCache.get(client)!.set(operation, clientOperation);

      return clientOperation;
    },
    getOverloads(client, operation) {
      if (operation.name === "constructor") {
        const constructors = getConstructors(client);
        if (constructors.length > 1) {
          return constructors;
        }
      }
      return [];
    },
    getAccess(operation) {
      return getAccess(operation);
    },
    getName(operation) {
      return getName(operation);
    },
    getClientSignature(client, operation) {
      // TODO: filter out client parameters
      return [...operation.parameters.properties.values()];
    },
    getValidReturnType(operation) {
      const returnType = operation.returnType;
      if (returnType === undefined) {
        return undefined;
      }
      if ($.union.is(returnType)) {
        const validTypes = [...returnType.variants.values()].filter((v) => !$.type.isError(v.type));
        if (validTypes.length === 0) {
          return undefined;
        }
        if (validTypes.length === 1) {
          return validTypes[0].type;
        }
        return $.union.create({ variants: validTypes });
      }
      if (!$.type.isError(returnType)) {
        return returnType;
      }
      return undefined;
    },
    getExceptionReturnType(operation) {
      const returnType = operation.returnType;
      if (returnType === undefined) {
        return undefined;
      }
      if ($.union.is(returnType)) {
        const errorTypes = [...returnType.variants.values()].filter((v) => $.type.isError(v.type));
        if (errorTypes.length === 0) {
          return undefined;
        }
        if (errorTypes.length === 1) {
          return errorTypes[0].type;
        }
        return $.union.create({ variants: errorTypes });
      }
      if ($.type.isError(returnType)) {
        return returnType;
      }
      return undefined;
    },
  },
});

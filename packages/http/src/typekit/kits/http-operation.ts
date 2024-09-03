import { Refkey, refkey } from "@alloy-js/core";
import { ignoreDiagnostics, Model, ModelProperty, Operation } from "@typespec/compiler";
import { $, defineKit } from "@typespec/compiler/typekit";
import { getHttpOperation } from "../../operations.js";
import {
  HttpOperation,
  HttpOperationResponse,
  HttpOperationResponseContent,
  HttpStatusCodesEntry,
} from "../../types.js";

interface HttpOperationKit {
  httpOperation: {
    /**
     * Get the corresponding HTTP operation for the given TypeSpec operation. The same
     * TypeSpec operation will always return the exact same HttpOperation object.
     *
     * @param op The TypeSpec operation to get the HTTP operation metadata for.
     */
    get(op: Operation): HttpOperation;
    getResponseModel(
      operation: Operation,
      statusCode: HttpOperationResponse,
      responseContent: HttpOperationResponseContent,
      options?: { namer?: HttpResponseModelNamer }
    ): Model;
  };
}

declare module "@typespec/compiler/typekit" {
  interface TypekitPrototype extends HttpOperationKit {}
}

const HttpResponses = new Map<Refkey, Model>();

defineKit<HttpOperationKit>({
  httpOperation: {
    get(op) {
      return ignoreDiagnostics(getHttpOperation(this.program, op));
    },
    getResponseModel(operation, statusCode, responseContent, options = {}) {
      const namer = options.namer ?? getResponseModelName;
      const key = refkey(statusCode, responseContent);
      const existingModel = HttpResponses.get(key);
      if (existingModel) {
        return existingModel;
      }

      if (
        Object.keys(responseContent.headers ?? {}).length === 0 &&
        responseContent.body?.type.kind === "Model"
      ) {
        HttpResponses.set(key, responseContent.body.type);
        return responseContent.body.type;
      }
      const responseProperties: Record<string, ModelProperty> = {};

      // Extract the response headers and add them as properties of the response model
      for (const [name, type] of Object.entries(responseContent.headers ?? [])) {
        responseProperties[name] = type;
      }

      if (responseContent.body?.bodyKind === "multipart") {
        throw new Error("Multipart responses are not supported yet");
      } else {
        if (responseContent.body?.type && $.model.is(responseContent.body?.type)) {
          responseContent.body.type.properties.forEach((property) => {
            // Add all properties of the response body as properties of the response model
            responseProperties[property.name] = property;
          });
        }
      }

      const modelName = namer(operation, statusCode, responseContent);

      const responseModel = $.model.create({
        name: modelName,
        properties: responseProperties,
      });

      HttpResponses.set(key, responseModel);
      return responseModel;
    },
  },
});

export interface HttpResponseModelNamer {
  (
    operation: Operation,
    statusCode: HttpOperationResponse,
    responseContent: HttpOperationResponseContent
  ): string;
}

function getResponseModelName(
  operation: Operation,
  statusCode: HttpOperationResponse,
  responseContent: HttpOperationResponseContent
): string {
  const operationName = operation.name;
  const contentType = responseContent.body?.contentTypes?.[0] ?? "application/json";
  const contentTypeName = getContentTypeName(contentType);
  const statusCodeName = getStatusCodeName(statusCode.statusCodes);
  return `${operationName}_${statusCodeName}_${contentTypeName}_Response`;
}

function getContentTypeName(contentType: string): string {
  // Normalize the content type
  contentType = contentType.trim().toLowerCase();

  // Split the content type into parts
  const parts = contentType.split("/");

  // Capitalize each part and remove non-alphanumeric characters
  const formattedParts = parts.map((part) => {
    return part
      .replace(/[^a-zA-Z0-9]/g, "") // Remove non-alphanumeric characters
      .replace(/^\w/, (c) => c.toUpperCase()); // Capitalize first letter
  });

  // Join the parts with no delimiter to make a valid symbol name
  return formattedParts.join("_");
}

function getStatusCodeName(statusCode: HttpStatusCodesEntry): string {
  if (typeof statusCode === "number") {
    return `${statusCode}`;
  }

  if (statusCode === "*") {
    return "default";
  }

  return `${statusCode.start}_to_${statusCode.end}`;
}

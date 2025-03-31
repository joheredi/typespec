import { createFetchHttpClient, createHttpHeaders } from "@typespec/ts-http-runtime";
import { parse } from "uri-template";
import { createRestError } from "../helpers/error.js";
import { OperationOptions } from "../helpers/interfaces.js";
import { ApiKeyClientContext } from "./apiKeyClientContext.js";

export interface ValidOptions extends OperationOptions {}
export async function valid(client: ApiKeyClientContext, options?: ValidOptions): Promise<void> {
  const url = parse(`${client.endpoint}/authentication/api-key/valid`).expand({});
  const headers = createHttpHeaders({});
  const response = await client.pipeline.sendRequest(createFetchHttpClient(), {
    url,
    method: "GET",
    headers,
    withCredentials: false,
    requestId: "",
    timeout: 0,
  });

  if (typeof options?.operationOptions?.onResponse === "function") {
    options?.operationOptions?.onResponse(response);
  }

  if (+response.status === 204) {
    return;
  }

  throw createRestError(response);
}
export interface InvalidOptions extends OperationOptions {}
export async function invalid(
  client: ApiKeyClientContext,
  options?: InvalidOptions,
): Promise<void> {
  const url = parse("/authentication/api-key/invalid").expand({});
  const headers = createHttpHeaders({});
  const response = await client.pipeline.sendRequest(createFetchHttpClient(), {
    url,
    method: "GET",
    headers,
    withCredentials: false,
    requestId: "",
    timeout: 0,
  });

  if (typeof options?.operationOptions?.onResponse === "function") {
    options?.operationOptions?.onResponse(response);
  }

  if (+response.status === 204) {
    return;
  }

  throw createRestError(response);
}

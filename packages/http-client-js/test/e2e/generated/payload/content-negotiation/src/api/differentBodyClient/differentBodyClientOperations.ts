import { createFetchHttpClient, createHttpHeaders, PipelineRequestOptions, sendRequest } from "@typespec/ts-http-runtime";
import { parse } from "uri-template";
import { createRestError } from "../../helpers/error.js";
import { OperationOptions } from "../../helpers/interfaces.js";
import { decodeBase64 } from "../../models/internal/serializers.js";
import { DifferentBodyClientContext } from "./differentBodyClientContext.js";

export interface GetAvatarAsPngOptions extends OperationOptions {
  accept?: "image/png";
  requestOptions?: PipelineRequestOptions
}
export async function getAvatarAsPng(
  client: DifferentBodyClientContext,
  options?: GetAvatarAsPngOptions,
): Promise<Blob> {
  const url = parse("/content-negotiation/different-body").expand({});
  const headers = createHttpHeaders({
    accept: options?.accept ?? "image/png",
  });

  const response = await sendRequest("GET", url, client.pipeline, {...options?.requestOptions, headers})

  if (typeof options?.operationOptions?.onResponse === "function") {
    options?.operationOptions?.onResponse(response);
  }

  if (+response.status === 200 && response.headers.get("content-type")?.includes("image/png") && response.rawResponse) {
    return response.rawResponse.blob();
  }

  throw createRestError(response);
}


export interface GetAvatarAsJsonOptions extends OperationOptions {
  accept?: "application/json";
}
export async function getAvatarAsJson(
  client: DifferentBodyClientContext,
  options?: GetAvatarAsJsonOptions,
): Promise<{ content: Uint8Array }> {
  const url = parse("/content-negotiation/different-body").expand({});

  const headers = createHttpHeaders({
    accept: options?.accept ?? "application/json",

  })

  const response = await sendRequest("GET", url, client.pipeline, {headers})

  if (typeof options?.operationOptions?.onResponse === "function") {
    options?.operationOptions?.onResponse(response);
  }
  if (+response.status === 200 && response.headers.get("content-type")?.includes("application/json")) {
    const body = await response.rawResponse?.json();
    return {
      content: decodeBase64(body.content)!,
    }!;
  }
  throw createRestError(response);
}

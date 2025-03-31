import { parse } from "uri-template";
import { createRestError } from "../../helpers/error.js";
import { OperationOptions } from "../../helpers/interfaces.js";
import { SameBodyClientContext } from "./sameBodyClientContext.js";
import {createHttpHeaders, sendRequest} from "@typespec/ts-http-runtime";
export interface GetAvatarAsPngOptions extends OperationOptions {
  accept?: "image/png";
}
export async function getAvatarAsPng(
  client: SameBodyClientContext,
  options?: GetAvatarAsPngOptions,
): Promise<Blob> {
  const path = parse("/content-negotiation/same-body").expand({});
  const headers = createHttpHeaders({
      accept: options?.accept ?? "image/png",
  });
  const response = await sendRequest("GET", path, client.pipeline, {
    headers
  })
  

  if (response.status === 200 && response.headers.get("content-type")?.includes("image/png")) {
    return response.rawResponse?.blob()!;
  }

  throw createRestError(response);
}
export interface GetAvatarAsJpegOptions extends OperationOptions {
  accept?: "image/jpeg";
}
export async function getAvatarAsJpeg(
  client: SameBodyClientContext,
  options?: GetAvatarAsJpegOptions,
): Promise<Blob> {
  const path = parse("/content-negotiation/same-body").expand({});
  const headers = createHttpHeaders({
    accept: options?.accept ?? "image/png",
});
  const response = await sendRequest("GET", path, client.pipeline, {
    headers
  })

  if (typeof options?.operationOptions?.onResponse === "function") {
    options?.operationOptions?.onResponse(response);
  }

  if (response.status === 200 && response.headers.get("content-type")?.includes("image/jpeg")) {
    return response.rawResponse?.blob()!;
  }
  
  throw createRestError(response);
}

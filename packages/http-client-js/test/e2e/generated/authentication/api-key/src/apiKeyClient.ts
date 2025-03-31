import { ApiKeyCredential } from "@typespec/ts-http-runtime";
import { ValidOptions, valid, InvalidOptions, invalid } from "./api/apiKeyClientOperations.js";
import { ApiKeyClientContext, ApiKeyClientOptions, createApiKeyClientContext } from "./api/apiKeyClientContext.js";

export class ApiKeyClient {
  #context: ApiKeyClientContext

  constructor(credential: ApiKeyCredential, options?: ApiKeyClientOptions) {
    this.#context = createApiKeyClientContext(credential, options);

  }
  async valid(options?: ValidOptions) {
    return valid(this.#context, options);
  };
  async invalid(options?: InvalidOptions) {
    return invalid(this.#context, options);
  }
}

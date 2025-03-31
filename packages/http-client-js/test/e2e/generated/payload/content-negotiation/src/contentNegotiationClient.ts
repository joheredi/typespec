import { ContentNegotiationClientContext, ContentNegotiationClientOptions, createContentNegotiationClientContext } from "./api/contentNegotiationClientContext.js";
import { GetAvatarAsPngOptions, getAvatarAsPng, GetAvatarAsJpegOptions, getAvatarAsJpeg } from "./api/sameBodyClient/sameBodyClientOperations.js";
import { SameBodyClientContext, SameBodyClientOptions, createSameBodyClientContext } from "./api/sameBodyClient/sameBodyClientContext.js";
import { GetAvatarAsPngOptions as GetAvatarAsPngOptions_2, getAvatarAsPng as getAvatarAsPng_2, GetAvatarAsJsonOptions, getAvatarAsJson } from "./api/differentBodyClient/differentBodyClientOperations.js";
import { DifferentBodyClientContext, DifferentBodyClientOptions, createDifferentBodyClientContext } from "./api/differentBodyClient/differentBodyClientContext.js";

export class ContentNegotiationClient {
  #context: ContentNegotiationClientContext
  sameBodyClient: SameBodyClient;
  differentBodyClient: DifferentBodyClient
  constructor(options?: ContentNegotiationClientOptions) {
    this.#context = createContentNegotiationClientContext(options);
    this.sameBodyClient = new SameBodyClient(options);;this.differentBodyClient = new DifferentBodyClient(options);
  }

}
export class DifferentBodyClient {
  #context: DifferentBodyClientContext

  constructor(options?: DifferentBodyClientOptions) {
    this.#context = createDifferentBodyClientContext(options);

  }
  async getAvatarAsPng(options?: GetAvatarAsPngOptions_2) {
    return getAvatarAsPng_2(this.#context, options);
  };
  async getAvatarAsJson(options?: GetAvatarAsJsonOptions) {
    return getAvatarAsJson(this.#context, options);
  }
}
export class SameBodyClient {
  #context: SameBodyClientContext

  constructor(options?: SameBodyClientOptions) {
    this.#context = createSameBodyClientContext(options);

  }
  async getAvatarAsPng(options?: GetAvatarAsPngOptions) {
    return getAvatarAsPng(this.#context, options);
  };
  async getAvatarAsJpeg(options?: GetAvatarAsJpegOptions) {
    return getAvatarAsJpeg(this.#context, options);
  }
}
import { Type } from "@typespec/compiler";
import { defineKit } from "@typespec/compiler/typekit";
import { getHttpPart, HttpPart } from "../../private.decorators.js";
import { HttpOperationPart } from "../../types.js";

export interface HttpPartKit {
  /**
   * Check if the model is a HTTP part.
   * @param type model to check
   */
  is(type: Type): boolean;
  /*
   * Get the HTTP part from the model.
   */
  get(type: Type): HttpPart | undefined;
  /**
   * Unpacks the wrapped model from the HTTP part or the original model if
   * not an HttpPart.
   * @param type HttpPart model to unpack
   */
  unpack(type: Type): Type;
  /**
   * Check if the part is an array.
   * @param part HttpPart to check
   */
  isArray(part: HttpOperationPart): boolean;
  /**
   * Check if the part is a file.
   * @param part HttpPart to check
   */
  isFile(part: HttpOperationPart): boolean;
}

export interface TypekitExtension {
  httpPart: HttpPartKit;
}

declare module "@typespec/compiler/typekit" {
  interface Typekit extends TypekitExtension {}
}

defineKit<TypekitExtension>({
  httpPart: {
    is(type) {
      return this.model.is(type) && this.httpPart.get(type) !== undefined;
    },
    get(type) {
      return getHttpPart(this.program, type);
    },
    unpack(type) {
      const part = this.httpPart.get(type);
      if (part) {
        return part.type;
      }
      return type;
    },
    isArray(type) {
      return type.multi;
    },
    isFile(part: HttpOperationPart) {
      return part.filename !== undefined;
    },
  },
});

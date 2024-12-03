import { Type } from "@typespec/compiler";
import { $, defineKit } from "@typespec/compiler/typekit";
import { isBody } from "../../decorators.js";

export interface HttpTypeTypeKit {
  isHttpBody(prop: Type): boolean;
}

interface HttpKit {
  type: HttpTypeTypeKit;
}

declare module "@typespec/compiler/typekit" {
  interface TypeTypeKit extends HttpTypeTypeKit {}
}

defineKit<HttpKit>({
  type: {
    isHttpBody(type: Type): boolean {
      return isBody($.program, type);
    },
  },
});

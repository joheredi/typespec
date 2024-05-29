import * as jsx from "@typespec/jsx-handler";

declare global {
  const createElement: typeof jsx.createElement;
}

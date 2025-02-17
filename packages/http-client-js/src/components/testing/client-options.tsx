import { config } from "dotenv";
import * as ay from "@alloy-js/core";

config();

export interface ClientTestOptions {}

export function ClientTestOptions(_props: ClientTestOptions) {
  if (process.env.NODE_ENV !== "test") {
    return null;
  }

  return ay.code`
    allowInsecureConnection: true,
    retryOptions: {
      maxRetries: 1,
    }`;
}

export function addClientTestOptions(
  options: ay.Children[],
  settings: { location?: "front" | "back" } = { location: "front" }
) {
  if (process.env.TYPESPEC_JS_EMITTER_TESTING === "true") {
    const testOptions = <ClientTestOptions />;
    if (settings.location === "front") {
      options.unshift(testOptions);
    } else {
      options.push(testOptions);
    }
  }
}

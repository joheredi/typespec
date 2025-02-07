import { describe, it } from "vitest";
import {
  BodyOptionalityClient,
  OptionalExplicitClient,
} from "../../../generated/http/parameters/body-optionality/http-client-javascript/src/index.js";

describe("Parameters.BodyOptionality", () => {
  const client = new BodyOptionalityClient("http://localhost:3000", {
    allowInsecureConnection: true,
    retryOptions: {
      maxRetries: 1,
    },
  });

  it("should handle required explicit body parameter", async () => {
    await client.requiredExplicit({ name: "foo" });
    // Assert successful request
  });

  describe("OptionalExplicitClient", () => {
    const optionalExplicitClient = new OptionalExplicitClient("http://localhost:3000", {
      allowInsecureConnection: true,
      retryOptions: {
        maxRetries: 1,
      },
    });

    it("should handle explicit optional body parameter (set case)", async () => {
      await optionalExplicitClient.set({ body: { name: "foo" } });
      // Assert successful request
    });

    it("should handle explicit optional body parameter (omit case)", async () => {
      await optionalExplicitClient.omit();
      // Assert successful request
    });
  });

  it("should handle implicit required body parameter", async () => {
    await client.requiredImplicit("foo");
    // Assert successful request
  });
});

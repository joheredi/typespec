import { describe, it } from "vitest";
import { SingleClient } from "../../../../generated/http/server/path/single/http-client-javascript/src/index.js";

describe("Server.Path.Single", () => {
  const client = new SingleClient("http://localhost:3000");

  it("should perform a simple operation in a parameterized server", async () => {
    await client.myOp();
    // Assert successful request
  });
});

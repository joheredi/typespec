import { describe, expect, it } from "vitest";
import {
  AddedClient,
  EnumV1,
  EnumV2,
  InterfaceV2Client,
  ModelV1,
  ModelV2,
} from "../../../generated/http/versioning/added/http-client-javascript/src/index.js";

describe("Versioning.Added", () => {
  const client = new AddedClient("http://localhost:3000", {
    allowInsecureConnection: true,
    retryOptions: {
      maxRetries: 0,
    },
    apiVersion: "v2",
  });

  it("should send and receive v1 operation with ModelV1 at latest version", async () => {
    const body: ModelV1 = {
      prop: "foo",
      unionProp: 10,
      enumProp: EnumV1.EnumMemberV2,
    };
    const response = await client.v1("bar", body);
    expect(response).toEqual(body);
  });

  it("should send and receive v2 operation with ModelV2 at latest version", async () => {
    const body: ModelV2 = {
      prop: "foo",
      enumProp: EnumV2.EnumMember,
      unionProp: "bar",
    };
    const response = await client.v2(body);
    expect(response).toEqual(body);
  });

  describe("InterfaceV2Client", () => {
    const interfaceV2Client = new InterfaceV2Client("http://localhost:3000", {
      allowInsecureConnection: true,
      retryOptions: {
        maxRetries: 1,
      },
      apiVersion: "v2",
    });

    it("should send and receive v2InInterface operation with ModelV2", async () => {
      const body: ModelV2 = {
        prop: "foo",
        enumProp: EnumV2.EnumMember,
        unionProp: "bar",
      };
      const response = await interfaceV2Client.v2InInterface(body);
      expect(response).toEqual(body);
    });
  });
});

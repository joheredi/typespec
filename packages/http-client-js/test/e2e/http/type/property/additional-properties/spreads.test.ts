import { describe, expect, it } from "vitest";
import {
  ExtendsDifferentSpreadFloatClient,
  ExtendsDifferentSpreadModelArrayClient,
  ExtendsDifferentSpreadModelClient,
  ExtendsDifferentSpreadStringClient,
  ExtendsFloatClient,
  ExtendsModelArrayClient,
  ExtendsModelClient,
  ExtendsStringClient,
  IsFloatClient,
  IsModelArrayClient,
  IsModelClient,
  IsStringClient,
  MultipleSpreadClient,
  SpreadDifferentFloatClient,
  SpreadDifferentModelArrayClient,
  SpreadDifferentModelClient,
  SpreadDifferentStringClient,
  SpreadFloatClient,
  SpreadModelArrayClient,
  SpreadModelClient,
  SpreadRecordDiscriminatedUnionClient,
  SpreadRecordForDiscriminatedUnion,
  SpreadRecordForNonDiscriminatedUnion,
  SpreadRecordForNonDiscriminatedUnion2,
  SpreadRecordForNonDiscriminatedUnion3,
  SpreadRecordNonDiscriminatedUnion2Client,
  SpreadRecordNonDiscriminatedUnion3Client,
  SpreadRecordNonDiscriminatedUnionClient,
  SpreadRecordUnionClient,
  SpreadStringClient,
} from "../../../../generated/type/property/additional-properties/src/index.js";

// Helper to create a client instance with common options.
const clientOptions = {
  allowInsecureConnection: true,
  retryOptions: { maxRetries: 1 },
};

describe("Missing AdditionalProperties Endpoints", () => {
  describe("ExtendsString", () => {
    const client = new ExtendsStringClient("http://localhost:3000", clientOptions);
    const expected = {
      additionalProperties: { prop: "abc" },
      name: "ExtendsStringAdditionalProperties",
    };
    it("GET returns the expected response", async () => {
      const response = await client.get();
      expect(response).toEqual(expected);
    });
    it("PUT accepts the expected input", async () => {
      await client.put(expected);
    });
  });

  describe("IsString", () => {
    const client = new IsStringClient("http://localhost:3000", { allowInsecureConnection: true });
    const expected = {
      additionalProperties: { prop: "abc" },
      name: "IsStringAdditionalProperties",
    };
    it("GET returns the expected response", async () => {
      const response = await client.get();
      expect(response).toEqual(expected);
    });
    it("PUT accepts the expected input", async () => {
      await client.put(expected);
    });
  });

  describe("SpreadString", () => {
    const client = new SpreadStringClient("http://localhost:3000", {
      allowInsecureConnection: true,
    });
    const expected = {
      additionalProperties: { prop: "abc" },
      name: "SpreadSpringRecord",
    };
    it("GET returns the expected response", async () => {
      const response = await client.get();
      expect(response).toEqual(expected);
    });
    it("PUT accepts the expected input", async () => {
      await client.put(expected);
    });
  });

  describe("ExtendsFloat", () => {
    const client = new ExtendsFloatClient("http://localhost:3000", clientOptions);
    const expected = {
      additionalProperties: { prop: 43.125 },
      id: 43.125,
    };
    it("GET returns the expected response", async () => {
      const response = await client.get();
      expect(response).toEqual(expected);
    });
    it("PUT accepts the expected input", async () => {
      await client.put(expected);
    });
  });

  describe("IsFloat", () => {
    const client = new IsFloatClient("http://localhost:3000", clientOptions);
    const expected = {
      additionalProperties: { prop: 43.125 },
      id: 43.125,
    };
    it("GET returns the expected response", async () => {
      const response = await client.get();
      expect(response).toEqual(expected);
    });
    it("PUT accepts the expected input", async () => {
      await client.put(expected);
    });
  });

  describe("SpreadFloat", () => {
    const client = new SpreadFloatClient("http://localhost:3000", clientOptions);
    const expected = {
      additionalProperties: { prop: 43.125 },
      id: 43.125,
    };
    it("GET returns the expected response", async () => {
      const response = await client.get();
      expect(response).toEqual(expected);
    });
    it("PUT accepts the expected input", async () => {
      await client.put(expected);
    });
  });

  describe("ExtendsModel", () => {
    const client = new ExtendsModelClient("http://localhost:3000", clientOptions);
    const expected = {
      knownProp: { state: "ok" },
      additionalProperties: { prop: { state: "ok" } },
    };
    it("GET returns the expected response", async () => {
      const response = await client.get();
      expect(response).toEqual(expected);
    });
    it("PUT accepts the expected input", async () => {
      await client.put(expected);
    });
  });

  describe("IsModel", () => {
    const client = new IsModelClient("http://localhost:3000", clientOptions);
    const expected = {
      knownProp: { state: "ok" },
      additionalProperties: { prop: { state: "ok" } },
    };
    it("GET returns the expected response", async () => {
      const response = await client.get();
      expect(response).toEqual(expected);
    });
    it("PUT accepts the expected input", async () => {
      await client.put(expected);
    });
  });

  describe("SpreadModel", () => {
    const client = new SpreadModelClient("http://localhost:3000", clientOptions);
    const expected = {
      knownProp: { state: "ok" },
      additionalProperties: { prop: { state: "ok" } },
    };
    it("GET returns the expected response", async () => {
      const response = await client.get();
      expect(response).toEqual(expected);
    });
    it("PUT accepts the expected input", async () => {
      await client.put(expected);
    });
  });

  describe("ExtendsModelArray", () => {
    const client = new ExtendsModelArrayClient("http://localhost:3000", clientOptions);
    const expected = {
      knownProp: [{ state: "ok" }, { state: "ok" }],
      additionalProperties: { prop: [{ state: "ok" }, { state: "ok" }] },
    };
    it("GET returns the expected response", async () => {
      const response = await client.get();
      expect(response).toEqual(expected);
    });
    it("PUT accepts the expected input", async () => {
      await client.put(expected);
    });
  });

  describe("IsModelArray", () => {
    const client = new IsModelArrayClient("http://localhost:3000", clientOptions);
    const expected = {
      knownProp: [{ state: "ok" }, { state: "ok" }],
      additionalProperties: { prop: [{ state: "ok" }, { state: "ok" }] },
    };
    it("GET returns the expected response", async () => {
      const response = await client.get();
      expect(response).toEqual(expected);
    });
    it("PUT accepts the expected input", async () => {
      await client.put(expected);
    });
  });

  describe("SpreadModelArray", () => {
    const client = new SpreadModelArrayClient("http://localhost:3000", clientOptions);
    const expected = {
      knownProp: [{ state: "ok" }, { state: "ok" }],
      additionalProperties: { prop: [{ state: "ok" }, { state: "ok" }] },
    };
    it("GET returns the expected response", async () => {
      const response = await client.get();
      expect(response).toEqual(expected);
    });
    it("PUT accepts the expected input", async () => {
      await client.put(expected);
    });
  });

  // Known properties type is different from additional properties type
  describe("SpreadDifferentStringClient", () => {
    const client = new SpreadDifferentStringClient("http://localhost:3000", clientOptions);
    const expected = {
      id: 43.125,
      additionalProperties: { prop: "abc" },
    };
    it("GET returns the expected response", async () => {
      const response = await client.get();
      expect(response).toEqual(expected);
    });
    it("PUT accepts the expected input", async () => {
      await client.put(expected);
    });
  });

  describe("SpreadDifferentFloatClient", () => {
    const client = new SpreadDifferentFloatClient("http://localhost:3000", clientOptions);
    const expected = {
      name: "abc",
      additionalProperties: { prop: 43.125 },
    };
    it("GET returns the expected response", async () => {
      const response = await client.get();
      expect(response).toEqual(expected);
    });
    it("PUT accepts the expected input", async () => {
      await client.put(expected);
    });
  });

  describe("SpreadDifferentModel", () => {
    const client = new SpreadDifferentModelClient("http://localhost:3000", clientOptions);
    const expected = {
      knownProp: "abc",
      additionalProperties: { prop: { state: "ok" } },
    };
    it("GET returns the expected response", async () => {
      const response = await client.get();
      expect(response).toEqual(expected);
    });
    it("PUT accepts the expected input", async () => {
      await client.put(expected);
    });
  });

  describe("SpreadDifferentModelArrayClient", () => {
    const client = new SpreadDifferentModelArrayClient("http://localhost:3000", clientOptions);
    const expected = {
      knownProp: "abc",
      additionalProperties: { prop: [{ state: "ok" }, { state: "ok" }] },
    };
    it("GET returns the expected response", async () => {
      const response = await client.get();
      expect(response).toEqual(expected);
    });
    it("PUT accepts the expected input", async () => {
      await client.put(expected);
    });
  });

  describe("ExtendsDifferentSpreadString", () => {
    const client = new ExtendsDifferentSpreadStringClient("http://localhost:3000", clientOptions);
    const expected = {
      id: 43.125,
      additionalProperties: { prop: "abc" },
      derivedProp: "abc",
    };
    it("GET returns the expected response", async () => {
      const response = await client.get();
      expect(response).toEqual(expected);
    });
    it("PUT accepts the expected input", async () => {
      await client.put(expected);
    });
  });

  describe("ExtendsDifferentSpreadFloat", () => {
    const client = new ExtendsDifferentSpreadFloatClient("http://localhost:3000", clientOptions);
    const expected = {
      name: "abc",
      additionalProperties: { prop: 43.125 },
      derivedProp: 43.125,
    };
    it("GET returns the expected response", async () => {
      const response = await client.get();
      expect(response).toEqual(expected);
    });
    it("PUT accepts the expected input", async () => {
      await client.put(expected);
    });
  });

  describe("ExtendsDifferentSpreadModel", () => {
    const client = new ExtendsDifferentSpreadModelClient("http://localhost:3000", clientOptions);
    const expected = {
      knownProp: "abc",
      additionalProperties: { prop: { state: "ok" } },
      derivedProp: { state: "ok" },
    };
    it("GET returns the expected response", async () => {
      const response = await client.get();
      expect(response).toEqual(expected);
    });
    it("PUT accepts the expected input", async () => {
      await client.put(expected);
    });
  });

  describe("ExtendsDifferentSpreadModelArray", () => {
    const client = new ExtendsDifferentSpreadModelArrayClient(
      "http://localhost:3000",
      clientOptions,
    );
    const expected = {
      knownProp: "abc",
      additionalProperties: { prop: [{ state: "ok" }, { state: "ok" }] },
      derivedProp: [{ state: "ok" }, { state: "ok" }],
    };
    it("GET returns the expected response", async () => {
      const response = await client.get();
      expect(response).toEqual(expected);
    });
    it("PUT accepts the expected input", async () => {
      await client.put(expected);
    });
  });

  // Multiple spread tests
  describe("MultipleSpreadRecord", () => {
    const client = new MultipleSpreadClient("http://localhost:3000", clientOptions);
    const expected = {
      flag: true,
      additionalProperties: { prop1: "abc", prop2: 43.125 },
    };
    it("GET returns the expected response", async () => {
      const response = await client.get();
      expect(response).toEqual(expected);
    });
    it("PUT accepts the expected input", async () => {
      await client.put(expected);
    });
  });

  describe("SpreadRecordUnion", () => {
    const client = new SpreadRecordUnionClient("http://localhost:3000", clientOptions);
    const expected = {
      flag: true,
      additionalProperties: { prop1: "abc", prop2: 43.125 },
    };
    it("GET returns the expected response", async () => {
      const response = await client.get();
      expect(response).toEqual(expected);
    });
    it("PUT accepts the expected input", async () => {
      await client.put(expected);
    });
  });

  describe("SpreadRecordDiscriminatedUnion", () => {
    const client = new SpreadRecordDiscriminatedUnionClient("http://localhost:3000", clientOptions);
    const expected: SpreadRecordForDiscriminatedUnion = {
      name: "abc",
      additionalProperties: {
        prop1: { kind: "kind0", fooProp: "abc" },
        prop2: {
          kind: "kind1",
          start: new Date("2021-01-01T00:00:00Z"),
          end: new Date("2021-01-02T00:00:00Z"),
        },
      },
    };
    it("GET returns the expected response", async () => {
      const response = await client.get();
      expect(response).toEqual(expected);
    });
    it("PUT accepts the expected input", async () => {
      await client.put(expected);
    });
  });

  describe("SpreadRecordNonDiscriminatedUnion", () => {
    const client = new SpreadRecordNonDiscriminatedUnionClient(
      "http://localhost:3000",
      clientOptions,
    );
    const expected: SpreadRecordForNonDiscriminatedUnion = {
      name: "abc",
      additionalProperties: {
        prop1: { kind: "kind0", fooProp: "abc" },
        prop2: {
          kind: "kind1",
          start: "2021-01-01T00:00:00Z",
          end: "2021-01-02T00:00:00Z",
        } as any,
      },
    };
    it("GET returns the expected response", async () => {
      const response = await client.get();
      expect(response).toEqual(expected);
    });
    it("PUT accepts the expected input", async () => {
      await client.put(expected);
    });
  });

  describe("SpreadRecordNonDiscriminatedUnion2", () => {
    const client = new SpreadRecordNonDiscriminatedUnion2Client(
      "http://localhost:3000",
      clientOptions,
    );
    const expected: SpreadRecordForNonDiscriminatedUnion2 = {
      name: "abc",
      additionalProperties: {
        prop1: { kind: "kind1", start: "2021-01-01T00:00:00Z" },
        prop2: {
          kind: "kind1",
          start: "2021-01-01T00:00:00Z",
          end: "2021-01-02T00:00:00Z",
        } as any,
      },
    };
    it("GET returns the expected response", async () => {
      const response = await client.get();
      expect(response).toEqual(expected);
    });
    it("PUT accepts the expected input", async () => {
      await client.put(expected);
    });
  });

  describe("SpreadRecordNonDiscriminatedUnion3", () => {
    const client = new SpreadRecordNonDiscriminatedUnion3Client(
      "http://localhost:3000",
      clientOptions,
    );
    const expected: SpreadRecordForNonDiscriminatedUnion3 = {
      name: "abc",
      additionalProperties: {
        prop1: [
          { kind: "kind1", start: "2021-01-01T00:00:00Z" },
          { kind: "kind1", start: "2021-01-01T00:00:00Z" },
        ],
        prop2: {
          kind: "kind1",
          start: "2021-01-01T00:00:00Z",
          end: "2021-01-02T00:00:00Z",
        } as any,
      },
    };
    it("GET returns the expected response", async () => {
      const response = await client.get();
      expect(response).toEqual(expected);
    });
    it("PUT accepts the expected input", async () => {
      await client.put(expected);
    });
  });
});

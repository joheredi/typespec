import { Namespace, Operation } from "@typespec/compiler";
import { unsafe_Mutator } from "@typespec/compiler/experimental";
import { BasicTestRunner } from "@typespec/compiler/testing";
import { $ } from "@typespec/compiler/typekit";
import { beforeEach, expect, it } from "vitest";
import "../../src/typekit/index.js";
import { createTypespecHttpClientLibraryTestRunner } from "../test-host.js";

let runner: BasicTestRunner;

beforeEach(async () => {
  runner = await createTypespecHttpClientLibraryTestRunner();
});

it("should get a client operation", async () => {
  const { DemoService, get } = (await runner.compile(`
      @service({
        title: "Widget Service",
      })
      @test namespace DemoService;
      op get(): string;
      @post op create(): void;
      @put op update(): void;
      
      @route("attachments")
      namespace Attachments {
        @test @get op get(): string;
        @post op create(): void;
        @put op update(): void;
      }
      `)) as { DemoService: Namespace; get: Operation };

  const client = $.client.get(DemoService)!;
  expect(client).toBeDefined();
  const getOperation = $.operation.getClientOperation(client, get)!;
  expect(getOperation).toBeDefined();
  expect(getOperation.name).toEqual("get");
  expect([...getOperation.parameters.properties.values()]).toHaveLength(0);
});

it("should invoke the mutator", async () => {
  const { DemoService, get, create } = (await runner.compile(`
      @service({
        title: "Widget Service",
      })
      @test namespace DemoService;
      op get(): string;
      @post op create(): void;
      @put op update(): void;
      
      @route("attachments")
      namespace Attachments {
        @test @get op get(): string;
        @test @post op create(): void;
        @put op update(): void;
      }
      `)) as { DemoService: Namespace; get: Operation; create: Operation };

  const client = $.client.get(DemoService)!;
  expect(client).toBeDefined();

  const testMutator: unsafe_Mutator = {
    name: "Test Mutator",
    Operation: {
      filter(type) {
        return type.name === "create";
      },
      mutate(operation, clone) {
        clone.name = "add";
      },
    },
  };

  const addOperation = $.operation.getClientOperation(client, create, { mutator: testMutator })!;
  expect(addOperation).toBeDefined();
  expect(addOperation.name).toEqual("add");

  // Mutator should not execute based on the filter
  const getOperation = $.operation.getClientOperation(client, get, { mutator: testMutator })!;
  expect(getOperation).toBeDefined();
  expect(getOperation.name).toEqual("get");
});

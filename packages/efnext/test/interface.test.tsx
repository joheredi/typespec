import { Model, Interface as TspInterface } from "@typespec/compiler";
import { format } from "prettier";
import { describe, it } from "vitest";
import { renderTree } from "../src/index.js";
import { Interface } from "../src/typescript/interface.js";
import { createTypespecTestRunner } from "./test-host.js";

import assert from "node:assert";

describe("interface", () => {
  it("emit an interface for a TypeSpec model", async () => {
    const runner = await createTypespecTestRunner();
    const [result] = await runner.compileAndDiagnose(
      ` @test model Foo {
      name: string
    }`,
      {
        outputDir: "tsp-output",
      }
    );

    const model: Model = result["Foo"] as Model;

    const tree = renderTree(<Interface model={model} />);
    const output = (tree as any).flat(Infinity).join("");
    const formatted = await format(output, { parser: "typescript" });
    //TODO: Update property type when references are working
    assert.strictEqual(formatted, "interface Foo {\n  name: any;\n}\n");
  });

  it("emit an interface for a TypeSpec operation", async () => {
    const runner = await createTypespecTestRunner();
    const [result] = await runner.compileAndDiagnose(
      ` @test interface Foo {
      op foo(param: string): string;
    }`,
      {
        outputDir: "tsp-output",
      }
    );

    const interfaceType: TspInterface = result["Foo"] as TspInterface;

    const tree = renderTree(<Interface interfaceType={interfaceType} />);
    const output = (tree as any).flat(Infinity).join("");
    const formatted = await format(output, { parser: "typescript" });
    //TODO: Update parameter type when references are working
    assert.strictEqual(formatted, "interface Foo {\n  foo(param: any): any;\n}\n");
  });
});

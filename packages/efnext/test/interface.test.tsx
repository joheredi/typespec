import { Model, Interface as TspInterface } from "@typespec/compiler";
import { format } from "prettier";
import { describe, it } from "vitest";
import { Interface } from "../src/typescript/interface.js";
import { createTypespecTestRunner } from "./test-host.js";

import assert from "node:assert";
import { render } from "../src/framework/core/render.js";

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

    const tree = render(<Interface model={model} />);
    const output = (tree as any).flat(Infinity).join("");
    const formatted = await format(output, { parser: "typescript" });
    //TODO: Update property type when references are working
    assert.strictEqual(formatted, "interface Foo {\n  name: any;\n}\n");
  });

  it("emit an interface for a TypeSpec model that extends another", async () => {
    const runner = await createTypespecTestRunner();
    const [result] = await runner.compileAndDiagnose(
      ` @test model Foo {
      name: string
    }
    @test model Bar extends Foo {
      age: number
    }`,
      {
        outputDir: "tsp-output",
      }
    );

    const model: Model = result["Bar"] as Model;

    const tree = render(<Interface model={model} />);
    const output = (tree as any).flat(Infinity).join("");
    const formatted = await format(output, { parser: "typescript" });
    const expected = await format(
      `
    interface Bar extends any {
      age: any;
    }`,
      { parser: "typescript" }
    );
    //TODO: Update property type when references are working
    assert.strictEqual(formatted, expected);
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

    const tree = render(<Interface interfaceType={interfaceType} />);
    const output = (tree as any).flat(Infinity).join("");
    const formatted = await format(output, { parser: "typescript" });
    //TODO: Update parameter type when references are working
    assert.strictEqual(formatted, "interface Foo {\n  foo(param: any);\n}\n");
  });

  it("emit an interface that extends another", async () => {
    const runner = await createTypespecTestRunner();
    const [result] = await runner.compileAndDiagnose(
      ` @test interface Foo {
      op foo(param: string): string;
    }

    @test interface Bar extends Foo {
      op foo(param: string): string;
    }
    `,
      {
        outputDir: "tsp-output",
      }
    );

    const interfaceType: TspInterface = result["Bar"] as TspInterface;

    const tree = render(<Interface interfaceType={interfaceType} />);
    const output = (tree as any).flat(Infinity).join("");
    const formatted = await format(output, { parser: "typescript" });
    const expected = await format(
      `
    interface Bar extends any {
       foo(param: any);
      }`,
      {
        parser: "typescript",
      }
    );
    //TODO: Update parameter type when references are working
    assert.strictEqual(formatted, expected);
  });

  it("emit an interface that extends multiple others", async () => {
    const runner = await createTypespecTestRunner();
    const [result] = await runner.compileAndDiagnose(
      ` @test interface Foo {
      op foo(param: string): string;
    }

    @test interface Baz {
      op baz(param: string): string;
    }

    @test interface Bar extends Foo, Baz {
      op bar(param: string): string;
    }
    `,
      {
        outputDir: "tsp-output",
      }
    );

    const interfaceType: TspInterface = result["Bar"] as TspInterface;

    const tree = render(<Interface interfaceType={interfaceType} />);
    const output = (tree as any).flat(Infinity).join("");
    const formatted = await format(output, { parser: "typescript" });
    const expected = await format(
      `
    interface Bar extends any, any {
      foo(param: any);
      baz(param: any);
      bar(param: any);
    }
    `,
      { parser: "typescript" }
    );
    //TODO: Update parameter type when references are working
    assert.strictEqual(formatted, expected);
  });
});

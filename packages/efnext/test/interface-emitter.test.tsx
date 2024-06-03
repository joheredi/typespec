import { format } from "prettier";
import { describe, it } from "vitest";
import { EmitOutput } from "../src/framework/components/emit-output.js";
import { SourceFile } from "../src/framework/components/source-file.js";
import { RenderedTreeNode } from "../src/framework/core/render.js";
import { TypeDeclaration } from "../src/typescript/type-declaration.js";
import { getProgram } from "./test-host.js";
async function print(root: RenderedTreeNode) {
  const raw = (root as any).flat(Infinity).join("");

  try {
    console.log(await format(raw, { parser: "typescript" }));
  } catch (e) {
    console.error("Formatting error", e);
    console.log(raw);
  }
}

describe("e2e", () => {
  it("interfaces", async () => {
    // const program = await getProgram(`
    // namespace DemoService;

    // model Widget {
    //   id: string;
    //   weight: int32;
    //   color: "red" | "blue";
    // }

    // model Error {
    //   code: int32;
    //   message: string;
    // }

    // interface Widgets {
    //   list(): Widget[] | Error;
    //   read(id: string): Widget | Error;
    //   create(...Widget): Widget | Error;
    //   update(...Widget): Widget | Error;
    //   delete(id: string): void | Error;
    //   analyze(id: string): string | Error;
    // }
    // `);

    // const namespace = program.getGlobalNamespaceType();
    // const interfaces = Array.from(namespace.interfaces.values());

    // const res = await render(
    //   <EmitOutput>
    //     <SourceFile path="operations.ts">
    //       {interfaces.map((iface) => (
    //         <InterfaceDeclaration type={iface} />
    //       ))}
    //     </SourceFile>
    //   </EmitOutput>
    // );

    // console.log(JSON.stringify(res, null, 4));
    // await print(res);
    const program = await getProgram(`
    model Foo { x: Bar }
    model Bar { x: Foo }
  `);

    const [Foo] = program.resolveTypeReference("Foo");
    const [Bar] = program.resolveTypeReference("Bar");

    let res = (
      <EmitOutput>
        <SourceFile path="test1.ts">
          <TypeDeclaration type={Bar!} />
        </SourceFile>
        <SourceFile path="test2.ts">
          <TypeDeclaration type={Foo!} />
        </SourceFile>
      </EmitOutput>
    );

    await sleep(2000);
    await print(res);
  });
});

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

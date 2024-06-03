import { EmitContext } from "@typespec/compiler";
import { format } from "prettier";
import { EmitOutput } from "../framework/components/emit-output.js";
import { SourceFile } from "../framework/components/source-file.js";
import { render } from "../framework/core/render.js";
import { InterfaceDeclaration } from "../typescript/interface-declaration.js";

export async function $onEmit(context: EmitContext) {
  const namespace = context.program.getGlobalNamespaceType();
  const interfaces = Array.from(namespace.interfaces.values());

  const tree = (
    <EmitOutput>
      <SourceFile path="operations.ts">
        {interfaces.map((iface) => (
          <InterfaceDeclaration type={iface} />
        ))}
      </SourceFile>
    </EmitOutput>
  );

  const output = (await render(tree)) as any;

  const formatted = format(output.join(" "), { parser: "typescript" });
  console.log(formatted);
}

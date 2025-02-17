import * as ay from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { EmitContext } from "@typespec/compiler";
import { OperationsDirectory } from "./components/client-directory.jsx";
import { Client } from "./components/client.jsx";
import { Models } from "./components/models.js";
import { Output } from "./components/output.jsx";
import { ModelSerializers } from "./components/serializers.js";
import { Interfaces } from "./components/static-helpers/interfaces.jsx";
import { MultipartHelpers } from "./components/static-helpers/multipart-helpers.jsx";
import { JsClientEmitterOptions } from "./lib.js";
import { writeOutput } from "@typespec/emitter-framework";

export async function $onEmit(context: EmitContext<JsClientEmitterOptions>) {
  const packageName = context.options["package-name"] ?? "test-package";
  const output = <Output>
        <ts.PackageDirectory name={packageName} version="1.0.0" path="." scripts={{ "build": "tsc" }} devDependencies={{ "@types/node": "~18.19.75" }}>
          <ay.SourceDirectory path="src">
            <ts.BarrelFile export="." />
            <Client/>
            <ay.SourceDirectory path="models">
              <ts.BarrelFile export="models"/>
              <Models />
              <ModelSerializers />
            </ay.SourceDirectory>
            <ay.SourceDirectory path="api">
                <OperationsDirectory />
            </ay.SourceDirectory>
            <ay.SourceDirectory path="helpers">
              <Interfaces />
              <MultipartHelpers />
            </ay.SourceDirectory>
          </ay.SourceDirectory>
        </ts.PackageDirectory>
    </Output>;

    await writeOutput(output, context.emitterOutputDir);
}

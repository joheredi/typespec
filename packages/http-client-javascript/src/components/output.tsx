import * as ay from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { TransformNamePolicyContext } from "@typespec/emitter-framework";
import { ClientLibrary } from "@typespec/http-client-library/components";
import { httpParamsMutator } from "../utils/operations.js";
import { httpRuntimeTemplateLib } from "./external-packages/ts-http-runtime.js";
import { uriTemplateLib } from "./external-packages/uri-template.js";
import { createTransformNamePolicy } from "./transforms/transform-name-policy.js";

export interface OutputProps {
  children?: ay.Children;
}

export function Output(props: OutputProps) {
  const tsNamePolicy = ts.createTSNamePolicy();
  const defaultTransformNamePolicy = createTransformNamePolicy();
  return <ay.Output namePolicy={tsNamePolicy} externals={[uriTemplateLib, httpRuntimeTemplateLib]}>
    <ClientLibrary operationMutators={[httpParamsMutator]}>
      <TransformNamePolicyContext.Provider value={defaultTransformNamePolicy}>
        {props.children}
      </TransformNamePolicyContext.Provider>
    </ClientLibrary>
    </ay.Output>;
}

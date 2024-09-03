import * as ay from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import {
  EmitContext,
  getEffectiveModelType,
  getNamespaceFullName,
  isStdNamespace,
  listServices,
  Model,
  Operation,
  Type,
} from "@typespec/compiler";
import { $ } from "@typespec/compiler/typekit";
import { TypeCollector } from "@typespec/emitter-framework";
import { namespace as HttpNamespace } from "@typespec/http";
import path from "path";
import { ClientContext } from "./components/client-context.js";
import { ModelsFile } from "./components/models-file.js";
import { OperationsFile } from "./components/operations-file.js";
import { ModelSerializers } from "./components/serializers.js";
import { HttpFetch, HttpRequestOptions } from "./components/static-fetch-wrapper.jsx";

const RestNamespace = "TypeSpec.Rest";

export async function $onEmit(context: EmitContext) {
  const types = queryTypes(context);
  const tsNamePolicy = ts.createTSNamePolicy();
  const outputDir = context.emitterOutputDir;
  const sourcesDir = path.join(outputDir, "src");
  const modelsDir = path.join(sourcesDir, "models");
  const apiDir = path.join(sourcesDir, "api");
  const utilitiesDir = path.join(sourcesDir, "utilities");
  const service = listServices(context.program)[0]!;

  return (
    <ay.Output namePolicy={tsNamePolicy}>
      <ts.PackageDirectory name="test-package" version="1.0.0" path={outputDir}>
        <ay.SourceDirectory path={sourcesDir}>
          <ay.SourceDirectory path={modelsDir}>
            <ts.BarrelFile />
            <ModelsFile types={types.dataTypes} />
            <ModelSerializers types={types.dataTypes} />
          </ay.SourceDirectory>
          <ay.SourceDirectory path={apiDir}>
            <ClientContext service={service} />
            <OperationsFile operations={types.operations} service={service} />
            <ts.BarrelFile />
          </ay.SourceDirectory>
          <ay.SourceDirectory path={utilitiesDir}>
            <ts.SourceFile path="http-fetch.ts">
              <HttpRequestOptions />
              <HttpFetch />
            </ts.SourceFile>
          </ay.SourceDirectory>
        </ay.SourceDirectory>
      </ts.PackageDirectory>
    </ay.Output>
  );
}

function queryTypes(context: EmitContext) {
  const types = new Set<Type>();
  const operations = new Set<Operation>();
  const globalns = context.program.getGlobalNamespaceType();
  const allTypes = new TypeCollector(globalns).flat();
  const operationResponses = queryHttpOperationsModels(allTypes.operations);
  for (const dataType of [
    ...allTypes.models,
    ...operationResponses,
    ...allTypes.unions,
    ...allTypes.enums,
    ...allTypes.scalars,
    ...allTypes.operations,
  ]) {
    if (isNoEmit(dataType)) {
      continue;
    }

    if (dataType.kind === "Operation") {
      operations.add(dataType);
    } else {
      types.add(dataType);
    }
  }

  function queryHttpOperationsModels(operations: Operation[]): Model[] {
    const models: Model[] = [];
    for (const operation of operations) {
      const httpOperation = $.httpOperation.get(operation);
      const responses = httpOperation.responses;
      for (const statusCodeResponse of responses) {
        for (const responseContent of statusCodeResponse.responses) {
          const model = $.httpOperation.getResponseModel(operation, statusCodeResponse, responseContent);
          models.push(model);
        }
      }
    }
    return models;
  }

  // Collect all the types that are used in the body of the operations
  // might want to make this part of the TypeCollector
  for (const operation of operations) {
    const httpOperation = $.httpOperation.get(operation);
    if (httpOperation.parameters.body) {
      let bodyType = httpOperation.parameters.body.type;
      if (bodyType.kind === "Model") {
        bodyType = getEffectiveModelType(context.program, bodyType);
      }
      types.add(bodyType);
    }
  }
  return { dataTypes: [...types], operations: [...operations] };
}

function isNoEmit(type: Type): boolean {
  // Skip anonymous types
  if (!(type as any).name) {
    return true;
  }

  if ("namespace" in type && type.namespace) {
    if (isStdNamespace(type.namespace)) {
      return true;
    }

    const fullNamespaceName = getNamespaceFullName(type.namespace);

    if (fullNamespaceName.startsWith(HttpNamespace)) {
      return true;
    }
    if (fullNamespaceName.startsWith(RestNamespace)) {
      return true;
    }
  }

  return false;
}

import * as ay from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import {
  EmitContext,
  Enum,
  getNamespaceFullName,
  Model,
  navigateProgram,
  navigateType,
  Operation,
  Scalar,
  Type,
  Union,
} from "@typespec/compiler";
import { $ } from "@typespec/compiler/typekit";
import { ClientLibrary } from "@typespec/http-client-library/components";
import { ClientContext } from "./components/client-context.js";
import { Client } from "./components/client-v2.jsx";
import { httpRuntimeTemplateLib } from "./components/external-packages/ts-http-runtime.js";
import { uriTemplateLib } from "./components/external-packages/uri-template.js";
import { ModelsFile } from "./components/models-file.js";
import { Operations } from "./components/operations.js";
import { ModelSerializers } from "./components/serializers.js";

export async function $onEmit(context: EmitContext) {
  const visited = operationWalker(context);
  const tsNamePolicy = ts.createTSNamePolicy();
  const rootNs = $.clientLibrary.listNamespaces()[0]; // TODO: Handle multiple namespaces
  const client = $.client.get(rootNs); // TODO: Handle multiple clients
  return <ay.Output namePolicy={tsNamePolicy} externals={[uriTemplateLib, httpRuntimeTemplateLib]}>
      <ClientLibrary scope="typescript">
        <ts.PackageDirectory name="test-package" version="1.0.0" path=".">
          <ay.SourceDirectory path="src">
            <ts.BarrelFile export="." />
            <Client client={client} />
            <ay.SourceDirectory path="models">
              <ts.BarrelFile />
              <ModelsFile types={visited.dataTypes} />
              <ModelSerializers types={visited.dataTypes} />
            </ay.SourceDirectory>
            <ay.SourceDirectory path="api">
              <ClientContext client={client} />
              <Operations client={client} />
              <ts.BarrelFile />
            </ay.SourceDirectory>
          </ay.SourceDirectory>
        </ts.PackageDirectory>
      </ClientLibrary>
    </ay.Output>;
}

function getOperationContainerKey(operation: Operation) {
  const interfaceName = operation.interface?.name;
  const namespace = operation.namespace;
  const operationContainer = [];
  if (interfaceName) {
    operationContainer.push(interfaceName);
  }
  if (namespace) {
    const namespaceParts = getNamespaceFullName(namespace, {
      namespaceFilter: (ns) => !getNamespaceFullName(ns).includes("TypeSpec"),
    }).split(".");
    operationContainer.push(...namespaceParts);
  }
  return operationContainer.join("/");
}

function trackOperation(operations: Map<string, Operation[]>, operation: Operation) {
  const key = getOperationContainerKey(operation);
  if (!operations.has(key)) {
    operations.set(key, []);
  }
  operations.get(key)!.push(operation);
}

function operationWalker(context: EmitContext) {
  const types = new Set<DataType>();
  const operations = new Map<string, Operation[]>();
  navigateProgram(
    context.program,
    {
      operation(o) {
        trackOperation(operations, o);
        navigateType(
          o,
          {
            model(m) {
              trackType(types, m);
            },
            modelProperty(p) {
              trackType(types, p.type);
            },
            scalar(s) {
              if (s.namespace?.name !== "TypeSpec") {
                return;
              }

              trackType(types, s);
            },
            enum(e) {
              trackType(types, e);
            },
            union(u) {
              trackType(types, u);
            },
            unionVariant(v) {
              trackType(types, v.type);
            },
          },
          { includeTemplateDeclaration: false },
        );
      },
    },
    { includeTemplateDeclaration: false },
  );

  const dataTypes = Array.from(types);

  return { dataTypes, operations };
}

type DataType = Model | Union | Enum | Scalar;

function isDataType(type: Type): type is DataType {
  return (
    type.kind === "Model" || type.kind === "Union" || type.kind === "Enum" || type.kind === "Scalar"
  );
}

function isDeclaredType(type: Type): boolean {
  if ("namespace" in type && type.namespace?.name === "TypeSpec") {
    return false;
  }

  if (!isDataType(type)) {
    return false;
  }

  if (type.name === undefined || type.name === "") {
    return false;
  }

  return true;
}

function trackType(types: Set<DataType>, type: Type) {
  if (!isDataType(type)) {
    return;
  }

  if (!isDeclaredType(type)) {
    return;
  }

  types.add(type);
}

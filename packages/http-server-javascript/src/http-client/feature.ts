import { JSONSchemaType, NoTarget } from "@typespec/compiler";
import {
  HttpOperation,
  HttpOperationParameter,
  HttpServer,
  HttpService,
  getHttpService,
  getServers,
} from "@typespec/http";
import { JsContext, Module, completePendingDeclarations, createModule } from "../ctx.js";
import { JsEmitterFeature, registerFeature } from "../feature.js";
import { reportDiagnostic } from "../lib.js";
import { parseCase } from "../util/case.js";

// Declare the existence of the HTTP feature.
declare module "../feature.js" {
  export interface JsEmitterFeature {
    httpClient: HttpClientOptions;
  }
}

export interface HttpClientOptions {}

/**
 * Additional context items used by the HTTP Client emitter.
 */
export interface HttpContext extends JsContext {
  /**
   * The HTTP-level representation of the service.
   */
  httpService: HttpService;
  /**
   * The options provided to the HTTP Client feature.
   */
  httpClientOptions: HttpClientOptions;
  /**
   * The root module for HTTP Client specific code.
   */
  httpClientModule: Module;
  /**
   * The server definitions of the service (\@server decorator)
   */
  servers: HttpServer[];
}

const HttpClientOptionsSchema: JSONSchemaType<JsEmitterFeature["httpClient"]> = {
  type: "object",
  properties: {},
  required: [],
  nullable: true,
};

// Register the HTTP Client feature.
registerFeature("httpClient", HttpClientOptionsSchema, emitHttpClient);

/**
 * Emits bindings for the service to be carried over the HTTP protocol.
 */
async function emitHttpClient(ctx: JsContext, options: JsEmitterFeature["httpClient"]) {
  const [httpService, diagnostics] = getHttpService(ctx.program, ctx.service.type);

  const diagnosticsAreError = diagnostics.some((d) => d.severity === "error");

  if (diagnosticsAreError) {
    // TODO/joheredi: ensure that HTTP Client layer diagnostics are reported when the user enables
    // the HTTP feature.
    reportDiagnostic(ctx.program, {
      code: "http-client-emit-disabled",
      target: NoTarget,
      messageId: "default",
    });
    return;
  }

  const servers = getServers(ctx.program, ctx.service.type) ?? [];

  const httpClientModule = createModule("http-client", ctx.rootModule);

  const httpContext: HttpContext = {
    ...ctx,
    httpService,
    httpClientModule,
    servers,
    httpClientOptions: options,
  };

  const operationsModule = createModule("operations", httpClientModule);

  emitRestClient(httpContext, operationsModule);
}

/**
 * Emits rest operations for sending requests to the server.
 *
 * @param ctx - The HTTP Client emitter context.
 * @param operationsModule - The module to emit the operations into.
 * @returns the module containing the rest client operations.
 */
function emitRestClient(ctx: HttpContext, operationsModule: Module): Module {
  const restClientModule = createModule("rest_client", operationsModule);

  for (const operation of ctx.httpService.operations) {
    restClientModule.declarations.push([
      ...emitOperationRequestInterface(operation),
      ...emitOperationResponseInterface(operation),
      ...emitRestClientOperationSignature(ctx, operation, restClientModule),
    ]);
  }

  return restClientModule;
}

function getOperatioBaseName(operation: HttpOperation): string {
  const op = operation.operation;
  const operationNameCase = parseCase(op.name);

  const container = op.interface ?? op.namespace!;
  const containerNameCase = parseCase(container.name);

  return `${containerNameCase.pascalCase}${operationNameCase.pascalCase}`;
}

function* emitRestClientOperationSignature(
  ctx: HttpContext,
  operation: HttpOperation,
  module: Module
): Iterable<string> {
  const opBaseName = getOperatioBaseName(operation);

  const verb = operation.verb;

  completePendingDeclarations(ctx);

  yield `export interface ${opBaseName}  {`;
  // prettier-ignore
  yield ` ${verb}(`
  if (hasParameters(operation)) {
    yield `request: ${opBaseName}${opBaseName}Request`;
  }
  yield `  ): Promise<any>`;
  yield `}`;
}

function hasParameters(operation: HttpOperation): boolean {
  return operation.parameters.parameters.some((param) => param.type !== "path");
}

function* emitOperationResponseInterface(operation: HttpOperation): Iterable<string> {
  const operationBaseName = getOperatioBaseName(operation);

  for (const response of operation.responses) {
    const statusCode = response.statusCodes === "*" ? "Error" : response.statusCodes;
    yield `export interface ${operationBaseName}${statusCode}Response {`;
    yield `  status: ${response.statusCodes === "*" ? "string" : `"${response.statusCodes}"`};`;
    yield `}`;
  }

  yield ``;
}

function* emitOperationRequestInterface(operation: HttpOperation): Iterable<string> {
  const operationBaseName = getOperatioBaseName(operation);
  const queryParams: Extract<HttpOperationParameter, { type: "query" }>[] = [];
  const headerParams: Extract<HttpOperationParameter, { type: "header" }>[] = [];

  for (const parameter of operation.parameters.parameters) {
    switch (parameter.type) {
      case "header":
        headerParams.push(parameter);
        break;
      case "query":
        queryParams.push(parameter);
        break;
      case "path":
        // This parameter is handled at the `path` level.
        break;
      default:
        throw new Error(
          `UNREACHABLE: parameter type ${
            (parameter satisfies never as HttpOperationParameter).type
          }`
        );
    }
  }

  yield `export interface ${operationBaseName}Request {`;
  if (headerParams.length > 0) {
    yield `  headers: {`;
    for (const param of headerParams) {
      yield `    ${param.name}: string;`;
    }
    yield `  },`;
  }

  if (queryParams.length > 0) {
    yield `  query: {`;
    for (const param of queryParams) {
      yield `    ${param.name}: string;`;
    }
    yield `  },`;
  }
  yield `}`;
}

import * as ay from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { httpRuntimeTemplateLib } from "../external-packages/ts-http-runtime.js";

export function getRestErrorRefkey() {
  return ay.refkey("rest-error", "static-helpers", "class");
}

export function getCreateRestErrorRefkey() {
  return ay.refkey("create-rest-error", "static-helpers", "function");
}

export function RestError() {
  const requestRefkey = ay.refkey("request", "rest-error-class-field");
  const responseRefkey = ay.refkey("response", "rest-error-class-field");
  const statusRefkey = ay.refkey("status", "rest-error-class-field");
  const bodyRefkey = ay.refkey("body", "rest-error-class-field");
  const headersRefkey = ay.refkey("headers", "rest-error-class-field");
  const constructorRefkey = ay.refkey("constructor", "rest-error-class-method");
  const fromHttpResponseRefkey = ay.refkey("from-http-response", "rest-error-class-method");

  const restErrorClass =
    <ts.ClassDeclaration export name="RestError" extends="Error" refkey={getRestErrorRefkey()}>
      <ts.ClassField public name="request" type={httpRuntimeTemplateLib.HttpRequest} refkey={requestRefkey} />
      <ts.ClassField public name="response" type={httpRuntimeTemplateLib.PipelineResponse} refkey={responseRefkey} />
      <ts.ClassField public name="status" type="string" refkey={statusRefkey}/>
      <ts.ClassField public name="body" type="any" refkey={bodyRefkey}/>
      <ts.ClassField public name="headers" type={"Record<string, string>"} refkey={headersRefkey} />

      <ts.ClassMethod name="constructor" parameters={{message: "string", response: httpRuntimeTemplateLib.PipelineResponse}} returnType={null} refkey={constructorRefkey}>
        {ay.code`
          // Create an error message that includes relevant details.
          super(\`$\{message\} - HTTP $\{response.status} received for $\{response.request.method} $\{response.request.url}\`);
          this.name = 'RestError';
          this.request = response.request;
          this.response = response;
          this.status = response.status;
          this.headers = response.headers;
          this.body = response.body;

          // Set the prototype explicitly.
          Object.setPrototypeOf(this, RestError.prototype);
        `}
      </ts.ClassMethod>
      <ts.ClassMethod static name="fromHttpResponse" parameters={{response: httpRuntimeTemplateLib.PipelineResponse}} returnType={getRestErrorRefkey()} refkey={fromHttpResponseRefkey}>
        {ay.code`
          const defaultMessage = \`Unexpected HTTP status code: $\{response.status}\`;
          return new RestError(defaultMessage, response);
        `}
      </ts.ClassMethod>
    </ts.ClassDeclaration>;

  const createRestError =
    <ts.FunctionDeclaration export name="createRestError" parameters={{response: httpRuntimeTemplateLib.PipelineResponse}} returnType={getRestErrorRefkey()} refkey={getCreateRestErrorRefkey()}>
    {ay.code`
      return ${fromHttpResponseRefkey}(response);
    `}
  </ts.FunctionDeclaration>;

  return [restErrorClass, "\n\n", createRestError];
}

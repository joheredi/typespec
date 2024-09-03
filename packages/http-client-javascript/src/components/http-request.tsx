import { Child, Children, code, mapJoin } from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { Model, Operation, Service } from "@typespec/compiler";
import { $ } from "@typespec/compiler/typekit";
import { FunctionDeclaration } from "@typespec/emitter-framework/typescript";
import {
  HttpOperationResponse,
  HttpOperationResponseContent,
  HttpStatusCodeRange,
} from "@typespec/http";
import { getClientContextRefkey } from "./client-context.js";
import { DeserializerCall, Serializer } from "./serializers-utils.jsx";
import { HttpFetchRefkey } from "./static-fetch-wrapper.js";

interface HttpRequestProps {
  operation: Operation;
  service: Service;
  children?: Children;
}

export function HttpRequest(props: HttpRequestProps) {
  const httpOperation = $.httpOperation.get(props.operation);
  const path = httpOperation.path;
  const method = httpOperation.verb;
  

  return (
    <FunctionDeclaration
      export
      async
      type={props.operation}
      parameters={{ client: <ts.Reference refkey={getClientContextRefkey(props.service)} /> }}
    >
      {code`
        const url = \`\${client.endpoint}${path}${<HttpRequestQuery type={props.operation} />}\`;
        const options = {
          method: "${method}",
          ${<HttpRequestHeaders type={props.operation} />}
          ${(<HttpRequestBody type={props.operation} />)}
         };

         const response = await ${(<ts.Reference refkey={HttpFetchRefkey} />)}(url, options);
      `}
      <HttpResponse type={props.operation} />
    </FunctionDeclaration>
  );
}

export interface HttpRequestQueryProps {
  type: Operation;
}

export function HttpRequestQuery(props: HttpRequestQueryProps) {
  const namer = ts.useTSNamePolicy();
  const httpOperation = $.httpOperation.get(props.type);
  const queryParameters = httpOperation.parameters.properties.filter((p) => $.modelProperty.isHttpQueryParam(p.property)).map(p => p.property)

  if(queryParameters.length === 0) {
    return null;
  }
  
  const queryMap = new Map<string, string>();

  for (const query of queryParameters) {
    const parameterName =namer.getName(query.name, "parameter");
    const queryPath = query.optional ? `options.${parameterName}` : parameterName
    queryMap.set(query.name, queryPath);
  }

  const flatQuery = mapJoin(
    queryMap,
    (name, value) => {
      return `${name}=${value}`;
    },
    { joiner: "&" }
  );

  return code`
    ?${flatQuery},
  `;
}

export interface HttpRequestPathProps {
  type: Operation;
}

export function HttpRequestPath(props: HttpRequestPathProps) {
  const namer = ts.useTSNamePolicy();
  const httpOperation = $.httpOperation.get(props.type);
  httpOperation.uriTemplate
  const pathParameters = httpOperation.parameters.properties.filter((p) => $.modelProperty.isHttpPathParam(p.property)).map(p => p.property)

  if(pathParameters.length === 0) {
    return null;
  }
  
  const pathMap = new Map<string, string>();

  for (const path of pathParameters) {
    const parameterName =namer.getName(path.name, "parameter");
    const pathPath = parameterName
    pathMap.set(path.name, pathPath);
  }

  const flatPath = mapJoin(
    pathMap,
    (name, value) => {
      return `${name}=${value}`;
    },
    { joiner: "&" }
  );

  return code`
    ?${flatPath},
  `;
}

export interface HttpRequestHeadersProps {
  type: Operation;
}

export function HttpRequestHeaders(props: HttpRequestHeadersProps) { 
  const namer = ts.useTSNamePolicy();
  const httpOperation = $.httpOperation.get(props.type);
  const headers = httpOperation.parameters.properties.filter((p) => $.modelProperty.isHttpHeader(p.property)).map(p => p.property)

  if(headers.length === 0) {
    return null;
  }
  
  const headerMap = new Map<string, string>();

  for (const header of headers) {
    const parameterName =namer.getName(header.name, "parameter");
    const headerPath = header.optional ? `options.${parameterName}` : parameterName
    headerMap.set(header.name, headerPath);
  }

  const flatHeaders = mapJoin(
    headerMap,
    (name, value) => {
      return `${name}: ${value}`;
    },
    { joiner: ",\n" }
  );

  return code`
    headers: {
      ${flatHeaders}
    },
  `;
}

export function HttpResponse(props: { type: Operation }) {
  const httpOperation = $.httpOperation.get(props.type);
  const responses = httpOperation.responses;

  const parts: Child[] = [];
  // Loop status codes
  for (const statusCodeResponse of responses) {
    for (const responseContent of statusCodeResponse.responses) {
      parts.push(
        <HttpResponseVariant
          operation={props.type}
          statusCodeResponse={statusCodeResponse}
          responseContent={responseContent}
        />
      );
    }
  }

  return parts;
}

export interface HttpErrorResponseProps {
  type?: Model;
}

export function HttpErrorResponse(props: HttpErrorResponseProps) {
  // TODO: Deserialize error response
  return code`
    throw new Error("Http error");
  `;
}

export interface HttpResponseVariantProps {
  operation: Operation;
  statusCodeResponse: HttpOperationResponse;
  responseContent: HttpOperationResponseContent;
}

function HttpResponseVariant({
  operation,
  responseContent,
  statusCodeResponse,
}: HttpResponseVariantProps) {
  const responseMap = new Map<string, string>();

  for (const name of Object.keys(responseContent.headers ?? [])) {
    responseMap.set(name, `response.headers.get("${name}")`);
  }

  const responseBody = responseContent.body;
  if (responseBody?.bodyKind !== "multipart") {
    const bodyType = responseBody?.type;
    const isDirectSerializer = bodyType && ($.scalar.is(bodyType) || $.array.is(bodyType) || $.record.is(bodyType))
    if (bodyType && isDirectSerializer ) {
      return (
        <HttpResponseStatusCode statusCodeResponse={statusCodeResponse}>
          return <DeserializerCall type={bodyType} itemPath="response.body" />
        </HttpResponseStatusCode>
      );
    }

    if(bodyType && $.model.is(bodyType)) {
      const bodyProperties = bodyType?.properties ?? [];
      bodyProperties.forEach((property) => {
        responseMap.set(property.name, `response.body["${property.name}"]`);
      });
    }


    const flatResponse = mapJoin(
      responseMap,
      (name, value) => {
        return `${name}: ${value}`;
      },
      { joiner: ",\n" }
    );

    const responseModel = $.httpOperation.getResponseModel(
      operation,
      statusCodeResponse,
      responseContent
    );

    if (responseMap.size === 0) {
      return <HttpResponseStatusCode statusCodeResponse={statusCodeResponse}>
        return;
      </HttpResponseStatusCode>;
    }

    return (
      <HttpResponseStatusCode statusCodeResponse={statusCodeResponse}>
        {code`
              const flatResponse = {
                 ${flatResponse}
              }
              return ${(<DeserializerCall type={responseModel} itemPath="flatResponse" />)}
          `}
      </HttpResponseStatusCode>
    );
  }
}

export interface HttpResponseStatusCodeProps {
  statusCodeResponse: HttpOperationResponse;
  children?: Children;
}

export function HttpResponseStatusCode(props: HttpResponseStatusCodeProps) {
  if (typeof props.statusCodeResponse.statusCodes === "number") {
    return code`
    if(response.status === ${props.statusCodeResponse.statusCodes}) {
      ${props.children}
    }`;
  } else if (props.statusCodeResponse.statusCodes === "*") {
    return <HttpErrorResponse />;
  } else if (isHttpStatusCodeRange(props.statusCodeResponse)) {
    return code`
    if(response.status >= ${props.statusCodeResponse.start} && response.status <= ${props.statusCodeResponse.end}) {
      ${props.children}
    }
    `;
  }
}

function isHttpStatusCodeRange(statusCode: any): statusCode is HttpStatusCodeRange {
  return Boolean(
    statusCode.end &&
      statusCode.start &&
      typeof statusCode.end === "number" &&
      typeof statusCode.start === "number"
  );
}

function HttpRequestBody(props: { type: Operation }) {
  const httpOperation = $.httpOperation.get(props.type);
  const requestBody = httpOperation.parameters.body;

  if (!requestBody) {
    return null;
  }

  if (requestBody.bodyKind === "multipart") {
    throw new Error("Multipart request bodies are not supported yet");
  }

  // TODO: Select serializer based on content-type
  return (
    <>
      body:
      <JsonSerializer>
        <Serializer type={requestBody.type} />
      </JsonSerializer>{" "}
    </>
  );
}

export interface JsonSerializerProps {
  children?: Children;
}

function JsonSerializer(props: JsonSerializerProps) {
  return code`JSON.stringify(${props.children})`;
}

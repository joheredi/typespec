import { Children, code, Refkey } from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { Operation, StringLiteral } from "@typespec/compiler";
import { $ } from "@typespec/compiler/typekit";
import { HttpRequestParametersExpression } from "./http-request-parameters-expression.jsx";
import { TypeTransformCall } from "./transforms/type-transform-call.jsx";

export interface HttpRequestOptionsProps {
  operation: Operation;
  refkey?: Refkey;
  children?: Children;
}

export function HttpRequestOptions(props: HttpRequestOptionsProps) {
  return <ts.VarDeclaration name="httpRequestOptions" refkey={props.refkey}>
    <ts.ObjectExpression>
      <HttpRequestOptions.Headers operation={props.operation} />
      <HttpRequestOptions.Body operation={props.operation} />
    </ts.ObjectExpression>
  </ts.VarDeclaration>;
}

export interface HttpRequestOptionsHeadersProps {
  operation: Operation;
  children?: Children;
}

HttpRequestOptions.Headers = function HttpRequestOptionsHeaders(
  props: HttpRequestOptionsHeadersProps,
) {
  // Extract the header request parameters from the operation
  const httpOperation = $.httpOperation.get(props.operation);
  const headers = $.httpRequest.getParameters(httpOperation, "header");

  // Prepare the default content type, to use in case no explicit content type is provided
  let contentType = $.httpRequest.getBodyParameters(httpOperation) ? (
    <ts.ObjectProperty name='"content-type"' value='"application/json"' />
  ) : null;

  // Extract the content type property from the header request parameters, if available
  const contentTypeProperty = $.httpRequest
    .getParameters(httpOperation, "contentType")
    ?.properties.get("contentType");

  // If the content type property is available, use it to set the content type header.
  if (contentTypeProperty) {
    let contentTypePath = "contentType";
    const contentTypeLiteral = (contentTypeProperty.type as StringLiteral).value;
    // When there is a content type literal, use it as the content type value
    const contentTypeValue = contentTypeLiteral ? `"${contentTypeLiteral}"` : contentTypePath;
    contentTypePath = contentTypeProperty.optional
      ? `options.${contentTypePath}`
      : contentTypeValue;
    // Override the default content type
    contentType = <ts.ObjectProperty name='"content-type"' value={contentTypeValue} />;
  }

  return <ts.ObjectProperty name="headers">
      <HttpRequestParametersExpression parameters={headers}>
        {contentType}
      </HttpRequestParametersExpression>,
  </ts.ObjectProperty>;
};

export interface HttpRequestOptionsBodyProps {
  operation: Operation;
  itemName?: string;
  children?: Children;
}

HttpRequestOptions.Body = function HttpRequestOptionsBody(props: HttpRequestOptionsBodyProps) {
  const httpOperation = $.httpOperation.get(props.operation);
  const body = httpOperation.parameters.body;

  if (!body) {
    return <></>;
  }

  let optional = null;
  // if (collapse) {
  //   const collapsedBody = [...body.properties.values()][0];
  //   if (collapsedBody.optional) {
  //     optional = `options?.${collapsedBody.name} && `;
  //   }
  // }

  // The transformer to apply to the body.
  const propertyPath = body.property ? [body.property.name] : undefined;
  const bodyTransform =
    <>
      {optional}<TypeTransformCall type={body.type} itemPath={propertyPath} target="transport" optionsBagName="options"/>
  </>;

  return <>
    <ts.ObjectProperty name="body" value={bodyTransform} />,
    </>;
};

export function JSONSerializer(props: { children?: Children }) {
  return code`JSON.stringify(${props.children})`;
}

import { Children, code, mapJoin, refkey } from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { EncodeData, Model, ModelProperty } from "@typespec/compiler";
import { $ } from "@typespec/compiler/typekit";
import { JsonTransform } from "./transforms/json/json-transform.jsx";

export interface HttpRequestParametersExpressionProps {
  optionsParameter: ModelProperty;
  parameters?: Model;
  children?: Children;
}

export function HttpRequestParametersExpression(props: HttpRequestParametersExpressionProps) {
  const parameters: (ModelProperty | Children)[] = [];

  if (props.children || (Array.isArray(props.children) && props.children.length)) {
    parameters.push(<>
      {props.children},

    </>);
  }

  if (!props.parameters && parameters.length) {
    return <ts.ObjectExpression>
      {parameters}
    </ts.ObjectExpression>;
  } else if (!props.parameters) {
    return <ts.ObjectExpression />;
  }

  const optionsParamRef = props.optionsParameter ? refkey(props.optionsParameter) : "options";
  const members = mapJoin(
    props.parameters.properties,
    (_parameterName, parameter) => {
      const input = parameter.optional ? code`${optionsParamRef}?` : null;

      const encoding = $.modelProperty.getEncoding(parameter) ?? getDefaultEncoding(parameter);
      return <JsonTransform itemRef={input} type={parameter} target="transport" encoding={encoding}/>;
    },
    { joiner: ",\n" },
  );

  parameters.push(...members);

  return <ts.ObjectExpression>
    {parameters}
  </ts.ObjectExpression>;
}

function getDefaultEncoding(prop: ModelProperty): EncodeData | undefined {
  const type = prop.type;
  if ($.scalar.isUtcDateTime(type) || $.scalar.extendsUtcDateTime(type)) {
    return { type, encoding: "rfc3339" };
  }

  if ($.scalar.isBytes(type) || $.scalar.extendsBytes(type)) {
    return { type, encoding: "base64url" };
  }

  return undefined;
}

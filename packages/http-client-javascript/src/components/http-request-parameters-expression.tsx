import { Children, code, mapJoin, refkey } from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { Model, ModelProperty } from "@typespec/compiler";
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
      const options = $.modelProperty.getHttpParamOptions(parameter);
      const name = options?.name ? options.name : parameter.name;

      const input = parameter.optional ? code`${optionsParamRef}?.${name}` : refkey(parameter);

      const value = <JsonTransform itemRef={input} type={parameter.type} target="transport" />;
      return <ts.ObjectProperty name={JSON.stringify(name)} value={value} />;
    },
    { joiner: ",\n" },
  );

  parameters.push(...members);

  return <ts.ObjectExpression>
    {parameters}
  </ts.ObjectExpression>;
}

import * as ay from "@alloy-js/core";
import { Children, mapJoin } from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { EncodeData, ModelProperty } from "@typespec/compiler";
import { $ } from "@typespec/compiler/experimental/typekit";
import { useTransformNamePolicy } from "@typespec/emitter-framework";
import { HttpProperty } from "@typespec/http";
import { getDefaultValue } from "../utils/parameters.jsx";
import { JsonTransform } from "./transforms/json/json-transform.jsx";

export interface HttpRequestParametersExpressionProps {
  optionsParameter: ay.Children;
  parameters?: HttpProperty[];
  children?: Children;
}

export function HttpRequestParametersExpression(props: HttpRequestParametersExpressionProps) {
  const parameters: (ModelProperty | Children)[] = [];
  const transformNamer = useTransformNamePolicy();

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

  const optionsParamRef = props.optionsParameter ?? "options";
  const members = mapJoin(
    props.parameters,
    (httpProperty) => {
      const parameter = httpProperty.property;

      const defaultValue = getDefaultValue(httpProperty);
      const headerName: ay.Children = transformNamer.getApplicationName(parameter);

      const headerRef = ay.code`${optionsParamRef}?.${headerName}`;

      if (defaultValue) {
        const defaultAssignment = defaultValue ? ` ?? ${defaultValue}` : "";
        const headerValue = <>{headerRef}{defaultAssignment}</>;
        const name = transformNamer.getTransportName(parameter);
        const headerAssignment = <ts.ObjectProperty name={`"${name}"`} value={headerValue} />;
        return headerAssignment;
      }

      const itemRef: ay.Children = parameter.optional ? ay.code`${optionsParamRef}?` : null;
      const encoding = $.modelProperty.getEncoding(parameter) ?? getDefaultEncoding(parameter);
      if (parameter.optional) {
        return ay.code`
        ...(${headerRef} && {${<JsonTransform itemRef={itemRef} type={parameter} target="transport" encoding={encoding}/>}})
      `;
      } else {
        return <JsonTransform itemRef={itemRef} type={parameter} target="transport" encoding={encoding}/>;
      }
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

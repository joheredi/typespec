import { mapJoin, refkey } from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { Model } from "@typespec/compiler";
import { DeserializerCall, } from "./serializers-utils.jsx";


export interface ModelDeserializerProps {
  type: Model;
  name?: string;
}
export function ModelDeserializer(props: ModelDeserializerProps) {
  const namePolicy = ts.useTSNamePolicy();
  const modelName = namePolicy.getName(props.type.name ? props.type.name  : "ModelExpression", "function");

  const functionName = props.name ? props.name : `${modelName}Deserializer`;
  return (
    <ts.FunctionDeclaration export name={functionName} refkey={getDeserializerRefkey(props.type)}>
      <ts.FunctionDeclaration.Parameters
        parameters={{ item: "any" }}
      ></ts.FunctionDeclaration.Parameters>
      <>
        return <ModelDeserializerExpression type={props.type} itemPath="item" />;
      </>
    </ts.FunctionDeclaration>
  );
}

export interface ModelDeserializerExpressionProps {
  type: Model;
  itemPath: string;
}

export function ModelDeserializerExpression(props: ModelDeserializerExpressionProps) {
  const namePolicy = ts.useTSNamePolicy();

  return (
    <ts.ObjectExpression>
      {mapJoin(
            props.type.properties,
            (_, property) => {
              const propertyName = namePolicy.getName(property.name, "interface-member");
              const itemPath = `item.${property.name}`;
              return (
                <ts.ObjectProperty
                  name={propertyName}
                  value={<DeserializerCall itemPath={itemPath} type={property.type} />}
                  />
              );
            },
            { joiner: ",\n" }
          )}
    </ts.ObjectExpression>
  );
}

export function getDeserializerRefkey(type: Model) {
  return refkey(type, "deserializer");
}

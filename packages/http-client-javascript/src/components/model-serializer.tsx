import { mapJoin, refkey } from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { Model, Type } from "@typespec/compiler";
import { $ } from "@typespec/compiler/typekit";
import {
  SerializerCall,
} from "./serializers-utils.jsx";
import { ArraySerializerRefkey, RecordSerializerRefkey } from "./static-serializers.jsx";

export interface ModelSerializerProps {
  type: Model;
  name?: string;
}
export function ModelSerializer(props: ModelSerializerProps) {
  const namePolicy = ts.useTSNamePolicy();
  const modelName = namePolicy.getName(props.type.name ? props.type.name : "ModelExpression", "function");

  const functionName = props.name ? props.name : `${modelName}Serializer`;
  return (
    <ts.FunctionDeclaration export name={functionName} refkey={getSerializerRefkey(props.type)}>
      <ts.FunctionDeclaration.Parameters
        parameters={{ item: <ts.Reference refkey={refkey(props.type)} /> }}
      ></ts.FunctionDeclaration.Parameters>
      <>
        return <ModelSerializerExpression type={props.type} itemPath="item" />;
      </>
    </ts.FunctionDeclaration>
  );
}

export interface ModelSerializerExpression {
  type: Model;
  itemPath: string;
}

export function ModelSerializerExpression(props: ModelSerializerExpression) {
  const namePolicy = ts.useTSNamePolicy();

  return (
    <ts.ObjectExpression>
      {mapJoin(
        props.type.properties,
        (_, property) => {
          const propertyName = namePolicy.getName(property.name, "interface-member");
          const itemPath = props.itemPath ?  `${props.itemPath}.${propertyName}` : propertyName ;
          return (
            <ts.ObjectProperty
              name={property.name}
              // TODO: Alloy to support ref to interface properties
              // value={<ts.Reference refkey={refkey(property)} />}
              value={<SerializerCall itemPath={itemPath} type={property.type} />}
            />
          );
        },
        { joiner: ",\n" }
      )}
    </ts.ObjectExpression>
  );
}

export function getSerializerRefkey(type: Model) {
  if ($.array.is(type)) {
    return <ts.Reference refkey={ArraySerializerRefkey} />;
  }

  if ($.record.is(type)) {
    return <ts.Reference refkey={RecordSerializerRefkey} />;
  }

  return refkey(type, "serializer");
}

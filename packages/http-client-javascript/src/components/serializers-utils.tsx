import { Child, Children } from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { EncodeData, Model, Type } from "@typespec/compiler";
import { $ } from "@typespec/compiler/typekit";
import { getSerializerRefkey, ModelSerializerExpression } from "./model-serializer.jsx";
import { ArraySerializerRefkey, DateDeserializerRefkey, DateRfc3339SerializerRefkey, DateRfc7231SerializerRefkey, DateUnixTimestampDeserializerRefkey, DateUnixTimestampSerializerRefkey, RecordSerializerRefkey } from "./static-serializers.jsx";
import { getDeserializerRefkey, ModelDeserializerExpression } from "./model-deserializer.jsx";

export interface DeserializerCallProps {
  type: Type;
  itemPath: string;
  children?: Children;
}

export function DeserializerCall(props: DeserializerCallProps) {
  if (props.type.kind === "Model") {
    if (!props.type.name) {
      return (<ModelDeserializerExpression type={props.type} itemPath={props.itemPath} />)
    }

    if($.array.is(props.type)) {
      return <ArraySerializerCall type={props.type} itemPath={props.itemPath} />
    }

    return (
      <>
        <ts.Reference refkey={getDeserializerRefkey(props.type)} />({props.itemPath})
      </>
    );
  }

  return <><Deserializer type={props.type} />({props.itemPath})</>
}

export interface SerializerCallProps {
  type: Type;
  itemPath: string;
  children?: Children;
}

export function SerializerCall(props: SerializerCallProps) {
  if (props.type.kind === "Model") {
    if (!props.type.name) {
      return (<ModelSerializerExpression type={props.type} itemPath={props.itemPath} />)
    }

    return (
      <>
        <ts.Reference refkey={getSerializerRefkey(props.type)} />({props.itemPath})
      </>
    );
  }

  return <><Serializer type={props.type} />({props.itemPath})</>
}

export interface SerializerProps {
  type: Type;
  wrapperEncoding?: EncodeData;
}

export function Serializer(props: SerializerProps) {
  const { type } = props;
  if (type.kind === "Model") {
    if (!type.name) {
     return <SerializerCall type={type} itemPath="" />;
    }

    return <ts.Reference refkey={getSerializerRefkey(type)} />;
  }

  if($.scalar.is(type)) {
    if($.scalar.isUtcDateTime(type) || $.scalar.extendsUtcDateTime(type)) {
      const encoding = props.wrapperEncoding ?? $.scalar.getEncoding(type);
      switch(encoding?.encoding) {
        case "rfc7231":
          return <ts.Reference refkey={DateRfc7231SerializerRefkey} />;
        case "unixTimestamp":
          return <ts.Reference refkey={DateUnixTimestampSerializerRefkey} />;
        case "rfc3339":
        default:
          return <ts.Reference refkey={DateRfc3339SerializerRefkey} />;
      }
    }
  }

  return null;
}

export interface DeserializerProps {
  type: Type;
}
export function Deserializer(props: DeserializerProps) {
  const { type } = props;
  if (type.kind === "Model") {
    if (!type.name) {
     return <DeserializerCall type={type} itemPath="item" />;
    }

    return <ts.Reference refkey={getDeserializerRefkey(type)} />;
  }

  if($.scalar.is(type)) {
    if($.scalar.isUtcDateTime(type) || $.scalar.extendsUtcDateTime(type)) {
      const encoding = $.scalar.getEncoding(type);
      switch(encoding?.encoding) {
        case "unixTimestamp":
          return <ts.Reference refkey={DateUnixTimestampDeserializerRefkey} />;
        case "rfc3339":
        case "rfc7231":
        default:
          return <ts.Reference refkey={DateDeserializerRefkey} />;
      }
    }
  }

  return null;
}

export interface ModelSerializerCallProps {
  type: Model;
  itemPath: string;
  name?: string;
}

export function ModelSerializer(props: ModelSerializerCallProps) {
  if ($.array.is(props.type)) {
    return <ArraySerializerCall type={props.type} itemPath={props.itemPath} />;
  }
}

export interface ArraySerializerCallProps {
  type: Model;
  itemPath: string;
  children?: Children;
}

export function ArraySerializerCall(props: ArraySerializerCallProps) {
  if (!$.array.is(props.type)) {
    return null;
  }

  const elementType = $.array.getElementType(props.type);
  const elementSerializer = <Serializer type={elementType} />;

  return (
    <>
      <ts.Reference refkey={ArraySerializerRefkey} />({props.itemPath}, {elementSerializer})
    </>
  );
}

export interface ArrayDeserializerProps {
  type: Model;
  itemPath: string;
  children?: Children;
}

export function ArrayDeserializer(props: ArrayDeserializerProps) {
  if (!$.array.is(props.type)) {
    return null;
  }

  const elementType = $.array.getElementType(props.type);
  const elementSerializer = <Deserializer type={elementType} />;

  return (
    <>
      <ts.Reference refkey={ArraySerializerRefkey} />({props.itemPath}, {elementSerializer})
    </>
  );
}

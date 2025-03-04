import { Children, mapJoin } from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import * as ay from "@alloy-js/core";
import { Enum, Union } from "@typespec/compiler";
import { TypeExpression } from "./type-expression.js";
import { $ } from "@typespec/compiler/experimental/typekit";

export interface UnionExpressionProps {
  type: Union | Enum;
  children?: Children;
}

export function UnionExpression({ type, children }: UnionExpressionProps) {
  const items = $.union.is(type) ? Array.from(type.variants.entries()) : Array.from(type.members.entries());
  const variants = <ay.For joiner={" | "} each={items}>
      {([_, value]) => {
        if($.enumMember.is(value)) {
          return <ts.ValueExpression jsValue={value.value ?? value.name} />;
        } else {
          return <TypeExpression type={value.type} />;
        }
      }}
    </ay.For>
 
  

  if (children || (Array.isArray(children) && children.length)) {
    return <>{variants} {` | ${children}`}</>;
  }

  return variants;
}

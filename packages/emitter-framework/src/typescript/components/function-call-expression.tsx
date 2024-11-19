import { Refkey } from "@alloy-js/core"
import * as ts from "@alloy-js/typescript"
import * as ay from "@alloy-js/core"
import { Model } from "@typespec/compiler"

export interface FunctionCallExpressionProps {
  refkey: Refkey
  type: Model;
}

export function FunctionCallExpression(props: FunctionCallExpressionProps) {
  const args = Array.from(props.type.properties.keys())
  return <ts.FunctionCallExpression refkey={props.refkey} args={args} />
}

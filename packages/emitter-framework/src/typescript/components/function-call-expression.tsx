import { Refkey } from "@alloy-js/core"
import * as ts from "@alloy-js/typescript"
import * as ay from "@alloy-js/core"
import { Model } from "@typespec/compiler"

export interface FunctionCallExpressionProps {
  refkey: Refkey
  type: Model;
  args?: string[];
}

export function FunctionCallExpression(props: FunctionCallExpressionProps) {
  const args = Array.from(props.type.properties.keys())
  if(props.args) {
    args.push(...props.args)
  }
  return <ts.FunctionCallExpression refkey={props.refkey} args={args} />
}

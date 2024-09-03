import { mapJoin } from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { Operation, Service } from "@typespec/compiler";
import { HttpRequest } from "./http-request.jsx";

export interface OperationsFileProps {
  operations: Operation[];
  service: Service;
}

export function OperationsFile(props: OperationsFileProps) {
  return (
    <ts.SourceFile path="operations.ts">
      {mapJoin(props.operations, (operation) => {
        return (
            <HttpRequest operation={operation} service={props.service} />
        );
      }, {joiner: "\n\n"})}
    </ts.SourceFile>
  );
}


import { PathUncheckedResponse } from "@typespec/ts-http-runtime";

export interface OperationOptions {
  operationOptions?: {
    onResponse?: PathUncheckedResponse;
  };
}

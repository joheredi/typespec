import { Scalar } from "../../../src/index.js";

export const intrinsicNameToTSType = new Map<string, string>([
  ["unknown", "unknown"],
  ["string", "string"],
  ["int32", "number"],
  ["int16", "number"],
  ["float16", "number"],
  ["float32", "number"],
  ["int64", "bigint"],
  ["boolean", "boolean"],
  ["null", "null"],
]);

export interface ScalarProps {
  scalar?: Scalar;
  scalarName: string;
}

export default function Scalar({ scalarName }: ScalarProps) {
  if (!intrinsicNameToTSType.has(scalarName)) {
    throw new Error("Unknown scalar type " + scalarName);
  }

  const code = intrinsicNameToTSType.get(scalarName)!;
  return code;
}

import { Interface, Model } from "@typespec/compiler";

export function isModel(type: any): type is Model {
  return type.kind === "Model";
}

export function isInterface(type: any): type is Interface {
  return type.kind === "Interface";
}

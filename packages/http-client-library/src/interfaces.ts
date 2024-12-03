import { Interface, Namespace } from "@typespec/compiler";

export interface Client {
  kind: "Client";
  name: string;
  type: Namespace | Interface;
  service: Namespace;
  parent?: Client;
}

export interface ReferencedType {
  kind: "ReferencedType";
  name: string;
  library: string;
}

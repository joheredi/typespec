import { refkey as getRefkey } from "@alloy-js/core";
import { ParameterDescriptor, Reference } from "@alloy-js/typescript";
import { Interface, Namespace } from "@typespec/compiler";
import { $ } from "@typespec/compiler/typekit";
import { getServers } from "@typespec/http";
import { getClientOptionsRefkey } from "../components/client-context.js";

export function getClientParams(
  type: Namespace | Interface,
  options?: { isClientlet?: boolean },
): Record<string, ParameterDescriptor> {
  if (type.kind === "Interface") {
    return {};
  }

  const server = getServers($.program, type)?.[0];
  const clientParameters: Record<string, ParameterDescriptor> = {};
  // If there is no URL defined we make it a required parameter
  if (!server?.url) {
    clientParameters["endpoint"] = { type: "string", refkey: getRefkey("endpoint") };
  }

  clientParameters["options"] = {
    optional: true,
    type: <Reference refkey={getClientOptionsRefkey($.client.get(type)!) } />,
    refkey: getRefkey("client.options"),
  };

  return clientParameters;
}

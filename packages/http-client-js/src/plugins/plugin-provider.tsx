import { ComponentContext, createNamedContext, useContext } from "@alloy-js/core";
import { PluginRegistry } from "./plugin.js";

export const PluginContext: ComponentContext<PluginRegistry> =
  createNamedContext<PluginRegistry>("PluginRegistry");

export function usePluginRegistry() {
  return useContext(PluginContext)!;
}

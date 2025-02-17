import { Component } from "@alloy-js/core";
export type Plugin<TProps = any> = {
  name: string;
  component: Component<TProps>;
  match: (props: TProps) => boolean; // Determines if this plugin should be used
};

export class PluginRegistry {
  private plugins: Plugin[] = [];

  register(plugin: Plugin) {
    this.plugins.push(plugin);
  }

  resolve<TProps>(props: TProps): Component<TProps> | null {
    const plugin = this.plugins.find((p) => p.match(props));
    return plugin ? plugin.component : null;
  }
}

export const pluginRegistry = new PluginRegistry();

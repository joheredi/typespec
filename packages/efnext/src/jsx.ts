interface FunctionComponent {
  (props: Record<string, any>): SourceNode | Promise<SourceNode>;
}

export function jsx(
  component: FunctionComponent,
  props?: Record<string, any> & { children: any }
): SourceNode {
  const { children, ...rest } = props || {};
  return createElement(component, rest, children);
}

export function Fragment(props: { children: any[] }): any[] {
  return props.children;
}

export function jsxs(
  component: FunctionComponent,
  props?: Record<string, any> & { children: any }
): SourceNode {
  const { children, ...rest } = props || {};
  return createElement(component, rest, children);
}

export interface SourceNode {
  type: FunctionComponent | typeof Fragment;
  props: Record<string, any> & { children?: any[] };
}

export function createElement(tag: any, props: any, ...children: any[]) {
  if (typeof tag === "function") {
    return tag({ ...props, children });
  }
  return { tag, props: { ...props, children } };
}

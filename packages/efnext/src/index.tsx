import { Fragment, SourceNode } from "#jsx/jsx-runtime";
import {
  EmitContext,
  Model,
  ModelProperty,
  Operation,
  Type,
  Union,
  listOperationsIn,
} from "@typespec/compiler";
import { EmitOutput, SourceFile } from "./framework/index.js";
import { Block } from "./typescript/block.js";
import { Function } from "./typescript/function.js";
import { ObjectValue } from "./typescript/value.js";

export function $onEmit(context: EmitContext) {
  const operations = listOperationsIn(context.program.getGlobalNamespaceType());
  console.log(operations.length);
  const op: Operation = operations[0];
  const x = (
    <EmitOutput>
      <SourceFile path="test1.txt">
        import <lb /> parseArgs, type ParseArgsConfig <rb /> from "node:util";
        <CommandArgParser command={op} />
      </SourceFile>
      <SourceFile path="test2.txt"></SourceFile>
    </EmitOutput>
  );

  renderTree(x);
}

export interface CommandArgParserProps {
  command: Operation;
}
function $verbatim(code: string): any {
  return code;
}

function isBoolean(type: Type): boolean {
  return type.kind === "Boolean";
}

function hasShortName(option: ModelProperty): boolean {
  return false;
}

function getShortName(option: ModelProperty): string {
  return "NYI";
}

export function CommandArgParser({ command }: CommandArgParserProps) {
  const parseArgsArg: Record<string, any> = {
    args: $verbatim("args"),
    tokens: true,
    strict: true,
    options: {},
  };

  for (const option of collectCommandOptions(command)) {
    const argOptions: Record<string, any> = {};
    parseArgsArg.options[option.name] = argOptions;

    if (isBoolean(option.type)) {
      argOptions.type = "boolean";
    } else {
      argOptions.type = "string";
    }

    if (hasShortName(option)) {
      argOptions.short = getShortName(option);
    }
  }

  return (
    <Function name={`parse${command.name}Args`}>
      <Function.Parameters>args: string[]</Function.Parameters>
      <Function.Body>
        const <Block> tokens </Block> = nodeParseArgs(
        <ObjectValue jsValue={parseArgsArg} />
        );
      </Function.Body>
    </Function>
  );
}

function collectCommandOptions(command: Operation): ModelProperty[] {
  const commandOpts: ModelProperty[] = [];

  const types: (Model | Union)[] = [command.parameters];

  while (types.length > 0) {
    const type = types.pop()!;

    if (type.kind === "Model") {
      for (const param of type.properties.values()) {
        if (param.type.kind === "Model") {
          types.push(param.type);
        } else if (
          param.type.kind === "Union" &&
          [...param.type.variants.values()].find((v) => v.type.kind === "Model")
        ) {
        } else {
          commandOpts.push(param);
        }
      }
    } else if (type.kind === "Union") {
      for (const variant of type.variants.values()) {
        if (variant.type.kind === "Union" || variant.type.kind === "Model") {
          types.push(variant.type);
        }
      }
    }
  }

  return commandOpts;
}

/*
 import { parseArgs, type ParseArgsConfig } from "node:util";
function parse<%= string.capitalize(command.name) %>Args(args: string[]) {
  const { tokens } = nodeParseArgs({
    args,
    options: {
      <% for(const opt of options) { %>
        "<%- opt.name %>": {
          <% if (boolean.is(opt.type)) { %>
            type: "boolean",
          <% } else { %>
            type: "string",
          <% } %>
          <% if (option.hasShortName(opt)) { %>
            short: "<%- option.getShortName(opt) %>",
          <% } %>
        },
      <% } %>
    },
    tokens: true,
    strict: false,
  });

  const args: [
    <% for(const [paramName, paramType] of command.parameters.properties) { %>
      <%- paramName %>: <%- include("interface.ejs", { type: paramType }) %>
    <% } %>
  ] = [] as any;

  return tokens;
}
*/

// const res = $onEmit();
// renderTree(res);

// if this guy sees a promise somewhere in props, it can wait for resolution
// then replace that index of the array with that text.

async function renderTree(root: SourceNode) {
  try {
    const output = await renderNode(root);
    console.log(output);
  } catch (error) {
    console.error("Error rendering tree:", error);
  }
}

export async function renderNode(node: SourceNode): Promise<string> {
  if (Array.isArray(node)) {
    return renderNodes(node);
  }

  if (node.type === Fragment) {
    return renderNodes(node.props.children || []);
  }

  if (typeof node.type === "function") {
    const result = await node.type(node.props as any);
    if (typeof result === "string") {
      return result;
    }
    if (typeof result === "object" && "type" in result) {
      return renderNode(result);
    }
    throw new Error(`Unexpected result type: ${typeof result}`);
  }

  if (typeof node === "string") {
    return node;
  }

  if (node instanceof Promise) {
    const resolvedNode = await node;
    return renderNode(resolvedNode);
  }

  throw new Error(`Unknown node type: ${JSON.stringify(node)}`);
}

export async function renderNodes(nodes: SourceNode[]): Promise<string> {
  const result: string[] = [];
  for (const node of nodes) {
    const renderedNode = await renderNode(node);
    result.push(renderedNode);
  }
  return result.join("");
}

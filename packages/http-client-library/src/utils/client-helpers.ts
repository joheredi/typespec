import { ModelProperty, Operation, StringLiteral, Type } from "@typespec/compiler";
import { $ } from "@typespec/compiler/typekit";
import { getAuthentication, getServers } from "@typespec/http";
import { Client } from "../interfaces.js";
import { getStringValue, getUniqueTypes } from "./helpers.js";

/**
 * Returns endpoint parameters, grouped by constructor. Meaning, each constructor will have its own set of parameters.
 * @param client
 * @returns
 */
export function getEndpointParametersPerConstructor(client: Client): ModelProperty[][] {
  const servers = getServers($.program, client.service);
  if (servers === undefined && client.parent === undefined) {
    const name = "endpoint";
    return [
      [
        $.modelProperty.create({
          name,
          type: $.program.checker.getStdType("string"),
          optional: false,
          defaultValue: getStringValue("{endpoint}"),
        }),
      ],
    ];
  }
  const retval: ModelProperty[][] = [];
  for (const server of servers ?? []) {
    const overridingEndpointConstructor: ModelProperty[] = [];
    // add a parameter for each server, this is where users can override and pass in the full server
    overridingEndpointConstructor.push(
      $.modelProperty.create({
        name: "endpoint",
        type: $.builtin.string,
        optional: false,
        defaultValue: getStringValue(server.url),
      }),
    );
    retval.push(overridingEndpointConstructor);
    const formattingServerUrlConstructor: ModelProperty[] = [];
    for (const param of server.parameters.values()) {
      formattingServerUrlConstructor.push(
        $.modelProperty.create({
          name: param.name,
          type: param.type,
          optional: param.optional,
          defaultValue: param.defaultValue,
        }),
      );
    }
    if (formattingServerUrlConstructor.length > 0) {
      retval.push(formattingServerUrlConstructor);
    }
  }
  return retval;
}

export function getCredentalParameter(client: Client): ModelProperty | undefined {
  const schemes = getAuthentication($.program, client.service)?.options.flatMap((o) => o.schemes);
  if (!schemes) return;
  const credTypes: StringLiteral[] = schemes.map((scheme) => {
    return $.literal.createString(scheme.type);
  });
  let credType: Type;
  if (credTypes.length === 1) {
    credType = credTypes[0];
  } else {
    const variants = credTypes.map((v) => $.unionVariant.create({ name: v.value, type: v }));
    credType = $.union.create({ variants });
  }
  return $.modelProperty.create({
    name: "credential",
    type: credType,
  });
}

const constructorCache = new Map<Client, Operation[]>();

export function getConstructors(client: Client): Operation[] {
  if (constructorCache.has(client)) {
    return constructorCache.get(client)!;
  }

  const parentConstructors = client.parent ? getConstructors(client.parent) : [];
  let constructors: Operation[] = parentConstructors;

  const credentialParam = getCredentalParameter(client);
  const endpointParams = getEndpointParametersPerConstructor(client);

  if (!endpointParams.length && !credentialParam) {
    return constructors;
  }

  if (endpointParams.length) {
    constructors = [];
    const creds = credentialParam
      ? credentialParam
      : parentConstructors[0]?.parameters.properties.get("credential");
    for (const endpointParamGrouping of endpointParams) {
      constructors.push(
        $.operation.create({
          name: "constructor",
          parameters: [...endpointParamGrouping, ...(creds ? [creds] : [])],
          returnType: $.program.checker.voidType,
        }),
      );
    }
  }

  // Apply credential override
  if (credentialParam) {
    const subClientConstructors: Operation[] = [];
    for (const constructor of constructors) {
      const newOperation = $.type.clone(constructor);
      const clonedParams = $.type.clone(newOperation.parameters);
      newOperation.parameters = clonedParams;
      clonedParams.properties.set(credentialParam.name, credentialParam);
      subClientConstructors.push(newOperation);
    }

    constructors = subClientConstructors;
  }

  constructorCache.set(client, constructors);
  return constructors;
}

export function createBaseConstructor(client: Client, constructors: Operation[]): Operation {
  const allParams: Map<string, ModelProperty[]> = new Map();
  const combinedParams: ModelProperty[] = [];

  // Collect all parameters from all constructors
  constructors.forEach((constructor) => {
    constructor.parameters.properties.forEach((param) => {
      if (!allParams.has(param.name)) {
        allParams.set(param.name, []);
      }
      allParams.get(param.name)!.push(param);
    });
  });

  // Combine parameter types and determine if they should be optional
  allParams.forEach((params, name) => {
    // if they aren't used in every single overload, then the parameter should be optional
    // otherwise, it's optional if any of the overloads have it as optional
    const overrideToOptional = params.length !== constructors.length;
    const uniqueTypes = getUniqueTypes(params.map((param) => param.type));
    const combinedType =
      uniqueTypes.length > 1
        ? $.union.create({ variants: uniqueTypes.map((x) => $.unionVariant.create({ type: x })) })
        : uniqueTypes[0];
    combinedParams.push(
      $.modelProperty.create({
        name,
        type: combinedType,
        optional: overrideToOptional ? true : params.some((param) => param.optional),
      }),
    );
  });
  // Custom sorting function
  combinedParams.sort((a, b) => {
    // Required parameters come before optional ones
    if (a.optional !== b.optional) {
      return a.optional ? 1 : -1;
    }

    // "endpoint" comes before "credential"
    if (a.name === "endpoint" && b.name !== "endpoint") {
      return -1;
    }
    if (a.name !== "endpoint" && b.name === "endpoint") {
      return 1;
    }
    if (a.name === "credential" && b.name !== "credential") {
      return -1;
    }
    if (a.name !== "credential" && b.name === "credential") {
      return 1;
    }

    // Alphabetical ordering
    return a.name.localeCompare(b.name);
  });
  return $.operation.create({
    name: "constructor",
    parameters: combinedParams,
    returnType: $.program.checker.voidType,
  });
}

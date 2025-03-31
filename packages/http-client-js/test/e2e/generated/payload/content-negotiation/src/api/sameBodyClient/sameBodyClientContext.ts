import { createPipelineFromOptions, Pipeline, CreatePipelineForClientOptions } from "@typespec/ts-http-runtime";

export interface SameBodyClientContext {
  pipeline: Pipeline;
  endpoint: string;
}
export interface SameBodyClientOptions {
  endpoint?: string;
  pipelineOptions?: CreatePipelineForClientOptions;
}
export function createSameBodyClientContext(
  options?: SameBodyClientOptions,
): SameBodyClientContext {
  const params: Record<string, any> = {
    endpoint: options?.endpoint ?? "http://localhost:3000",
  };
  const resolvedEndpoint = "{endpoint}".replace(/{([^}]+)}/g, (_, key) =>
    key in params
      ? String(params[key])
      : (() => {
          throw new Error(`Missing parameter: ${key}`);
        })(),
  );

  const pipeline = createPipelineFromOptions({ ...options?.pipelineOptions  });

  return {
    pipeline,
    endpoint: resolvedEndpoint,
  };
}

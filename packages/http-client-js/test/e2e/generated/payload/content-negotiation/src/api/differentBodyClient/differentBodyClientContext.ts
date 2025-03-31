import {
  CreatePipelineForClientOptions,
  createPipelineFromOptions,
  Pipeline,
} from "@typespec/ts-http-runtime";


export interface DifferentBodyClientContext {
  pipeline: Pipeline;
  endpoint: string;
}
export interface DifferentBodyClientOptions {
  endpoint?: string;
  pipelineOptions?: CreatePipelineForClientOptions;
}

export function createDifferentBodyClientContext(
  options?: DifferentBodyClientOptions,
): DifferentBodyClientContext {
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

  const pipeline = createPipelineFromOptions({ ...options?.pipelineOptions });


  return {
    pipeline,
    endpoint: resolvedEndpoint,
  }
}

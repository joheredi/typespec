import {
  apiKeyAuthenticationPolicy,
  ApiKeyCredential,
  CreatePipelineForClientOptions,
  createPipelineFromOptions,
  Pipeline,
} from "@typespec/ts-http-runtime";

export interface ApiKeyClientContext {
  pipeline: Pipeline;
  endpoint: string;
}

export interface ApiKeyClientOptions {
  endpoint?: string;
  pipelineOptions?: CreatePipelineForClientOptions;
}

export function createApiKeyClientContext(
  credential: ApiKeyCredential,
  options?: ApiKeyClientOptions,
): ApiKeyClientContext {
  const params: Record<string, any> = {};
  const resolvedEndpoint = "http://localhost:3000".replace(/{([^}]+)}/g, (_, key) =>
    key in params
      ? String(params[key])
      : (() => {
          throw new Error(`Missing parameter: ${key}`);
        })(),
  );
  const pipeline = createPipelineFromOptions({ ...options?.pipelineOptions });

  // Setup pipeline policies specifically for this client
  // Only a single policy is accepted in this client
  pipeline.addPolicy(
    apiKeyAuthenticationPolicy({
      credential,
      authSchemes: [
        {
          kind: "apiKey",
          apiKeyLocation: "header",
          name: "x-ms-api-key",
        },
      ],
    }),
  );

  return {
    pipeline,
    endpoint: resolvedEndpoint,
  };
}

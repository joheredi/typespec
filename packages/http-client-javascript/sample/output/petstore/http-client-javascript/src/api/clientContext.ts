import { Client, ClientOptions, getClient } from "@typespec/ts-http-runtime";

export interface PetStoreClientContext extends Client {}
export interface PetStoreClientOptions extends ClientOptions {
  endpoint?: string;
}
export function createPetStoreClientContext(endpoint: string): PetStoreClientContext {
  return getClient(endpoint, { allowInsecureConnection: true });
}

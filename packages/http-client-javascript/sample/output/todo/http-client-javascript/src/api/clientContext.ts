import {
  Client,
  ClientOptions,
  KeyCredential,
  TokenCredential,
  getClient,
} from "@typespec/ts-http-runtime";

export interface TodoClientContext extends Client {}
export interface TodoClientOptions extends ClientOptions {
  endpoint?: string;
}
export function createTodoClientContext(
  endpoint: string,
  credential: TokenCredential | KeyCredential,
): TodoClientContext {
  return getClient(endpoint, credential, { allowInsecureConnection: true });
}
export interface TodoItemsClientContext extends Client {}
export interface TodoItemsClientOptions extends ClientOptions {
  endpoint?: string;
}
export function createTodoItemsClientContext(
  endpoint: string,
  credential: TokenCredential | KeyCredential,
): TodoItemsClientContext {
  return getClient(endpoint, credential, { allowInsecureConnection: true });
}
export interface AttachmentsClientContext extends Client {}
export interface AttachmentsClientOptions extends ClientOptions {
  endpoint?: string;
}
export function createAttachmentsClientContext(
  endpoint: string,
  credential: TokenCredential | KeyCredential,
): AttachmentsClientContext {
  return getClient(endpoint, credential, { allowInsecureConnection: true });
}
export interface UsersClientContext extends Client {}
export interface UsersClientOptions extends ClientOptions {
  endpoint?: string;
}
export function createUsersClientContext(endpoint: string): UsersClientContext {
  return getClient(endpoint, { allowInsecureConnection: true });
}

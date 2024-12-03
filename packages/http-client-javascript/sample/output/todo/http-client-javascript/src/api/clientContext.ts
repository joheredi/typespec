import { Client, ClientOptions, KeyCredential, TokenCredential } from "@typespec/ts-http-runtime";

export interface TodoClientContext extends Client {}
export interface TodoClientOptions extends ClientOptions {
  endpoint?: string;
}
export function createTodoClientContext(
  credential: TokenCredential | KeyCredential,
  endpoint: string,
): TodoClientContext {
  throw new Error("Not implemented");
}
export interface TodoItemsClientContext extends Client {}
export interface TodoItemsClientOptions extends ClientOptions {
  endpoint?: string;
}
export function createTodoItemsClientContext(
  credential: TokenCredential | KeyCredential,
  endpoint: string,
): TodoItemsClientContext {
  throw new Error("Not implemented");
}
export interface AttachmentsClientContext extends Client {}
export interface AttachmentsClientOptions extends ClientOptions {
  endpoint?: string;
}
export function createAttachmentsClientContext(
  credential: TokenCredential | KeyCredential,
  endpoint: string,
): AttachmentsClientContext {
  throw new Error("Not implemented");
}
export interface UsersClientContext extends Client {}
export interface UsersClientOptions extends ClientOptions {
  endpoint?: string;
}
export function createUsersClientContext(endpoint: string): UsersClientContext {
  throw new Error("Not implemented");
}

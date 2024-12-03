import { Client, ClientOptions } from "@typespec/ts-http-runtime";

export interface TodoClientContext extends Client {}
export interface TodoClientOptions extends ClientOptions {
  endpoint?: string;
}
export function createTodoClientContext(
  endpoint: string,
  credential: "http" | "apiKey",
): TodoClientContext {
  throw new Error("Not implemented");
}
export interface TodoItemsClientContext extends Client {}
export interface TodoItemsClientOptions extends ClientOptions {
  endpoint?: string;
}
export function createTodoItemsClientContext(
  endpoint: string,
  credential: "http" | "apiKey",
): TodoItemsClientContext {
  throw new Error("Not implemented");
}
export interface AttachmentsClientContext extends Client {}
export interface AttachmentsClientOptions extends ClientOptions {
  endpoint?: string;
}
export function createAttachmentsClientContext(
  endpoint: string,
  credential: "http" | "apiKey",
): AttachmentsClientContext {
  throw new Error("Not implemented");
}
export interface UsersClientContext extends Client {}
export interface UsersClientOptions extends ClientOptions {
  endpoint?: string;
}
export function createUsersClientContext(
  endpoint: string,
  credential: "noAuth",
): UsersClientContext {
  throw new Error("Not implemented");
}

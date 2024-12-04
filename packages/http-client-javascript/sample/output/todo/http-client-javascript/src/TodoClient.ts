import { KeyCredential, TokenCredential } from "@typespec/ts-http-runtime";
import { createAttachment, list as list_2 } from "./api/attachmentsClient/operations.js";
import {
  AttachmentsClientContext,
  TodoClientContext,
  TodoItemsClientContext,
  UsersClientContext,
  createAttachmentsClientContext,
  createTodoClientContext,
  createTodoItemsClientContext,
  createUsersClientContext,
} from "./api/clientContext.js";
import { create, delete_, get, list, update } from "./api/todoItemsClient/operations.js";
import { create as create_2 } from "./api/usersClient/operations.js";
import {
  AttachmentPage,
  TodoAttachment,
  TodoItem,
  TodoItemPatch,
  TodoLabels,
  TodoPage,
  User,
} from "./models/models.js";

export class TodoClient {
  #context: TodoClientContext;
  usersClient: UsersClient;
  todoItemsClient: TodoItemsClient;
  constructor(endpoint: string, credential: TokenCredential | KeyCredential) {
    this.usersClient = new UsersClient(endpoint);
    this.todoItemsClient = new TodoItemsClient(endpoint, credential);

    this.#context = createTodoClientContext(endpoint, credential);
  }
}
export class TodoItemsClient {
  #context: TodoItemsClientContext;
  attachmentsClient: AttachmentsClient;
  constructor(endpoint: string, credential: TokenCredential | KeyCredential) {
    this.attachmentsClient = new AttachmentsClient(endpoint, credential);

    this.#context = createTodoItemsClientContext(endpoint, credential);
  }
  async list(options?: { limit?: number; offset?: number }): Promise<TodoPage> {
    return list(this.#context, options);
  }
  async create(
    item: TodoItem,
    contentType: "application/json",
    options?: {
      attachments?: TodoAttachment[];
    },
  ): Promise<{
    id: number;
    title: string;
    createdBy: number;
    assignedTo?: number;
    description?: string;
    status: "NotStarted" | "InProgress" | "Completed";
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
    labels?: TodoLabels;
  }> {
    return create(this.#context, item, contentType, options);
  }
  async get(id: number): Promise<{
    id: number;
    title: string;
    createdBy: number;
    assignedTo?: number;
    description?: string;
    status: "NotStarted" | "InProgress" | "Completed";
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
    labels?: TodoLabels;
  } | void> {
    return get(this.#context, id);
  }
  async update(
    id: number,
    patch: TodoItemPatch,
    contentType: "application/merge-patch+json",
  ): Promise<{
    id: number;
    title: string;
    createdBy: number;
    assignedTo?: number;
    description?: string;
    status: "NotStarted" | "InProgress" | "Completed";
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
    labels?: TodoLabels;
  }> {
    return update(this.#context, id, patch, contentType);
  }
  async delete(id: number): Promise<void> {
    return delete_(this.#context, id);
  }
}
export class AttachmentsClient {
  #context: AttachmentsClientContext;

  constructor(endpoint: string, credential: TokenCredential | KeyCredential) {
    this.#context = createAttachmentsClientContext(endpoint, credential);
  }
  async list(itemId: number): Promise<AttachmentPage | void> {
    return list_2(this.#context, itemId);
  }
  async createAttachment(itemId: number, contents: TodoAttachment): Promise<void> {
    return createAttachment(this.#context, itemId, contents);
  }
}
export class UsersClient {
  #context: UsersClientContext;

  constructor(endpoint: string) {
    this.#context = createUsersClientContext(endpoint);
  }
  async create(user: User): Promise<{
    id: number;
    username: string;
    email: string;
    token: string;
  }> {
    return create_2(this.#context, user);
  }
}

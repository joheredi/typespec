import { KeyCredential, TokenCredential } from "@typespec/ts-http-runtime";
import { createAttachment, list as list_2 } from "../api/attachmentsClient/operations.js";
import {
  AttachmentsClientContext,
  TodoClientContext,
  TodoItemsClientContext,
  UsersClientContext,
  createAttachmentsClientContext,
  createTodoClientContext,
  createTodoItemsClientContext,
  createUsersClientContext,
} from "../api/clientContext.js";
import { create, delete_, get, list, update } from "../api/todoItemsClient/operations.js";
import { create as create_2 } from "../api/usersClient/operations.js";
import {
  AttachmentPage,
  InvalidTodoItem,
  InvalidUserResponse,
  NoContentResponse,
  NotFoundResponse,
  Standard4XxResponse,
  Standard5XxResponse,
  TodoAttachment,
  TodoItem,
  TodoItemPatch,
  TodoPage,
  User,
  UserCreatedResponse,
  UserExistsResponse,
} from "../models/models.js";

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
  async list(options?: {
    limit?: number;
    offset?: number;
  }): Promise<TodoPage | Standard4XxResponse | Standard5XxResponse> {
    return list(this.#context, options);
  }
  async create(
    item: TodoItem,
    contentType: "application/json",
    options?: {
      attachments?: TodoAttachment[];
    },
  ): Promise<TodoItem | InvalidTodoItem | Standard4XxResponse | Standard5XxResponse> {
    return create(this.#context, item, contentType, options);
  }
  async get(id: number): Promise<TodoItem | NotFoundResponse> {
    return get(this.#context, id);
  }
  async update(
    id: number,
    patch: TodoItemPatch,
    contentType: "application/merge-patch+json",
  ): Promise<TodoItem> {
    return update(this.#context, id, patch, contentType);
  }
  async delete(
    id: number,
  ): Promise<NoContentResponse | NotFoundResponse | Standard4XxResponse | Standard5XxResponse> {
    return delete_(this.#context, id);
  }
}
export class AttachmentsClient {
  #context: AttachmentsClientContext;

  constructor(endpoint: string, credential: TokenCredential | KeyCredential) {
    this.#context = createAttachmentsClientContext(endpoint, credential);
  }
  async list(
    itemId: number,
  ): Promise<AttachmentPage | NotFoundResponse | Standard4XxResponse | Standard5XxResponse> {
    return list_2(this.#context, itemId);
  }
  async createAttachment(
    itemId: number,
    contents: TodoAttachment,
  ): Promise<NoContentResponse | NotFoundResponse | Standard4XxResponse | Standard5XxResponse> {
    return createAttachment(this.#context, itemId, contents);
  }
}
export class UsersClient {
  #context: UsersClientContext;

  constructor(endpoint: string) {
    this.#context = createUsersClientContext(endpoint);
  }
  async create(
    user: User,
  ): Promise<
    | UserCreatedResponse
    | UserExistsResponse
    | InvalidUserResponse
    | Standard4XxResponse
    | Standard5XxResponse
  > {
    return create_2(this.#context, user);
  }
}

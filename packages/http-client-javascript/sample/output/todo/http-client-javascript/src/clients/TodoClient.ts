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
  constructor(endpoint: string, credential: "http" | "apiKey") {}
  async create(
    user: User,
  ): Promise<
    | UserCreatedResponse
    | UserExistsResponse
    | InvalidUserResponse
    | Standard4XxResponse
    | Standard5XxResponse
  > {}
  async list(
    limit?: number,
    offset?: number,
  ): Promise<TodoPage | Standard4XxResponse | Standard5XxResponse> {}
  async create_2(
    contentType: "application/json",
    item: TodoItem,
    attachments?: TodoAttachment[],
  ): Promise<TodoItem | InvalidTodoItem | Standard4XxResponse | Standard5XxResponse> {}
  async get(id: number): Promise<TodoItem | NotFoundResponse> {}
  async update(
    contentType: "application/merge-patch+json",
    id: number,
    patch: TodoItemPatch,
  ): Promise<TodoItem> {}
  async delete(
    id: number,
  ): Promise<NoContentResponse | NotFoundResponse | Standard4XxResponse | Standard5XxResponse> {}
  async list_2(
    itemId: number,
  ): Promise<AttachmentPage | NotFoundResponse | Standard4XxResponse | Standard5XxResponse> {}
  async createAttachment(
    itemId: number,
    contents: TodoAttachment,
  ): Promise<NoContentResponse | NotFoundResponse | Standard4XxResponse | Standard5XxResponse> {}
}
export class TodoClient_2 {
  constructor(endpoint: string, credential: "noAuth") {}
  async create(
    user: User,
  ): Promise<
    | UserCreatedResponse
    | UserExistsResponse
    | InvalidUserResponse
    | Standard4XxResponse
    | Standard5XxResponse
  > {}
}
export class TodoClient_3 {
  constructor(endpoint: string) {}
  async list(
    limit?: number,
    offset?: number,
  ): Promise<TodoPage | Standard4XxResponse | Standard5XxResponse> {}
  async create(
    contentType: "application/json",
    item: TodoItem,
    attachments?: TodoAttachment[],
  ): Promise<TodoItem | InvalidTodoItem | Standard4XxResponse | Standard5XxResponse> {}
  async get(id: number): Promise<TodoItem | NotFoundResponse> {}
  async update(
    contentType: "application/merge-patch+json",
    id: number,
    patch: TodoItemPatch,
  ): Promise<TodoItem> {}
  async delete(
    id: number,
  ): Promise<NoContentResponse | NotFoundResponse | Standard4XxResponse | Standard5XxResponse> {}
  async list_2(
    itemId: number,
  ): Promise<AttachmentPage | NotFoundResponse | Standard4XxResponse | Standard5XxResponse> {}
  async createAttachment(
    itemId: number,
    contents: TodoAttachment,
  ): Promise<NoContentResponse | NotFoundResponse | Standard4XxResponse | Standard5XxResponse> {}
}

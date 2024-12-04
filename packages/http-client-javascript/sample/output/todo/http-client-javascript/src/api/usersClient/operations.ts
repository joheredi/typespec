import { parse } from "uri-template";
import { User } from "../../models/models.js";
import { userToTransport } from "../../models/serializers.js";
import { UsersClientContext } from "../clientContext.js";

export async function create(
  client: UsersClientContext,
  user: User,
): Promise<{
  id: number;
  username: string;
  email: string;
  token: string;
}> {
  const path = parse("/").expand({});

  const httpRequestOptions = {
    headers: {
      "Content-Type": "application/json",
    },
    body: userToTransport(user),
  };

  const response = await client.path(path).post(httpRequestOptions);
  if (response.status === "200") {
    return {
      id: response.body.id,
      username: response.body.username,
      email: response.body.email,
      token: response.body.token,
    };
  }

  throw new Error("Unhandled response");
}

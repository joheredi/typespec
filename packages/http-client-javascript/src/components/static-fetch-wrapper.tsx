import * as ay from "@alloy-js/core";
import { code, refkey } from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { ApiKeyAuth, Authentication } from "@typespec/http";

export const HttpFetchOptionsOptionsRefkey = refkey();
export function HttpFetchOptionsDeclaration() {
  return <ts.InterfaceDeclaration export name="HttpRequestOptions" refkey={HttpFetchOptionsOptionsRefkey}>
    <ts.InterfaceMember name="method" type="string" />
    <ts.InterfaceMember optional name="headers" type="Record<string, string>" />
    <ts.InterfaceMember optional name="body" type="string" />
  </ts.InterfaceDeclaration>;
}

export const HttpFetchRefkey = refkey();
export function HttpFetchDeclaration() {
  return <ts.FunctionDeclaration export async name="httpFetch"  refkey={HttpFetchRefkey}>
      <ts.FunctionDeclaration.Parameters>url: string, options: <ts.Reference refkey={HttpFetchOptionsOptionsRefkey} />
      </ts.FunctionDeclaration.Parameters>
      {code`
        try {
          const response = await fetch(url, options);

          if (!response.ok) {
            throw new Error(\`HTTP error! Status: \${response.status}\`);
          }

          return response;
        } catch (error) {
          console.error('Fetch error:', error);
          throw error;
        }
      `}
    </ts.FunctionDeclaration>;
}

export const BearerCredentialRefkey = refkey();
export function BearerCredential() {
  return <ts.InterfaceDeclaration export name="BearerCredential" refkey={BearerCredentialRefkey}>
    <ts.InterfaceMember name="kind" type={`"bearer`} />
    <ts.InterfaceMember name="token" type="string" />
  </ts.InterfaceDeclaration>;
}

export const ApiKeyCredentialRefkey = refkey();
export function ApiKeyCredential() {
  return <ts.InterfaceDeclaration export name="ApiKeyCredential" refkey={ApiKeyCredentialRefkey}>
    <ts.InterfaceMember name="kind" type={`apiKey`} />
    <ts.InterfaceMember name="key" type="string" />
  </ts.InterfaceDeclaration>;
}

export const CredentialRefkey = refkey();
export function Credential() {
  return <ts.TypeDeclaration export name="Credential" refkey={CredentialRefkey}>
    <ts.Reference refkey={BearerCredentialRefkey} /> | <ts.Reference refkey={ApiKeyCredentialRefkey} />
  </ts.TypeDeclaration>;
}

export interface AuthenticateRequestProps {
  auth: Authentication;
}

export function AuthenticateRequest() {}

export function applyBearer() {
  return ay.code`
    if(credential.kind === "bearer") {
      headers[""Authorization""] = "Bearer " + credential.token;
    }
  `;
}

export function applyApiKey(apiKeyAuth: ApiKeyAuth<"header" | "query" | "cookie", string>) {
  if (apiKeyAuth.in === "header") {
    return ay.code`
      headers["${apiKeyAuth.name}"] = credential.key;
    `;
  }

  if (apiKeyAuth.in === "cookie") {
    return ay.code`
      headers["Cookie"] = "${apiKeyAuth.name}"=credential.key;
    `;
  }

  if (apiKeyAuth.in === "query") {
    throw new Error("Query API key is not supported yet");
  }
  return ay.code`
    if(credential.kind === "apiKey") {
      headers[""Authorization""] = "Bearer " + credential.key;
    }
  `;
}

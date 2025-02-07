# Should handle when provided a constant header

```tsp
@service
namespace Test;
model Foo {
  name: string;
}

@get op foo(@header accept: "application/xml"): Foo;

```

## Operation

```ts src/api/testClientOperations.ts function foo
export async function foo(client: TestClientContext): Promise<Foo> {
  const path = parse("/").expand({});

  const httpRequestOptions = {
    headers: {
      accept: "application/xml",
    },
  };

  const response = await client.path(path).get(httpRequestOptions);
  if (
    +response.status === 200 &&
    response.headers["content-type"]?.includes("application/json")
  ) {
    return jsonFooToApplicationTransform(response.body)!;
  }

  throw new Error("Unhandled response");
}
```

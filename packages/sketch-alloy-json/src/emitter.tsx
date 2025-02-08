import * as ay from "@alloy-js/core";
import { JsonObject, JsonObjectProperty, SourceFile } from "@alloy-js/json";
import { EmitContext, navigateType, Type } from "@typespec/compiler";
import { $ } from "@typespec/compiler/experimental/typekit";

// This activates a side effect to include @typespec/http helpers in Typekit ($)
// import "@typespec/compiler/experimental/typekit/http";

export async function $onEmit(context: EmitContext) {
  const models = collectTypes().filter((t) => $.model.is(t));

  // This is a super simple emitter that just outputs a JsonObject where each property is a model name and the value is the number of properties in the model
  return <ay.Output>
        <SourceFile path="test.json">
            <JsonObject>
              {ay.mapJoin(models, model =>
                  {
                  return (
                    <JsonObjectProperty name={model.name}>
                      {model.properties.size}
                    </JsonObjectProperty>
                    )}, {joiner: ",\n"}
              )}
            </JsonObject>
        </SourceFile>
    </ay.Output>;
}

// One of the differences vs V1 is that the type graph is not traversed automatically
// However there is a function to walk the graph. This is a simple function that shows how
// Types can be collected from the graph.
function collectTypes() {
  const types = new Set<Type>();
  const globalNs = $.program.getGlobalNamespaceType();

  navigateType(
    globalNs,
    {
      model(model) {
        // This ignores any file that comes from TypeSpec itself or any libraries
        if (!$.type.isUserDefined(model)) {
          return;
        }

        types.add(model);
      },
      operation(op) {
        if (!$.type.isUserDefined(op)) {
          return;
        }

        types.add(op);
      },
    },
    { includeTemplateDeclaration: false, visitDerivedTypes: true },
  );

  return Array.from(types);
}

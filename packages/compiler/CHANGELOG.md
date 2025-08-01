# Change Log - @typespec/compiler

## 1.2.0

### Features

- [#7576](https://github.com/microsoft/typespec/pull/7576) Allow LSP to configure which emitters to include for live checks
- [#7151](https://github.com/microsoft/typespec/pull/7151) [API] Addition of a new testing framework. See https://typespec.io/docs/extending-typespec/testing

### Bump dependencies

- [#7674](https://github.com/microsoft/typespec/pull/7674) Upgrade dependencies

### Bug Fixes

- [#7586](https://github.com/microsoft/typespec/pull/7586) Improved the error message for the `@pattern` decorator when applied to a `union` type. The new message is more descriptive and helps users understand how to correctly define string-compatible union types.
- [#7740](https://github.com/microsoft/typespec/pull/7740) Config interpolation is more flexible in interpolating variables in any order as long as no circular reference occur. For example using `{output-dir}` in parameters.
- [#7731](https://github.com/microsoft/typespec/pull/7731) Fix literal typekits `$.literal.create`, `$.literal.createString`, etc. use right checker api that include caching
- [#7906](https://github.com/microsoft/typespec/pull/7906) Corrected some logic around the detection of array types in visibility calculation.


## 1.1.0

### Features

- [#7377](https://github.com/microsoft/typespec/pull/7377) Add a `--stats` flag to `tsp compile` to log some performance and complexity statistics
- [#7530](https://github.com/microsoft/typespec/pull/7530) Show the full definition of model and interface when it has 'extends' and 'is' relationship in the hover text
- [#6923](https://github.com/microsoft/typespec/pull/6923) Init templates can define a project kind which decide if dependencies are added to peer or regular dependencies
- [#6783](https://github.com/microsoft/typespec/pull/6783) Install packages for unrecognized import via npm command
- [#7239](https://github.com/microsoft/typespec/pull/7239) [LSP] Expose new compile project command
- [#7137](https://github.com/microsoft/typespec/pull/7137) Allow passing template parameters as property defaults
- [#7256](https://github.com/microsoft/typespec/pull/7256) Expose `VisibilityFilter.toCacheKey` to allow caching results based on visibility filters.

### Bump dependencies

- [#7323](https://github.com/microsoft/typespec/pull/7323) Upgrade dependencies

### Bug Fixes

- [#7421](https://github.com/microsoft/typespec/pull/7421) Fix hanging when using `::returnType` meta accessor on operation defined with `op is`
- [#7507](https://github.com/microsoft/typespec/pull/7507) Fix empty string emitting error when used in string interpolation in a template
- [#7524](https://github.com/microsoft/typespec/pull/7524) Fixes an error where reported diagnostics had invalid relative paths on Windows
- [#7508](https://github.com/microsoft/typespec/pull/7508) Allow extends of array expression for not just template (`model MyStrings extends string[]`)
- [#7473](https://github.com/microsoft/typespec/pull/7473) Mutator were not mutating tuple values
- [#7485](https://github.com/microsoft/typespec/pull/7485) Fix paging operations to correctly detect the `@pageItems` decorator on base models.
- [#7461](https://github.com/microsoft/typespec/pull/7461) Remove non documented `templateArguments` property on types
- [#7480](https://github.com/microsoft/typespec/pull/7480) Fix infinite recursion when navigating paging properties by detecting and handling circular model references.
- [#7137](https://github.com/microsoft/typespec/pull/7137) Allow passing tempalate parameter values in object and array values used inside the template
- [#7295](https://github.com/microsoft/typespec/pull/7295) Corrected visibility filtering logic to even more aggressively deduplicate the models it visits when the applied visibility transform does not actually remove any properties from a model.


## 1.0.0

### Features

- [#7199](https://github.com/microsoft/typespec/pull/7199) Add "capitalize" string helper to compiler
- [#7180](https://github.com/microsoft/typespec/pull/7180) Add support for formatting `tspconfig.yaml` with `tsp format`
- [#7180](https://github.com/microsoft/typespec/pull/7180) `tsp format` only formats files it knows about and ignores other. Allowing a more generic glob pattern `tsp format .` or `tsp format "**/*"`
- [#5674](https://github.com/microsoft/typespec/pull/5674) [LSP] Update imports when renaming typespec files
- [#7125](https://github.com/microsoft/typespec/pull/7125) Adds typekits for getting intrinsic types via `$.intrinsic.<type>`
- [#7204](https://github.com/microsoft/typespec/pull/7204) Update typekits `is*` methods to accept `Entity` instead of just `Type` or `Value`
- [#7108](https://github.com/microsoft/typespec/pull/7108) Adds support for nesting typekits
- [#7202](https://github.com/microsoft/typespec/pull/7202) Replaces `$.model.getSpreadType` with `$.model.getIndexType` to better reflect what it actually being returned. `getSpreadType` did not actually return a list of spread types, but the model's indexer type instead.
- [#7090](https://github.com/microsoft/typespec/pull/7090) Adds TypeKit support for type.inNamespace to check namespace membership
- [#7167](https://github.com/microsoft/typespec/pull/7167) Adds `$.value.resolve` and `$.type.resolve` typekits, and updated `$.resolve` to return values or types, instead of just types
- [#7106](https://github.com/microsoft/typespec/pull/7106) Adds `$.type.isAssignableTo`, `$.value.isAssignableTo` and `$.entity.isAssignableTo` typekits. Also registers `$.resolve` typekit
- [#7193](https://github.com/microsoft/typespec/pull/7193) Typekits have been moved out of experimental and can now be accessed via the `@typespec/compiler/typekit` submodule.
  This also removed the `$.type.getDiscriminator` typekit in favor of the `$.model.getDiscriminatedUnion` and `$.union.getDiscriminatedUnion`
  typkits.
  
  ```diff
  -import { $ } from "@typespec/compiler/experimental/typekit";
  +import { $ } from "@typespec/compiler/typekit";
  ```
- [#7105](https://github.com/microsoft/typespec/pull/7105) Add typekit support for creating a union from an array of children
- [#7207](https://github.com/microsoft/typespec/pull/7207) Exposed experimental function `isMutableType` as `unsafe_isMutableType`.
- [#7200](https://github.com/microsoft/typespec/pull/7200) Added an optional `nameTemplate` argument to `@withVisibilityFilter`, allowing the visibility filters to rename models as they are transformed. This template is applied by default in the `Create`, `Read`, `Update`, `Delete`, and `Query` visibility transform templates. This allows for more flexible renaming than simply using the `@friendlyName` decorator, as it will change the primary name of the transformed type, reducing the incidence of naming conflicts.
  
  Cached the result of applying visibility filters to types. If the same visibility filter is applied to the same type with the same configuration, the model instance produced by the visibility filter will be object-identical. This should reduce the incidence of multiple models that are structurally equivalent in visibility filters and conflicts over the name of models.

### Bug Fixes

- [#7183](https://github.com/microsoft/typespec/pull/7183) Fix decorators on model properties getting wrongly called when checking the template declaration in the following cases
   - inside a union expression
   - under an non templated operation under a templated interface
- [#6938](https://github.com/microsoft/typespec/pull/6938) Fixes template argument resolution when a default template parameter value is resolved by a parent container (e.g. interface)
  For example:
  ```tsp
  interface Resource<T> {
    read<U = T>(): U;
  }
  
  model Foo {
    type: "foo";
  }
  
  alias FooResource = Resource<Foo>;
  
  op readFoo is FooResource.read;
  ```
  The `returnType` for `readFoo` would be model `Foo`. Previously the `returnType` resolved to a `TemplateParameter`.
- [#7153](https://github.com/microsoft/typespec/pull/7153) Fixes handling of nested templates in getPlausibleName
- [#6883](https://github.com/microsoft/typespec/pull/6883) Realm handle multiple instance of compiler loaded at once
- [#7222](https://github.com/microsoft/typespec/pull/7222) Remove `version` property on `ServiceOptions` passed to `@service` decorator. That handling of that option was removed in `1.0.0-rc.0` where it was previously deprecated.
  If wanting to specify version in an OpenAPI document use the `@OpenAPI.info` decorator from the `@typespec/openapi` library
- [#7155](https://github.com/microsoft/typespec/pull/7155) Mark `TemplateParameter` type as an experimental type
- [#7106](https://github.com/microsoft/typespec/pull/7106) Removes `program.checker.isTypeAssignableTo`. Use one of the following typekits instead:
  - `$(program).type.isAssignableTo`
  - `$(program).value.isAssignableTo`
  - `$(program).entity.isAssignableTo`
- [#7207](https://github.com/microsoft/typespec/pull/7207) Weakened rules around `@mediaTypeHint` decorator, allowing media type hints with suffixes like "application/merge-patch+json".
- [#7200](https://github.com/microsoft/typespec/pull/7200) Fixed an error in Model visibility filtering where the indexer of a model was ignored. This prevented the value of Array/Record instances from being transformed correctly, as they now should be.


## 1.0.0-rc.1

### Features

- [#7067](https://github.com/microsoft/typespec/pull/7067) Adding support for nested paging properties.
- [#6862](https://github.com/microsoft/typespec/pull/6862) `--trace` cli option applies to all commands now
- [#7065](https://github.com/microsoft/typespec/pull/7065) Adds a TypeKit for Tuple types
- [#7049](https://github.com/microsoft/typespec/pull/7049) Adds a new createDiagnosable typekit helper for APIs that return diagnostics
- [#7018](https://github.com/microsoft/typespec/pull/7018) Removes the default typekit in favor of always instantiating typekits with either a `program` or `realm`.
- [#7047](https://github.com/microsoft/typespec/pull/7047) Adds typekit support for creating unions from enums

### Bug Fixes

- [#6897](https://github.com/microsoft/typespec/pull/6897) Improve errors when loading libraries with invalid exports/main fields
- [#7069](https://github.com/microsoft/typespec/pull/7069) Mark `node` property on all typespec types as optional
- [#7063](https://github.com/microsoft/typespec/pull/7063) Fixes an issue where isError was checking for error types instead of error models.
- [#7047](https://github.com/microsoft/typespec/pull/7047) Preserve API documentation when calling `$.enum.createFromUnion`


## 1.0.0-rc.0

### Breaking Changes

- [#6678](https://github.com/microsoft/typespec/pull/6678) Moved `TypeSpecPrettierPlugin` type to internal. If wanting to use the prettier pluging programmatically, use it from the `@typespec/prettier-plugin-typespec` package
- [#6544](https://github.com/microsoft/typespec/pull/6544) Remove deprecated `@typespec/compiler/emitter-framework` export in favor of a new package `@typespec/asset-emitter`
  
    ```diff lang=json title=package.json
    "dependencies": {
    +   "@typespec/asset-emitter": "^0.68.0"
    }
    ```
  
    ```diff lang=ts
    -import { TypeEmitter, ... } from "@typespec/compiler/emitter-framework";
    +import { TypeEmitter, ... } from "@typespec/asset-emitter";
    ```
- [#6754](https://github.com/microsoft/typespec/pull/6754) Reserve additional keywords:
   - `context`
   - `sym`
   - `prop`
   - `property`
   - `scenario`

### Bump dependencies

- [#6595](https://github.com/microsoft/typespec/pull/6595) Upgrade dependencies

### Bug Fixes

- [#6197](https://github.com/microsoft/typespec/pull/6197) Show emitter internal error message in tspconfig
- [#6710](https://github.com/microsoft/typespec/pull/6710) Updates to scaffolding script and scaffold commands for consistency
- [#6826](https://github.com/microsoft/typespec/pull/6826) Fix new reserved keywords were not allowed in augment decorator expression
- [#6697](https://github.com/microsoft/typespec/pull/6697) Fix crash that would happen when a type was mutated while using null in a decorator(e.g. when using versioning library with `@example(null)`)
- [#6711](https://github.com/microsoft/typespec/pull/6711) Fix extra properties not validated in nested entries of the config
- [#6711](https://github.com/microsoft/typespec/pull/6711) Fix passing nested emitter options with `--option`


## 0.67.2

### Bug Fixes

- [#6648](https://github.com/microsoft/typespec/pull/6648) Fix `tsp install` broken in standalone CLI


## 0.67.0

### Breaking Changes

- [#6231](https://github.com/microsoft/typespec/pull/6231) Remove deprecated items:
  - `@deprecated` decorator, use `#deprecated` directive instead

    ```diff lang=tsp
    - @deprecated("Message")
    + #deprecated "Message"
    ```

  - `@service` `versions` support. Either migrate to `@OpenAPI.info` or the versioning library
  
    ```diff lang=tsp
    - @service({version: "1.0"})
    + @service
    + @OpenAPI.info(#{version: "1.0"})
    ```

  - Removed `@knownValues`. Use a union with a string variant instead
    
    ```diff lang=tsp
    - enum MyKnownValues {a, b}
    - @knownValues(MyKnownValues)
    - scalar Custom extends string;
    + union Custom {
    +   "a", "b", string
    + };
    ```

  - Removed `@projectedName` Migrate to `@encodedName` instead.

    ```diff lang=tsp
    - @projectedName("json", "nbf")
    + @encodedName("application/json", "nbf")
    notBefore: int32;
    ```

  - CLI configuration value `output-path`, use `output-dir` instead.

  - Support for `cadlMain` in `package.json`. Migrate to `exports["."].tsp` instead.
    
    ```diff lang=json
    - "cadlMain": "lib/main.tsp",
    + "exports": {
    +   ".": {
    +     "tsp": "lib/main.tsp"
    +   }
    + }
    ```
    
  - Compiling `.cadl` files, use `.tsp` instead.

  - `decoratorArgMarshalling` flag in `$flags` was removed and support for the `legacy` decorator arg marshalling.

  - Using `@format` on bytes. `@format` can only be used on string where it defines a known pattern for the string.

  - Javascript functions and typescript types:
    - `stringTemplateToString`
    - `CadlLanguageConfiguration`
    - `CadlPrettierPlugin`
    - `NodePackage` -> `PackageJson`
    - `CadlValue` -> `TypeSpecValue`
    - `createCadlLibrary` -> `createTypeSpecLibrary`
    - `setCadlNamespace` -> `setTypeSpecNamespace`
    - `CadlLibrary` -> `TypeSpecLibrary`
    - `SyntaxKind.CadlScript` -> `SyntaxKind.TypeSpecScript`
    - `isCadlValueTypeOf` -> `isTypeSpecValueTypeOf`
    - `cadlTypeToJson` -> `typespecTypeToJson`
    - `checkFormatCadl` -> `checkFormatTypeSpec`
    - `cadlVersion` -> `typespecVersion`
    - `CadlManifest` -> `TypeSpecManifest`
    - `validateDecoratorTargetIntrinsic` -> Use `extern dec` to define the signature of decorators instead
    - `validateDecoratorParamType` -> Use `extern dec` to define the signature of decorators instead
    - `createDecoratorDefinition` -> Use `extern dec` to define the signature of decorators instead
    - `CompilerOptions#emitters` -> Use `emit` and `options` field instead.
    - `Type#templateArguments` -> Use `templateMapper` instead.
    - `ModelProperty#default` -> Use `defaultValue` instead.
    - `Union#options` -> Use `variants` instead.
    - `linter` in `createTypeSpecLibrary` -> Use `export const $linter = defineLinter({ ... })` instead.
    - Accessor for removed `@knownValues` decorator
      - `getKnownValues`
    - Accessor for removed `@projectedName` decorator
      - `getProjectedNames`
      - `getProjectedName` 
      - `hasProjectedName`
- [#6323](https://github.com/microsoft/typespec/pull/6323) Move AST related APIS to `@typespec/compiler/ast` package. This is to mark a clear separation for the AST types and APIs which are considered for advanced usage and might change at any time.
  - All `*Node` types
  - `exprIsBareIdentifier`
  - `getFirstAncestor`
  - `getIdentifierContext`
  - `getNodeAtPosition`
  - `getNodeAtPositionDetail`
  - `hasParseError`
  - `isImportStatement`
  - `parse`
  - `parseStandaloneTypeReference`
  - `positionInRange`
  - `visitChildren`
- [#6323](https://github.com/microsoft/typespec/pull/6323) Stop exposing APIs that were not meant for external users. Please file issue if you had legitmate use of some of those APIs.
- `Checker`: The check itself should be used very carefully and its wouldn't be covered under the compatibility guarantees. There is some apis that were explicitly marked as internal while other remained until we provide a better way to do the same thing:
  - `getGlobalNamespaceType();` -> `program.getGlobalNamespaceType();`
  - `resolveTypeReference();` -> `program.resolveTypeReference();`
  - `checkProgram();` This isn't meant to be used by external users.
  - `getLiteralType()` This isn't meant to be used by external users.
  - `resolveRelatedSymbols()` This isn't meant to be used by external users.
  - `resolveCompletions()` This isn't meant to be used by external users.

- `Program`: Exposed functions on the program are safe to use but a few have been updated to be internal:
  - `mainFile` -> Use `projectRoot` instead.
  - `literalTypes` This isn't meant to be used by external users.
  - `checker`: This is still exposed but to be used carefully, see above.
  - `loadTypeSpecScript`: This isn't meant to be used by external users.
  - `onValidate`: This isn't meant to be used by external users.
  - `reportDuplicateSymbols`: This isn't meant to be used by external users.

- `logVerboseTestOutput` Internal test util, not meant for external users
- `validateDecoratorTarget` -> migrate to `extern dec` declaration
- `validateDecoratorParamCount`: Same as above
- `altDirectorySeparator`: Internal path utils
- `directorySeparator`: Internal path utils
- `isIntrinsicType`: Internal check
- `getFullyQualifiedSymbolName` Symbols are an internal aspect of the compiler
- Scanner related APIs:
  - `createScanner`
  - `isComment`
  - `isKeyword`
  - `isModifier`
  - `isPunctuation`
  - `isStatementKeyword`
  - `isTrivia`
  - `skipContinuousIdentifier`
  - `skipTrivia`
  - `skipTriviaBackward`
  - `skipWhiteSpace`
  - `Token`
  - `TokenFlags`
  - `type`DocToken,
  - `type`Scanner,
  - `type`StringTemplateToken,
- Types
  - `Sym` Symbols are an internal aspect of the compiler 
  - `SymbolLinks` Symbols are an internal aspect of the compiler 
  - `SymbolTable` Symbols are an internal aspect of the compiler 
  - `SymbolFlags` Symbols are an internal aspect of the compiler 
  - `MutableSymbolTable` Symbols are an internal aspect of the compiler 
  - `ResolutionResult` Internal type used in non exposed resolver 
  - `NodeLinks` Internal type used in non exposed resolver 
  - `ResolutionResultFlags` Internal type used in non exposed resolver 
  - `MetaMemberKey` Unused type
  - `MetaMembersTable` Unused type
  - `Dirent` Unused type
- [#5977](https://github.com/microsoft/typespec/pull/5977) Minimum node version is now 20
- [#6410](https://github.com/microsoft/typespec/pull/6410) Remove a legacy behavior of resolving package names which wasn't inline with node ESM module resolution.

  For example if you were running tsp compile within your node_modules folder(on a test package) and referencing your emitter by name you might need to change this
  ```diff lang=bash 
  -tsp compile . --emit my-emitter
  +tsp compile . ../../  # path to your emitter root instead
  ```
- [#6286](https://github.com/microsoft/typespec/pull/6286) Removed deprecated use of `@discriminator` on union. Migrate to `@discriminated`

  ```diff lang="tsp"
  -@discriminator("type")
  +@discriminated(#{envelope: "none", discriminatorPropertyName: "type"})
  union Pet;
  ```
- [#6327](https://github.com/microsoft/typespec/pull/6327) Remove projection. Projection was an experiemental syntax that was too flawed to be included in 1.0 in that current state.
- [#6388](https://github.com/microsoft/typespec/pull/6388) Remove deprecated type to value conversion. Since the introductions of object values(`#{}`) and array values(`#[]`) using model expressions or tuple where values were expected has been deprecated. It is now an error with a codefix.

  ```diff lang="tsp"
  -@service({title: "My service"})
  +@service(#{title: "My service"})
  ```
- [#6416](https://github.com/microsoft/typespec/pull/6416) Adding new keywords for future use:
  - `statemachine`
  - `macro`
  - `package`
  - `metadata`
  - `env`
  - `arg`
  - `declare`
  - `array`
  - `struct`
  - `record`
  - `module`
  - `mod`
  - `pub`
  - `sub`
  - `typeref`
  - `trait`
  - `this`
  - `self`
  - `super`
  - `keyof`
  - `with`
  - `implements`
  - `impl`
  - `satisfies`
  - `flag`
  - `auto`
  - `partial`
  - `private`
  - `public`
  - `protected`
  - `internal`
  - `sealed`
  - `local`
  - `async`
- [#6258](https://github.com/microsoft/typespec/pull/6258) Removed deprecated legacy visibility APIs and converted all warnings for using string-based visibility modifiers to errors.

The removed APIs include:

- `getVisibility`: use `getVisibilityForClass` instead.
- `getParameterVisibility`: use `getParameterVisibilityFilter` instead.
- `getReturnTypeVisibility`: use `getReturnTypeVisibilityFilter` instead.

Furthermore, the legacy signature of `isVisible` that accepts an array of strings has been removed. Please use the new signature that accepts `EnumMember` instead.

The changed decorators include:

- `@visibility`
- `@parameterVisibility`
- `@returnTypeVisibility`
- `@withVisibility`
- `@withDefaultKeyVisibility`

The `TypeSpec.DefaultKeyVisibility` template also no longer accepts a string as a visibility modifier argument.

Attempting to pass a string to any of the above decorators or templates will now result in a type-checking error. Please use the `Lifecycle` visibility modifiers instead.

If you develop a third-party library and you use any custom visibility modifiers, you will need to instead define a visibility class enum. See: [Visibility | TypeSpec](https://typespec.io/docs/language-basics/visibility/).

**Migration steps**:

String-based visibilities can be replaced as follows:

- `"create"`, `"read"`, `"update"`, `"delete"`, and `"query"` can be replaced with `Lifecycle.Create`, `Lifecycle.Read`, `Lifecycle.Update`, `Lifecycle.Delete`, and `Lifecycle.Query` respectively.
- `@visibility("none")` can be replaced with `@invisible(Lifecycle)`.

For example:

```tsp
@visibility("create", "read")
example: string;
```

can be replaced with:

```tsp
@visibility(Lifecycle.Create, Lifecycle.Read)
example: string;
```

```tsp
@visibility("none")
example: string;
```

can be replaced with:

```tsp
@invisible(Lifecycle)
example: string;
```

Additionally, `@parameterVisibility` with no arguments has been made an error. Previously, some specifications used it to disable effective PATCH optionality, but that behavior was an unintended side effect. For example:

```tsp
@parameterVisibility
@patch
op example(@bodyRoot resource: Resource): Resource;
```

If you wish to disable effective PATCH optionality in `@typespec/http`, preventing it from treating all properties of the request body as effectively optional, you can now do so explicitly:

```tsp
@patch(#{ implicitOptionality: false })
op example(@bodyRoot resource: Resource): Resource;
```

### Deprecations

- [#6310](https://github.com/microsoft/typespec/pull/6310) Deprecate `@typespec/compiler/emitter-framework` export in favor of a new package `@typespec/asset-emitter`
  ```diff lang=json title=package.json
  "dependencies": {
  +   "@typespec/asset-emitter": "0.67.0"
  }
  ```
  
  ```diff lang=ts
  -import { TypeEmitter, ... } from "@typespec/compiler/emitter-framework";
  +import { TypeEmitter, ... } from "@typespec/asset-emitter";
  ```
- [#6306](https://github.com/microsoft/typespec/pull/6306) Remove the use of deprecated getDiscriminatedUnion

### Features

- [#6178](https://github.com/microsoft/typespec/pull/6178) Introducing the JS Http Client emitter
- [#6411](https://github.com/microsoft/typespec/pull/6411) Introduce a new `dryRun` compiler option(`--dry-run` in the cli) that emitters can opt-in to support by setting `capabilities.dryRun` in their `$lib`.
- [#6411](https://github.com/microsoft/typespec/pull/6411) Update `noEmit` compiler option (`--no-emit` cli flag) to prevent emitter to run. A new `dryRun` option has been added to achieve a safer similar result where emitters run but do not write output.
- [#6220](https://github.com/microsoft/typespec/pull/6220) `tsp install` now downloads and uses the configured package manager in `devEngines.packageManager` or `packageManager` field of `package.json`
- [#6357](https://github.com/microsoft/typespec/pull/6357) Add support for `@mediaTypeHint` to apply a hint for default Media/MIME type (Content-Type in HTTP) to a TypeSpec type.

### Bump dependencies

- [#6266](https://github.com/microsoft/typespec/pull/6266) Update dependencies

### Bug Fixes

- [#6335](https://github.com/microsoft/typespec/pull/6335) Improvements to the CLI output
- [#6315](https://github.com/microsoft/typespec/pull/6315) Fix auto complete cannot replace $ prefix
- [#6309](https://github.com/microsoft/typespec/pull/6309) Fixed an issue where the `--emit-files` flag on emitters with nested folders was not generating the correct paths to the files.
- [#6292](https://github.com/microsoft/typespec/pull/6292) Fix `tsp init` not respecting default selected emitters


## 0.66.0

### Deprecations

- [#6059](https://github.com/microsoft/typespec/pull/6059) Deprecate use of `@discriminator` on union. Migrate to `@discriminated`

```diff lang="tsp"
-@discriminator("type")
+@discriminated(#{envelope: "none", discriminatorPropertyName: "type"})
union Pet;
```
- [#6088](https://github.com/microsoft/typespec/pull/6088) Deprecate use of string-based visibility modifiers using warnings.

String-based visibilities can be replaced as follows:

- `"create"`, `"read"`, `"update"`, `"delete"`, and `"query"` can be replaced with `Lifecycle.Create`, `Lifecycle.Read`, `Lifecycle.Update`, `Lifecycle.Delete`, and `Lifecycle.Query` respectively.
- `@visibility("none")` can be replaced with `@invisible(Lifecycle)`.

For example:

```tsp
@visibility("create", "read")
example: string;
```

can be replaced with:

```tsp
@visibility(Lifecycle.Create, Lifecycle.Read)
example: string;
```

```tsp
@visibility("none")
example: string;
```

can be replaced with:

```tsp
@invisible(Lifecycle)
example: string;
```

Additionally, `@parameterVisibility` with no arguments is deprecated.

```tsp
@parameterVisibility
@patch
op example(@bodyRoot resource: Resource): Resource;
```

The effect of `@parameterVisibility` is to disable effective PATCH optionality. If you wish
to disable effective PATCH optionality in `@typespec/http`, preventing it from treating all
properties of the request body as effectively optional, you can now do so explicitly:

```tsp
@patch(#{ implicitOptionality: false })
op example(@bodyRoot resource: Resource): Resource;
```

- [#6108](https://github.com/microsoft/typespec/pull/6108) Migrate `@service` decorator options to take in a value

```diff lang="tsp"
-@service({title: "My service"})
+@service(#{title: "My service"})
```
- [#6047](https://github.com/microsoft/typespec/pull/6047) `--version` shows if tsp is running from the standalone version
- [#5453](https://github.com/microsoft/typespec/pull/5453) Report unused `using` in language server
- [#6164](https://github.com/microsoft/typespec/pull/6164) Renamed package `@typespec/http-server-javascript` to `@typespec/http-server-js`.

### Features

- [#5483](https://github.com/microsoft/typespec/pull/5483) Add autocomplete of model properties for union type
- [#5458](https://github.com/microsoft/typespec/pull/5458) Add codefix for for various triple quoted string syntax issues
- [#6082](https://github.com/microsoft/typespec/pull/6082) Introduced `list-files` flag to log all emitted files.
- [#6082](https://github.com/microsoft/typespec/pull/6082) Added a progress indicator to show the current stage of tsp compilation process.
- [#6059](https://github.com/microsoft/typespec/pull/6059) Add new `@discriminated` decorator to represent discriminated union with implicit envelopes
- [#5494](https://github.com/microsoft/typespec/pull/5494) Report unused template parameters in language server
- [#6045](https://github.com/microsoft/typespec/pull/6045) Redesign and simplification of `tsp init`
- [#5996](https://github.com/microsoft/typespec/pull/5996) Add Typekits to support EFV2
- [#5986](https://github.com/microsoft/typespec/pull/5986) Tsp init template with both config and emitters merge in tspconfig.yaml

### Bug Fixes

- [#4926](https://github.com/microsoft/typespec/pull/4926) Augmenting an expression will now report an error instead of silently failing to apply.
- [#5937](https://github.com/microsoft/typespec/pull/5937) Fix: StringTemplate type not supported in typespecValueToJson
- [#6204](https://github.com/microsoft/typespec/pull/6204) Fix `@example` reporting assignability error when using mix metadata(http) models
- [#6125](https://github.com/microsoft/typespec/pull/6125) Fix tmlanguage syntax highlighting when using decorator before escaped identifier
- [#6192](https://github.com/microsoft/typespec/pull/6192) Fix `tsp info` crash
- [#6203](https://github.com/microsoft/typespec/pull/6203) Fix mutator not mutating sourceModel(s)


## 0.65.3

### Bug Fixes

- [#6041](https://github.com/microsoft/typespec/pull/6041) Fix validation issue in `@opExample` when using versioning/mutators


## 0.65.2

### Bug Fixes

- [#6003](https://github.com/microsoft/typespec/pull/6003) Fix regression where enum values would report not being assignable to their enum when using versioning


## 0.65.1

### Bug Fixes

- [#5975](https://github.com/microsoft/typespec/pull/5975) Downgrade arborist dependency which added node20+ requirement


## 0.65.0

### Bug Fixes

- [#5940](https://github.com/microsoft/typespec/pull/5940) Fix: Infinite loop in language server due to not caching indeterminate entities in templates
- [#5186](https://github.com/microsoft/typespec/pull/5186) Fix issue that extra " will be added when auto completing emitter options inside ""
- [#5833](https://github.com/microsoft/typespec/pull/5833) Fix tracing in `SourceLoader`

### Bump dependencies

- [#5690](https://github.com/microsoft/typespec/pull/5690) Upgrade dependencies

### Features

- [#5572](https://github.com/microsoft/typespec/pull/5572) Add support for [ESM subpath imports](https://nodejs.org/api/packages.html#subpath-imports)
- [#5790](https://github.com/microsoft/typespec/pull/5790) Add option for semantic walker to visit model derived types
- [#5340](https://github.com/microsoft/typespec/pull/5340) Add Experimental Typekit helpers for `@typespec/http`
- [#5716](https://github.com/microsoft/typespec/pull/5716) Updated Rest init template to include additional emitters(client, server) and a basic sample.
- [#5186](https://github.com/microsoft/typespec/pull/5186) Support the auto completion for extends, imports, rule, rule sets and variables in tspconfig.yaml
- [#5186](https://github.com/microsoft/typespec/pull/5186) Show required/optional information in the details of emitter's options completion item in tspconfig.yaml
- [#5342](https://github.com/microsoft/typespec/pull/5342) Convert model/tuple expression to value code fix is applied to the entire value.
- [#5699](https://github.com/microsoft/typespec/pull/5699) Promote `unsafe_useStateMap` and `unsafe_useStateSet` experimental APIs to stable version `useStateMap` and `useStateSet`. Old ones are deprecated
- [#5794](https://github.com/microsoft/typespec/pull/5794) Use local version of npm to manage dependencies when running `tsp install`
- [#5824](https://github.com/microsoft/typespec/pull/5824) `tsp init` will not automatically run `tsp install` if a `package.json` file is created.
- [#4931](https://github.com/microsoft/typespec/pull/4931) [Experimental] Update to subgraph mutator to visit all missing relations
- [#5416](https://github.com/microsoft/typespec/pull/5416) Added APIs for getting parameterVisibility and returnTypeVisibility as VisibilityFilter objects.

### Deprecations

- [#4931](https://github.com/microsoft/typespec/pull/4931) Deprecate experimental projection.


## 0.64.0

### Bug Fixes

- [#5295](https://github.com/microsoft/typespec/pull/5295) Fix incorrectly returning a positive `BigInt` for a negative `Numeric`.
- [#5353](https://github.com/microsoft/typespec/pull/5353) Meta property are auto-completed, current only supported '::type', '::parameters', '::returnType'
- [#5180](https://github.com/microsoft/typespec/pull/5180) Fixed serialization of object examples on unions
- [#5525](https://github.com/microsoft/typespec/pull/5525) Enum-driven visibility decorators and projections now interact correctly.

Projections now project EnumValue values to preserve consistency with projected Enum/EnumMember types using a best-effort
strategy.

### Features

- [#5415](https://github.com/microsoft/typespec/pull/5415) Added support for emitter selections for init template.
- [#5316](https://github.com/microsoft/typespec/pull/5316) Compiler trace will be sent to IDE as trace log through language server
- [#5594](https://github.com/microsoft/typespec/pull/5594) Support Emitters section in Init Template when creating TypeSpec project in vscode
- [#5294](https://github.com/microsoft/typespec/pull/5294) Add capacities in TypeSpec Language Server to support "Scaffolding new TypeSpec project" in IDE


## 0.63.0

### Bug Fixes

- [#5252](https://github.com/microsoft/typespec/pull/5252) Added RegEx validation for @pattern and will throw warning for invalid RegEx string

### Features

- [#4937](https://github.com/microsoft/typespec/pull/4937) Add mutateSubgraphWithNamespace as a separate API
- [#4837](https://github.com/microsoft/typespec/pull/4837) Allow trailing delimiter in array values, tuple, decorator declaration, scalar initializer, etc.
- [#5149](https://github.com/microsoft/typespec/pull/5149) Experimental: Improve Realm, Mutator, and Typekit implementations.

This change strongly binds a Realm and Typekit together, and changes mutators so that new types are cloned within the
mutator's realm. The default Typekit now creates a default typekit realm for the current program, and a Typekit can be
easily created to work in a specific Program or Realm as needed.
- [#4825](https://github.com/microsoft/typespec/pull/4825) Adds support for enum-driven visibility in the compiler core.


## 0.62.0

### Bug Fixes

- [#4745](https://github.com/microsoft/typespec/pull/4745) Improve diagnostic when JS files fail to load due to a JS error

### Bump dependencies

- [#4679](https://github.com/microsoft/typespec/pull/4679) Upgrade dependencies - October 2024

### Features

- [#4807](https://github.com/microsoft/typespec/pull/4807) CLI logs diagnostic source path relative to the CWD.
- [#4871](https://github.com/microsoft/typespec/pull/4871) [experimental] Mutators: Allow mutating namespaces
- [#4470](https://github.com/microsoft/typespec/pull/4470) Add support for paginated operations
- [#4849](https://github.com/microsoft/typespec/pull/4849) Overall of the symbol resolution. TypeSpec is able to resolve anything that can be statically linked. Augment decorators in turn are able to target any statically linkable types.
- [#4806](https://github.com/microsoft/typespec/pull/4806) Diagnostics emitted in template instance include instantiation trace.
- [#4790](https://github.com/microsoft/typespec/pull/4790) Support completion for tspconfig.yaml file in vscode


## 0.61.2

### Bug Fixes

- [#4704](https://github.com/microsoft/typespec/pull/4704) Fix order of resolution from node_modules and parent package


## 0.61.1

### Bug Fixes

- [#4697](https://github.com/microsoft/typespec/pull/4697) Fix module resolution when resolving self from within another package


## 0.61.0

### Bug Fixes

- [#4626](https://github.com/microsoft/typespec/pull/4626) [API] Add missing exit callback
- [#4513](https://github.com/microsoft/typespec/pull/4513) Fixes issue with the semantic walker where `exitTuple` was not being emitted.
- [#4462](https://github.com/microsoft/typespec/pull/4462) Fix examples with enums inside of unions
- [#4574](https://github.com/microsoft/typespec/pull/4574) Fix: Passing `const` of model type to `@example`
- [#4551](https://github.com/microsoft/typespec/pull/4551) Json serialization of example respect `@encodedName`
- [#4514](https://github.com/microsoft/typespec/pull/4514) Fix issue with decimal numeric and leading `0.0` with multiple digit
- [#4445](https://github.com/microsoft/typespec/pull/4445) [API] model `sourceModels` property are now projected correctly
- [#4467](https://github.com/microsoft/typespec/pull/4467) Changing tspconfig.yaml won't take effect in LSP server because of the cache
- [#4563](https://github.com/microsoft/typespec/pull/4563) `tsp compile --watch` reread from `tspconfig.yaml` file

### Bump dependencies

- [#4424](https://github.com/microsoft/typespec/pull/4424) Bump dependencies

### Features

- [#4442](https://github.com/microsoft/typespec/pull/4442) Library diagnostic can now define a `description` and `url` that links to a more detailed doc for this diagnostic
- [#4290](https://github.com/microsoft/typespec/pull/4290) Adding experimental (unstable) API fro Type Mutators
- [#4595](https://github.com/microsoft/typespec/pull/4595) Expose more accurate `PackageJson` type and deprecate `NodePackage`
- [#4606](https://github.com/microsoft/typespec/pull/4606) Add support for node `exports` field. Specific typespec exports can be provided with the `typespec` field

```json
"exports": {
  ".": {
    "typespec": "./lib/main.tsp",
  },
  "./named": {
    "typespec": "./lib/named.tsp",
  }
}
```
- [#4539](https://github.com/microsoft/typespec/pull/4539) Support nested emitter options

### Breaking Changes

- [#4539](https://github.com/microsoft/typespec/pull/4539) Config parameters and emitters options cannot contains `.`. This conflict with newly added support for nested options.
- [#4500](https://github.com/microsoft/typespec/pull/4500) API: Update default of `decoratorArgMarshalling` from `legacy` to `new`

To revert to the old behavior export the following. **Highly discouraged, this will be removed in a few versions.**

```ts
export const $flags = definePackageFlags({
  decoratorArgMarshalling: "legacy",
});
```


## 0.60.1

### Bug Fixes

- [#4420](https://github.com/microsoft/typespec/pull/4420) Fix: Numeric values defined with e-notation incorrectly resolved


## 0.60.0

### Bug Fixes

- [#4381](https://github.com/microsoft/typespec/pull/4381) Fix Semantic walker doesn't fire exitOperation or exitModelProperty
- [#4146](https://github.com/microsoft/typespec/pull/4146) Fix model expression defined in alias will resolve its namespace from the namespace where the alias was declared
- [#4147](https://github.com/microsoft/typespec/pull/4147) Fix examples with models using `extends`
- [#4144](https://github.com/microsoft/typespec/pull/4144) Fix: Model and union expression in template were not considered as template instances
- [#4135](https://github.com/microsoft/typespec/pull/4135) Fix numeric 0 stringify producing 0.0
- [#4064](https://github.com/microsoft/typespec/pull/4064) IDE: Formatting command will use prettier config if provided over the editor's configuration.
- [#4089](https://github.com/microsoft/typespec/pull/4089) Fix tmlanguage for named type argument in type reference.
- [#4324](https://github.com/microsoft/typespec/pull/4324) API: Extract source resolution logic into its own source loader

### Features

- [#4139](https://github.com/microsoft/typespec/pull/4139) Add new way to define decorator implementation with `$decorators` export.
```ts
export const $decorators = {
  "TypeSpec.OpenAPI": {
    useRef: $useRef,
    oneOf: $oneOf,
  },
};
```
- [#4148](https://github.com/microsoft/typespec/pull/4148) Diagnostics logged to the terminal now have a clickable hyperlink to the diagnostic documentation url if applicable.
- [#4141](https://github.com/microsoft/typespec/pull/4141) Diagnostic code in IDE now link to the linter rule documentation url if applicable
- [#4357](https://github.com/microsoft/typespec/pull/4357) Improvements to type relation errors: Show stack when it happens in a nested property otherwise show up in the correct location.


## 0.59.1

### Bug Fixes

- [#4173](https://github.com/microsoft/typespec/pull/4173) Fix: Revert `unix-style` warning that was preventing windows path via the CLI as well


## 0.59.0

### Bug Fixes

- [#3881](https://github.com/microsoft/typespec/pull/3881) Fixes a bug where ending a non-terminal line in a multi-line comment with a backslash caused the next star to show up in the parsed doc string.
- [#4050](https://github.com/microsoft/typespec/pull/4050) Allow using compact namespace form `Foo.Bar` when inside another namespace
  ```tsp
  namespace MyOrg.MyProject {
    namespace MyModule.MySubmodule { // <-- this used to emit an error
      // ...
    }
  }
  ```
- [#3898](https://github.com/microsoft/typespec/pull/3898) Fix decimal numeric with leading zeros
- [#4046](https://github.com/microsoft/typespec/pull/4046) Fix type comparison of literal and scalar when in projection context
- [#4022](https://github.com/microsoft/typespec/pull/4022) `tsp compile --watch` will not stop when a crash happens during compilation
- [#3933](https://github.com/microsoft/typespec/pull/3933) Add `const` template parameter to get the precise lib type

### Bump dependencies

- [#3948](https://github.com/microsoft/typespec/pull/3948) Update dependencies

### Features

- [#3906](https://github.com/microsoft/typespec/pull/3906) Support completion for template parameter extending model or object value

  Example
  ```tsp
  model User<T extends {name: string, age: int16}> {
  }
  alias user = User< {┆
                      | [age]
                      | [name]
  ```
- [#4020](https://github.com/microsoft/typespec/pull/4020) Add support for encoding numeric types as string
- [#4023](https://github.com/microsoft/typespec/pull/4023) Warn when using `\` in config file field that expect a path.
- [#3932](https://github.com/microsoft/typespec/pull/3932) Add `ArrayEncoding` enum to define simple serialization of arrays

### Breaking Changes

- [#4050](https://github.com/microsoft/typespec/pull/4050) Fix issue where naming a namespace with the same name as the blockless namespace would merge with it instead of creating a subnamespace like any other name would.

  ```tsp
  namespace MyOrg.MyProject;

  namespace MyOrg.MyProject.MyArea {
    model A {}
  }

  namespace MyArea2 {
    model B {}
  }
  ```

  Previously model `A` would end-up in namespace `MyOrg.MyProject.MyArea` and model `B` in `MyOrg.MyProject.MyArea2`. With this change model `A` will now be in `MyOrg.MyProject.MyOrg.MyProject.MyArea`. To achieve the previous behavior the above code should be written as:

  ```tsp
  namespace MyOrg.MyProject;

  namespace MyArea {
    model A {}
  }

  namespace MyArea2 {
    model B {}
  }
  ```


## 0.58.1

### Bug Fixes

- [#3875](https://github.com/microsoft/typespec/pull/3875) Fix issues with examples not working with `Array`, `Record`, `Union` and `unknown` types


## 0.58.0

### Bug Fixes

- [#3623](https://github.com/microsoft/typespec/pull/3623) Fix crash of language server on firefox
- [#3516](https://github.com/microsoft/typespec/pull/3516) Deprecate getAssetEmitter and recommend calling `createAssetEmitter` directly
- [#3767](https://github.com/microsoft/typespec/pull/3767) Fix semantic highlighting of using of single namespace
- [#3824](https://github.com/microsoft/typespec/pull/3824) Do not cast model expression to object value if the constraint is allowing the type
- [#3577](https://github.com/microsoft/typespec/pull/3577) Fix formatting of object and array literal in decorator to hug parenthesis
- [#3823](https://github.com/microsoft/typespec/pull/3823) Fix formatting of scalar constructor called with no args
- [#3743](https://github.com/microsoft/typespec/pull/3743) Fix 'typespec vs install' command on windows
- [#3605](https://github.com/microsoft/typespec/pull/3605) Fix templates initialized on node 22

### Bump dependencies

- [#3718](https://github.com/microsoft/typespec/pull/3718) Dependency updates July 2024

### Features

- [#3699](https://github.com/microsoft/typespec/pull/3699) Moved compiler dependencies to peer and dev for scaffolded projects.
- [#3572](https://github.com/microsoft/typespec/pull/3572) Add new `@example` and `@opExample` decorator to provide examples on types and operations.

  ```tsp
  @example(#{
    id: "some",
    date: utcDateTime.fromISO("2020-01-01T00:00:00Z"),
    timeout: duration.fromISO("PT1M"),
  })
  model Foo {
    id: string;
    date: utcDateTime;
  
    @encode("seconds", int32) timeout: duration;
  }
  ```
  
  ```tsp
  @opExample(
    #{
      parameters: #{
        pet: #{
          id: "some",
          name: "Fluffy",
          dob: plainDate.fromISO("2020-01-01"),
        },
      },
      returnType: #{
        id: "some",
        name: "Fluffy",
        dob: plainDate.fromISO("2020-01-01"),
      },
    },
    #{ title: "First", description: "Show creating a pet" }
  )
  op createPet(pet: Pet): Pet;
  ```
- [#3751](https://github.com/microsoft/typespec/pull/3751) Adds option to `tsp init` to generate .gitignore file

### Breaking Changes

- [#3793](https://github.com/microsoft/typespec/pull/3793) Do not carry over `@friendlyName` with `model is` or `op is`

  ```tsp
  @friendlyName("Abc{T}", T)
  model Foo<T> {}
  
  model Bar is Foo<string>;
  
  // This can be changed to
  model Abcstring is Foo<string>;
  ```
- [#3659](https://github.com/microsoft/typespec/pull/3659) Disallows overriding a required inherited property with an optional property.

In previous versions of TypeSpec, it was possible to override a required property with an optional property. This is no longer allowed. This change may result in errors in your code if you were relying on this bug, but specifications that used this behavior are likely to have been exposed to errors resulting from incoherent type checking behavior.

The following example demonstrates the behavior that is no longer allowed:

```tsp
model Base {
  example: string;
}

model Child extends Base {
  example?: string;
}
```

In this example, the `Child` model overrides the `example` property from the `Base` model with an optional property. This is no longer allowed.


## 0.57.0


### Breaking changes

- [#3022](https://github.com/microsoft/typespec/pull/3022) Addition of new `const` keyword means using `const` as a property name or decorator name will result in an error. This can be fixed by wrapping the property in backtick.

```tsp
model Test {
  // error
  const: string;

  // correct
  `const`: string;

}
```

### Bug Fixes

- [#3399](https://github.com/microsoft/typespec/pull/3399) Preserve leading whitespace in fenced blocks in doc comments
- [#3566](https://github.com/microsoft/typespec/pull/3566) [API] Do not run decorators on cloned type if the original type wasn't finished
- [#3522](https://github.com/microsoft/typespec/pull/3522) Fix EINVAL error when running `tsp code install`
- [#3371](https://github.com/microsoft/typespec/pull/3371) Numeric not handling trailing zeros and causing freeze(e.g. `const a = 100.0`)
- [#3451](https://github.com/microsoft/typespec/pull/3451) Emitter framework: fix losing context when referencing circular types
- [#3517](https://github.com/microsoft/typespec/pull/3517) Fix application of `@param` doc tag on operation create with `op is` to override upstream doc
- [#3488](https://github.com/microsoft/typespec/pull/3488) Add `PickProperties` type to dynamically select a subset of a model

### Bump dependencies

- [#3401](https://github.com/microsoft/typespec/pull/3401) Update dependencies - May 2024

### Features

- [#3280](https://github.com/microsoft/typespec/pull/3280) Support completion for Model with extended properties

  Example
  ```tsp
  model Device {
    name: string;
    description: string;
  }

  model Phone extends Device {
    ┆
  } | [name]
    | [description]
  ```
- [#3280](https://github.com/microsoft/typespec/pull/3280) Support completion for object values and model expression properties.

  Example
  ```tsp
  model User {
    name: string;
    age: int32;
    address: string;
  }

  const user: User = #{name: "Bob", ┆}
                                    | [age]
                                    | [address]
  ```
- [#3375](https://github.com/microsoft/typespec/pull/3375) Allow `@` to be escaped in doc comment with `\`
- [#3022](https://github.com/microsoft/typespec/pull/3022) Add syntax for declaring values. [See docs](https://typespec.io/docs/language-basics/values).

Object and array values
```tsp
@dummy(#{
  name: "John",
  age: 48,
  address: #{ city: "London" }
  aliases: #["Bob", "Frank"]
})
```

Scalar constructors

```tsp
scalar utcDateTime {
  init fromISO(value: string);
}

model DateRange {
  minDate: utcDateTime = utcDateTime.fromISO("2024-02-15T18:36:03Z");
}
```
- [#3527](https://github.com/microsoft/typespec/pull/3527) Add support for `@prop` doc comment tag to describe model properties
- [#3422](https://github.com/microsoft/typespec/pull/3422) Formatter: Indent or dedent multiline strings to the current indentation
- [#3460](https://github.com/microsoft/typespec/pull/3460) Hide deprecated items from completion list
- [#3443](https://github.com/microsoft/typespec/pull/3443) Support completion for keyword 'extends' and 'is'

  Example
  ```tsp
  model Dog ┆ {}
            | [extends]
            | [is]
  
  scalar Addresss ┆ 
                  | [extends]

  op jump ┆ 
          | [is]
  
  interface ResourceA ┆ {}
                      | [extends]

  model Cat<T ┆> {}
              | [extends]
  ```
- [#3462](https://github.com/microsoft/typespec/pull/3462) Linter `all` rulesets is automatically created if not explicitly provided
- [#3533](https://github.com/microsoft/typespec/pull/3533) More logs and traces are added for diagnostic and troubleshooting in TypeSpec language server

### Deprecations

- [#3022](https://github.com/microsoft/typespec/pull/3022) Using a tuple type as a value is deprecated. Tuple types in contexts where values are expected must be updated to be array values instead. A codefix is provided to automatically convert tuple types into array values.

```tsp
model Test {
  // Deprecated
  values: string[] = ["a", "b", "c"];
  
  // Correct
  values: string[] = #["a", "b", "c"];
```
- [#3022](https://github.com/microsoft/typespec/pull/3022) Using a model type as a value is deprecated. Model types in contexts where values are expected must be updated to be object values instead. A codefix is provided to automatically convert model types into object values.

```tsp
model Test {
  // Deprecated
  user: {name: string} = {name: "System"};
  
  // Correct
  user: {name: string} = #{name: "System"};
```
- [#3022](https://github.com/microsoft/typespec/pull/3022) Decorator API: Legacy marshalling logic

With the introduction of values, the decorator marshalling behavior has changed in some cases. This behavior is opt-in by setting the `valueMarshalling` package flag to `"new"`, but will be the default behavior in future versions. It is strongly recommended to adopt this new behavior as soon as possible.


  Example: 
  ```tsp
  extern dec multipleOf(target: numeric | Reflection.ModelProperty, value: valueof numeric);
  ```
  Will now emit a deprecated warning because `value` is of type `valueof string` which would marshall to `Numeric` under the new logic but as `number` previously.

  To opt-in you can add the following to your library js/ts files.
  ```ts
  export const $flags = definePackageFlags({
    decoratorArgMarshalling: "new",
  });
  ```


## 0.56.0

### Bug Fixes

- [#3170](https://github.com/microsoft/typespec/pull/3170) `--nostdlib` flag will now work by only applying to optional standard library types
- [#3212](https://github.com/microsoft/typespec/pull/3212) Fix: augmenting template model property could result in sending invalid argument to decorator
- [#3188](https://github.com/microsoft/typespec/pull/3188) Fix: Do not crash when trying to access member of aliased expressions
- [#3185](https://github.com/microsoft/typespec/pull/3185) Fix tsp init hanging when done due to unclosed connection
- [#3151](https://github.com/microsoft/typespec/pull/3151) IDE: Fix completion of statement keywords
- [#3287](https://github.com/microsoft/typespec/pull/3287) Templated interface extending another templated interface shouldn't run decorator on their operations
- [#3290](https://github.com/microsoft/typespec/pull/3290) Model with an optional property should not satisfy a constraint with that property required. (`{foo?: string}` cannot be assigned to a constraint of `{foo: string}`)
- [#3163](https://github.com/microsoft/typespec/pull/3163) Fix: Model with spread indexer shouldn't validate explicit properties
- [#3227](https://github.com/microsoft/typespec/pull/3227) Stop running decorators on partially instantiated operations(When interface is instantiated but not the operation)
- [#3180](https://github.com/microsoft/typespec/pull/3180) Fix issue where directives were not parsed to the leaf node in multi-segment Namespace segments.
- [#3243](https://github.com/microsoft/typespec/pull/3243) Fix calling `tsp install` on windows due to recent NodeJS breaking change to fix vulnerability.
- [#3216](https://github.com/microsoft/typespec/pull/3216) Fix compiler crash when using an invalid `is` target in an interface operation template
- [#3246](https://github.com/microsoft/typespec/pull/3246) Internals: Use node built-in `fetch` API that is now stable since node `18.13.0`

### Bump dependencies

- [#3169](https://github.com/microsoft/typespec/pull/3169) Update dependencies

### Features

- [#3035](https://github.com/microsoft/typespec/pull/3035) `getEncode` returns the fully qualified enum member name if using a custom enum.
- [#3183](https://github.com/microsoft/typespec/pull/3183) Show template parameters when hovering on an operation template
- [#3191](https://github.com/microsoft/typespec/pull/3191) [API] Add new `sourceModels` property to model


## 0.55.0

### Bug Fixes

- [#3018](https://github.com/microsoft/typespec/pull/3018) Grammar: Fix comments in template params not tokenized
- [#3052](https://github.com/microsoft/typespec/pull/3052) Fix: Union template declaration were incorrectly being finished in projection
- [#2983](https://github.com/microsoft/typespec/pull/2983) Warnings converted to error with `warn-as-error` do not prevent compilation from moving to the next stage like regular warnings
- [#3041](https://github.com/microsoft/typespec/pull/3041) Improve relability of application of codefixes in IDE, often it would not do anything
- [#3069](https://github.com/microsoft/typespec/pull/3069) TmLanguage: Fix tokenization of escaped identifiers, enums and unions

### Bump dependencies

- [#3027](https://github.com/microsoft/typespec/pull/3027) Update dependencies

### Features

- [#2992](https://github.com/microsoft/typespec/pull/2992) Enable the use of `@encode` for model properties that have a union type. This supports cases like `@encode("rfc3339") prop: utcDateTime | null`
- [#3053](https://github.com/microsoft/typespec/pull/3053) Experimental projection: Add support for scalars

### Deprecations

- [#3094](https://github.com/microsoft/typespec/pull/3094) Deprecate `@knownValues` decorator. Use a named union of string literal with a string variant to achieve the same result without a decorator

Example:
```diff
-enum FooKV { a, b, c}
-@knownValues(FooKV)
-scalar foo extends string;
+union Foo { "a", "b", "c", string }
```
- [#2910](https://github.com/microsoft/typespec/pull/2910) Deprecate `@projectedName` decorator. `@encodedName` should be used instead.

Example:
```diff
-@projectedName("json", "exp")
+@encodedName("application/json", "exp")
```


## 0.54.0

### Bug Fixes

- [#2932](https://github.com/microsoft/typespec/pull/2932) Report error when having a circular template constraint e.g. `model Example<T extends T>`
- [#2955](https://github.com/microsoft/typespec/pull/2955) [Formatter] Formatting file with only comments would reorder the first line.
- [#2934](https://github.com/microsoft/typespec/pull/2934) [IDE] Fix issue when deleting an open file outside the IDE that would crash the language server
- [#2959](https://github.com/microsoft/typespec/pull/2959) Decorators that have missing arguments will not run. This is inline with passing invalid argument to a decorator that would prevent it from running.
- [#2976](https://github.com/microsoft/typespec/pull/2976) [IDE] Fix type documentation shown twice when hovering symbols or in completion details.
- [#2929](https://github.com/microsoft/typespec/pull/2929) [API] Add `Scalar` to TS `TemplatedType` type
- [#2978](https://github.com/microsoft/typespec/pull/2978) [IDE] Go to imports
- [#2936](https://github.com/microsoft/typespec/pull/2936) [IDE] Autocompleting file or folder with non alpha numeric charachter completes correctly
- [#2936](https://github.com/microsoft/typespec/pull/2936) [IDE] Fix crashing when trying to autocomplete an invalid folder
- [#2951](https://github.com/microsoft/typespec/pull/2951) Wrap string in quotes in errors
- [#2886](https://github.com/microsoft/typespec/pull/2886) Fix: `tsp compile --watch` was missing coloring and error previews

### Bump dependencies

- [#2900](https://github.com/microsoft/typespec/pull/2900) Update dependencies

### Features

- [#2888](https://github.com/microsoft/typespec/pull/2888) Add support for codefixes
- [#2920](https://github.com/microsoft/typespec/pull/2920) Add support for `...Record<T>` to define the type of remaining properties
- [#2968](https://github.com/microsoft/typespec/pull/2968) Any subtype of an error(marked with `@error`) is now an error.

### Deprecations

- [#2919](https://github.com/microsoft/typespec/pull/2919) [API] Create a new export `@typespec/compiler/utils` exports. Deprecate export from `@typespec/compiler` of utils like `DuplicateTracker`, `Queue`, `createTwoKeyMap`, etc.
- [#2902](https://github.com/microsoft/typespec/pull/2902) Deprecate `@service` version property. If wanting to describe a service versioning you can use the `@typespec/versioning` library. If wanting to describe the project version you can use the package.json version. For OpenAPI generation. the `@OpenAPI.info` nows decorator allows providing the document version.

### Breaking Changes

- [#2920](https://github.com/microsoft/typespec/pull/2920) Intersecting Record<T> with incompatible properties will now emit an error


## 0.53.1

### Patch Changes

- e6a045b: Allow using default values for union property types

## 0.53.0

### Minor Changes

- 15f6dbe: Added an optional validation message to the @pattern decorator.
- 9726b3d: Emitter framework: `ObjectBuilder` will keep track when built using a `Placeholder` allowing data to be carried over when chaining `ObjectBuilder`

### Patch Changes

- cc2723a: Template instantiated with ErrorType will get the arg changed to unknown
- fd4fdfb: Fix: Error out when using properties in array model


## 0.52.0

Wed, 24 Jan 2024 05:46:53 GMT

### Updates

- add bytes encode to the general encode type
- Added support for named template arguments (#2340)
- Feature: Added encoded name decorator
- Add a new init template for creating a new emitter
- Added new `--template` option to `tsp init` command line action which lets user specify which template to choose from in the template list.
- IDE: Performance improvements to the language server.
- Fix: Compiler couldn't resolve files at a long path(256+) on windows
- Stop warning user when `tsp init` a template without `compilerVersion` specified
- Library declaration: Deprecated linter property on `$lib` in favor of a new `$linter` variable that can be exported. This was done to prevent circular reference caused by referencing linter rules in $lib.
- Library declaration: State symbols can now be declared in the library declaration(Prefereably internal declaration added above) to have a central place to define state symbols used in your libraries.
- Add a new `tsp init` template for setting up a library
- Rename template parameters in preparation for named template argument instantiation.
- Add ability to use another template parameter as a constraint. e.g. `model Foo<A, B extends A>`
- Add new helper function to change casing to the init templates
- Update dependencies

## 0.51.0

Wed, 06 Dec 2023 19:40:58 GMT

### Updates

- [API] Emitter framework: `emitTypeReference` function takes an optional reference context that can be used to patch the context for the target.
- Emitter API: Added `absolute-path` as a known format for emitter options which will validate the value passed by the user resolve to an absolute path.
- Linter rules can provide a url to the full documentation
- **New language feature** **BREAKING** Added string template literal in typespec. Single and multi-line strings can be interpolated with `${` and `}`. Example `\`Doc for url ${url} is here: ${location}\``
- Formatter: Fix: `valueof` expression with parentheses around will preserve them when they are meaningful(For example inside a union or array expression)
- Emitter framework: allows scalar and enum declaration to provide a reference context.
- Fix: Union variant are now assignable to the parent union
- Emitter framework: Allow passing a custom context when calling `emitType`
- Upgrade formatter to prettier 3.1

## 0.50.0

Wed, 08 Nov 2023 00:07:17 GMT

### Updates

- Add new `unixTimestamp32` scalar to standard library
- Fixing @doc and /\*\* \*/ disappears from multi-segment or nested namespaces. #2642
- Fix issue where using `@overload` could result in incorrect `unassignable` type errors.
- Add new hook for handling circular references
- Fix: Issue where referencing a template in an alias might cause augment decorators to not be applied on types referenced in the aliased type.
- [Internal] Fix: `RekeyableMap` kept track of old value if rekeying to an existing item
- Fix: Properties filtered with `@withVisibility` will have their visibility removed. This prevent visibility from being applied twice and rendering invalid models
- `TypeEmitter` now supports Tuples.
- Issue error if a model spreads itself within its declaration.
- Stop showing empty code frame when diagnostic has no location
- `TypeScript` use `types` entry under `exports` of `package.json` instead of legacy `typesVersions` to provide the definition files
- **BREAKING CHANGE** Dropped support for node 16, minimum node version is now 18

## 0.49.0

Wed, 11 Oct 2023 23:31:35 GMT

### Updates

- Handle hyphen in @param doc comment
- The `never` type is now assignable to all types
- Allow nullable types for constraint decorators(min/max value, length, etc)
- Add support for `@returns` and `@errors` doc comment tags. `@returns`(or `@returnsDoc` decorator) can be used to describe the success return types of an operation. `@errors`(or `@errorsDoc` decorator) can be used to describe the error return types of an operation.
- Fix: Colorization of line comment was bleeding over to the next line(s).
- Fix crash when using parenthesis on directives
- Fix: Assigning negative and 0 to float64
- `tsp format` now returns a non-zero exit code when it fails to format a file
- Fix: Anonymous union variants were formatted with an extra leading `:`
- Formatter: Unions and Enums members are now formatted following the same rules as model properties. An extra line will be added between members if the member is annotated with a decorator, directive or doc comment.
- Fix: Correct formatting of comments between a directive or doc and its node
- Fix: `tsp init` was not creating the `tspconfig.yaml` file for templates that specified it
- Fix: `tsp init` will create a placeholder `tspconfig.yaml` file for templates that don't specify an explicit one.
- Fix `tsp init` was ignoring the `files` specified in an init template
- Fix: Language Server wasn't loading the `tspconfig.yaml` correctly resulting in some options being dropped like the linter configuration.
- Fix: Allow `null` to be assigned as a default value
- Fix: Using `TypeSpec.Xyz` namespace shouldn't require the `TypeSpec Prefix`
- Skip emit of `deprecated` diagnostic for a type reference that is used in a deprecated declaration statement
- Update dependencies
- Remove `decorators` export, import decorators individually

## 0.48.1

Tue, 19 Sep 2023 19:28:32 GMT

### Patches

- Fix emitter framework issue causing reference context to be lost in certain cases.

### Updates

- Add typesVersions metadata for the emitter framework to package.json

## 0.48.0

Tue, 12 Sep 2023 21:47:11 GMT

### Updates

- **Breaking Change** A semicolon is now required after augment decorator statements.
- Added decorators `@parameterVisibility` and `@returnTypeVisibility`. Added methods `getParameterVisibility` and `getReturnTypeVisibility`.
- Fix issue where --config would search the folder hierarchy looking for `tspconfig.yaml`.
- **Deprecation** `@deprecated` decorator has been marked as deprecated. Use `#deprecated` directive instead.
- **IDE** Add coloring for doc comment
- Changed yaml parser from `js-yaml` to `yaml`
- Parsing and validation of the tspconfig.yaml will not report the error location.
- **Fix** Stackoverflow when model property reference itself
- **Fix** Compiler crash when using alias of namespace that has decorators
- Fix: Compiler freeze when using invalid token between doc comment and type
- **Added** validation making sure properties of model are compatible with a base model indexer (using `extends`)
- Fix: Crash with when relating recursive types
- Fix typo in 'format' error message
- Expose `CompilerOptions` TypeScript type
- Report library information when crash happen in $onValidate
- Diagnostics reported on nodes with an `id` will see the diagnostic highlight the id instead of the whole node. For example it will show the error on the model name instead of highlighting the entire model.

## 0.47.1

Thu, 10 Aug 2023 20:18:00 GMT

### Patches

- **Fix**: `--config` flag was being ignored.

## 0.47.0

Tue, 08 Aug 2023 22:32:10 GMT

### Updates

- Allow omitting variant names in union declarations
- Internal: Refactoring of cli code
- Other cli commands reuse the diagnostic system to report errors
- Add `#deprecated` directive to replace `@deprecated` decorator
- Add `--ignore-deprecated` CLI argument to suppress all `deprecated` diagnostics
- **Breaking change** Emitter Framework: `sourceFile` method can return a `Promise`. This allows running async processes when generating the file content, a formatter for example. This result in a potential breaking change if calling `emitSourceFile` where you'll have to add `await` before.
- Add a new util `resolveCompilerOptions` to resolve compiler options from a given entrypoint. This will resolve the options from the tspconfig.yaml in the same way the cli would.
- Fix: Compiler version mismatch error would fire incorrectly
- Fix crash when `using` non-namespace
- Fix some issues with not reporting deprecation on template constraints
- Emit diagnostic for an unresolved metatype property reference
- **Fix** issue where using augment decorators on spread model properties, enum members or operations extended from parent interface wouldn't do anything.
- **Fix** issue where using augment decorator on operation parameters applied to source operation parameter as well.
- Fix: TypeEmitter missing interfaces methods causing crash
- **Fix** `warn-as-error` in `tspconfig.yaml` was ignored
- Improve compiler watch mode. Files loaded in previous compilation will be watched for changes.
- **Breaking change** `formatTypeSpec` is now async. Formatter was updated to use prettier 3.0.
- Allow library dependency versions to be specified in init templates using the form `{ name: "the-lib", version: "1.0.0" }`
- Update init template version compare to be greaterThanAndEqual instead of greaterThan.

## 0.46.0

Tue, 11 Jul 2023 22:06:00 GMT

### Updates

- Fix signature help after comment with no closing parenthesis or angle bracket
- Internal: Reorganize sources inside `src/` folder
- Fix: Doc comment `/** */` should override base type doc in `model is` or `op is`
- Emitter Framework: add support for emitting enum member references.
- **Feature** New built-in linter system. Typespec libraries are able to define linting rules which can be configured in `tspconfig.yaml`. See documentation for configuring a [linter](https://typespec.io/docs/handbook/configuration#linter---configuring-linters) and [writing a linter](https://typespec.io/docs/extending-typespec/linters)
- **Breaking** Minimum version of TypeScript updated to 5.0. TypeSpec is using new features available in TypeScript 5.0 which result in a definition file not parsable by older version. Note that this only affect compiling TypeScript code and is not breaking any JS or TypeSpec code. [See more information on typescript 5.0](https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/)
- Remove `mkdirp` dependencies and replace with built-in `mkdir({recursive: true})`.
- Compiler keeps track of the scope where a file is declared(User project, a library or the compiler)
- Add support for `UTF-8 with bom` for other files loaded by typespec compiler. `.tsp` files already had support, this make it more available for any library/emitter using the compiler api to load a file.
- Allow annotations(Decorators, directives and doc comments) to be specified in any order
- Fix: `entrypoints` folder wasn't included in package causing failure to resolve cli.js
- Fix: Formatter incorrectly formatting `::` to `.`
- Fix formatting issue with comment between decorator and scalar or interface
- Fix: Stack overflow crash when having circular reference with `op is` inside an interface.
- Fix IDE issue with squiggles in library code if the library had an entry point named something other than `main.tsp` and a library document was opened after another document that imported the library.
- Fix: Referencing decorator target in argument cause stack overflow for enum and union in checker and interface and operations in projection.
- **Fix** `getTypeName` include namespace prefix for unions as well
- Formatter will now format doc comment above directives and decorators. This only applies to doc comments. Regular line comments and block comments will remain where they are
- **Formatter**: Improve formatting for properties with comments and decorators. A property with a leading decorator on its own line or comment will be wrapped in blank lines.
- **Breaking change** Updating tsp init template schema for future extensibility. Older tsp version will fail validation.
- Emitter Framework: TypeEmitter can now implement `writeOutput` to customize how to write source files to disk.
- Emitter Framework: Source Files and Declarations have a new property `meta` which can store arbitrary metadata about those entities.
- Add support for new identifier characters from Unicode 15.0
- **Deprecate** `@list` decorator in favor of `@listsResource` in `@typespec/rest`
- **Deprecate** `isListOperation` function in favor of `isListOperation` in `@typespec/rest`
- **Deprecate** `getListOperationType` function
- Emitter Framework: Add new `TypeEmitter` methods for scalar instantiation.
- Emitter Framework: Fix that context was set incorrectly for some `TypeEmitter` methods, and add missing context methods for model properties, enum members, and union variants.
- Emitter Framework: Fix that some context methods were not being passed the expected parameters.
- Emitter Framework: Breaking change: Add support for templates instantiated with types without declared names. In such cases, `TypeEmitter`'s declarationName method may return `undefined`, and so the various `*Instantiation` methods might be called with an undefined name, and `AssetEmitter`'s `emitDeclarationName` method might return undefined.
- Fix: Wrong path for typescript types for main entrypoint
- Update dependencies

## 0.45.2

Thu, 15 Jun 2023 17:00:33 GMT

### Patches

- Fix: Formatter crash when using comment in empty statement, after an augment decorator or in an empty file

## 0.45.1

Wed, 14 Jun 2023 17:05:12 GMT

### Patches

- Fix: Formatter moves all comments in flattened namespace to the top

## 0.45.0

Tue, 06 Jun 2023 22:44:16 GMT

### Updates

- Fix: `tspconfig.yaml` should always get resolved relative to the entrypoint
- Add decimal and decimal128 built-in scalar types.
- **Feature** Doc comment will be applied as the doc for types unless an explicit @doc is provided.
- Added new keyword `valueof` designed to request for a value type in a decorator parameter.
- **BREAKING** Decorator API will not be marshalling values unless the parameter type is using `valueof`. `extern dec foo(target, value: string)` should be changed to `extern dec foo(target, value: valueof string)`.
- **DEPRECATION** To make transition to valueof smoother if using a template parameter inside a decorator that is now using valueof the existing parmater constraint will still be compatible but emit a warning.
- **BREAKING CHANGE** Fix: Array shouldn't be assignable to an empty model(and `object`)
- **DEPRECATION** `object` is deprecated. Alternative is to use `{}` for an empty model, `Record<unknown>` for a record with unknown property types, `unknown[]` for an array.
- Mark `Array` and `Record` doc comment as for dev only
- Fix: formatting of comment between decorator and `op` statement
- Fix: Operation can self reference or circular reference other operation via decorators
- **BREAKING CHANGE** Remove `@format("url") from url scalar`
- Fix `unixTimestamp` validation was incorrect
- **Fix** diagnostic validating type is intrinsic always showing `string` as expected
- Fix error message for @encode errors.
- Improve error handling when tsp init template is invalid or fails to download.
- Emitter framework: uppercase type argument type names when constructing a declaration name from a template instantiation.
- Add signature for missing decorators
- Remove dependency on `node-fetch`
- Remove misleading output dir from compilation success message
- Fix relative path resolution when init template is behind HTTP redirect
- Emitter option validation will only validate emitters selected with `emit`/`--emit`. Options for other emitter will be ignored. This allows defining options for an emitter that is not installed.
- Fix signature help with trailing space in unterminated arg list
- Add template argument signature help
- Show alias doc comments in IDE

## 0.44.0

Wed, 10 May 2023 21:24:00 GMT

### Patches

- Normalizing cwd before first use in getCompilerOptions()

### Updates

- Allow use of defaults on non-optional properties.
- Cleanup deprecated use
- **Added** `@encode` decorator used to specify encoding of types
- Add `projectRoot` to program
- Api: Added `sourceModel` and `sourceOperation` on `Model` and `Operation` respectively.
- Add relative file path utils, and allow emitter framework's ObjectBuilder to be initialized with a placeholder object.
- Better error recovery when error thrown from emitter is not an object
- Fix compiler mismatch error recommendation
- Fix: Interface with templated operation causing crash if defined after use
- Fix: Issue with templated operations in templated interface would get cached only by keying on the operation template args.
- Fix: `missing-index` diagnostic showing at the wrong location
- Fix `--emit` pointing to emitter js entrypoint resolve correct options
- Fix: `scalar` template parameter name conflict with each other
- Added a new `isFinished` property to types to differentiate template instance that are not finalized (Still have template arguments to be resolved)
- **Breaking** `isTemplateDeclaration` will only return true for the original declaration and not partially instantiated templates.
- **Fix** `unsupported-default` diagnostic showing at the wrong location
- Fix `url` doc to not mention "URI"
- Minor reorganization of standard library docs
- Language server: Allow main file to be outside workspace.
- Added `Model` and `Scalar` to Reflection namespace
- Fix `@format` decorator doc.
- Update dependencies

## 0.43.0

Tue, 11 Apr 2023 18:49:17 GMT

### Updates

- Bug: Emitter framework will now visit scalar declarations
- Emit diagnostic when ambiguous symbol exists between global and usings.
- Feature: Add support for referencing metatypes ModelProperty `::type` and Operation `::returnType` and `::parameters`
- Relax constraint on derived type overrides
- Fix: Alias unknown ref crash
- Fix: Empty model expression assignable to array
- Fix `tsp code uninstall` not finding extension to uninstall.
- Fix Issue where template parameter type check wouldn't work if constraint is exact same type as next validation.
- Prevent use of augment decorators on instantiated templates.
- Allow projectedNames helpers to work with previous projections
- Add helper `interpolatePath` for emitter to do additional interpolation on config properties
- Api: Update `getTypeName` to omit standard library namespace
- Allow overloads in interfaces to work under projection
- Add pre-projection support.
- Provide access to extended interfaces in type graph.
- Document member ordering and fix projection rename reordering.
- Replaced zonedDateTime with utcDateTime and offsetDateTime

## 0.42.0

Mon, 13 Mar 2023 21:30:44 GMT

### Updates

- **Breaking Change**. Removes `emitters` option in cadl-project.yaml. Use `emit` and `options` instead.
- Export formatIdentifier function from the lib
- Add `--config` option to `tsp compile`.

## 0.41.0

Fri, 03 Mar 2023 19:59:17 GMT

### Updates

- Adding back all compiler exported public artifacts contains Cadl that got renamed to TypeSpec.
- Fix ambiguous references diagnostic for decorators
- Add loading cadl-project.yaml for back compat
- Remove support for Visual Studio 2019
- Allow escaping identifiers using backticks
- Format `StringLiteral` to `Identifier` (backticked when necessary)
- Apply augmented decorator at last.
- Adding .cadl & package.json cadlMain back compat support
- Fix projection of template arguments
- Revert back changelog
- Revert PR #1634.
- Fix issue with projectedName decorator not working correctly when multiple copies of the compiler are loaded.
- Updating default output to tsp-output and package.json entrypoint to tspMain
- Rename to TypeSpec
- Fixing cli help message, package homepage link

## 0.40.0

Tue, 07 Feb 2023 21:56:17 GMT

### Updates

- Fix giving a default value to custom numeric scalar
- Feature: add an emitter framework to simplify building emitters
- Add `arrayDeclaration` and `arrayLiteral` methods to emitter framework's TypeEmitter
- Bug: properly parse logical and (`&&`) expressions in projections
- Support --option=path/to/emitter.js.option=value in cli args
- Removed all \*Type aliases (ModelType for Model, etc.). Removed `uri` scalar. Removed `Map<K, V>` model. Removed `@serviceTitle` and `@serviceVersion` decorators. Removed `getServiceNamespace`, `getServiceTitle`, `getServiceVersion`, `getServiceNamespaceString` and `setServiceNamespace` functions.

## 0.39.0

Fri, 13 Jan 2023 00:05:26 GMT

### Updates

- Api: Provide more accurate `parent` type for Nodes
- Add IDE completion and signature help for augment decorators
- Fix `(anonymous model).paramName` showing in operation signatures in IDE
- Add double quote to autoClosingPairs
- Only warn when an invalid identifier is used in a doc comment
- Add @minValueExclusive and @maxValueExclusive decorators.
- Feature: Templated operation inside of interfaces
- Feature: Add templated operation inside of interface
- Fix: Alias cause types to be resolved before some binding
- Fix `cadl format` works with windows backslash paths
- [Language Server] Fix: Completion of library imports replace import correctly"
- Fix issue with using server lib at the root of filesystem
- Fix: Projecting model property with type referencing sibling
- Fix: Issue with referencing spread members
- Internal: Update resolution of member symbols to have more ahead of time resolution
- Internal: Update TS module resolution to node16
- Type graph navigation navigate decorators
- Internal: Refactor organization of completions logic for language server
- Fix issue with referencing spread properties or enum member depending on the order of declaration
- Fix: `resolveUsages` shouldn't include base model
- Added `changeReturnType` projection method for operations.
- Improve visibility decorator documentation

## 0.38.5

Fri, 16 Dec 2022 22:02:45 GMT

### Patches

- emitter not found validation in emitter options is a warning

## 0.38.4

Thu, 15 Dec 2022 02:21:08 GMT

### Patches

- Fix: `--arg` wasn't being picked up

## 0.38.3

Fri, 09 Dec 2022 22:03:04 GMT

### Patches

- Fix: `constants` not available in `fs/promise`

## 0.38.2

Fri, 09 Dec 2022 20:43:01 GMT

### Patches

- Fix: Revert breaking change to global cli usage

## 0.38.1

Thu, 08 Dec 2022 22:04:15 GMT

### Patches

- Fix: `scalar` can be used inside of namespace block

## 0.38.0

Wed, 07 Dec 2022 17:21:52 GMT

### Minor changes

- Allow subtypes to override parent properties if the derived property type is a subtype of the parent property.
- Add opt-in support for parsing JSDoc-like developer documentation
- Show developer docs in IDE features
- Doc: Add Doc comments to built-in types and decorators
- **Deprecation** Split `emitters` in cadl-project.yaml and compiler in 2 option `emit` and `options` that makes it consistent with the CLI
- Extract `getTypeName` and `getNamespaceString` outside of the checker into standalone helper function
- Add new helper `validateDecoratorUniqueOnNode` that validate the decorator is not being used twice on the same node
- Add variable interpolation functionality in the cadl-project.yaml
- Add built-in `emitter-output-dir` options for all emitter.
- **Api Breaking change** $onEmit signature was updated to take an EmitContext object as only parameter.
- Fix typing and export format command
- **Api Breaking** Multiple `@service` per specs are now allowed.
- Add new `program.resolveTypeReference` helper to resolve a type in the cadl program using fully qualified name
- **Breaking** Add new `scalar` type and updated all intrinsic types to be a scalar type. `model MyString is string` changes to `scalar MyString extends string`
- `LanguageServer` Feature: Add signature help for decorators
- `Testing` Simplification of the testing framework
- `cadl init` Initialize the package.json with `type: module`
- **Deprecation** Renamed `url` to `uri`. Old `uri` is deprecated

### Patches

- Fix member completion on aliases
- Improve error recovery in the presence of merge conflict markers
- Fix reportDiagnostics error from emitters
- Fix: Should still instantiate template with invalid args but using constrain value
- Fix: Issue with diagnostic location when target was the operation parmeters
- Fix: miscOptions handling
- **Fix** Handle no service in services deprecated apis
- Fix: Validate `@service` decorator is targetting a namespace
- Fix: Cascading error when template is used with invalid arguments
- Update dependencies

## 0.37.0

Sat, 12 Nov 2022 00:14:04 GMT

### Minor changes

- Add `output-dir`, `trace`, `imports` option to cadl-project.yaml giving parity with cli arguments
- **Feature** Add decorator and function declaration in cadl using `extern dec` and `extern fn`.
- Fix: crash with referencing global namespace
- Added a new export to only import the module resolver
- Debugging: adding tracing information for JS decorators and function binding

### Patches

- `emitFile` now ensures that the folder exists prior to writing to the path.
- Add `isDeclaredInNamespace` utility function that checks if a definable type exists under a namespace or its children

## 0.36.1

Wed, 19 Oct 2022 19:36:13 GMT

### Patches

- **Fix** augment decorators can be applied on namespace

## 0.36.0

Wed, 12 Oct 2022 21:12:35 GMT

### Minor changes

- Remove `createProgram` and change `compile` parameter order to match old `createProgram`.
- Add new `getDiscriminatedUnion` helper to resolve the variants of a discriminated model or union
- Emitter throwing exception will emit a new `emitter-uncaught-error` diagnostic with information on how to file issue for the given emitter.
- Expose module resolver
- Add support for augment decorators.
- Language server provide document formatting using Cadl formatter
- **Deprecation** Replace `@serviceTitle` and `@serviceVersion` with a single `@service` decorator.
- `API` Replaced logger (now internal) with new tracer module. Where trace have to be explicity enabled with `--trace`.
- Add `uri` built-in type
- Allow referencing global namespace as `global` for disambiguation
- **Feature** `Api`: `resolveUsages` can now be used on a list of operation, interface or namespaces
- **Fix** `Api`: `resolveUsages` collect reference to array element type and record value correctly.
- Expose helper to walk inherited properties and some helper data structures
- Feature: `decorators` Add `@minItems` and `@maxItems` decorators
- Add `navigateNamespace` helper letting user to navigate types under a namespace.(Similar to `navigateProgram`)
- Include `@discriminator` decorator from "@cadl-lang/rest" library
- Language Server: Improvement to outline, symbols correctly structured.
- Rename `output-path` to `output-dir` and deprecate old name.
- Add additional validation for `@overload` decorator: Make sure overloads are in the same container and that return types are compatible
- Added `listOperations` helper method
- **Breaking** Model `extends` or `is` cannot reference a model expression.

### Patches

- Fix bug where cloned type members had wrong parent
- Internal: Update type of `CompilerOptions.miscOptions` to be more accurate.
- Fix: Intersection types belong to namespace they are declared in.
- Fix: namespace and non namespace types should have unique names
- Fix: Deprecated `output-path` not being respected
- Fix: Property included via `model is` were not referencing the right model parent.
- Fix: Projected types point to projected parent type for Model properties, Union variants.
- Fix: Projected model property sourceProperty point to projected property
- Minor improvemens to decorator definitions

## 0.35.0

Thu, 08 Sep 2022 01:04:53 GMT

### Minor changes

- implementation of documentHighlight
- **Breaking** Update `Enum` type members type to be a `Map<string, EnumMember>` instead of `EnumMember[]`
- Add `@projectedName` decorator and projection for projected names
- Add auto formatting support for projections
- Add syntax highlighting for projections
- **API BREAKING** Replace `enableProjections` and `disableProjections` with a new function `projectProgram` removing the state of the program around the current projection.
- Api: Add helper method to resolve model usages
- Formatter: Comments in between decorators will stay between the decorators when formatting.
- Hovering over a symbol gives the fully-qualified name and documentation
- Enable loading multiple installation of the same library as long as the versions are the same
- Internal: Remove `evalCadlScript` from `Program`
- Remove Type suffix from most Types and deprecate old names
- Perf: Reuse unchanged files and programs in language server.

### Patches

- Api: `isGlobalNamespace` takes projection into account
- Internal: Facilitate adding new tokens to scanner."
- Formatter: Cadl doesn't include blank line at the end of embedded markdown codeblock
- Fix issue with ever-increasing duplicate symbol errors in IDE
- Formatter: Directive on model property with decorators will hug decorator.
- Fix additional issues for decorators not running in projections in templated type instance
- Internal: Fix some functionally not compatible in the browser
- Fix issue where decorators would get called on uninstantiated template declarations
- Internal: Don't clear template arguments on clone
- Internal: Make scanner capable of scanning future keywords that are longer than 10 characters.

## 0.34.0

Thu, 11 Aug 2022 19:05:23 GMT

### Minor changes

- combine consecutive single line comments that are separated by whitespace
- comment folding
- implemented folding for comments
- Allow extracting value from enums
- Add helper method for emitting file in emitters
- Feature: Emitter can specify a list of required imports
- Allow `@secret` on model property
- Add type relations and include a few more built-in types `any`, `object`, `Record`. `Map` was removed
- Added support for template constraints
- Format `model Foo is Bar {}` to `model Foo is Bar;`
- Added ability for decorator validator to accept any type
- Add @overload decorator
- Add helper to check if a namespace is the global namespace
- Support spread enum
- Add editor support for document symbols.
- Improve language configuration to help with comment indentation
- Provide helper to check types are template, template declaration or template instance

### Patches

- Fix: Allow omiting optional properties
- Improve `cloneType` implementation to duplicate decorator lists correctly
- Add DefaultKeyVisibility<T, Visibility> and @withDefaultKeyVisibility to assign a default visibility value to model @key properties in specific operation signatures
- Fix: Referencing previous template parameter in template parameter default
- Fix bug in finding effective type
- Fix issue with required parentheses being dropped with union, intersection and array expressions
- Fix issue with formatting multi line tuple adding trailing comma.
- Fix parsing error locations for imports and blockless namespaces
- Fix issue with multi-file specs in VS Code on Windows where common definitions are not found.
- Fix `mix` message when trying to extend non-interface
- Fix issue with projection of nested namespace passing partial projected element to decorators
- Fix: Operation signature with circular reference causing crash and updated message+code to be relevant to operations.
- Fix: Couldn't use operation defined inside interfaces as signature.
- Fix uninitialized parent namespaces in projections
- Run projections on types returned from getEffectiveType
- Fix: Issue with Nested namespace in projection causing versioning library to fail when Service is using nested namespace
- Internal: union variant type has reference to parent union.
- Fix null reference in getTypeName API when called on anonymous models without a backing syntax node
- Emit diagnostic when an optional property is marked with @key
- Providing `cadl.cadl-server.path` option will force the specified compiler to be used
- Fix error location of duplicate property from spread

## 0.33.0

Fri, 08 Jul 2022 23:22:57 GMT

### Minor changes

- Decorator definition helper support spread args
- Add ability to provide emitter options
- Improve folding in IDE.
- Allow omitting braces from model is statements
- implementation of relativePath

### Patches

- Fix issue with compiler version mismatch in VSCode
- Fix error location for intersection with non-model
- Fix Internal Compiler Error when using invalid relative import
- Internal: Decorator definition helper works with multiple target and param types
- Improved the error message shown when an `onEmit` function is not found in the requested emitter package

## 0.32.0

Mon, 13 Jun 2022 23:42:28 GMT

### Minor changes

- Improve error message when loading library with invalid `main` file
- Added new decorator signature validation helper
- Allow empty tuples
- Add helper functions to work with diagnostics in accessor functions
- Add diagnostics target to decorator context
- Add `@deprecated` decorator and emit warning diagnostic when referencing deprecated type
- Add completion support for import of libraries
- Remove @serviceHost decorator
- Add ability to rename Models, Operations, Interface, Unions and Enums in projections.
- Add compiler API to filter model properties and get try to find equivalent named models for anonymous models
- Rename `setDecoratorNamespace` -> `setCadlNamespace`
- Add support for operation templates and operation signature reuse
- Implement references to model, enum, union, and interface members
- Add semantic colorization
- Add completion/find-all-ref/rename support to member references
- Allow `using` before blockless `namespace`

### Patches

- Fix completion between `.` and `)`
- Fix issue with compiling virtual editor files
- Allow an emitter library to have `.cadl` files
- Fix issue with resolving node position when inside string literal
- Provide full namespace name in diagnostic
- Fix issue with server not locating main.cadl in parent folder
- Improve tracking of open documents in language server
- Fix issues with referencing enum from decorator on namespace

### Updates

- Allow cadl compile . on the compiler itself
- `getTypeName` returns type name for more types
- Upgrade to TS4.7

## 0.31.0

Fri, 06 May 2022 17:19:57 GMT

### Minor changes

- Prompt on cadl vs install if multiple versions of VS are installed
- Improve module resolution logic to allow compiling a cadl library
- Add code preview and coloring for diagnostics.
- Add ability to import library or emitter defined in parent folder. Adds the ability to use the actual emitter name in a samples folder of that emitter
- Formatter has ability to ignore patterns
- Formatter: remove quotes in model properties when not needed
- Add library loading debug logging
- Include manifest with version and commit
- Rename `mixes` to `extends` for interfaces
- Include reference from parent model to all children
- Cli: Add `--no-emit` flag configuring the `noEmit` compilerOption
- Add `warn-as-error` flag to cli that will return non zero exit code when there is a warning
- Add find references and rename support to language server
- Add goto definition of namespaces, usings, and decorators to language server
- Export `isTemplate` helper method
- Add namespace to model expressions
- Make Program.checker required
- Added formatting to a few more missing syntax(`array`, `tuple`, `template parameters`)
- Add OmitProperties type and @withoutOmittedProperties decorator
- Remove node 14 support
- Log PID and timestamps in language server
- Update to Unicode 14.0 and disallow U+FFFD
- Add option to Checker.getTypeName to filter namespaces

### Patches

- Improve tests for doc decorator
- Add workaround for npx bug causing issue with backslash in cli on windows
- Do not validate default assignment when property type is an error type. Prevent additional unrelated error to the original problem with the property type.
- Fix projection bug setting the namespace of operation with the interface
- Fix logger levels
- Fix issue with using model in template default
- Give a helpful error when code is missing from path
- Don't complete decorator names in type reference position
- Preserve namespace nesting in versioning projections

### Updates

- Add `CadlLanguageConfiguration` containing the configuration used by editor (vscode, monaco)

## 0.30.0

Thu, 31 Mar 2022 17:10:49 GMT

### Minor changes

- Add new helper `cadlTypeToJson` to convert cadl type to a Json serializable type
- Add helper methods to detect `void` and `never` types
- Prevent decorators from running if arguments are errors.
- Handle unknown identifier/error types used in spread operator.
- Add parent .model to ModelTypeProperty
- Add validation that template params cannot use latter params as default

### Patches

- support format in bytes type
- Fix: stack overflow when defining template argument where default reference argument itself. `Foo<T = T>`
- Fix formatting of comment between decorator and statement
- Fix resolving location for diagnostic in js files
- Fix formatting of comment between decorator and property
- Fix using `&` with template parameters
- Support browser builds
- Fix issues with mishandled promises
- Fix cascade of error when having unexpected token in directive

## 0.29.0

Wed, 09 Mar 2022 17:42:09 GMT

### Minor changes

- Move @key decorator to core
- Replace findChildModels with mapChildModels
- **Exports** `NodeHost` for programmatic usage of Cadl
- **Added** `@knownValues` decorator providing set of known options for a string type
- Using `extends` with intrinsic types will emit diagnostic.
- Allow `op` in interfaces
- Complete using statements and qualified decorators.
- Add back `@inspectType` and `@inspectTypeName` decorators
- Redirect console.log to stderr in language server

### Patches

- Improve list parsing error recovery
- Use the proper symbol to use cadl exports in eval
- Fix issue with missing namespace name in certain cases
- Fix issue using `is` with intrinsic types.
- Fix decorator completion on namespaces
- refactor symbols and other improvements

## 0.28.0

Tue, 15 Feb 2022 22:35:02 GMT

### Minor changes

- Internals: Module resolver not dependent on `CompilerHost`
- Provide reusable decorator validation for target

### Patches

- Fix parser issue with missing error flag when using `interface extends` instead of `interface mixes`.
- Fix parser issue with incorrect `op` in various projection expressions, and wrong node type for `/` and `*`.
- Add support for separate `@summary` from `@doc`

## 0.27.0

Mon, 14 Feb 2022 03:01:07 GMT

### Minor changes

- Provide helper for library to validate parameter
- Update api for decorator taking `DecoratorContext` instead of `Program`

### Patches

- Fix bugs involving merged decorators
- Give nice error for using extends keyword in interfaces
- Implement template parameter defaults
- Bump dependency versions

## 0.26.0

Fri, 04 Feb 2022 18:00:18 GMT

### Minor changes

- Validate for `@doc` decorator argument is a string
- Add @error decorator in core
- **Added** --emit flag to configure the emitter(s) to use and separate library imports from emitters
- Add directory manipulation to CompilerHost
- Update to syntax tree to be readonly
- Formatter: Separate Enum members with decorator with new lines
- Implement projections and versioning

### Patches

- Adding @format decorator to compiler and openapi3 emitter
- Add `sourceObject` parameter to `@doc` decorator to aid in producing messages using a context object
- `@list` decorator will now ignore `TemplateParameter` objects
- Init include compiler as dependency in generated package.json
- Allow CLI array options to come before positional arguments
- **Fix** Diagnostic location for invalid use of templated models
- Fix path normalization issue that caused diagnostics from language server to be dropped.
- Fix error with file ending with mutline comment
- **Fix** issue when loading cadl using a different casing than the actual casing in a case insensitive file system
- Add @friendlyName decorator to customize model names for emitters
- Fix issue where identifiers could be confused with keywords when they had common endings.
- Renaming @format decorator to @pattern.
- Stop offering `true` and `false` completions after `.`
- Fix completion icon for symbols pulled in via using

## 0.25.0

Thu, 16 Dec 2021 08:02:20 GMT

### Minor changes

- **Update** reference resolution with `using` to fix duplicate symbols issues
- **Added** keyword autocomplete and icons
- **Added** support for union default values
- **Formatter** Add support for spread model formatting
- add mkdirp to compilerHost

### Patches

- Add findChildModels and getProperty utility functions
- **Fix** Circular reference in `is` or `extends` now emit a diagnostic instead of crashing
- **Fix** Circular reference in `alias` now emit a diagnostic instead of crashing
- **Fix** Circular reference between template model and non template model causing unresolved types issues.
- **Formatter** fix issues with empty model and interface with comments being moved outside.
- **Formatter** fix crash when having a comment in anonymous empty model.
- **Formatter** fix crash when using multi-line comment without each line starting with `*`.
- **Formatter** Tweak formatting of interface mixes that overflow.
- **Formatter** Keep single value decorator inline.
- **Formatter** Keep empty line seperation in interface similar to namespace (Only keeps 1 max between operation).
- Add support for `interface` as a `@tag` decorator target
- Reintroduce @list decorator to assist with collection operations
- Improve getTypeName support for Unions and UnionVariants

## 0.24.1

Wed, 01 Dec 2021 22:56:11 GMT

### Patches

- Fix issue where formatter would try to format a document with irrecoverable parse errors in certain cases
- **Fix** Wrong library import for the rest template
- Fix crash in language server
- Fix formatting bug with operations returning anonymous models
- Fix language server crashes in certain error cases
- Update README

## 0.24.0

Thu, 18 Nov 2021 13:58:15 GMT

### Minor changes

- **Added** `cadl install` command which shell out to `npm install`
- Remove @list decorator
- Show `@doc` info along with completions

### Patches

- **Fix** Logging of warning counts, showing error count
- Ensure interface is assigned for checked operations
- Add setDecoratorNamespace helper function

## 0.23.0

Thu, 11 Nov 2021 21:46:21 GMT

### Minor changes

- **Added** `duration` intrinsic type
- **Added** `--check` option to `cadl format` command to verify files are formatted
- **Added** log of the error and warning count at the end in case `cadl compile` failed.
- **Added** Support for models with mutual references
- Add completion ("IntelliSense") support to language server
- `cadl init` generate `package.json` with `private: true`

### Patches

- Add Prettier formatting support for interface mixes
- Add new --import CLI parameter to add a global import via the command line

## 0.22.0

Thu, 28 Oct 2021 21:17:50 GMT

### Minor changes

- **Added** logger functionality to log information
- Add `OmitDefaults` model to remove default values of a model

### Patches

- Return non-zero exit code when compilation has errors
- Diagnostics are strongly defined and all have a code
- **Fix** `using` formatting
- **Tweak** formatter model properties with decorators
- **Improve** decorator formatting

## 0.21.0

Fri, 15 Oct 2021 21:33:37 GMT

### Minor changes

- Add an API to clone a type
- Reverse decorator evaluation order
- **Added** Support for server default
- **Added** New library helper for strong diagnostics definitions
- **Added** New syntax to compiler for directive
- **Added** support for suppressing warning via #suppress directive
- Implement `interface`
- Add walker, colorization, printer for interfaces
- Surface decorator and emitter errors in IDE
- Add union declarations

### Patches

- Defensive code to prevent errors in decorators and onBuild from exiting the language server
- Fix options comment
- Update samples
- Fix binding JS file namespaces and namespace decorators referencing types in a later namespace.
- fix using a namespace merged after current namespace
- Fix namespace synthesis in certain contexts
- Make nextLink optional in pageable response
- Stop running decorators and emitters in language server again, fix language server crash.
- regenerate samples

## 0.20.0

Fri, 17 Sep 2021 00:49:37 GMT

### Minor changes

- Added `cadl init` command to scaffold new cadl project
- Added semantic walker
- Add IDE go-to definition support
- Implement cadl namespace, don't merge namespaces until checking
- Remove support for multiple inheritance
- Definition for `bytes` and new number types

### Patches

- Fix issues with specs
- Update samples
- Ensure syntax nodes report correct and consistent source positions
- Fix bug that broke analyzing untitled documents in IDE
- Fix bug preventing using latest changes to document in IDE
- Update sample generation

## 0.19.0

Sat, 21 Aug 2021 00:04:02 GMT

### Minor changes

- Introduce naming convention `$name` for JavaScript-defined Cadl functions and decorators

### Patches

- Update test output

## 0.18.0

Fri, 13 Aug 2021 19:10:21 GMT

### Minor changes

- Remove `cadl generate` command

### Patches

- Add support for discovering updatable properties using visibility
- Fix error in `cadl vs uninstall` command

## 0.17.0

Tue, 10 Aug 2021 20:23:04 GMT

### Minor changes

- Rename package to @cadl-lang/compiler

## 0.16.0

Mon, 09 Aug 2021 21:14:12 GMT

### Minor changes

- Add `compile --watch` option to watch files for changes and recompile
- Implement model is

### Patches

- **Update** to yargs 17 and update args parsing to use handlers logic to have full type safety
- Report errors for duplicate model and enum members

## 0.15.0

Mon, 02 Aug 2021 18:17:00 GMT

### Minor changes

- Rename ADL to Cadl

## 0.14.0

Wed, 28 Jul 2021 19:40:06 GMT

### Minor changes

- Decorators can be put into namespaces using a .namespace property or a namespace export

### Patches

- Add service code generator module
- Allow more non-ascii characters in identifiers and normalize identifiers
- Use newer version of autorest from `adl generate`

## 0.13.0

Fri, 09 Jul 2021 20:21:06 GMT

### Minor changes

- Add OptionalProperties<T> and withOptionalProperties decorator for creating model variations with all properties set to optional
- Add semantic analysis to language server

### Patches

- **Update** Diagnostics code to be a string
- Formatter can recover from parsing error that don't affect the validity of the tree
- Use LSP to log messages from client to server

## 0.12.0

Thu, 24 Jun 2021 03:57:43 GMT

### Minor changes

- Require main.adl or adlMain in package.json
- Add mutator library which enables the programmatic addition of model properties, operation parameters, and operation return types
- Add semantic error recovery

### Patches

- **Added** ADL Configuration file loading
- Added typechecker type navigation
- Add isStringType helper function
- Fix some edge cases in config file loading
- Add support for Visual Studio 2022

## 0.11.0

Tue, 18 May 2021 23:43:31 GMT

### Minor changes

- **Added** format command to automatically format adl files

### Patches

- **Fix** Throw diagnostic when main ADL file doesn't exists
- Fix TypeError after `adl vs` command
- **Fix** formatter handling string and number literal should keep as it is.
- **Fix** Formatter not rendering template parameters of models.
- **Fix** Don't format a file with parsing errors
- Work around npm 7+ Mac OS bug in `adl code install`
- Prefer local install of adl package when running global `adl`

## 0.10.0

Thu, 06 May 2021 14:56:02 GMT

### Minor changes

- Implement alias and enum, remove model =
- Implement basic parser error recovery
- Add API to check if a node or any descendants have parse errors

### Patches

- Small parsing speed improvement when expecting one of N tokens.
- Fix blockless namespaces not accumulating decls
- Allow leading +/- in numeric literals and require fractional digits
- Fix bugs with non-ascii identifiers
- Improve CLI experience for generate command
- Replace several internal compiler errors with diagnostics
- Do not allow multi-line non-triple-quoted string literals
- Fix parsing edge cases and optimize parsing slightly

## 0.9.0

Tue, 20 Apr 2021 15:23:29 GMT

### Minor changes

- Fix parse errors from trailing commas; implement optional prefix | and &

### Patches

- Fix issue where dynamic namespaces were not evaluated
- Virtualize writting to filesystem to enable programtic usage of adl

## 0.8.0

Tue, 06 Apr 2021 01:23:07 GMT

### Minor changes

- Implement npm libraries
- Implement library import with npm, abstract out rest, openapi, rpaas

### Patches

- Add commands to install and uninstall Visual Studio extension
- Enable security and securityDefinitions metadata to be applied to emitted OpenAPI documents; add default ARM security details
- Add api-version parameter to all ARM operations
- Add operations endpoint for ARM services
- Enable creation of $refs to ARM common model and parameter definitions
- Add common ARM parameter definitions for resource operations
- remove parenless decorators

## 0.7.0

Wed, 31 Mar 2021 22:00:43 GMT

### Minor changes

- Implement usings statements
- Implement imports
- Improved OpenAPI output for ARM services, including pluralized operation groups and operation tags

### Patches

- Add service-level metadata decorators: @serviceTitle, @serviceVersion, @produces, @consumes, and @armNamespace
- Add support for OpenAPI operation overloads using x-ms-paths

## 0.6.0

Fri, 26 Mar 2021 17:06:33 GMT

### Minor changes

- Implement namespace merging, blockless namespaces, and dotted namespaces

### Patches

- Emit `readOnly: true` for model properties marked with `@visibility("read")`
- The `visibility` decorator now accepts multiple values; the Swagger emitter will write these out as an `x-ms-mutability` field.
- Adding sample generated controller for **\_** service
- Add back post operation
- Add standard ARM operation and error model types
- Fix id lookup bug
- Initial check-in of adl spec and generated swagger for **\_**
- Update **\_** spec with user comments.
- Fixing formatting to match repo prettier config
- Add `@minValue` and `@maxValue` decorators for specifying the value range of numeric types
- Allow the use of recursive type references in model definitions
- Enable metadata and extensions to be applied to $ref'd schemas
- Add missing metadata for ARM library types

## 0.5.0

Tue, 23 Mar 2021 01:06:29 GMT

### Minor changes

- Add `time` intrinsic type
- Rename all date and time intrinsics: zonedDateTime, plainDate, and plainTime
- Add commands to install/uninstall VS Code extension

### Patches

- Automatically mark named enum types with `x-ms-enum` and `modelAsString: true`

## 0.4.0

Tue, 16 Mar 2021 23:13:42 GMT

### Minor changes

- Introduce language server and add live parse errors to VS Code

## 0.3.0

Thu, 11 Mar 2021 19:14:29 GMT

### Minor changes

- Add byte primitive type
- Add datetime primitive type
- Enable HTTP verb decorators to specify a subpath from the parent resource path
- Add float32 primitive type
- Replace `interface` syntax with `namespace` and `op` syntax
- Add new decorator @tags
- Add support for nested namespace definitions and scopes
- Add null intrinsic type, allow unions with it for x-nullable support in OpenAPI emitter
- Add response model types for many standard HTTP responses in rest.adl
- Renamed Ok<T> to OkResponse<T>
- Add syntax highlighting

### Patches

- Fix model Foo<T> extends T { }
- Fix resolution of declared parameters in resource sub-paths
- Always output a response description field to ensure valid swagger
- Added new gRPC to ADL examples
- Add back line and column tracking
- Support arrays of arrays and parenthesized expressions
- Remove hardcoded @autorest/core version
- Include source file path in parse error log
- Add body-boolean testserver sample
- Fix bug preventing empty string literals
- Refactor scanner to use less state
- Log source locations with all errors
- Support multiple content types for request bodies

### Updates

- Implement extends, re-implement spread to copy properties, implement visibility framework, move to explicit bodies in responses, and fix various bugs.
- Implement nostdlib option

## 0.2.1

Thu, 28 Jan 2021 21:30:01 GMT

### Patches

- Fixed standard library decorator module resolution

## 0.2.0

Wed, 27 Jan 2021 21:48:34 GMT

### Minor changes

- Initial ADL compiler preview release

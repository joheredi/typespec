import { getDiscriminatedUnion } from "../../../core/helpers/discriminator-utils.js";
import { getLocationContext } from "../../../core/index.js";
import {
  Discriminator,
  getDiscriminator,
  getMaxItems,
  getMaxLength,
  getMaxValue,
  getMaxValueExclusive,
  getMinItems,
  getMinLength,
  getMinValue,
  getMinValueExclusive,
} from "../../../core/intrinsic-type-state.js";
import { isErrorType, isNeverType } from "../../../core/type-utils.js";
import { Enum, Model, Scalar, Union, type Namespace, type Type } from "../../../core/types.js";
import { getDoc, getSummary } from "../../../lib/decorators.js";
import { resolveEncodedName } from "../../../lib/encoded-names.js";
import { Typekit, defineKit } from "../define-kit.js";
import { copyMap } from "../utils.js";
import { getPlausibleName } from "../utils/get-plausible-name.js";

/**  @experimental */
export interface TypeTypeKit {
  /**
   * Clones a type and adds it to the typekit's realm.
   * @param type Type to clone
   */
  clone<T extends Type>(type: T): T;
  /**
   * Finishes a type, applying all the decorators.
   */
  finishType(type: Type): void;
  /**
   * Checks if a type is decorated with @error
   * @param type The type to check.
   */
  isError(type: Type): boolean;
  /**
   * Get the name of this type in the specified encoding.
   */
  getEncodedName(type: Type & { name: string }, encoding: string): string;

  /**
   * Get the summary of this type as specified by the `@summary` decorator.
   *
   * @param type The type to get the summary for.
   */
  getSummary(type: Type): string | undefined;

  /**
   * Get the documentation of this type as specified by the `@doc` decorator or
   * the JSDoc comment.
   *
   * @param type The type to get the documentation for.
   */
  getDoc(type: Type): string | undefined;
  /**
   * Get the plausible name of a type. If the type has a name, it will use it otherwise it will try generate a name based on the context.
   * If the type can't get a name, it will return an empty string.
   * If the type is a TemplateInstance, it will prefix the name with the template arguments.
   * @param type The scalar to get the name of.z
   */
  getPlausibleName(type: Model | Union | Enum | Scalar): string;
  /**
   * Resolves a discriminated union for the given model or union.
   * @param type Model or Union to resolve the discriminated union for.
   */
  getDiscriminatedUnion(type: Model | Union): Union | undefined;
  /**
   * Resolves the discriminator for a discriminated union. Returns undefined if the type is not a discriminated union.
   * @param type
   */
  getDiscriminator(type: Model | Union): Discriminator | undefined;
  /**
   * Gets the maximum value for a numeric or model property type.
   * @param type type to get the maximum value for
   */
  maxValue(type: Type): number | undefined;
  /**
   * Gets the minimum value for a numeric or model property type.
   * @param type type to get the minimum value for
   */
  minValue(type: Type): number | undefined;

  /**
   * Gets the maximum value this numeric type should be, exclusive of the given value.
   * @param type
   */
  maxValueExclusive(type: Type): number | undefined;

  /**
   * Gets the minimum value this numeric type should be, exclusive of the given value.
   * @param type type to get the minimum value for
   */
  minValueExclusive(type: Type): number | undefined;

  /**
   * Gets the maximum length for a string type.
   * @param type type to get the maximum length for
   */
  maxLength(type: Type): number | undefined;
  /**
   * Gets the minimum length for a string type.
   * @param type type to get the minimum length for
   */
  minLength(type: Type): number | undefined;
  /**
   * Gets the maximum number of items for an array type.
   * @param type type to get the maximum number of items for
   */
  maxItems(type: Type): number | undefined;
  /**
   * Gets the minimum number of items for an array type.
   * @param type type to get the minimum number of items for
   */
  minItems(type: Type): number | undefined;
  /**
   * Checks if the given type is a never type.
   */
  isNever(type: Type): boolean;
  /**
   * Checks if the given type is a user defined type. Non-user defined types are defined in the compiler or other libraries imported by the spec.
   * @param type The type to check.
   * @returns True if the type is a user defined type, false otherwise.
   */
  isUserDefined(type: Type): boolean;
}

interface TypekitExtension {
  /**
   * Utilities for working with general types.
   */
  type: TypeTypeKit;
}

declare module "../define-kit.js" {
  interface Typekit extends TypekitExtension {}
}

defineKit<TypekitExtension>({
  type: {
    finishType(type: Type) {
      this.program.checker.finishType(type);
    },
    clone<T extends Type>(type: T): T {
      let clone: T;
      switch (type.kind) {
        case "Model":
          clone = this.program.checker.createType({
            ...type,
            decorators: [...type.decorators],
            properties: copyMap(type.properties),
            indexer: type.indexer ? { ...type.indexer } : undefined,
          });
          break;
        case "Union":
          clone = this.program.checker.createType({
            ...type,
            decorators: [...type.decorators],
            variants: copyMap(type.variants),
            get options() {
              return Array.from(this.variants.values()).map((v: any) => v.type);
            },
          });
          break;
        case "Interface":
          clone = this.program.checker.createType({
            ...type,
            decorators: [...type.decorators],
            operations: copyMap(type.operations),
          });
          break;

        case "Enum":
          clone = this.program.checker.createType({
            ...type,
            members: copyMap(type.members),
          });
          break;
        case "Namespace":
          clone = this.program.checker.createType({
            ...type,
            decorators: [...type.decorators],
            instantiationParameters: type.instantiationParameters
              ? [...type.instantiationParameters]
              : undefined,
            projections: [...type.projections],
          });
          const clonedNamespace = clone as Namespace;
          clonedNamespace.decoratorDeclarations = cloneTypeCollection(
            this,
            type.decoratorDeclarations,
            {
              namespace: clonedNamespace,
            },
          );
          clonedNamespace.models = cloneTypeCollection(this, type.models, {
            namespace: clonedNamespace,
          });
          clonedNamespace.enums = cloneTypeCollection(this, type.enums, {
            namespace: clonedNamespace,
          });
          clonedNamespace.functionDeclarations = cloneTypeCollection(
            this,
            type.functionDeclarations,
            {
              namespace: clonedNamespace,
            },
          );
          clonedNamespace.interfaces = cloneTypeCollection(this, type.interfaces, {
            namespace: clonedNamespace,
          });
          clonedNamespace.namespaces = cloneTypeCollection(this, type.namespaces, {
            namespace: clonedNamespace,
          });
          clonedNamespace.operations = cloneTypeCollection(this, type.operations, {
            namespace: clonedNamespace,
          });
          clonedNamespace.scalars = cloneTypeCollection(this, type.scalars, {
            namespace: clonedNamespace,
          });
          clonedNamespace.unions = cloneTypeCollection(this, type.unions, {
            namespace: clonedNamespace,
          });
          break;
        default:
          clone = this.program.checker.createType({
            ...type,
            ...("decorators" in type ? { decorators: [...type.decorators] } : {}),
          });
          break;
      }
      this.realm.addType(clone);
      return clone;
    },
    isError(type) {
      return isErrorType(type);
    },
    getEncodedName(type, encoding) {
      return resolveEncodedName(this.program, type, encoding);
    },
    getSummary(type) {
      return getSummary(this.program, type);
    },
    getDoc(type) {
      return getDoc(this.program, type);
    },
    getPlausibleName(type) {
      return getPlausibleName(type);
    },
    getDiscriminator(type) {
      return getDiscriminator(this.program, type);
    },
    getDiscriminatedUnion(type) {
      const discriminator = getDiscriminator(this.program, type);

      if (!discriminator) {
        return undefined;
      }

      const [union] = getDiscriminatedUnion(type, discriminator);
      const variants = Array.from(union.variants.entries()).map(([k, v]) =>
        this.unionVariant.create({ name: k, type: v }),
      );
      return this.union.create({
        name: union.propertyName,
        variants,
      });
    },
    maxValue(type) {
      return getMaxValue(this.program, type);
    },
    minValue(type) {
      return getMinValue(this.program, type);
    },
    maxLength(type) {
      return getMaxLength(this.program, type);
    },
    minLength(type) {
      return getMinLength(this.program, type);
    },
    maxItems(type) {
      return getMaxItems(this.program, type);
    },
    maxValueExclusive(type) {
      return getMaxValueExclusive(this.program, type);
    },
    minValueExclusive(type) {
      return getMinValueExclusive(this.program, type);
    },
    minItems(type) {
      return getMinItems(this.program, type);
    },
    isNever(type) {
      return isNeverType(type);
    },
    isUserDefined(type) {
      return getLocationContext(this.program, type).type === "project";
    }
  },
});

function cloneTypeCollection<T extends Type>(
  kit: Typekit,
  collection: Map<string, T>,
  options: { namespace?: Namespace } = {},
): Map<string, T> {
  const cloneCollection = new Map<string, T>();
  for (const [key, type] of collection) {
    const clone = kit.type.clone(type);
    if ("namespace" in clone && options.namespace) {
      clone.namespace = options.namespace;
    }
    cloneCollection.set(key, clone);
  }
  return cloneCollection;
}

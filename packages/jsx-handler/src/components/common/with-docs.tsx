export interface WithDocsProps {
  docs?: string;
}

/**
 * Prepends a string `indentation` to each value in `values`.
 *
 * @param values - an iterable of strings to indent
 * @param indentation - the string to prepend to the beginning of each value
 */
export function indent(
  values: Iterable<string>,
  indentation: string = "  "
): string {
  const indented: string[] = [];
  for (const value of values) {
    indented.push(indentation + value);
  }

  return indented.join("\n");
}

/**
 * Emit the documentation for a type in JSDoc format.
 *
 * This assumes that the documentation may include Markdown formatting.
 *
 * @param type - The type to emit documentation for.
 */
export function formatDocumentation(doc?: string): string {
  if (doc === undefined || doc.length < 1) return "";
  const docs: string[] = [];

  docs.push(`/**`);

  docs.push(indent(doc.trim().split(/\r?\n/g), " * "));

  docs.push(` */`);

  return docs.join("\n");
}

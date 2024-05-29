export function createElement(tag: any, props: any, ...children: any[]) {
  if (typeof tag === "function") {
    return tag({ ...props, children });
  }
  return { tag, props: { ...props, children } };
}

function flattenArray(arr: any[]): any[] {
  return arr.reduce((flat, toFlatten) => {
    return flat.concat(
      Array.isArray(toFlatten) ? flattenArray(toFlatten) : toFlatten
    );
  }, []);
}

export function code(strings: TemplateStringsArray, ...values: any[]) {
  const flattenedValues = values.map((value) =>
    Array.isArray(value) ? flattenArray(value) : value
  );

  return strings.reduce((result, string, i) => {
    const value = flattenedValues[i];

    // Join array values with proper formatting and avoid extra commas
    if (Array.isArray(value)) {
      // Join elements with newlines and avoid trailing commas
      return result + string + value.join("\n");
    }

    // For single values, just concatenate
    return result + string + (value || "");
  }, "");
}

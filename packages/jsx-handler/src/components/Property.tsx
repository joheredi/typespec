import { code } from "../jsxFactory.js";
import { WithDocsProps, formatDocumentation } from "./common/with-docs.js";

export interface PropertyProps extends WithDocsProps {
  name: string;
  type: any;
  required?: boolean;
  readonly?: boolean;
  noQuoteWrap?: boolean;
}

export function Property({
  name,
  type,
  required,
  readonly,
  noQuoteWrap,
  docs,
}: PropertyProps) {
  const optionality = required ? "" : "?";
  const visibility = readonly ? "readonly" : "";
  let formattedDoc = formatDocumentation(docs);

  let nameString = `${name}`;
  if (!noQuoteWrap) {
    nameString = `"${name}"`;
  }

  return code`
  ${formattedDoc}${visibility} ${nameString}${optionality}: ${type}`;
}

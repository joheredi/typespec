import { code } from "../jsxFactory.js";
import { WithDocsProps, formatDocumentation } from "./common/with-docs.js";

export interface ResponseInterfaceProps extends WithDocsProps {
  name: string;
  exported?: boolean;
  extendsClauses?: string[];
  children?: any;
}

// TODO: Support `extends` and `implements` also other things like export or not and templates
export function Interface({
  name,
  exported,
  extendsClauses,
  children,
  docs,
}: ResponseInterfaceProps) {
  let formattedDoc = formatDocumentation(docs);
  const exportKeyword = exported ? "export " : "";
  const extendsString =
    extendsClauses && extendsClauses.length > 0
      ? `extends ${extendsClauses.join(", ")} `
      : "";
  return code`
  ${formattedDoc}${exportKeyword} interface ${name} ${extendsString} {
    ${children}
  }
  `;
}

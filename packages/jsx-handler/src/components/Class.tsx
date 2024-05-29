// src/components/Class.tsx
import { code } from "../jsxFactory.js";
import { TypeVariable, TemplateDeclaration } from "./TemplateDeclaration.js";
import { WithDocsProps } from "./common/with-docs.js";

export interface ClassProps extends WithDocsProps {
  name: string;
  exported?: boolean;
  children?: any;
  extendsClassName?: string;
  implementsInterfaceNames?: string[];
  templateTypes?: TypeVariable[];
}

export function Class({
  name,
  children,
  extendsClassName,
  implementsInterfaceNames,
  exported,
  templateTypes,
}: ClassProps) {
  const extendsString = extendsClassName ? `extends ${extendsClassName} ` : "";
  let implementsString = "";

  const exportedString = exported ? "export " : "";

  if (implementsInterfaceNames && implementsInterfaceNames.length > 0) {
    implementsString = `implements ${implementsInterfaceNames.join(", ")} `;
  }

  const templateString = TemplateDeclaration({ typeVariables: templateTypes });

  return code`
    ${exportedString} class ${name}${templateString} ${extendsString} ${implementsString}{
      ${children}
    }
  `;
}

interface Bar {}
interface MyF {}
class Baz {}
class Bax {}
class Foo<T> implements Bar, MyF {}

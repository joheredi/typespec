// src/components/Import.tsx
import { code } from "../jsxFactory.js";

export interface ImportProps {
  from: string;
  imports: string[];
}

export function Import({ from, imports }: ImportProps) {
  //TODO: Support other kind of imports
  return code`
    import { ${imports.join(", ")} } from '${from}';
  `;
}

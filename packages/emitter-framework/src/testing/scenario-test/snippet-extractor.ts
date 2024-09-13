import Parser from "tree-sitter";
import CSharpLanguage from "tree-sitter-c-sharp";
import JavaLanguage from "tree-sitter-java";
import PythonLanguage from "tree-sitter-python";
import TypeScriptLanguage from "tree-sitter-typescript";

// Interface for SnippetExtractor
export interface SnippetExtractor {
  getClass(fileContent: string, name: string): string | null;
  getFunction(fileContent: string, name: string): string | null;
  getInterface(fileContent: string, name: string): string | null;
  getTypeAlias(fileContent: string, name: string): string | null;
}

export function createCSharpExtractorConfig(): LanguageConfiguration {
  return {
    codeBlockTypes: ["cs", "csharp"],
    format: async (content: string) => content,
    language: CSharpLanguage,
    nodeKindMapping: {
      classNodeType: "class_declaration",
      functionNodeType: "method_declaration",
      interfaceNodeType: "interface_declaration",
    },
  };
}

export function createJavaExtractorConfig(): LanguageConfiguration {
  return {
    codeBlockTypes: ["java"],
    format: async (content: string) => content,
    language: JavaLanguage,
    nodeKindMapping: {
      classNodeType: "class_declaration",
      functionNodeType: "function_declaration",
      interfaceNodeType: "interface_declaration",
    },
  };
}

export function createPythonExtractorConfig(): LanguageConfiguration {
  return {
    codeBlockTypes: ["py", "python"],
    format: async (content: string) => content,
    language: PythonLanguage,
    nodeKindMapping: {
      classNodeType: "class_definition",
      functionNodeType: "function_definition",
    },
  };
}

export function createTypeScriptExtractorConfig(): LanguageConfiguration {
  return {
    codeBlockTypes: ["ts", "typescript"],
    language: TypeScriptLanguage.typescript,
    format: async (content: string) => content,
    nodeKindMapping: {
      classNodeType: "class_declaration",
      functionNodeType: "function_declaration",
      interfaceNodeType: "interface_declaration",
    },
  };
}

type Language = {
  name: string;
  language: unknown;
  nodeTypeInfo: unknown[];
};

export interface LanguageConfiguration {
  language: Language;
  format: (content: string) => Promise<string>;
  codeBlockTypes: string[];
  nodeKindMapping: {
    classNodeType?: string;
    functionNodeType?: string;
    interfaceNodeType?: string;
    typeAliasNodeType?: string;
  };
}

export function createSnipperExtractor(
  languageConfiguration: LanguageConfiguration
): SnippetExtractor {
  return new SnippetExtractorImpl(languageConfiguration);
}

class SnippetExtractorImpl implements SnippetExtractor {
  private readonly languageConfiguration: LanguageConfiguration;
  private parser: Parser;

  constructor(languageConfiguration: LanguageConfiguration) {
    this.parser = new Parser();
    this.parser.setLanguage(languageConfiguration.language);
    this.languageConfiguration = languageConfiguration;
  }

  getClass(fileContent: string, name: string): string | null {
    const classNodeType = this.languageConfiguration.nodeKindMapping.classNodeType;
    if (!classNodeType) {
      throw new Error("Class node type is not defined in the language configuration");
    }
    const classNode = this.findNodeByTypeAndName(fileContent, classNodeType, name);
    return classNode ? this.getCodeFromNode(classNode) : null;
  }

  getFunction(fileContent: string, name: string): string | null {
    const functionNodeType = this.languageConfiguration.nodeKindMapping.functionNodeType;
    if (!functionNodeType) {
      throw new Error("Function node type is not defined in the language configuration");
    }
    const classNode = this.findNodeByTypeAndName(fileContent, functionNodeType, name);
    return classNode ? this.getCodeFromNode(classNode) : null;
  }

  getInterface(fileContent: string, name: string): string | null {
    const interfaceNodeType = this.languageConfiguration.nodeKindMapping.interfaceNodeType;
    if (!interfaceNodeType) {
      throw new Error("Interface node type is not defined in the language configuration");
    }
    const classNode = this.findNodeByTypeAndName(fileContent, interfaceNodeType, name);
    return classNode ? this.getCodeFromNode(classNode) : null;
  }

  getTypeAlias(fileContent: string, name: string): string | null {
    const typeAliasNodeType = this.languageConfiguration.nodeKindMapping.interfaceNodeType;
    if (!typeAliasNodeType) {
      throw new Error("Interface node type is not defined in the language configuration");
    }
    const typeAliasNode = this.findNodeByTypeAndName(fileContent, typeAliasNodeType, name);
    return typeAliasNode ? this.getCodeFromNode(typeAliasNode) : null;
  }

  // Helper function to extract code from a node
  private getCodeFromNode(node: Parser.SyntaxNode): string {
    return node.text;
  }

  // Helper function to find a node by type and name in AST
  private findNodeByTypeAndName(
    fileContent: string,
    type: string,
    name: string
  ): Parser.SyntaxNode | null {
    const tree = this.parser.parse(fileContent);
    const rootNode = tree.rootNode; // Start from the root node

    const traverse = (node: Parser.SyntaxNode): Parser.SyntaxNode | null => {
      if (node.type === type && node.childForFieldName("name")?.text === name) {
        return node;
      }

      for (let i = 0; i < node.childCount; i++) {
        const childNode = node.child(i);
        if (childNode) {
          // Ensure the childNode is not null
          const found = traverse(childNode);
          if (found) return found;
        }
      }

      return null;
    };

    return traverse(rootNode); // Start traversal from the root node
  }
}

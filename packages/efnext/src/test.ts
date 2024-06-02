import { Program } from "@typespec/compiler";

class Scope {
  private symbols: Map<string, string> = new Map();

  declare(name: string, type: string) {
    if (this.symbols.has(name)) {
      throw new Error(`Symbol ${name} already declared`);
    }
    this.symbols.set(name, type);
  }

  lookup(name: string): string | undefined {
    return this.symbols.get(name);
  }
}

class ScopeStack {
  private stack: Scope[] = [new Scope()];

  enterScope() {
    this.stack.push(new Scope());
  }

  leaveScope() {
    this.stack.pop();
  }

  declare(name: string, type: string) {
    this.stack[this.stack.length - 1].declare(name, type);
  }

  lookup(name: string): string | undefined {
    for (let i = this.stack.length - 1; i >= 0; i--) {
      const type = this.stack[i].lookup(name);
      if (type) {
        return type;
      }
    }
    return undefined;
  }
}

class CodeGenContext {
  private scopeStack = new ScopeStack();
  private program: Program;
  private visiting: Set<string> = new Set();

  constructor(program: Program) {
    this.program = program;
  }

  declareSymbol(name: string, type: string) {
    this.scopeStack.declare(name, type);
  }

  resolveSymbol(name: string): string | undefined {
    return this.scopeStack.lookup(name);
  }

  enterScope() {
    this.scopeStack.enterScope();
  }

  leaveScope() {
    this.scopeStack.leaveScope();
  }

  startVisiting(name: string) {
    this.visiting.add(name);
  }

  stopVisiting(name: string) {
    this.visiting.delete(name);
  }

  isVisiting(name: string) {
    return this.visiting.has(name);
  }
}

class LazyCodeGenerator {
  private context: CodeGenContext;
  private generated: Set<string> = new Set();

  constructor(program: Program) {
    this.context = new CodeGenContext(program);
  }

  generateCode() {
    this.context.enterScope();
    this.context.declareSymbol("x", "number");
    this.context.declareSymbol("y", "number");
    this.context.leaveScope();
  }
}

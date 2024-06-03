import { ScopeContext } from "../framework/components/scope.js";
import { useContext } from "../framework/core/context.js";
import { TaskQueueContext } from "../framework/core/task-queue.js";

export interface ReferenceProps {
  refkey?: unknown;
}
async function _Reference({ refkey }: ReferenceProps) {
  const scope = useContext(ScopeContext);
  if (!scope) {
    throw new Error("Need scope context to form references");
  }
  const binder = scope.binder;

  const result = await binder.resolveOrWaitForDeclaration(scope, refkey);
  if (!result.resolved) {
    throw new Error("Failed to resolve");
  }
  const { targetDeclaration, pathDown } = result;
  // handle cross-file references
  const basePath = pathDown.map((s) => s.name).join(".");
  return basePath ? basePath + "." + targetDeclaration.name : targetDeclaration.name;
}

export function Reference(props: ReferenceProps) {
  const taskQueue = useContext(TaskQueueContext);
  if (!taskQueue) {
    throw new Error("Need task queue context to form references");
  }

  taskQueue.enqueue(_Reference(props));
  return null;
}

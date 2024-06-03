import { ComponentChildren } from "#jsx/jsx-runtime";
import { BinderContext, createOutputBinder } from "../core/binder.js";
import { render } from "../core/render.js";
import { TaskQueueContext, createTaskQueue } from "../core/task-queue.js";
export interface EmitOutputProps {
  children?: ComponentChildren;
}
export async function EmitOutput({ children }: EmitOutputProps) {
  const binder = createOutputBinder();
  const taskQueue = createTaskQueue();
  const foo = (
    <BinderContext.Provider value={binder}>
      <TaskQueueContext.Provider value={taskQueue}>{children}</TaskQueueContext.Provider>
    </BinderContext.Provider>
  );

  const wa = await render(foo);
  console.log(wa);
  return foo;
}

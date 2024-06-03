import { createContext } from "./context.js";

export interface TaskQueue {
  enqueue(task: Promise<unknown>): void;
  wait(): Promise<void>;
}

export const TaskQueueContext = createContext<TaskQueue>();

export function createTaskQueue(): TaskQueue {
  let queue: Promise<void>[] = [];
  function enqueue(task: Promise<void>): void {
    queue.push(task);
  }

  async function wait(): Promise<void> {
    await Promise.all(queue);
    queue = [];
  }

  return {
    enqueue,
    wait,
  };
}

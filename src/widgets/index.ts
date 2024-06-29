import { WidgetDefinition } from "../types.ts";
import { counterWidget } from "./counter.tsx";
import { recurringTodoWidget } from "./recurring-todo.tsx";
import { counterButtonsWidget } from "./counter-buttons.tsx";
import { counterGraphWidget } from "./counter-graph.tsx";
import { todoListWidget } from "./todoList.tsx";

export const widgets = {
  counterWidget,
  recurringTodoWidget,
  counterButtonsWidget,
  counterGraphWidget,
  todoListWidget,
} as Record<string, WidgetDefinition<any, any>>;

import { WidgetDefinition } from "../types.ts";
import { counterWidget } from "./counter.tsx";
import { recurringTodoWidget } from "./recurring-todo.tsx";
import { counterButtonsWidget } from "./counter-buttons.tsx";
import { counterGraphWidget } from "./counter-graph.tsx";

export const widgets = {
  counterWidget,
  recurringTodoWidget,
  counterButtonsWidget,
  counterGraphWidget,
} as Record<string, WidgetDefinition<any, any>>;
